<?php

/**
 * Plugin Name: Inertia WordPress Theme Paths
 * Description: Keeps Inertia WordPress build, hot and SSR files inside the active theme instead of uploads.
 */

namespace {
    if (! defined('ABSPATH')) {
        exit;
    }
}

namespace EvoMark\InertiaWordpress {

    use WP_CLI;
    use Exception;
    use WP_REST_Request;
    use EvoWpRestRegistration\RestApi;
    use EvoMark\InertiaWordpress\Helpers\Path;
    use EvoMark\InertiaWordpress\Helpers\Header;
    use EvoMark\InertiaWordpress\Data\MessageBag;
    use EvoMark\InertiaWordpress\Helpers\Admin;
    use EvoMark\InertiaWordpress\Helpers\Efficiency;
    use EvoMark\InertiaWordpress\Helpers\HookFilters;
    use EvoMark\InertiaWordpress\Helpers\Settings;
    use EvoMark\InertiaWordpress\Theme\ThemeSetup;
    use EvoMark\InertiaWordpress\Modules\ModuleSetup;
    use YahnisElsts\PluginUpdateChecker\v5p5\Vcs\Api;
    use YahnisElsts\PluginUpdateChecker\v5\PucFactory;
    use EvoMark\InertiaWordpress\Request\RequestHandler;
    use EvoMark\InertiaWordpress\Helpers\RequestResponse;
    use EvoMark\InertiaWordpress\Helpers\Plugin as HelpersPlugin;

