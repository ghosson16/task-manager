import { X } from 'lucide-react';

function TaskModal({ currentTaskId, newTitle, setNewTitle, isCompleted, setIsCompleted, handleSave, closeForm}) {
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
                
                <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input
                    type="checkbox"
                    id="taskStatus"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="w-6 h-6 accent-indigo-600 rounded-lg cursor-pointer"
                    />
                    <label htmlFor="taskStatus" className="font-bold text-slate-600 cursor-pointer select-none">
                    I've completed this task
                    </label>
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