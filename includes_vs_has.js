const { performance } = require('perf_hooks');

const numElements = 1000000; // Number of elements in the array and object
const target = 'test'; // The string to search for

// Populate the array and object with some example strings
const testArray = [];
const testObject = {};
for (let i = 0; i < numElements; i++) {
  const value = `value${i}`;
  testArray.push(value);
  testObject[value] = true;
}

// Insert the target string
testArray[Math.floor(numElements / 2)] = target;
testObject[target] = true;

// Benchmark Array.includes()
let start = performance.now();
let foundArray = testArray.includes(target);
let end = performance.now();
let timeArray = end - start;

console.log(`Array.includes() took ${timeArray.toFixed(2)} milliseconds.`);
console.log(`Array.includes() found target: ${foundArray}`);

// Benchmark Object.hasOwnProperty()
start = performance.now();
let foundObject = testObject.hasOwnProperty(target);
end = performance.now();
let timeObject = end - start;

console.log(`Object.hasOwnProperty() took ${timeObject.toFixed(2)} milliseconds.`);
console.log(`Object.hasOwnProperty() found target: ${foundObject}`);

// Compare results
if (timeArray < timeObject) {
  console.log('Array.includes() is faster.');
} else if (timeArray > timeObject) {
  console.log('Object.hasOwnProperty() is faster.');
} else {
  console.log('Both methods have similar performance.');
}
