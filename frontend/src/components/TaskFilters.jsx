import { Search } from 'lucide-react';

function TaskFilters({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) {
    return (
    <div className="space-y-4 mb-8 text-left">
        
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
            <input
            type="text"
            placeholder="Search for a task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 placeholder:text-slate-400"
            />
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {['all', 'pending', 'completed'].map((status) => (
                <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold capitalize transition-all ${
                    filterStatus === status
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                >
                    {status}
                </button>
            ))}
        </div>
    </div>
    );
}

export default TaskFilters;