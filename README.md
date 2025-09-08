## Difference between var, let, and
** Answer **

var → old way, function-scoped, can be re-declared & updated.

let → block-scoped, can be updated but not re-declared.

const → block-scoped, cannot be re-assigned (value fixed).

==> Use let for changing values, const for fixed values.


## Difference between map(), forEach(), and filter()
** Answer **

forEach() → just loops over items, does not return anything.

map() → loops and returns a new array with modified values.

filter() → loops and returns a new array with only items that match a condition.


## Arrow functions in ES6
** Answer **
A shorter way to write functions using =>.

`
// normal
function add(a, b) { return a + b; }

// arrow
const add = (a, b) => a + b;

`

## Destructuring assignment in ES6
** Answer **
A quick way to take values from arrays or objects into variables.

`
const [a, b] = [1, 2];   // a=1, b=2
const {name, age} = {name: "Rasel", age: 25}; // name="Rasel"

`


## Template literals in ES6
** Answer **
Strings written with backticks `.

Allow variables inside strings with ${ }.

Can be multi-line easily.

`const name = "Rasel";
console.log(`Hello, my name is ${name}`); // easier than "Hello, my name is " + name
`



