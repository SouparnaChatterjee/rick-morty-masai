import React, { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(todos.length / itemsPerPage);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!res.ok) throw new Error("Failed to fetch todos");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const start = (currentPage - 1) * itemsPerPage;
  const currentTodos = todos.slice(start, start + itemsPerPage);

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Todos Pagination (10 per page)</h1>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {loading && <div>Loading…</div>}

      <ul>
        {currentTodos.map((todo) => (
          <li key={todo.id} style={{ margin: "6px 0", padding: "6px", border: "1px solid #ddd", borderRadius: 6 }}>
            <strong>#{todo.id}</strong> — {todo.title}
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: 20 }}>
        <button onClick={() => gotoPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => gotoPage(page)}
            style={{
              backgroundColor: page === currentPage ? "#0ea5e9" : "#f3f4f6",
              color: page === currentPage ? "white" : "black",
              padding: "4px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        ))}

        <button onClick={() => gotoPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
