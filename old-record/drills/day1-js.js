// ========================================
// DAY 1 — JS DRILL: Frequency Count
// ========================================
// Timer: START NOW. Target: 5 minutes.
//
// TASK: Given an array, count how many times each element appears.
// Input:  ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
// Output: { apple: 3, banana: 2, cherry: 1 }
//
// DO NOT SCROLL DOWN. Type your solution first.
// ========================================

const fruits = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];

// YOUR SOLUTION HERE:
function frequencyCount(arr) {
    return arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc
    }, {})
}

console.log(frequencyCount(fruits));
// Expected: { apple: 3, banana: 2, cherry: 1 }

// ========================================
// BONUS (if under 5 min): Do it with Map instead of object
// ========================================

function frequencyCountMap(arr) {
    const map = new Map()

    for (const item of arr) {
        map.set(item, (map.get(item || 0) + 1))
    }
    return map
}

console.log(frequencyCountMap(fruits));

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
