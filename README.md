# vestr

## Backend

Node.js runs Express to handle GET requests to various paths. These GET requests point to HTML files with a "[name]Bundle.js" created by Webpack handling all the React code. 

Webpack: Bundles CSS and JS from the individual files into one js.

Babel: Converts ES6 code written for React into ES5 for most browsers.

## Frontend

React: Each different JS file corresponding to the HTML has its own components. Individual HTML files are able to integrate only the bundles they need.

## Solved Stuff

- Sending stuff from client to server (login) - POST request to Express via BodyParser

- Looking aesthetic - Bootstrap for now

## Problems & Discussion

- Taking data from the server for rendering - proposed solution: Have an API setup for this purpose via Express
