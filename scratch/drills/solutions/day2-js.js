// ========================================
// DAY 2 — JS DRILL: Dedup Array
// ========================================
// Timer: START NOW. Target: 5 minutes.
//
// TASK 1: Remove duplicates using Set
// Input:  [1, 2, 2, 3, 4, 4, 5, 1]
// Output: [1, 2, 3, 4, 5]
//
// TASK 2: Remove duplicates WITHOUT Set (use filter + indexOf)
// Same input/output
//
// TASK 3: Dedup array of objects by email
// Input:  [{ email: 'a@b.com', name: 'Alice' }, { email: 'c@d.com', name: 'Bob' }, { email: 'a@b.com', name: 'Alice2' }]
// Output: [{ email: 'a@b.com', name: 'Alice' }, { email: 'c@d.com', name: 'Bob' }]
// (keep first occurrence)
// ========================================

const nums = [1, 2, 2, 3, 4, 4, 5, 1];

// TASK 1: Set
function dedupSet(arr) {
  return [...new Set(arr)]
}
console.log('Set:', dedupSet(nums));

// TASK 2: No Set
function dedupNoSet(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index)
}
console.log('No Set:', dedupNoSet(nums));

// TASK 3: Dedup objects by key
const users = [
  { email: 'a@b.com', name: 'Alice' },
  { email: 'c@d.com', name: 'Bob' },
  { email: 'a@b.com', name: 'Alice2' },
];

function dedupByKey(arr, key) {
  const result = new Set()
  return arr.filter(item => {
    if (result.has(item[key])) return false;
    result.add(item[key])
    return true
  })
}
console.log('By key:', dedupByKey(users, 'email'));

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
