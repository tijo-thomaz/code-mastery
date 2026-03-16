// ========================================
// DAY 3 — JS DRILL: GroupBy + Transform
// ========================================
// Timer: START NOW. Target: 8 minutes.
//
// TASK 1: GroupBy — group people by city
// Input:  [{ name: 'Alice', city: 'NYC' }, { name: 'Bob', city: 'LA' }, { name: 'Charlie', city: 'NYC' }]
// Output: { NYC: [{ name: 'Alice', city: 'NYC' }, { name: 'Charlie', city: 'NYC' }], LA: [{ name: 'Bob', city: 'LA' }] }
//
// TASK 2: GroupBy Count — count people per city
// Output: { NYC: 2, LA: 1 }
//
// TASK 3: Generic groupBy function — works with any key OR function
// groupBy(arr, 'city')           → groups by city
// groupBy(arr, x => x.name[0])  → groups by first letter of name
// ========================================

const people = [
  { name: 'Alice', city: 'NYC', age: 30 },
  { name: 'Bob', city: 'LA', age: 25 },
  { name: 'Charlie', city: 'NYC', age: 35 },
  { name: 'Diana', city: 'LA', age: 28 },
  { name: 'Eve', city: 'NYC', age: 22 },
];

// TASK 1: GroupBy city
function groupByCity(arr) {
  return arr.reduce((acc, item) => {
    const group = item['city']

    acc[group] = acc[group] ?? []

    return acc
  }, {})
}
console.log('GroupBy:', JSON.stringify(groupByCity(people), null, 2));

// TASK 2: GroupBy Count
function groupByCount(arr, key) {
  return arr.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1
    return acc
  }, {})
}
console.log('Count:', groupByCount(people, 'city'));
// Expected: { NYC: 3, LA: 2 }

// TASK 3: Generic groupBy (key string OR function)
function groupBy(arr, keyOrFn) {
  return arr.reduce((acc, item) => {
    let group

    if (typeof keyOrFn === "string") {
      group = item[keyOrFn]
    } else {
      group = keyOrFn(item)
    }
    acc[group] = acc[group] ?? []
    acc[group].push(item)

    return acc
  }, {})



}
console.log('By key:', groupBy(people, 'city'));
console.log('By fn:', groupBy(people, (p) => p.age >= 30 ? 'senior' : 'junior'));

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
