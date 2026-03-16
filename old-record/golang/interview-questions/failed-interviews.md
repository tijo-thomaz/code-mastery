# Failed Interview Questions — Go

Track questions you got wrong or struggled with. Review before interviews.

---

## Template

### Date:
### Company:
### Question:
### My (Wrong) Answer:
### Correct Answer:
### What I Learned:
### Study Resources:

---

## Example Entry 1

### Date: 2025-01-15
### Company: Acme Corp
### Question: What happens if you start a goroutine that sends to a channel but no one ever receives from it?

### My (Wrong) Answer:
"The goroutine will eventually be garbage collected since nothing references it."

### Correct Answer:
The goroutine **leaks** — it blocks forever on the channel send and is never garbage collected. The Go runtime does not detect or clean up blocked goroutines. This is a goroutine leak.

To fix:
- Use a buffered channel so the send doesn't block
- Use `context.WithCancel` or `context.WithTimeout` and `select` to allow the goroutine to exit
- Ensure there's always a receiver

```go
// Leaky
go func() {
    ch <- result // blocks forever if nobody reads
}()

// Fixed with context
go func() {
    select {
    case ch <- result:
    case <-ctx.Done():
        return
    }
}()
```

### What I Learned:
Goroutines are not garbage collected — they must explicitly exit. Always design for cancellation.

### Study Resources:
- https://go.dev/blog/pipelines
- https://go.dev/blog/context

---

## Example Entry 2

### Date: 2025-02-20
### Company: TechStart Inc
### Question: What does this code print and why?

```go
s := []int{1, 2, 3}
t := append(s[:2], 4)
fmt.Println(s)
fmt.Println(t)
```

### My (Wrong) Answer:
"s is [1, 2, 3] and t is [1, 2, 4] — append creates a new slice."

### Correct Answer:
`s` prints `[1 2 4]` and `t` prints `[1 2 4]`.

`s[:2]` creates a slice with length 2 but the **capacity is still 3** (backed by the same array). Since there's room, `append` writes `4` into index 2 of the **original** backing array, overwriting `3`. Both `s` and `t` share the underlying array.

```go
s := []int{1, 2, 3}    // len=3, cap=3, array=[1,2,3]
t := s[:2]              // len=2, cap=3, same array
t = append(t, 4)        // len=3, cap=3, array=[1,2,4] — overwrites s[2]!
```

To avoid this, use a full slice expression: `s[:2:2]` to limit capacity.

### What I Learned:
Slice append only allocates a new array when capacity is exceeded. Sub-slices share the backing array and can cause subtle mutations. Use the three-index slice `s[low:high:max]` to control capacity.

### Study Resources:
- https://go.dev/blog/slices-intro
- https://go.dev/ref/spec#Slice_expressions
