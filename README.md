# Force Manager Bridge

Communication service for custom widgets, custom pages and custom forms.

![Travis](https://travis-ci.org/krasimir/webpack-library-starter.svg?branch=master)

## Installation

Force Manager Bridge is available as an npm & yarn package.

### As a dependency.

With yarn (recommended):

```
yarn install fm-bridge
```

With npm:

```
npm install fm-bridge
```

### As a script.

```html
<script type="text/javascript" src="http://localhost/fm-bridge.js"></script>;
```


## Usage

### An example of using the client importing the package as a dependency.

In the following example we are getting the token form the current session of ForceManager web app:

```js
import { bridge } from 'fm-bridge';

 bridge.getToken()
  .then(res => {
      console.log('Token', res.data);
  })
  .catch(err => {
      console.warn(err);
  });
```

### An example of using the client importing as script.

In the following example we are getting the user ID form the current session of ForceManager web app:

```html
<script type="text/javascript" src="http://localhost/fm-bridge.js"></script>;

<script>
 fmBridge.bridge.getUserId()
  .then(function(res) {
      console.log('UserId', res.data);
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