# Go (Golang) Mastery

## Overview

This section covers Go from basics to advanced concurrency and generics. Each exercise file compiles as `package main` with placeholder functions to implement.

## Setup

```bash
# Install Go 1.22+ from https://go.dev/dl/

# Initialize module
cd golang
go mod init golang-mastery

# Run an exercise
go run exercises/01-basics.go

# Run a solution
go run solutions/01-basics.go
```

## Go 1.22+ Features

- **Range over integers**: `for i := range 10 { ... }`
- **Loop variable fix**: Each iteration gets its own variable (no more closure gotchas)
- **Enhanced routing**: `http.HandleFunc("GET /api/{id}", handler)` with method + pattern matching
- **Slice/map ranging changes**: `for i, v := range slices.All(s) { ... }`

## Structure

```
golang/
├── exercises/              # Implement the placeholder functions
│   ├── 01-basics.go
│   ├── 02-functions-and-methods.go
│   ├── 03-concurrency.go
│   ├── 04-error-handling.go
│   └── 05-generics.go
├── solutions/              # Reference solutions with idiomatic Go
│   ├── 01-basics.go
│   ├── 02-functions-and-methods.go
│   ├── 03-concurrency.go
│   ├── 04-error-handling.go
│   └── 05-generics.go
├── speed-typing/
│   └── snippets.md         # Go code snippets for speed typing practice
├── interview-questions/
│   ├── common-questions.md # 12 Go interview Q&A
│   └── failed-interviews.md
└── README.md
```

## Progression

1. **Basics** — Variables, control flow, data structures, pointers
2. **Functions & Methods** — Interfaces, type assertions, first-class functions
3. **Concurrency** — Goroutines, channels, sync primitives, worker pools
4. **Error Handling** — Custom errors, wrapping, panic/recover
5. **Generics** — Type parameters, constraints, generic data structures
