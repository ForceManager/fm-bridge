# ForceManager Bridge

Communication service for ForceManager Fragments.

![Travis](https://travis-ci.org/krasimir/webpack-library-starter.svg?branch=master)

## Installation

ForceManager Bridge is available as an npm & yarn package.

### As a dependency.

With yarn (recommended):

```
yarn add fm-bridge
```

With npm:

```
npm install fm-bridge
```

### As a script.

```html
<script type="text/javascript" src="https://d15abo3q1yyhdy.cloudfront.net/fragments/fm-bridge.min.js"></script>;
```

## ⭐️ Features

-   Axios instance configured to make calls to ForceManager API.
-   Set of functions to get data from ForceManager App.

## Usage

In the following example we can see how to get the ID of the current account using the bridge and make an API call to get the details of this account usings the axios instance.

### Example importing the package as a dependency.

```js
import { bridge, axios } from 'fm-bridge';

 bridge.getEntityId()
  .then(res => axios.get(`/accounts/${res.data.toString()}`))
  .then(res => {
    console.log('Account details:', res.data);
  })
  .catch(err => {
    console.warn(err);
  });
```

### Example importing the package as script.

```html
<script type="text/javascript" src="https://d15abo3q1yyhdy.cloudfront.net/fragments/fm-bridge.min.js"></script>;

<script>
 fmBridge.bridge.getEntityId()
  .then(function(res) {
    return fmBridge.axios.get(`/accounts/${res.data.toString()}`)
  })
  .then(function(res) {
    console.log('Account details:', res.data);
  })
  .catch(function(err) {
    console.warn(err);
  });
</script>
```

## Functions

getCompanyId()

getToken()

getLiteral(literal)

getCultureLang()

getUserLocale()

getUserId()

getFilteredUsers()

getPermissions()

setDrilldown(key, value)

getFilteredPeriodString()