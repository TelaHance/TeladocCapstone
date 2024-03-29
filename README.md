# TelaHance

A Clinical Quality Serverless React web app made with Create React App.

Project Poster and Presentation can be found [here](https://capstone.cs.ucsb.edu/past21.html#team4).

## Property file values

This section serves as a quick reference for values found in [`.env.local.sample`](./.env.local.sample).

| Property name                  | Explanation                 |
| ------------------------------ | --------------------------- |
| `REACT_APP_AUTH0_DOMAIN`       | See `Getting Started` below |
| `REACT_APP_AUTH0_CLIENT_ID`    | See `Getting Started` below |
| `REACT_APP_AUTH0_AUDIENCE`     | See `Getting Started` below |
| `REACT_APP_CONSULT_API_KEY`    | Ask for an API Key          |
| `REACT_APP_MANAGEMENT_API_KEY` | Ask for an API Key          |
| `REACT_APP_APPOINTMENT_API_KEY`    | Ask for an API Key          |
| `REACT_APP_USER_API_KEY` | Ask for an API Key          |


## Getting started

The first step is to create our secrets file for running the application locally. You can do this by running the following command:

```bash
  cp telahance-dashboard/.env.local.sample telahance-dashboard/.env.local
```

The next thing you'll want to do is to choose a name for your application. The name should be lowercase letters, digits, and hyphens only. You'll want to then create this application on Netlify in order to verify that the name is available.

- For example, if your name is `cool-application` then your netlify application's url will end up looking like `https://cool-application.netlify.app`.

The next thing you'll want to do is set up your Auth0 SPA App. Instructions for setting up auth0 can be found [here](./docs/auth0.md).


At this point, you should be able to run the app locally via

```bash
npm run start
```
