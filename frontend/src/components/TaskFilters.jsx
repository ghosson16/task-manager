import { Search } from 'lucide-react';

function TaskFilters({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }) {
  const categories = ["all", "personal", "work", "study"];
  
  return (
    <div className="space-y-4 mb-8 text-left">
      {/* Search Input Field */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-5 py-3.5 rounded-[1.2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-slate-600 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium"
        />
      </div>
      
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap border ${
              filterCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none"
                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
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