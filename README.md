DepLint
=======

Lint dependencies requirements.

Installation
------------

```sh
npm install --global deplint
```

Documentation
-------------

Your `package.json` should contain a `deplint` key with these properties:

- `String[] files`: An array of file patterns to scan
- `String[] modules`: An array of directories that represent your top level
  sub-components

Support
-------

If you're having any problem, please [raise an
issue](https://github.com/jviotti/deplint/issues/new) on GitHub and I'll be
happy to help.

Tests
-----

Run the test suite by doing:

```sh
npm test
```

Contribute
----------

- Issue Tracker: [github.com/jviotti/deplint/issues](https://github.com/jviotti/deplint/issues)
- Source Code: [github.com/jviotti/deplint](https://github.com/jviotti/deplint)

License
-------

The project is licensed under the Apache 2.0 license.
