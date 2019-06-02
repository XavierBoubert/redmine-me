# Redmine me

## Use in dev

```sh
# If you don't have Yarn, install it
npm i -g yarn

# Install the dependencies
yarn install

# Create your env and configure it
cp .env.dist .env

# Build & serve the app assets
npm run serve

# Start the electron app
npm start
```

## Roadmap

- Non need for external assets (font awesome & google font)
- PWA
- add a tray icon
- app single instance
- Refactor: the activeIssue has to be inside the issues
- Panel activity
  - Actual day
- Display errors on push data to Redmine
- Display error when the activity is not selected
- Display error when the activities can't be pulled
- Panels design (& animation)
- When a panel is opened, re-locate the window
- Memorize the window position