    if (! class_exists(Plugin::class, false)) {
        class Plugin
        {
            public function __construct()
            {
                add_action('plugins_loaded', [$this, 'init'], 5);
                add_action('admin_init', [$this, 'adminInit']);
                add_action('rest_api_init', [$this, 'restApiInit']);
                add_action('after_setup_theme', [ModuleSetup::class, 'init']);
            }

            public function setup(string $entryFile)
            {
                $container = Container::getInstance();
                $container->set('env.entry', $entryFile);
                $container->set('env.root', plugin_dir_path($entryFile));
                $container->set('env.baseUrl', plugin_dir_url($entryFile));
                $container->set('requestHandler', \Di\create(RequestHandler::class));
                HelpersPlugin::setPluginVersion();

                $themeRuntimeDir = Path::join(get_stylesheet_directory(), '.inertia');
                $container->set('env.uploads', $themeRuntimeDir);

                if (! wp_mkdir_p($themeRuntimeDir)) {
                    throw new Exception('[Inertia Wordpress] Unable to create theme runtime folder');
                }
            }

            public function init()
            {
                $this->registerCommands();
                $this->registerSettings();
                $this->checkForUpdates();
                $this->registerRest();
                $this->registerRestErrorHandler();
                ThemeSetup::init();
                Efficiency::init();
            }

            public function adminInit()
            {
                $this->registerThemeTemplateFilters();
            }

            public function restApiInit()
            {
                $this->registerThemeTemplateFilters();
            }

            private function registerCommands()
            {
                if (defined('WP_CLI') && \WP_CLI) {
                    WP_CLI::add_command('inertia:start-ssr', \EvoMark\InertiaWordpress\Commands\StartSsrCommand::class);
                    WP_CLI::add_command('inertia:stop-ssr', \EvoMark\InertiaWordpress\Commands\StopSsrCommand::class);
                    WP_CLI::add_command('inertia:create-theme', \EvoMark\InertiaWordpress\Commands\CreateThemeCommand::class);
                }
            }

            private function registerSettings()
            {
                Admin::setup();
                Settings::registerPage();

                register_setting('inertia', 'inertia_ssr_enabled', [
                    'type' => 'boolean',
                    'default' => false,
                    'sanitize_callback' => 'boolval',
                    'label' => 'Enable the SSR functionality',
                ]);

                register_setting('inertia', 'inertia_ssr_url', [
                    'type' => 'string',
                    'default' => 'http://127.0.0.1:13714',
                    'label' => 'The URL to use for the SSR service',
                ]);

                register_setting('inertia', 'inertia_history_encrypt', [
                    'type' => 'boolean',
                    'default' => false,
                    'sanitize_callback' => 'boolval',
                    'label' => 'Encrypt the stored history data',
                ]);

                register_setting('inertia', 'inertia_root_template', [
                    'type' => 'string',
                    'default' => 'app.php',
                    'label' => 'The root template file in your theme',
                ]);

                register_setting('inertia', 'inertia_entry_file', [
                    'type' => 'string',
                    'default' => 'resources/Private/js/main.ts',
                    'label' => 'The JS entry file',
                ]);

                register_setting('inertia', 'inertia_entry_namespace', [
                    'type' => 'string',
                    'default' => 'theme-inertia',
                    'label' => 'The JS entry namespace',
                ]);

                register_setting('inertia', 'inertia_modules', [
                    'type' => 'array',
                    'default' => [],
                    'label' => 'Inertia modules that are enabled',
                ]);

                register_setting('inertia', 'inertia_templates_directory', [
                    'type' => 'string',
                    'default' => 'resources/Private/js/templates',
                    'label' => 'Theme templates directory',
                ]);

                register_setting('inertia', 'inertia_remove_emojis', [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Remove emojis',
                ]);

                register_setting('inertia', 'inertia_remove_jquery', [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Remove jQuery',
                ]);

                register_setting('inertia', 'inertia_remove_global_styles', [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Remove global styles',
                ]);

                register_setting('inertia', 'inertia_load_blocks_separately', [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Load core blocks separately',
                ]);

                register_setting('inertia', 'inertia_blocked_admin_roles', [
                    'type' => 'array',
                    'default' => ['subscriber'],
                    'label' => 'Roles that are blocked from admin',
                ]);

                register_setting('inertia', 'inertia_blocked_admin_roles_hide_bar', [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Hide admin bar from blocked admin-area users',
                ]);
            }

            private function checkForUpdates()
            {
                $container = Container::getInstance();
                $checker = PucFactory::buildUpdateChecker(
                    'https://github.com/evo-mark/inertia-wordpress/',
                    $container->get('env.entry'),
                    'inertia-wordpress'
                );

                $checker->getVcsApi()->enableReleaseAssets('/\.zip($|[?&#])/i', Api::REQUIRE_RELEASE_ASSETS);
            }

            private function registerRest()
            {
                new RestApi([
                    'namespace' => 'EvoMark\\InertiaWordpress\\RestApi\\',
                    'version' => 1,
                    'directory' => __DIR__ . '/../plugins/inertia-wordpress/src/RestApi',
                    'base_url' => 'inertia-wordpress',
                ]);
            }

            private function registerRestErrorHandler()
            {
                add_filter('rest_request_after_callbacks', [$this, 'handleRestError'], PHP_INT_MAX, 3);
            }

            public function handleRestError($response, $handler, WP_REST_Request $request)
            {
                if (is_wp_error($response) && $request->get_header(Header::INERTIA) === 'true') {
                    $bag = $request->get_header(Header::ERROR_BAG) ?? 'default';
                    $errorData = $response->error_data['rest_invalid_param']['params'] ?? [];

                    if (empty($errorData)) {
                        $errorData['_message'] = collect($response->errors)->first()[0] ?? 'An error occurred';
                    }

                    $errorBag = apply_filters(
                        HookFilters::REST_ERROR_BAG,
                        new MessageBag(RequestResponse::formatErrors($errorData)),
                        $response,
                        $request
                    );

                    RequestResponse::setFlashData('errors', [
                        $bag => $errorBag,
                    ]);

                    return Inertia::back();
                }

                return $response;
            }

            public function registerThemeTemplateFilters()
            {
                $postTypes = [...array_values(get_post_types([
                    'public' => true,
                    '_builtin' => false,
                ])), 'post', 'page'];

                foreach ($postTypes as $type) {
                    add_filter('theme_' . $type . '_templates', [$this, 'registerLayoutsAsTemplates'], 11, 3);
                }

                add_filter('default_page_template_title', function () {
                    return __('Inherit Page Template', 'inertia-wordpress');
                });
            }

            public function registerLayoutsAsTemplates($pageTemplates, $theme, $post)
            {
                $templatesDirectory = Settings::get('templates_directory');
                if (substr($templatesDirectory, 0, 1) !== '/') {
                    $templatesDirectory = '/' . $templatesDirectory;
                }
                $templatesDirectory = get_stylesheet_directory() . $templatesDirectory;

                if (! file_exists($templatesDirectory)) {
                    return $pageTemplates;
                }

                $layouts = opendir($templatesDirectory);
                while (($entry = readdir($layouts)) !== false) {
                    if (! preg_match("/^\./", $entry)) {
                        $filename = $entry;
                        $label = pathinfo($filename)['filename'];
                        $pageTemplates[$filename] = ucwords($label);
                    }
                }
                closedir($layouts);

                return $pageTemplates;
            }
        }
    }
}

namespace EvoMark\InertiaWordpress\Theme {

    use EvoMark\WpVite\WpVite;
    use EvoMark\InertiaWordpress\Container;
    use EvoMark\InertiaWordpress\Helpers\HookFilters;
    use EvoMark\InertiaWordpress\Helpers\Path;
    use EvoMark\InertiaWordpress\Helpers\Settings;
    use EvoMark\InertiaWordpress\Inertia;

