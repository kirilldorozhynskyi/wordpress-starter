# Starter architecture

| Task                   | Entry points and contract                                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme bootstrap        | `wp-content/themes/inertia/functions.php`, `classes/ThemeSetup.php`, `app.php` and Composer's `InertiaTheme` autoload mapping                                                                                                                                         |
| Pages and shared data  | `controllers/`, `classes/InertiaShare.php`, and `resources/Private/js/pages/`. Page names match the Inertia page resolver.                                                                                                                                            |
| ACF layouts            | `acf-json/` defines fields and keys. `classes/ACFContent.php` normalizes content. `components/Acf/FlexibleContent.vue` resolves snake_case names to PascalCase components under `components/Acf/Flex/`.                                                               |
| Links and localization | Use the `jdev_link` field type registered by the MU plugin and the existing URL behavior in `components/Utils/Button.vue`. Keep ACF text formatting compatible with the field's configured `new_lines` behavior.                                                      |
| Gravity Forms          | `classes/Controller/GravityFormController.php` and `classes/Model/GravityForm.php` provide the data consumed by `components/Form/GForm.vue` and `features/forms/`. See [frontend structure](../../../../docs/frontend-structure.md).                                  |
| Vue and SSR            | `resources/Private/js/main.ts` and `ssr.ts` share `inertia.ts`. `util/primevue.ts` loads the client UI plugin when needed, and the Vite SSR alias selects `util/primevue-ssr.ts`.                                                                                     |
| CSS and assets         | `resources/Private/css/style.css` is the Tailwind entry. Author Vue under `resources/Private/js`, icon sources in `resources/Private/Icons` and project images under `resources/Public/Images`. `resources/Public/Build` and `resources/Private/.vite` are generated. |
| Setup and deployment   | `composer.json` installs core/plugins and synchronizes the core. `.ddev/config.yaml`, `vite.config.ts`, `config.ts` and `Dockerfile` define the environments.                                                                                                         |

Paths after the first row are relative to the active theme unless they name a repository-level file or directory. Derive the active theme in forks from the
local Vite config, theme bootstrap and WordPress configuration.

For a new ACF section, trace the saved layout and field keys through the normalized payload before writing the Vue block. Use snake_case for the ACF layout
`name` and PascalCase for the file name, such as `page_hero` and `PageHero.vue`. Preserve field keys on existing groups. Read raw values when migrating a
plain-text field whose display formatting injects paragraphs or line breaks.
