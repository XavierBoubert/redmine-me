# Redmine me

## Install it

[Install the app from the latest releases relatives to your system](https://github.com/XavierBoubert/redmine-me/releases).

## Use the Github project

### Prerequisites

- Clone the project
- Install [Yarn](https://yarnpkg.com/lang/en/) as global (`npm i -g yarn`)
- Install the project dependencies (`yarn install`)

### Compile the app

```sh
# Compile the app to a binary relative to your system (packaged in an installer)
# It will be available in the "/out" directory
npm run make

# Execute the same as the make script and publish the app directly to a Github release
npm run publish

# Build the app assets (SPA) only
npm run build
```

### Use in dev

```sh
# Create your env and configure it
cp .env.dist .env

# Build & serve the app assets
npm run serve

# Start the electron app
npm start
```

## Roadmap

- add a tray icon
- Refactor: the activeIssue has to be inside the issues
- Panel activity
  - Actual day
- Display errors on push data to Redmine
- Display error when the activity is not selected
- Display error when the activities can't be pulled
- Panels design (& animation)
- When a panel is opened, re-locate the window
- Memorize the window position
