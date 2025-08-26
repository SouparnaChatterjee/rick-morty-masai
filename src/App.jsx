import React, { useEffect, useRef, useState } from "react";

// Rick & Morty Pagination App — 10 items per page
// Requirements covered:
// - useEffect: fetches data on mount
// - useRef: stores the current page number
// - Pagination: 10 characters per page with highlighted current page
// - Grid display of characters

export default function App() {
  const [info, setInfo] = useState({ count: 0, pages: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const pageRef = useRef(1); // <- stores current page number
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache API pages (the API returns 20 per page; we show 10 per page)
  const apiCache = useRef(new Map()); // key: apiPage (1-based) -> value: array of 20 characters

  const API_BASE = "https://rickandmortyapi.com/api/character";

  const totalPages = Math.max(1, Math.ceil((info.count || 0) / 10));

  const fetchApiPage = async (apiPage) => {
    if (apiCache.current.has(apiPage)) {
      return apiCache.current.get(apiPage);
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?page=${apiPage}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      apiCache.current.set(apiPage, data.results || []);
      if (!info.count) {
        setInfo({ count: data.info?.count || 0, pages: data.info?.pages || 0 });
      }
      return data.results || [];
    } catch (e) {
      setError(e.message || "Failed to fetch");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (page) => {
    const apiPage = Math.ceil(page / 2); // API serves 20 per page; we show 10 per page
    const list = await fetchApiPage(apiPage);
    const start = page % 2 === 1 ? 0 : 10; // odd pages -> first 10, even pages -> last 10
    const slice = list.slice(start, start + 10);
    setCharacters(slice);
  };

  useEffect(() => {
    // Load first page on mount
    loadPage(1);
  }, []);

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    pageRef.current = p; // keep the latest page number in a ref
    setCurrentPage(p); // state to trigger re-render
    loadPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    const pages = [];
    const maxButtons = 9;
    const range = 2; // show a window around the current page
    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (end - start + 1 < maxButtons) {
      const deficit = maxButtons - (end - start + 1);
      start = Math.max(1, start - Math.floor(deficit / 2));
      end = Math.min(totalPages, start + maxButtons - 1);
    }

    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 my-4">
        <button onClick={() => gotoPage(1)} disabled={currentPage === 1} className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 disabled:opacity-50">« First</button>
        <button onClick={() => gotoPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 disabled:opacity-50">‹ Prev</button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2">…</span>
          ) : (
            <button
              key={p}
              onClick={() => gotoPage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`px-3 py-1 rounded-full border ${p === currentPage ? "bg-sky-500 text-white border-sky-500" : "bg-gray-100 text-gray-900 border-gray-300"}`}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => gotoPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 disabled:opacity-50">Next ›</button>
        <button onClick={() => gotoPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 disabled:opacity-50">Last »</button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <header className="flex items-baseline justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Rick & Morty — Pagination (10 per page)</h1>
        <div className="text-sm text-gray-600">
          Current page (ref): <strong>{pageRef.current}</strong> / {totalPages || "…"}
        </div>
      </header>

      <Pagination />

      {error && (
        <div role="alert" className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-xl my-3">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-6">Loading…</div>
      )}

      {!loading && characters.length === 0 && !error && (
        <div className="text-center py-6 text-gray-500">No characters to display.</div>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        {characters.map((c) => (
          <article key={c.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow">
            <img alt={c.name} src={c.image} className="w-full h-44 object-cover" />
            <div className="p-3">
              <h2 className="text-base font-semibold mb-1">{c.name}</h2>
              <div className="text-sm text-gray-700 space-y-0.5">
                <div><strong>Status:</strong> {c.status}</div>
                <div><strong>Species:</strong> {c.species}</div>
                <div><strong>Location:</strong> {c.location?.name}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination />

      <footer className="mt-6 text-xs text-center text-gray-500">
        Data: Rick and Morty API — {info.count ? `${info.count} characters` : "…"}
      </footer>
    </div>
  );
}
