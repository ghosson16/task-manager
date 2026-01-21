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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    {currentTaskId ? "Edit Task" : "New Task"}
                </h2>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Task Title</label>
                <input
                    type="text"
                    required
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What are you planning?"
                    className="bg-slate-50 border-none rounded-2xl px-5 py-4 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 text-lg"
                />

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Priority
                        </label>
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium cursor-pointer"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium cursor-pointer"
                        >
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium"
                    />
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all">
                        {currentTaskId ? "Save Changes" : "Add Task"}
                    </button>
                    <button type="button" onClick={closeForm} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-4 rounded-2xl transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
};
export default TaskModal;