# mocha-dominate

[![NPM version](https://img.shields.io/npm/v/mocha-dominate.svg)](https://www.npmjs.com/package/mocha-dominate)
[![Build Status](https://github.com/alexjeffburke/mocha-dominate/workflows/tests/badge.svg)](https://github.com/alexjeffburke/mocha-dominate)
[![Coverage Status](https://img.shields.io/coveralls/alexjeffburke/mocha-dominate/master.svg)](https://coveralls.io/r/alexjeffburke/mocha-dominate?branch=master)

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

### Global registration

Once installed, alter the line used to execute mocha - typically the
`npm test` target in your package.json file so it requires the hook:

```
mocha -r mocha-dominate ...
```

At this point each test throughout the suite will be given a clean
JSDom instance with the document globals exposed. Any changes made
during test execution are automatically cleaned up and everything
is reset prior to the next test.

### Per-describe block

In some situations it can be useful to limit the scope of a browser
like environment to a single `describe()` block within a test file.

This can be achieved by requiring `mocha-dominate` directly in the
test and using the `hookEach()` export:

```
const mochaDominate = require("mocha-dominate");

describe("when behaving like a browser", () => {
  mochaDominate.hookEach();

  it("should have a document available", () => {
    // ...
  });
});
```

## Configuring transforms

One common issue that occurs when trying to run modern web code in
the browser is that non-standard import syntax is used to, for
example, CSS or SVG assets.

This use of import is not supported natively by browsers and not
by node.js either - in order to allow such files to be executed
those imports need to be matched by their extension and either
ignored or converted to a JavaScript representation that can run.
This is done by specifying _transforms_ which are loosely modelled
on the mechanism provided by
[jest](https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object).

This is particularly common with React code that makes use of syntax
extensions like JSX and aims to keep indivudual component self-contained.

### Allowing the import of CSS

Imagine the common situation of project containg React components
each of which has its own stylesheet. This is incredibly handy for
ensuring each component is truly isolated, and build systems such as
`webpack` or bundlers such as `rollup` can be configured to consume
such modules by default. The component might something like:

```js#evaluate:false
require("MyComponent.css");

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    // ...
  }
}
```

In order to allow this component to be seamlessly imported and have
tests run against it within mocha, it is necessary to convert that
import into something that can be understood.

```js
module.exports = {
  transform: {
    ".css": "<rootDir>/path/to/transforms/cssTransform.js"
  }
};
```

The transform itself returns some JavaScript code to take the place
of the CSS and might look something like:

```js
module.exports = {
  process(code, filename) {
    return "module.exports = { cssModule: true };";
  }
};
```

> NOTE: the code returned is a string to be passed to eval()

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

### mocha-dominate.config.cjs

The CJS extension is also supported and in fact used _preferentially_ to
support projects that are beginning the transition to native node.js ESM.

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