    if (! class_exists(ThemeSetup::class, false)) {
        class ThemeSetup
        {
            private const HOT_FILE = '../../../hot';
            private const BUILD_DIRECTORY = 'resources/Public/Build';

            public static function init()
            {
                add_filter('template_include', [__CLASS__, 'handleTemplateInclude']);
                self::addTemplateDirectories();
                self::enqueueScripts();
                self::getThemeVersion();
                self::addThemeSupport();
            }

            public static function addThemeSupport()
            {
                add_theme_support('custom-logo');
                add_theme_support('post-thumbnails');
            }

            public static function enqueueScripts()
            {
                $entryFile = Settings::get('entry_file');
                $entryNamespace = Settings::get('entry_namespace');
                $isReact = str_ends_with($entryFile, '.jsx');

                $vite = new WpVite();
                $vite->enqueue([
                    'input' => $entryFile,
                    'namespace' => $entryNamespace,
                    'react' => $isReact,
                    'absolutePath' => get_stylesheet_directory(),
                    'absoluteUrl' => get_stylesheet_directory_uri(),
                    'buildDirectory' => self::BUILD_DIRECTORY,
                    'hotFile' => self::HOT_FILE,
                ]);
            }

            public static function getThemeVersion()
            {
                $container = Container::getInstance();
                $request = $container->get('requestHandler');
                $hotFile = Path::join(get_stylesheet_directory(), self::HOT_FILE);
                $manifestPath = Path::join(get_stylesheet_directory(), self::BUILD_DIRECTORY, 'manifest.json');

                if (file_exists($hotFile)) {
                    $request->setVersion('dev');
                } elseif (file_exists($manifestPath)) {
                    $request->setVersion(md5_file($manifestPath));
                } else {
                    $request->setVersion('unknown');
                }
            }

            public static function handleTemplateInclude($template)
            {
                $templateName = basename($template);
                $controllerDir = get_stylesheet_directory() . '/controllers';
                $controllerFile = $controllerDir . '/' . $templateName;

                if (file_exists($controllerFile)) {
                    $class = Utils::getClass($template);
                    $class = apply_filters(HookFilters::PAGE_CONTROLLER, $class, $controllerFile);

                    if (in_array('EvoMark\InertiaWordpress\Contracts\InertiaControllerContract', class_implements($class), true) === false) {
                        return $template;
                    }

                    $controller = new $class();
                    echo $controller->handle();
                } else {
                    $class = Utils::getClass(Path::join($controllerDir, 'error.php'));
                    if (empty($class) || in_array('EvoMark\InertiaWordpress\Contracts\InertiaControllerContract', class_implements($class), true) === false) {
                        return $template;
                    }
                    Inertia::share('error', 404);
                    $controller = new $class();
                    echo $controller->handle();
                }
            }

            public static function addTemplateDirectories($templateBases = null)
            {
                $templateBases ??= self::getDefaultTemplateBases();

                array_map(function ($type) {
                    add_filter("{$type}_template_hierarchy", function ($templates) {
                        $directories = ['controllers'];

                        foreach ($templates as $key => $filename) {
                            $templates[$key] = [$filename];

                            foreach ($directories as $directory) {
                                array_unshift($templates[$key], $directory . DIRECTORY_SEPARATOR . $filename);
                            }
                        }

                        return self::arrayFlatten($templates);
                    });
                }, $templateBases);
            }

            public static function getDefaultTemplateBases(): array
            {
                return [
                    '404',
                    'archive',
                    'attachment',
                    'author',
                    'category',
                    'date',
                    'embed',
                    'frontpage',
                    'home',
                    'index',
                    'page',
                    'paged',
                    'privacypolicy',
                    'search',
                    'single',
                    'singular',
                    'tag',
                    'taxonomy',
                ];
            }

            public static function arrayFlatten(array $array): array
            {
                $result = [];

                foreach ($array as $item) {
                    if (is_array($item)) {
                        $result = array_merge($result, self::arrayFlatten($item));
                    } else {
                        $result[] = $item;
                    }
                }

                return $result;
            }
        }
    }
}

namespace EvoMark\InertiaWordpress\RestApi {

    use WP_REST_Request;
    use EvoWpRestRegistration\BaseRestController;
    use EvoMark\InertiaWordpress\Helpers\Settings;

