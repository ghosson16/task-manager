import { Search } from 'lucide-react';

function TaskFilters({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }) {
  const categories = ["all", "personal", "work", "study"];
    return (
    <div className="space-y-4 mb-8 text-left">
        
            <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600"
            />
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
            <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
            }`}
            >
            {cat}
            </button>
        ))}
        </div>
    </div>
    );
}

export default TaskFilters;