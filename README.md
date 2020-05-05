# middy-request-response

Creates a request/response objects from API Gateway event.

- [Installation](#installation)
- [Usage](#usage)
- [Why](#why)
- [Where](#where)


## Installation

```bash
npm i @ematipico/middy-request-response
```

Or

```bash
yarn add @ematipico/middy-request-response
```

## Usage

```javascript
const middy = require('middy/core');
const requestResponse = require('@ematipico/request-response');

const renderRequest = (event, context) => {
  const { response } = context;

  response.statusCode = 200;
  response.end('<html></html>');
}

const handler = middy(renderRequest)
  .use(requestResponse()) // parses the request body when it's a JSON and converts it to an object

module.exports = { handler }

```

## Why

The reason why I created this package, is that because sometimes it is difficult to unify a lambda environment with a
usual server where most of the people are comfortable with.

Most of the times we create a local server inside the lambda.

This middleware wants to mimic the same behaviour without creating a local server. The middleware creates two objects 
called `response` and `request` and will try to mimic as much as possible the behaviours of
 [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)  and   
[`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse).

## Where

This middleware can be used in advanced frontend cases where you want to store your pages on a lambda, and you'd need a 
`request` and `response` objects to feed to your frontend frameworks such as Next.js or Nuxt.js.
