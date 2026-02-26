import { X, Calendar, Tag, AlertCircle } from 'lucide-react';

function TaskModal({
    currentTaskId,
    newTitle, setNewTitle,
    priority, setPriority,
    category, setCategory,
    dueDate, setDueDate,
    handleSave, closeForm
}) {
    return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300 border border-transparent dark:border-slate-800">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    {currentTaskId ? "Edit Task" : "New Task"}
                </h2>
                <button 
                    onClick={closeForm} 
                    className="text-slate-400 hover:text-rose-500 p-2 bg-slate-50 dark:bg-slate-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col text-left">
                {/* Task Title */}
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Task Title</label>
                <input
                    type="text"
                    required
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What are you planning?"
                    className="bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500/20 dark:focus:border-indigo-500/10 rounded-2xl px-5 py-4 mb-6 outline-none text-slate-700 dark:text-slate-200 text-lg font-medium transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Priority Select */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Priority
                        </label>
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 dark:text-slate-300 font-bold cursor-pointer transition-all appearance-none"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Category Select */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 dark:text-slate-300 font-bold cursor-pointer transition-all appearance-none"
                        >
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                        </select>
                    </div>
                </div>

                {/* Due Date */}
                <div className="flex flex-col mb-10">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-600 dark:text-slate-300 font-bold transition-all"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                    >
                        {currentTaskId ? "UPDATE" : "CREATE TASK"}
                    </button>
                    <button 
                        type="button" 
                        onClick={closeForm} 
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-black py-4 rounded-[1.5rem] transition-all"
                    >
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
};
export default TaskModal;