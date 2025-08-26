import React, { useEffect, useState } from "react";

// Simple Todos Pagination App
// Requirements covered:
// - Fetch from jsonplaceholder todos
// - useEffect to load data
// - Pagination: 10 items per page
// - Next/Previous buttons
// - Highlight current page number

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Todos Pagination (10 per page)</h1>

      {error && <div className="text-red-600">Error: {error}</div>}
      {loading && <div>Loading…</div>}

      <ul className="space-y-2">
        {currentTodos.map((todo) => (
          <li
            key={todo.id}
            className="border rounded-lg px-3 py-2 shadow-sm bg-white"
          >
            <span className="font-semibold">#{todo.id}</span>: {todo.title}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => gotoPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => gotoPage(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => gotoPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}