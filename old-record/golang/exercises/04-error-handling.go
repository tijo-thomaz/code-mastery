package main

import (
	"errors"
	"fmt"
)

// =============================================================================
// Exercise 1: Error Interface
// Write a function parseInt(s string) (int, error) that converts a string to int.
// Return an error if the string is not a valid integer.
// (Hint: use strconv.Atoi or manual parsing)
// =============================================================================

func parseInt(s string) (int, error) {
	// TODO: Implement
	return 0, nil
}

// =============================================================================
// Exercise 2: Custom Errors
// Define a ValidationError struct with fields: Field string, Message string.
// Implement the error interface on it.
// Write validateAge(age int) error that returns a *ValidationError if age < 0 or age > 150.
// =============================================================================

type ValidationError struct {
	// TODO: Add fields
}

func (e *ValidationError) Error() string {
	// TODO: Implement
	return ""
}

func validateAge(age int) error {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 3: errors.Is and errors.As
// Define a sentinel error: ErrNotFound = errors.New("not found")
// Write findUser(id int) error that returns a wrapped ErrNotFound for id <= 0.
// Write a caller that uses errors.Is to check for ErrNotFound.
// =============================================================================

var ErrNotFound = errors.New("not found")

func findUser(id int) error {
	// TODO: Implement — wrap ErrNotFound with fmt.Errorf for id <= 0
	return nil
}

// =============================================================================
// Exercise 4: Wrapping Errors
// Write a function openConfig(path string) error that:
//   - Calls os.Open(path)
//   - Wraps the error with context: "opening config: %w"
// =============================================================================

func openConfig(path string) error {
	// TODO: Implement
	return nil
}

// =============================================================================
// Exercise 5: Panic and Recover
// Write a function safeDivision(a, b int) (result int, err error) that:
//   - Uses defer/recover to catch a panic from dividing by zero
//   - Returns the error instead of panicking
// =============================================================================

func safeDivision(a, b int) (result int, err error) {
	// TODO: Implement with defer/recover
	return a / b, nil
}

// =============================================================================
// Exercise 6: Sentinel Errors
// Define sentinel errors for a file processing pipeline:
//   ErrFileTooLarge, ErrUnsupportedFormat, ErrPermissionDenied
// Write processFile(name string, sizeMB int) error that returns appropriate errors:
//   - sizeMB > 100 -> ErrFileTooLarge
//   - name ends with ".exe" -> ErrUnsupportedFormat
//   - name starts with "." -> ErrPermissionDenied
// =============================================================================

var (
	ErrFileTooLarge      = errors.New("file too large")
	ErrUnsupportedFormat = errors.New("unsupported format")
	ErrPermissionDenied  = errors.New("permission denied")
)

func processFile(name string, sizeMB int) error {
	// TODO: Implement
	return nil
}

func main() {
	// Exercise 1
	fmt.Println("=== Exercise 1: Error Interface ===")
	v, err := parseInt("42")
	fmt.Printf("parseInt(\"42\"): %d, err: %v\n", v, err)
	v, err = parseInt("abc")
	fmt.Printf("parseInt(\"abc\"): %d, err: %v\n", v, err)

	// Exercise 2
	fmt.Println("\n=== Exercise 2: Custom Errors ===")
	fmt.Printf("validateAge(25): %v\n", validateAge(25))
	fmt.Printf("validateAge(-5): %v\n", validateAge(-5))

	// Exercise 3
	fmt.Println("\n=== Exercise 3: errors.Is / errors.As ===")
	err = findUser(0)
	fmt.Printf("findUser(0): %v\n", err)
	fmt.Printf("Is ErrNotFound? %t\n", errors.Is(err, ErrNotFound))

	// Exercise 4
	fmt.Println("\n=== Exercise 4: Wrapping Errors ===")
	err = openConfig("/nonexistent/config.yaml")
	fmt.Printf("openConfig: %v\n", err)

	// Exercise 5
	fmt.Println("\n=== Exercise 5: Panic/Recover ===")
	result, err := safeDivision(10, 2)
	fmt.Printf("10/2 = %d, err: %v\n", result, err)
	result, err = safeDivision(10, 0)
	fmt.Printf("10/0 = %d, err: %v\n", result, err)

	// Exercise 6
	fmt.Println("\n=== Exercise 6: Sentinel Errors ===")
	fmt.Printf("processFile(\"doc.pdf\", 50): %v\n", processFile("doc.pdf", 50))
	fmt.Printf("processFile(\"big.zip\", 200): %v\n", processFile("big.zip", 200))
	fmt.Printf("processFile(\"app.exe\", 10): %v\n", processFile("app.exe", 10))
	fmt.Printf("processFile(\".secret\", 5): %v\n", processFile(".secret", 5))
}
