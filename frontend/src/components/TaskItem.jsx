import { Trash2, Edit3, CheckCircle, Calendar, Circle } from 'lucide-react';

function TaskItem({ task, deleteTask, openEditForm, toggleComplete, filterCategory, sortBy }) {
    const priorityColors = {
        high: "bg-rose-500",
        medium: "bg-amber-500",
        low: "bg-slate-300 dark:bg-slate-600"
    };

    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dateString);
        due.setHours(0, 0, 0, 0);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysLeft = getDaysRemaining(task.dueDate);
    const isUrgent = daysLeft !== null && daysLeft <= 2;
    const shouldShowCategory = filterCategory === "all";
    const shouldShowDate = !task.completed && task.dueDate && (sortBy === "dueDate" || isUrgent);

    return (
        <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 mb-3 ${
            task.completed 
                ? 'border-emerald-100 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-900/10' 
                : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800/50 hover:border-indigo-100 dark:hover:border-indigo-900/50 shadow-sm'
        }`}>
            {/* Priority Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority] || priorityColors.low}`} />

            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={() => toggleComplete(task)}
                        className={`shrink-0 transition-transform active:scale-90 ${
                            task.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-indigo-400'
                        }`}
                    >
                        {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>

                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-base truncate transition-all ${
                            task.completed 
                                ? 'text-slate-300 dark:text-slate-600 line-through' 
                                : 'text-slate-700 dark:text-slate-200'
                        }`}>
                            {task.title}
                        </span>
                        
                        {(shouldShowCategory || shouldShowDate) && (
                            <div className="flex items-center gap-3 mt-1">
                                {shouldShowCategory && (
                                    <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
                                        {task.category}
                                    </span>
                                )}
                                
                                {shouldShowDate && (() => {
                                    let colorClass = "text-slate-400 dark:text-slate-500";
                                    let label = `${daysLeft} days left`;
                                    
                                    if (daysLeft === 0) {
                                        colorClass = "text-rose-600 dark:text-rose-400 font-bold animate-pulse";
                                        label = "Due Today";
                                    } else if (daysLeft < 0) {
                                        colorClass = "text-rose-700 dark:text-rose-500 font-black";
                                        label = `Overdue (${Math.abs(daysLeft)}d)`;
                                    } else if (isUrgent) {
                                        colorClass = "text-rose-500 dark:text-rose-400 font-bold";
                                        label = `${daysLeft}d left`;
                                    }

                                    return (
                                        <span className={`text-[10px] flex items-center gap-1 ${colorClass}`}>
                                            <Calendar className="w-3 h-3" />
                                            {label}
                                        </span>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions: Adjusted for Dark Mode */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => openEditForm(task)} 
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => deleteTask(task._id)} 
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskItem;