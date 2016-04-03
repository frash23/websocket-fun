'use strict';

exports.arrayContains = (arr, val)=> arr.indexOf(val) > -1;

exports.randomUint32 = ()=> Math.floor( Math.random() * ( Math.pow(2, 31) - 1 ) );
