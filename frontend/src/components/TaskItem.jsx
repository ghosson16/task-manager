import { Trash2, Edit3, CheckCircle } from 'lucide-react';

function TaskItem({ task, deleteTask, openEditForm }) {
    return (
    <div
    key={task._id}
    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 min-h-[70px] flex items-center ${
        task.completed ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50 shadow-sm'
    }`}>
        <div className="w-full p-5 flex justify-between items-center transition-all duration-300 group-hover:opacity-0">
            <span className={`font-semibold text-lg ${task.completed ? 'text-green-600 line-through' : 'text-slate-700'}`}>
                {task.title}
            </span>
            {task.completed && <CheckCircle className="text-green-500 w-6 h-6" />}
        </div>
        <div className="absolute inset-0 flex opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button onClick={() => openEditForm(task)} className="flex-1 bg-cyan-500 text-white flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors">
                <Edit3 className="w-5 h-5" />
                <span className="font-bold">Edit</span>
            </button>
            <button onClick={() => deleteTask(task._id)} className="flex-1 bg-rose-500 text-white flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors">
                <Trash2 className="w-5 h-5" />
                <span className="font-bold">Delete</span>
            </button>
        </div>
    </div>
    );
}
export default TaskItem;