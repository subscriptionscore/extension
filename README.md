# Subscription Score Extension

This is the code for building the [Subscription Score][2] browser extension.

## Bugs or Feature requests

Please submit an [issue][3].

## Setup

### Prerequisites

The extension requires `node` and `npm` or `yarn` to build (tested up to `node v12.9.1`) and the latest version of Chrome or Firefox to run.

### Install dependencies

```
yarn
```

or

```
npm install
```

### Environment

You will need to specify a connection to our API in your `.env` file. This is the endpoint that the built extension will use to fetch subscription scores.

Currently we don't have a development endpoint, so you will need to use the production one at `https://api.leavemealone.app/graphql`.

```
# .env
GRAPHQL_URL=https://api.leavemealone.app/graphql
```

You will need to [purchase an API key](#API-Key) in order to make requests.

### Build for development

```
npm run build:dev <target>
```

eg. developing Chrome extension;

```
npm run build:dev chrome
```

eg. developing Firefox extension;

```
npm run build:dev firefox
```

Development `manifest.json` files can be found in `/build/{target}` directory.

### Build new release

The following command will build for all release targets;

```
npm run build
```

Zipped releases can be found in `/releases` directory.

## Usage

Once you've built a version of the extension and installed it into your browser of choice you can connect it to our API. You will still need a valid licence key in order to connect. You can buy a key from our [website][2], or [contact us][1] for a development key.

### TODO

- Set up test environment for development contributions.

## API Key

An API key is required to run the extension and make requests to the API, you can purchase a key from our [website][2], or [contact us][1] for a development key.

## Licence

GNU General Public License v3.0

## Contact

[hi@subscriptionscore.com][1]

[1]: mailto:hi@subscriptionscore.com
[2]: https://subscriptionscore.com
[3]: https://github.com/squarecat/subscriptionscore-extension/issues
