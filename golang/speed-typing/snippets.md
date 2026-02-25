# Go Speed Typing Snippets

Practice typing these common Go patterns until they become muscle memory.

---

## 1. Hello World

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

## 2. Goroutine with WaitGroup

```go
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
	wg.Add(1)
	go func(id int) {
		defer wg.Done()
		fmt.Printf("worker %d\n", id)
	}(i)
}
wg.Wait()
```

## 3. Channel Send/Receive

```go
ch := make(chan string)
go func() {
	ch <- "hello"
}()
msg := <-ch
fmt.Println(msg)
```

## 4. Buffered Channel

```go
ch := make(chan int, 5)
for i := 0; i < 5; i++ {
	ch <- i
}
close(ch)
for v := range ch {
	fmt.Println(v)
}
```

## 5. Select with Timeout

```go
select {
case msg := <-ch:
	fmt.Println(msg)
case <-time.After(3 * time.Second):
	fmt.Println("timeout")
}
```

## 6. HTTP Handler

```go
http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"status":"ok"}`)
})
log.Fatal(http.ListenAndServe(":8080", nil))
```

## 7. Struct and Interface

```go
type Animal interface {
	Speak() string
}

type Dog struct {
	Name string
}

func (d Dog) Speak() string {
	return fmt.Sprintf("%s says woof!", d.Name)
}
```

## 8. Error Handling

```go
result, err := doSomething()
if err != nil {
	return fmt.Errorf("doSomething failed: %w", err)
}
fmt.Println(result)
```

## 9. Custom Error Type

```go
type NotFoundError struct {
	ID   int
	Name string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with id %d not found", e.Name, e.ID)
}
```

## 10. JSON Marshal/Unmarshal

```go
type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Age   int    `json:"age"`
}

data, err := json.Marshal(User{Name: "Alice", Email: "alice@example.com", Age: 30})
if err != nil {
	log.Fatal(err)
}

var u User
if err := json.Unmarshal(data, &u); err != nil {
	log.Fatal(err)
}
```

## 11. Slice Operations

```go
s := []int{1, 2, 3, 4, 5}
s = append(s, 6)
s = append(s[:2], s[3:]...)  // remove index 2
copy(s[1:], s[2:])           // shift left
```

## 12. Map Operations

```go
m := map[string]int{
	"alice": 90,
	"bob":   85,
}
m["charlie"] = 92
if val, ok := m["alice"]; ok {
	fmt.Printf("alice: %d\n", val)
}
delete(m, "bob")
```

## 13. Worker Pool Pattern

```go
jobs := make(chan int, 100)
results := make(chan int, 100)

for w := 0; w < 3; w++ {
	go func() {
		for j := range jobs {
			results <- j * j
		}
	}()
}

for i := 0; i < 10; i++ {
	jobs <- i
}
close(jobs)

for i := 0; i < 10; i++ {
	fmt.Println(<-results)
}
```

## 14. Defer/Recover

```go
func safeCall() (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("recovered: %v", r)
		}
	}()
	panic("something went wrong")
}
```

## 15. Context with Timeout

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case <-time.After(2 * time.Second):
	fmt.Println("operation completed")
case <-ctx.Done():
	fmt.Println("timeout:", ctx.Err())
}
```

## 16. Generic Function

```go
func Map[T any, U any](slice []T, fn func(T) U) []U {
	result := make([]U, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}
```

## 17. Mutex-Protected Map

```go
type SafeMap struct {
	mu sync.RWMutex
	m  map[string]int
}

func (sm *SafeMap) Get(key string) (int, bool) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	val, ok := sm.m[key]
	return val, ok
}

func (sm *SafeMap) Set(key string, val int) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.m[key] = val
}
```
