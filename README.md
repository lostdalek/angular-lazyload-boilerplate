## Angular Lazy Loaded Module Sample Application

This sample project is a demonstration of how to lazy load modules in an Angular application.
It also can be used as a boilerplate for crud application interacting with REST Webservices, it includes:
- routing with ui-router plugin
- I18n with translate plugin
- Restangular plugin
- Json Schema Form generation with Angular Form Schema
- ocLazyLoad Plugin

## Getting Started

First, install development dependencies, ensure you have nodejs installed and install the following tools:

[Gulp](http://gulpjs.com/) command line utility:
```bash
$ npm install -g gulp
```
[Bower](http://bower.io/) command line utility:
```bash
$ npm install -g bower
```

once installed see [update dependencies](#updating-dependencies)

## Updating Dependencies

###Ensure node tools and gulp plugins are up to date:

```bash
$ npm install
```
will install dependencies defined in **package.json** file

### Ensure Frontend dependencies are installed or up to date:
```bash
$ bower update
```
will install dependencies defined in **bower.json** file

## Usage

A dev server can be lauched at **http://localhost:3000/** with gulp commands:

For more informations run:
```bash
$ gulp -h
```
Launch a dev server at **http://localhost:3000/** and watch for modifications:
```bash
$ gulp serve --dev
```

### build options
Application can be built in different environnements:
```bash
$ gulp build --dev
```
OR
```bash
$ gulp build --prod
```
Default environment is **prod**, linting for production is more restrictive, it won't allow alert() OR console.log() globals


Application can be packaged for differents targets:
targets configuration can be found in **gulp/target/[target_name].js**
