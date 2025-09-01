import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { articles as initialArticles } from "./data";

function formatDate(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt‑BR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(d);
}

const leagues = [
  { key: "all", label: "Todas" },
  { key: "Brasileirão", label: "Brasileirão" },
  { key: "Premier League", label: "Premier League" },
  { key: "Champions League", label: "Champions League" },
  { key: "Seleção", label: "Seleção Brasileira" }
];

export default function App() {
  const [query, setQuery] = useState("");
  const [league, setLeague] = useState("all");
  const [order, setOrder] = useState("desc");

  const filtered = useMemo(() => {
    let arr = [...initialArticles];
    if (league !== "all") arr = arr.filter((a) => a.league === league);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
      );
    }
    arr.sort((a, b) =>
      order === "desc"
        ? b.publishedAt.localeCompare(a.publishedAt)
        : a.publishedAt.localeCompare(b.publishedAt)
    );
    return arr;
  }, [league, order, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-cyan-700 text-white p-6">
      <header className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">⚽ Futebol Total%</h1>
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Buscar..."
          className="px-3 py-2 rounded text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded text-black"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
        >
          {leagues.map((l) => (
            <option key={l.key} value={l.key}>
              {l.label}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 rounded text-black"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigas</option>
        </select>
      </header>

      <AnimatePresence>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <motion.a
              key={a.title}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <img
                src={a.image}
                alt={a.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 text-black flex-1 flex flex-col">
                <h2 className="font-bold text-lg mb-2">{a.title}</h2>
                <p className="text-sm flex-1">{a.summary}</p>
                <div className="mt-3 text-xs text-gray-500">
                  {a.source} • {formatDate(a.publishedAt)}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}