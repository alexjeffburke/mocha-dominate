# mocha-dominate

This module provides isolated global JSDom integration for mocha.

## Use

The module can be pulled into your project by simply running:

```
npm install --save-dev mocha-dominate
```

You'll also need to install a version of jsdom - we're not prescriptive
about this as long as it's >= 14.0.0 so you can upgrade at your own pace.
This will pull down the latest:

```
npm install --save-dev jsdom
```

Once installed, alter the line used to execute mocha - typically the
`npm test` target in your package.json file so it requires the hook:

```
mocha -r mocha-dominate ...
```

At this point each test throughout the suite will be given a clean
JSDom instance with the document globals exposed. Any changes made
during test execution are automatically cleaned up and everything
is reset prior to the next test.

## Configuring transforms

One common issue that occurs when trying to run modern web code in
the browser is the need to stub out additional parts of the modules
you may wish to import.

Projects using webpack to build for example often import or require
non-javascript code within modules - imagine a React component that
also laods its own stylesheet:

```js#evaluate:false
require("myComponent.less");

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    // ...
  }
}
```

In order to allow seamlessly running such tests with mocha, a choice
was made to support the `transforms` syntax made familiar from its
use in jest to allow the handling of file extensons to be customised.

```json
{
  "transform": {
    ".less": "<rootDir>/test/transforms/styleTransform.js"
  }
}
```

## Supplying options

Two alternatives are supported when suppliying configuration options
to mocha-dominate.

### mocha-dominate.config.js

This should be placed alongside the package.json file in the root
of the project and options placed within a root object:

```js#evaluate:false
module.exports = {
  transform: {
    // ...
  }
};
```

### package.json "mocha-dominate"

Options can be added directly within the project package.json
file if there is a desire to keep configuration together:

```json
{
  "name": "some_thing",
  "version": "0.0.0",
  "mocha-dominate": {}
}
```
