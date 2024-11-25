// console.log(arguments);
// console.log(require('module').wrapper);

// Using "module.exports"
const C = require('./test-module-1.js');
const calc1 = new C();

console.log(calc1.add(2, 5));

// Using just "exports"
const calc2 = require('./test-module-2.js');

console.log(calc2.add(6, 7));
console.log(calc2.multiply(4, 5));