    if (! class_exists(NoticesGet::class, false)) {
        class NoticesGet extends BaseRestController
        {
            protected $path = 'notices';
            protected $methods = 'GET';

            public function authorise()
            {
                return current_user_can('manage_options');
            }

            public function handler(WP_REST_Request $request)
            {
                $notices = [];

                $settings = Settings::get(['entry_file', 'root_template', 'templates_directory']);
                $entryFile = get_stylesheet_directory() . DIRECTORY_SEPARATOR . $settings['entry_file'];
                $rootTemplate = get_stylesheet_directory() . DIRECTORY_SEPARATOR . $settings['root_template'];
                $templates = get_stylesheet_directory() . DIRECTORY_SEPARATOR . $settings['templates_directory'];
                $node = dirname(WP_CONTENT_DIR) . DIRECTORY_SEPARATOR . 'node_modules';

                if (file_exists($entryFile) === false) {
                    $notices[] = "Your theme entry file doesn't appear to exist. Check the location in your Inertia settings page";
                }

                if (file_exists($rootTemplate) === false) {
                    $notices[] = "Your root template doesn't appear to exist. Check the location in your Inertia settings page";
                }

                if (file_exists($templates) === false) {
                    $notices[] = "Your templates folder doesn't appear to exist. Check the location in your Inertia settings page";
                }

                if (file_exists($node) === false) {
                    $notices[] = "You haven't installed your node dependencies in your project root. Follow the instructions at <a href='https://inertia-wordpress.evomark.co.uk/getting-started/finishing-theme-setup.html' target='_blank'>the documentation site</a> to finish your set up.";
                }

                return wp_send_json_success([
                    'notices' => $notices,
                ]);
            }
        }
    }
}

namespace EvoMark\InertiaWordpress\Commands {

    use WP_CLI;
    use Symfony\Component\Process\Process;
    use EvoMark\InertiaWordpress\Helpers\Path;
    use EvoMark\InertiaWordpress\Helpers\Settings;
    use EvoMark\InertiaWordpress\Exceptions\SsrException;

    if (! class_exists(StartSsrCommand::class, false)) {
        class StartSsrCommand
        {
            public function __invoke($args = [])
            {
                $isEnabled = Settings::get('ssr_enabled');
                if (! $isEnabled) {
                    WP_CLI::error('Inertia SSR is not enabled. Enable it via the Inertia settings pages in your Wordpress admin area');
                }

                $target = Path::join(get_stylesheet_directory(), 'resources', 'Private', '.vite', 'ssr', 'ssr.mjs');

                if (! file_exists($target)) {
                    WP_CLI::error("Couldn't find Inertia SSR file. Ensure you have run a build of your theme and try again.");
                }

                try {
                    //
                } catch (\Exception $e) {
                    //
                }

                $process = new Process(['node', $target]);
                $process->setTimeout(null);
                $process->start();

                if (extension_loaded('pcntl')) {
                    $stop = function () use ($process) {
                        $process->stop();
                    };
                    pcntl_async_signals(true);
                    pcntl_signal(SIGINT, $stop);
                    pcntl_signal(SIGQUIT, $stop);
                    pcntl_signal(SIGTERM, $stop);
                }

                foreach ($process as $type => $data) {
                    if ($process::OUT === $type) {
                        WP_CLI::log(trim($data));
                    } else {
                        WP_CLI::error(trim($data));
                        throw new SsrException($data);
                    }
                }

                return true;
            }
        }
    }
}

namespace EvoMark\WpVite {

