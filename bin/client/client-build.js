#!/usr/bin/env node

process.env.JS_ENV = 'client';
require('./../transpile'); // babel registration (runtime transpilation for node)
require('./client-build-es6.js');
