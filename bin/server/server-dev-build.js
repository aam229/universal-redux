#!/usr/bin/env node

process.env.JS_ENV = 'server';
require('./../transpile'); // babel registration (runtime transpilation for node)
require('./server-dev-build-es6.js');
