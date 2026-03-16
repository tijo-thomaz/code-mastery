package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Exercise 1: Error Interface
// strconv.Atoi is the standard way to parse integers from strings.
func parseInt(s string) (int, error) {
	return strconv.Atoi(s)
}

// Exercise 2: Custom Errors
// Custom error types let callers inspect error details programmatically.
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}

func validateAge(age int) error {
	if age < 0 {
		return &ValidationError{Field: "age", Message: "must be non-negative"}
	}
	if age > 150 {
		return &ValidationError{Field: "age", Message: "must be 150 or less"}
	}
	return nil
}

// Exercise 3: errors.Is and errors.As
// fmt.Errorf with %w wraps the error, preserving the chain for errors.Is/As.
var ErrNotFound = errors.New("not found")

func findUser(id int) error {
	if id <= 0 {
		return fmt.Errorf("findUser(%d): %w", id, ErrNotFound)
	}
	return nil
}

// Exercise 4: Wrapping Errors
// Always add context when propagating errors up the call stack.
func openConfig(path string) error {
	_, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("opening config: %w", err)
	}
	return nil
}

// Exercise 5: Panic and Recover
// defer+recover converts panics into errors — useful at API boundaries.
func safeDivision(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("recovered panic: %v", r)
		}
	}()
	return a / b, nil
}

// Exercise 6: Sentinel Errors
// Sentinel errors are package-level values used for expected error conditions.
var (
	ErrFileTooLarge      = errors.New("file too large")
	ErrUnsupportedFormat = errors.New("unsupported format")
	ErrPermissionDenied  = errors.New("permission denied")
)

func processFile(name string, sizeMB int) error {
	if sizeMB > 100 {
		return fmt.Errorf("processFile %q: %w", name, ErrFileTooLarge)
	}
	if strings.HasSuffix(name, ".exe") {
		return fmt.Errorf("processFile %q: %w", name, ErrUnsupportedFormat)
	}
	if strings.HasPrefix(name, ".") {
		return fmt.Errorf("processFile %q: %w", name, ErrPermissionDenied)
	}
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

	var ve *ValidationError
	err2 := validateAge(-1)
	if errors.As(err2, &ve) {
		fmt.Printf("ValidationError field: %s, message: %s\n", ve.Field, ve.Message)
	}

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
