//  enable runtime transpilation to use ES6/7 in node

/* eslint-disable */
var config = require('../config/babel.config.js');
/* eslint-enable */

require('babel-core/register')(config);
