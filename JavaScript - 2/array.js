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

console.log(elements.slice(1, 3)); // [20,30]

// splice
let data = [1, 2, 3, 4, 5];
<<<<<<< HEAD
console.log(data.splice(1, 3)); // [2,3,4]
console.log(data); // [1,5]
data.splice(1,1,2); 
console.log(data); // [1,2]

// concatenate 
let a = [1, 2];
let b = a.concat([3, 4], 5);
console.log(b); // [1, 2, 3, 4, 5]

//map
let squared = [1, 2, 3].map(x => x ** 2);
console.log(squared); // [1, 4, 9]

//find
let num = [1, 2, 3, 4];
console.log(num.find(n => n > 1)); // [2, 3, 4]

//reduce 
let arr = [1, 2, 3, 4, 5];
console.log(arr.reduce((acc, val) => acc + val, 0)); // 15

//filter
let odd = [1, 2, 3, 4].filter(x => x % 2 !== 0);
console.log(odd); // [1, 3]
=======
console.log(data.splice(1, 3));
console.log(data);
let replaced = data.splice(1,1,2,3);
console.log(replaced)
>>>>>>> 879462a (Learn about react)

