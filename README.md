# middy-request-response

Creates a request/response objects from API Gateway event.

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