    if (! class_exists(WpVite::class, false)) {
        class WpVite
        {
            public $type;
            public $vite;
            public $uploadsPath;
            public $uploadsUrl;
            public static $init = false;
            public bool $hasAbsolutes = false;

            public function __construct()
            {
                $this->uploadsPath = wp_upload_dir()['basedir'] . DIRECTORY_SEPARATOR . 'scw-vite-hmr';
                $this->uploadsUrl = wp_upload_dir()['baseurl'] . '/' . 'scw-vite-hmr';
                $this->setupFilters();
            }

            public function getVite(): ViteAdapter
            {
                return $this->vite;
            }

            public function enqueue($args = [])
            {
                $this->validateArgs($args);

                if ($this->hasAbsolutes) {
                    $this->uploadsPath = $args['absolutePath'];
                    $this->uploadsUrl = $args['absoluteUrl'];
                } else {
                    $this->uploadsPath = $this->uploadsPath . DIRECTORY_SEPARATOR . $args['namespace'];
                    $this->uploadsUrl = $this->uploadsUrl . '/' . $args['namespace'];
                }

                $buildDirectory = $args['buildDirectory'] ?? 'build';

                if (! file_exists($this->uploadsPath)) {
                    try {
                        wp_mkdir_p($this->uploadsPath);
                    } catch (\Exception $e) {
                        throw new \Exception('Directory "' . $this->uploadsPath . '" could not be created. Please ensure that your frontend build process is outputting to the same path.');
                    }
                }

                $this->vite = new ViteAdapter([
                    'uploadsPath' => $this->uploadsPath,
                    'uploadsUrl' => $this->uploadsUrl,
                    'hotFile' => $args['hotFile'] ?? 'hot',
                    'dependencies' => $args['dependencies'] ?? [],
                    'namespace' => $args['namespace'],
                    'entryHandle' => $args['entryHandle'] ?? '',
                    'useReact' => $args['react'] ?? false,
                    'disableModule' => $args['disableModule'] ?? false,
                ]);

                $hook = 'wp_enqueue_scripts';
                $echoHook = 'wp_head';
                if (! empty($args['admin'])) {
                    $hook = 'admin_enqueue_scripts';
                    $echoHook = 'admin_head';
                } elseif (! empty($args['gutenberg'])) {
                    $hook = 'enqueue_block_editor_assets';
                    $echoHook = 'admin_head';
                }

                $callback = function () use ($buildDirectory, $args, $echoHook) {
                    $inputs = is_array($args['input']) ? $args['input'] : (array) $args['input'];
                    if (count($inputs) === 0) {
                        throw new \Exception('No valid input files received');
                    }
                    foreach ($inputs as $input) {
                        $preload = $this->vite->generateTags($input, $buildDirectory);
                        add_action($echoHook, function () use ($preload) {
                            echo $preload;
                        });
                    }
                };

                if (did_action($hook) && ! did_action('wp_head') && ! did_action('admin_print_scripts')) {
                    $callback();
                } else {
                    add_action($hook, $callback, $args['priority'] ?? 10);
                }
            }

            public function validateArgs(array $args): bool
            {
                $this->checkAbsolutes($args);
                $this->checkInput($args);
                $this->checkNamespace($args);
                $this->checkPriority($args);
                $this->checkAdmin($args);
                $this->checkGutenberg($args);
                $this->checkDependencies($args);
                return true;
            }

            public function setupFilters(): void
            {
                if (self::$init === true) {
                    return;
                }

                add_filter('script_loader_tag', [$this, 'addScriptAttributes'], 10, 2);
                self::$init = true;
            }

            public function addScriptAttributes(string $tag, string $handle): string
            {
                $attributes = ['type', 'async', 'crossorigin', 'defer', 'fetchpriority', 'integrity', 'nomodule', 'nonce', 'referrerpolicy', 'blocking'];
                $tag = preg_replace("/type=['\"]text\/(javascript|css)['\"]/", '', $tag);
                foreach ($attributes as $attribute) {
                    $data = wp_scripts()->get_data($handle, $attribute);
                    if (! empty($data)) {
                        $tag = str_replace('src', $attribute . '="' . esc_attr($data) . '" src', $tag);
                    }
                }

                return $tag;
            }

            private function checkAbsolutes(array $args): void
            {
                if (isset($args['absolutePath']) || isset($args['absoluteUrl'])) {
                    $this->hasAbsolutes = true;
                }

                if ($this->hasAbsolutes && (! isset($args['absolutePath']) || ! isset($args['absoluteUrl']))) {
                    throw new \Exception("You must pass both 'absolutePath' and 'absoluteUrl' to use manual definitions");
                }
            }

            private function checkInput(array $args): void
            {
                if (! isset($args['input'])) {
                    throw new \Exception("No 'input' found");
                }
            }

            private function checkNamespace(array $args): void
            {
                if ((! $this->hasAbsolutes && empty($args['namespace'])) || ($this->hasAbsolutes && empty($args['namespace']))) {
                    throw new \Exception("A 'namespace' is required");
                }
            }

            private function checkPriority(array $args): void
            {
                if (isset($args['priority']) && ! is_int($args['priority'])) {
                    throw new \Exception('Priority must be an integer');
                }
            }

            private function checkAdmin(array $args): void
            {
                if (isset($args['admin']) && ! is_bool($args['admin'])) {
                    throw new \Exception('Admin argument must be a boolean');
                }
            }

            private function checkGutenberg(array $args): void
            {
                if (isset($args['gutenberg']) && ! is_bool($args['gutenberg'])) {
                    throw new \Exception('Gutenberg argument must be a boolean');
                }
            }

            private function checkDependencies(array $args): void
            {
                if (isset($args['dependencies']) && ! is_array($args['dependencies'])) {
                    throw new \Exception('Dependencies must be an array');
                }
            }

            public static function __callStatic($method, $args)
            {
                $instance = new static;
                return $instance->$method(...$args);
            }
        }
    }
}
