# WordPress Inertia Theme

A modern WordPress theme built with Inertia.js, Vue.js, and Vite for seamless SPA-like experience.

## Features

- 🚀 **Inertia.js** - Seamless SPA experience
- ⚡ **Vue.js 3** - Modern reactive framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔧 **Vite** - Fast build tool
- 📱 **PWA Ready** - Progressive Web App support
- 🎯 **ACF Integration** - Advanced Custom Fields support
- 🔍 **SEO Optimized** - Built-in SEO features
- 🌐 **i18n Support** - Internationalization ready

## Requirements

- PHP 8.0+
- WordPress 6.0+
- Node.js 18+
- Composer

## Installation

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Required Plugins

Make sure you have these plugins activated:

- [Timber](https://wordpress.org/plugins/timber-library/) - Twig templating (for backend)
- [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/pro/) - Custom fields
- [Gravity Forms](https://www.gravityforms.com/) - Form handling (optional)

### 3. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

## Development

### Project Structure

```
wp-content/themes/template/
├── classes/                 # PHP classes
│   ├── Base.php            # Theme base functionality
│   ├── Vite.php            # Asset management
│   ├── Favicon.php         # Favicon handling
│   ├── InertiaWP.php       # Inertia integration
│   ├── Model/              # Data models
│   └── Controller/         # Controllers
├── resources/              # Frontend assets
│   ├── Private/           # Source files
│   │   ├── Vue/          # Vue components
│   │   │   ├── Pages/    # Page components
│   │   │   ├── Components/ # Reusable components
│   │   │   └── Layout/   # Layout components
│   │   └── Scss/         # Styles
│   └── Public/           # Built assets
├── views/                 # Backend templates (minimal)
│   └── components/       # Utility Twig components
├── app.php               # Main template file
├── index.php             # Route handling
└── functions.php         # Theme initialization
```

### Key Classes

- **Base** - Core theme functionality
- **Vite** - Asset compilation and loading
- **Favicon** - PWA favicon generation
- **InertiaWP** - Inertia.js integration
- **Globals** - Global helper functions

### Adding New Pages

1. Create Vue component in `resources/Private/Vue/Pages/`
2. Add route in `index.php`
3. Create controller if needed

### Frontend Architecture

The theme uses **Inertia.js** for seamless SPA experience:

- **Vue.js 3** - Frontend framework
- **Inertia.js** - SPA bridge between PHP and Vue
- **Vite** - Build tool with HMR
- **Tailwind CSS** - Styling framework

### Custom Fields

Use ACF for custom fields. Fields are automatically available in Vue components via Inertia props.

## Configuration

### Environment Variables

Create `.env` file in theme root:

```env
NODE_ENV=development
VITE_BASE_URL=http://localhost
```

### ACF Options

Configure theme colors in ACF Options:
- `general_theme_color` - Primary theme color
- `general_background_color` - Background color

## Build Process

The theme uses Vite for asset compilation:

- **SCSS** → CSS with PostCSS
- **Vue** → JavaScript with HMR
- **SVG Icons** → Sprite map
- **Favicon** → Multiple formats for PWA

## Deployment

1. Run production build: `npm run build`
2. Upload theme files to server
3. Activate theme in WordPress admin

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `composer test`
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, visit [justDev.org](https://justdev.org)
