// Hello.
// This is a set of exercises.
// The idea is to practice a few things at a time.
// You do this by writing your answer after a task is given (see the example).
// Use the concepts from our sylabus. 

// DO NOT change the provided code unless the task specifically says to do so.

/* -----------------------------------------------------------------------------
    Task: Example
    Write code to print all the names in the list, one name per line
*/
console.log("Task: Example");
const people = ["Tony", "Christian", "Håkon"]

for (let index = 0; index < people.length; index++) {
    let person = people[index];
    console.log(person);
}

/* -----------------------------------------------------------------------------
    Task: A
    create a function that "draws" a tree of a given height.
    Example the following is a tree of height 5

           5        *
           4       ***
           3      *****
           2     *******
           1        x
*/
console.log("Task: A");

function drawTree(height) {
    for (let i = 1; i <= height; i++) {
        let stars = '*'.repeat(2 * i - 1);
        let spaces = ' '.repeat(height - i);
        console.log(spaces + stars);
    }
    let trunkSpaces = ' '.repeat(height - 1);
    console.log(trunkSpaces + 'x');
}

drawTree(4);

/* -----------------------------------------------------------------------------
    Task: B

    Write a function that "draws" an arrow of a given size.
    Example: This is an arrow of size 3.

    *
    * *
    * * *
    * *
    * 
*/
console.log("Task: B");

function drawArrow(size) {
    for (let i = 1; i <= size; i++) {
        console.log('* '.repeat(i).trim());
    }
    for (let i = size - 1; i > 0; i--) {
        console.log('* '.repeat(i).trim());
    }
}

drawArrow(3)
/* -----------------------------------------------------------------------------
    Task: C
    Write a function that draws a box of n by m dimensions. Take into acount the diffrence in aspectratio.

    Example: This is a aproximatly a 2 by 2 box. 
    +--------+
    |        |
    |        |
    +--------+
*/
console.log("Task: C");

function drawBox(n, m) {
    let topBottom = '+' + '-'.repeat(m - 2) + 'x';
    let middle = '|' + ' '.repeat(m - 2) + '|';

    console.log(topBottom);
    for (let i = 0; i < n - 2; i++) {
        console.log(middle)
    }
    console.log(topBottom)
}
drawBox(4, 10);

/* -----------------------------------------------------------------------------
    Task: D
    Write a function that returns true if a word is a Heterogram.   
*/
console.log("Task: D");

function isHeterogram(word) {
    let letterSet = new Set();
    word = word.toLowerCase().replace(/[^a-z]/g, '');

    for (let i = 0; i < word.length; i++) {
        if (letterSet.has(word[i])) {
            return false;
        }
        letterSet.add(word[i]);
    }
    return true;
}

console.log(isHeterogram("lamp"));
console.log(isHeterogram("letter"));

/* -----------------------------------------------------------------------------
    Task: E
    Write a function that returns true if two words are Anagrams.
*/
console.log("Task: E");

function areAnagrams(word1, word2) {
    word1 = word1.toLowerCase().replace(/[^a-z]/g, '');
    word2 = word2.toLowerCase().replace(/[^a-z]/g, '');

    if (word1.length !== word2.length) {
        return false;
    }

    let sortedWord1 = word1.split('').sort().join('');
    let sortedWord2 = word2.split('').sort().join('');

    return sortedWord1 === sortedWord2;
}

console.log(areAnagrams("listen", "silent"));
console.log(areAnagrams("hello", "world"));