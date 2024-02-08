
# ⚡️ WP develop boilerplate

  

This repository contains a wordpress boilerplate made with Vite, SASS, Twig.

It is shipped with some pre-made mixins, a configured SVG-Sprite setup and some image optimization functionalities.
  

## Requirements

 *  `composer` : `>=2.0`
*  `php` : `>=8.2`
*  `node` : `>=20`
*  `yarn` (or equivalent)

  

## Installation

You can install with composer

```sh

$  composer create-project justdev/wordpress-starter "name"

```

  

Or standart from project folder

```sh
$  composer install
$  yarn install
```
 

## Build Assets

  

### Development

  

Start a local development server with previous defined settings, default is `https://localhost:8000/`

  

```sh

$  yarn  dev

```

  

### Production

  

Build all assets for production :

  

```sh

$  yarn  build

```

