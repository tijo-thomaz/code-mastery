package main

import (
	"errors"
	"fmt"
)

// Exercise 1: Variables and Types
// Demonstrates short declaration, explicit typing, and zero values.
func variablesAndTypes() (int, float64, string, bool) {
	i := 42
	f := 3.14
	s := "hello"
	b := true
	return i, f, s, b
}

// Exercise 2: If/Switch
// Switch with range expressions is idiomatic Go for grading.
func grade(score int) string {
	switch {
	case score >= 90:
		return "A"
	case score >= 80:
		return "B"
	case score >= 70:
		return "C"
	case score >= 60:
		return "D"
	default:
		return "F"
	}
}

// Exercise 3: Loops
// Go only has for loops — this pattern covers all iteration needs.
func sumToN(n int) int {
	sum := 0
	for i := 1; i <= n; i++ {
		sum += i
	}
	return sum
}

// Exercise 4: Slices
// Append to a nil slice is safe — Go allocates as needed.
func filterEvens(nums []int) []int {
	var result []int
	for _, n := range nums {
		if n%2 == 0 {
			result = append(result, n)
		}
	}
	return result
}

// Exercise 5: Maps
// Ranging over a string yields runes (Unicode code points), not bytes.
func charFrequency(s string) map[rune]int {
	freq := make(map[rune]int)
	for _, ch := range s {
		freq[ch]++
	}
	return freq
}

// Exercise 6: Structs
// Value receiver — Rectangle is small and doesn't need mutation.
type Rectangle struct {
	Width  float64
	Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

// Exercise 7: Pointers
// Pointer receiver pattern — modifies the original value in place.
func doubleValue(p *int) {
	*p *= 2
}

// Exercise 8: Functions with Multiple Returns
// Idiomatic Go: return (value, error) and let the caller decide.
func safeDivide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func main() {
	// Exercise 1
	i, f, s, b := variablesAndTypes()
	fmt.Printf("1. Variables: %d, %.2f, %s, %t\n", i, f, s, b)

	// Exercise 2
	fmt.Printf("2. Grade(85): %s\n", grade(85))
	fmt.Printf("   Grade(42): %s\n", grade(42))

	// Exercise 3
	fmt.Printf("3. Sum to 10: %d\n", sumToN(10))

	// Exercise 4
	evens := filterEvens([]int{1, 2, 3, 4, 5, 6, 7, 8})
	fmt.Printf("4. Evens: %v\n", evens)

	// Exercise 5
	freq := charFrequency("hello")
	fmt.Printf("5. Char freq of 'hello': %v\n", freq)

	// Exercise 6
	rect := Rectangle{Width: 5, Height: 3}
	fmt.Printf("6. Rectangle area: %.2f\n", rect.Area())

	// Exercise 7
	val := 21
	doubleValue(&val)
	fmt.Printf("7. Doubled: %d\n", val)

	// Exercise 8
	result, err := safeDivide(10, 3)
	fmt.Printf("8. 10/3 = %.2f, err: %v\n", result, err)
	result, err = safeDivide(10, 0)
	fmt.Printf("   10/0 = %.2f, err: %v\n", result, err)
}
