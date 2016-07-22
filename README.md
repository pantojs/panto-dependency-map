# panto-dependency-map
[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Coverage Status][coveralls-image]][coveralls-url]

Dependency map for panto.

```js
const DependencyMap = require('panto-dependency-map');

const dm = new DependencyMap();
dm.add('a.css', 'a.png', 'b.jpg', 'c.eot');
dm.add('b.css', 'a.png', 'e.jpg');
dm.add('a.js', 'b.js');
dm.add('main.html', '*.css', '*.js');

dm.resolve('b.js') // ['a.js', 'main.html']
dm.resolve('c.eot', 'e.jpg') // ['a.css', 'main.html', 'b.css']
```

[npm-url]: https://npmjs.org/package/panto-dependency-map
[downloads-image]: http://img.shields.io/npm/dm/panto-dependency-map.svg
[npm-image]: http://img.shields.io/npm/v/panto-dependency-map.svg
[travis-url]: https://travis-ci.org/pantojs/panto-dependency-map
[travis-image]: http://img.shields.io/travis/pantojs/panto-dependency-map.svg
[david-dm-url]:https://david-dm.org/pantojs/panto-dependency-map
[david-dm-image]:https://david-dm.org/pantojs/panto-dependency-map.svg
[david-dm-dev-url]:https://david-dm.org/pantojs/panto-dependency-map#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/pantojs/panto-dependency-map/dev-status.svg
[coveralls-image]:https://coveralls.io/repos/github/pantojs/panto-dependency-map/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/pantojs/panto-dependency-map?branch=master