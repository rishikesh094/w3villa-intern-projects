// Refactor using Arrow function

// old way

function sum(a, b) {
  return a + b;
}
console.log("Sum is:", sum(10, 20));

// refactored

const add = (a, b) => (a+b);
console.log("Sum is:", add(10, 20));


// Refactor using Destructuring

const user = {
    name: "Rishi",
    age: 21
}
const name = user.name;
const age = user.age;

console.log("Name:"+name+" Age:"+age);

// Refactored
const person = {
    p_name: "John",
    p_age: 21
}

const {p_name, p_age} = person;

console.log("Person's Name:"+p_name+" and Age:"+p_age)