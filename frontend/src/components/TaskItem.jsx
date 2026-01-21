import { Trash2, Edit3, CheckCircle, Calendar, Circle } from 'lucide-react';

function TaskItem({ task, deleteTask, openEditForm, toggleComplete }) {
    const priorityColors = {
        high: "bg-rose-500",
        medium: "bg-amber-500",
        low: "bg-slate-300"
    };
    const priorityBadge = {
        high: "bg-rose-50 text-rose-600 border-rose-100",
        medium: "bg-amber-50 text-amber-600 border-amber-100",
        low: "bg-slate-50 text-slate-500 border-slate-100"
    };

    return (
        <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 mb-3 ${
            task.completed ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 bg-white hover:border-indigo-100 shadow-sm'
        }`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority] || priorityColors.low}`} />

            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={() => toggleComplete(task)}
                        className={`shrink-0 transition-transform active:scale-90 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                    >
                        {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>

                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-base truncate transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {task.title}
                        </span>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-lg border ${priorityBadge[task.priority]}`}>
                                {task.priority}
                            </span>
                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100">
                                {task.category}
                            </span>
                            {task.dueDate && (
                                <span className="text-xs text-slate-400 flex items-center gap-1 ml-1 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => openEditForm(task)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit Task"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Task"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskItem;