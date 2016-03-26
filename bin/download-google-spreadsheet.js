#!/usr/bin/env node
'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var argv = process.argv.slice(2);

_index2.default.call.apply(_index2.default, [null].concat(_toConsumableArray(argv.map(JSON.parse)), [function (err) {
  if (err) throw err;
}]));