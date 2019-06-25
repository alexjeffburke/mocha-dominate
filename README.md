# mocha-dominate

This module provides isolated global JSDom integration for mocha.

## Use

The module can be pulled into your project by simply running:

```
npm install --save-dev mocha-dominate
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
