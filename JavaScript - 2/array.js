// Program using Array methods

// push and pop
let arr = [1, 2, 3];
arr.push(4);
console.log("After push: ", arr);

arr.pop();
console.log("After pop: ", arr);

// unshift and shift
let fruits = ["apple", "orange", "pineapple"];
fruits.unshift("strawberry");
console.log("After unshift: ", fruits);

fruits.shift();
console.log("After shift: ", fruits);

// slice
let elements = [10, 20, 30, 40, 50];

console.log(elements.slice(1, 3));

// splice
let data = [1, 2, 3, 4, 5];
console.log(data.splice(1, 3));
console.log(data);
console.log(data.splice(1,2,2,3));

