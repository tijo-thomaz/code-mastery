// package main

// import (
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"time"
// )

// // ─── MODEL ───

// type Task struct {
// 	ID    string `json:"id"`
// 	Title string `json:"title"`
// 	Done  bool   `json:"done"`
// }

// // ─── IN-MEMORY STORE ───

// var tasks = []Task{
// 	{ID: "1", Title: "Learn Go", Done: false},
// 	{ID: "2", Title: "Build API", Done: true},
// }

// // ─── HANDLERS ───

// func getTasks(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(tasks)
// }

// func getTaskByID(w http.ResponseWriter, r *http.Request) {
// 	id := r.PathValue("id")
// 	for _, t := range tasks {
// 		if t.ID == id {
// 			w.Header().Set("Content-Type", "application/json")
// 			json.NewEncoder(w).Encode(t)
// 			return
// 		}
// 	}
// 	http.Error(w, "not found", http.StatusNotFound)
// }

// func createTask(w http.ResponseWriter, r *http.Request) {
// 	var t Task
// 	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
// 		http.Error(w, "invalid json", http.StatusBadRequest)
// 		return
// 	}
// 	t.ID = fmt.Sprintf("%d", time.Now().UnixNano())
// 	tasks = append(tasks, t)

// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(t)
// }

// // ─── MIDDLEWARE ───

// func logger(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		start := time.Now()
// 		next.ServeHTTP(w, r)
// 		fmt.Printf("[%s] %s %v\n", r.Method, r.URL.Path, time.Since(start))
// 	})
// }

// // ─── MAIN ───

// func main() {
// 	mux := http.NewServeMux()
// 	mux.HandleFunc("GET /api/tasks", getTasks)
// 	mux.HandleFunc("GET /api/tasks/{id}", getTaskByID)
// 	mux.HandleFunc("POST /api/tasks", createTask)

// 	fmt.Println("Server on :8080")
// 	http.ListenAndServe(":8080", logger(mux))
// }

// // ─── TEST WITH ───
// // curl http://localhost:8080/api/tasks
// // curl http://localhost:8080/api/tasks/1
// // curl -X POST http://localhost:8080/api/tasks -d '{"title":"New task","done":false}'

package main

import (
	"encoding/json"
	"net/http"
)

type Task struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

var task = []Task{
	{ID: "1", Title: "Task1", Done: true},
	{ID: "2", Title: "Task2", Done: false},
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/tasks", getTasks)

	http.ListenAndServe(":8080", mux)

}
