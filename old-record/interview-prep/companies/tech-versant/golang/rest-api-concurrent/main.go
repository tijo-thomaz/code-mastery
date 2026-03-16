package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

// ─── MODEL ───

type Task struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Done   bool   `json:"done"`
	Status string `json:"status"` // "pending" | "processing" | "completed"
}

// ─── THREAD-SAFE STORE (sync.RWMutex) ───

type TaskStore struct {
	mu    sync.RWMutex
	tasks map[string]Task
}

func NewTaskStore() *TaskStore {
	return &TaskStore{tasks: make(map[string]Task)}
}

func (s *TaskStore) GetAll() []Task {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		result = append(result, t)
	}
	return result
}

func (s *TaskStore) Get(id string) (Task, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	t, ok := s.tasks[id]
	return t, ok
}

func (s *TaskStore) Set(t Task) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.tasks[t.ID] = t
}

// ─── BACKGROUND WORKER (goroutine + channel) ───

func worker(id int, jobs <-chan Task, store *TaskStore, wg *sync.WaitGroup) {
	defer wg.Done()
	for task := range jobs {
		fmt.Printf("[Worker %d] Processing task: %s\n", id, task.Title)

		// Update status to processing
		task.Status = "processing"
		store.Set(task)

		time.Sleep(2 * time.Second) // simulate work

		// Update status to completed
		task.Status = "completed"
		task.Done = true
		store.Set(task)

		fmt.Printf("[Worker %d] Completed task: %s\n", id, task.Title)
	}
}

// ─── HANDLERS ───

var store = NewTaskStore()
var jobs = make(chan Task, 10) // buffered channel

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(store.GetAll())
}

func getTaskByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	t, ok := store.Get(id)
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}

func createTask(w http.ResponseWriter, r *http.Request) {
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	t.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	t.Status = "pending"
	store.Set(t)

	// Send to worker pool via channel
	jobs <- t

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

// ─── MAIN ───

func main() {
	// Start 3 workers
	var wg sync.WaitGroup
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go worker(i, jobs, store, &wg)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/tasks", getTasks)
	mux.HandleFunc("GET /api/tasks/{id}", getTaskByID)
	mux.HandleFunc("POST /api/tasks", createTask)

	fmt.Println("Server on :8080 (3 workers running)")
	http.ListenAndServe(":8080", mux)

	// Cleanup (reached on shutdown)
	close(jobs)
	wg.Wait()
}

// ─── WHAT TO NARRATE IN INTERVIEW ───
//
// "I wrap my store with sync.RWMutex — RLock for reads so multiple
//  goroutines can read concurrently, Lock for writes which is exclusive.
//  Always defer Unlock.
//
//  When a task is created, I send it to a buffered channel. 3 worker
//  goroutines range over this channel and process tasks concurrently.
//  WaitGroup tracks when all workers finish.
//
//  The flow: POST creates task (pending) → channel → worker picks it up
//  (processing) → worker completes it (completed). GET shows real-time
//  status because the store is thread-safe."
//
// ─── TEST ───
// Terminal 1: go run main.go
// Terminal 2: .\test.ps1
