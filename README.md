# volto-react-table-widget

[![Releases](https://img.shields.io/github/v/release/eea/volto-react-table-widget)](https://github.com/eea/volto-react-table-widget/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-react-table-widget%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-react-table-widget/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-react-table-widget%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-react-table-widget/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-react-table-widget-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-react-table-widget-develop)

[Volto](https://github.com/plone/volto) add-on to provide a [react-table](https://react-table.tanstack.com/) based widget for Volto to use it with fields with a large set of values.

The widget can be used like Volto's [ObjectListWidget](https://docs.voltocms.com/storybook/?path=/story/widgets-object-list-json--default&globals=measureEnabled:false), but it's more performant when you have a large set of values.

It also provides a CSV import and export functionality using the powerwful [react-papaparse](https://www.npmjs.com/package/react-papaparse) library.

## Features

Demo GIF

## Getting started

### Try volto-react-table-widget with Docker

1. Get the latest Docker images

   ```
   docker pull plone
   docker pull plone/volto
   ```

1. Start Plone backend

   ```
   docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone
   ```

1. Start Volto frontend

   ```
   docker run -it --rm -p 3000:3000 --link plone -e ADDONS="@eeacms/volto-react-table-widget" plone/volto
   ```

1. Go to http://localhost:3000

### Add volto-react-table-widget to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@eeacms/volto-react-table-widget"
  ],

  "dependencies": {
      "@eeacms/volto-react-table-widget": "^1.0.0"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --addon @eeacms/volto-react-table-widget
  cd my-volto-project
  ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-react-table-widget/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-react-table-widget/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-react-table-widget/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
