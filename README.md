# github-react-app
A simple full-stack application to work with third-party libraries (like Github, that is why the project is named so).

## Usage
Create a `./config` folder and place the `.env` file there, or just create one in the root folder.  
You will need:
* `OCTOKIT_TOKEN` - to use for the Octokit service authentication ([docs](https://octokit.github.io/rest.js/v19#authentication))
* `AUTH_CLIENT_ID` - your personal OAuth ID, which you can find in the settings.
* `AUTH_CLIENT_SECRET` - your personal OAuth Secret ID, which you can find in the settings.
* `THROTTLE_TTL` - for the Nest.js branch, TTL for the requests limit reset.
* `THROTTLE_LIMIT` - for the Nest.js branch, the requests limit for the API.

### Start
* `npm install`
* `npm run build` and `npm start` to run in the production mode.
* `npm run start:dev` to run in the development mode.
* `npm run start:debug` to run in the debug mode.
* `npm test` to run tests.

## Branches
In the `nest` branch, I use the Nest.js framework to work with and to build the app with the help of.
