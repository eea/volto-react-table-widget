# volto-react-table-widget

## Develop

1. Make sure you have `docker` and `docker compose` installed and running on your machine:

    ```Bash
    git clone https://github.com/eea/volto-react-table-widget.git
    cd volto-react-table-widget
    git checkout -b bugfix-123456 develop
    make
    make start
    ```

1. Wait for `Volto started at 0.0.0.0:3000` meesage

1. Go to http://localhost:3000

1.  Happy hacking!

    ```Bash
    cd src/addons/volto-react-table-widget/
    ```

### Or add @eeacms/volto-react-table-widget to your Volto project

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://docs.voltocms.com/getting-started/install/)

1.  Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        npm install -g yo @plone/generator-volto mrs-developer

1.  Create new volto app

        yo @plone/volto my-volto-project --addon @eeacms/volto-react-table-widget --skip-install
        cd my-volto-project

1.  Add the following to `mrs.developer.json`:

        {
            "volto-react-table-widget": {
                "url": "https://github.com/eea/volto-react-table-widget.git",
                "package": "@eeacms/volto-react-table-widget",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install

        yarn develop
        yarn

1.  Start backend

        docker pull plone
        docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone

    ...wait for backend to setup and start - `Ready to handle requests`:

        docker logs -f plone

    ...you can also check http://localhost:8080/Plone

1.  Start frontend

        yarn start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd src/addons/volto-react-table-widget/

## Cypress

To run cypress locally, first make sure you don't have any Volto/Plone running on ports `8080` and `3000`.

You don't have to be in a `clean-volto-project`, you can be in any Volto Frontend
project where you added `volto-react-table-widget` to `mrs.developer.json`

Go to:

  ```BASH
  cd src/addons/volto-react-table-widget/
  ```

Start:

  ```Bash
  make
  make start
  ```

This will build and start with Docker a clean `Plone backend` and `Volto Frontend` with `volto-react-table-widget` block installed.

Open Cypress Interface:

  ```Bash
  make cypress-open
  ```

Or run it:

  ```Bash
  make cypress-run
  ```
