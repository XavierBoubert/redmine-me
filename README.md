# Redmine me

## Use in dev

```sh
# If you don't have Yarn, install it
npm i -g yarn

# Install the dependencies
yarn install

# Build the app assets
npm run build

# Start the electron app
npm start
```

## Roadmap

- app single instance
- app auto reload
- Refactor: the activeIssue has to be inside the issues
- Panel activity
  - Actual day
- Display errors on push data to Redmine
- Display error when the activity is not selected
- Display error when the activities can't be pulled
- Panels design (& animation)
- When a panel is opened, re-locate the window
- Memorize the window position
