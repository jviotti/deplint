RequireLint
===========

Statically parse dependency trees of JavaScript and TypeScript projects.

[![Build Status](https://travis-ci.org/jviotti/hawthorn.svg?branch=master)](https://travis-ci.org/jviotti/hawthorn)
[![npm version](https://badge.fury.io/js/hawthorn.svg)](http://badge.fury.io/js/hawthorn)
[![Dependency Status](https://img.shields.io/david/jviotti/hawthorn.svg)](https://david-dm.org/jviotti/hawthorn)

Supports CommonJS and ES6 imports, and TSX.

Description
-----------

`hawthorn` is a static analyzer that can build a dependency tree data structure
out of a JavaScript or TypeScript project by recursively parsing and scanning
for `require()` calls and `import` expressions.

<img src="https://raw.githubusercontent.com/jviotti/hawthorn/master/screenshot.png">

Installation
------------

The easiest way to use `hawthorn` is with its example CLI that you can install
with:

```sh
npm install --global hawthorn
```

The CLI takes a `--directory`/`-d` option which is the base directory of the
project you want to scan, and one or more glob patterns to use as entry points
(defaults to `lib/**/*.js`).

You can test `hawthorn` on itself by running:

```sh
$ git clone https://github.com/jviotti/hawthorn.git
$ hawthorn --directory ./hawthorn 'lib/*.js' > tree.json
```

See an example of the generated output here:
https://github.com/jviotti/hawthorn/blob/master/example.json.

Documentation
-------------

If you install `hawthorn` as a dependency, you can `require('hawthorn')` and
the module will export a top level function that takes an array of path globs,
an options object, and resolves a JavaScript object with the resulting
dependency tree.

### `hawthorn(String[] paths, Object options) -> Object`

The available options are:

- `directory`: The base directory to use when scanning. Should be usually set
  to the root directory of the project you want to scan
- `types`: The types of dependencies to consider. Defaults to `[ 'module',
  'local', 'internal' ]`

Example:

```js
const hawthorn = require('hawthorn')
const tree = hawthorn([
  'lib/**/*.js'
], {
  directory: '~/projects/hawthorn'
})
```

Support
-------

If you're having any problem, please [raise an
issue](https://github.com/jviotti/hawthorn/issues/new) on GitHub and I'll be
happy to help.

Tests
-----

Run the test suite by doing:

```sh
npm test
```

Contribute
----------

- Issue Tracker: [github.com/jviotti/hawthorn/issues](https://github.com/jviotti/hawthorn/issues)
- Source Code: [github.com/jviotti/hawthorn](https://github.com/jviotti/hawthorn)

Before submitting a PR, please make sure that you include tests, and that the
linter runs without any warning

License
-------

The project is licensed under the Apache 2.0 license.
