// console.log(arguments);
// console.log(require('module').wrapper);

// Using "module.exports"
const C = require('./test-module-1.js');
const calc1 = new C();

console.log(calc1.add(2, 5));

// Using just "exports"
// const calc2 = require('./test-module-2.js');
const { add, multiply, devide } = require('./test-module-2.js');

console.log(add(6, 7));
console.log(multiply(4, 5));
console.log(devide(16, 2));
