import { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Edit3, CheckCircle, Plus, X } from 'lucide-react';
import Swal from 'sweetalert2'

function App() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const openEditForm = (task) => {
    setCurrentTaskId(task._id);
    setNewTitle(task.title);
    setIsCompleted(task.completed);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setCurrentTaskId(null);
    setNewTitle("");
    setIsCompleted(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentTaskId) {
        const response = await axios.patch(`http://localhost:3000/api/tasks/${currentTaskId}`, {
          title: newTitle,
          completed: isCompleted
        });
        setTasks(tasks.map(t => t._id === currentTaskId ? response.data : t));
      } else {
        const response = await axios.post('http://localhost:3000/api/tasks', {
          title: newTitle,
          completed: isCompleted
        });
        setTasks([...tasks, response.data]);
      }
      closeForm();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: currentTaskId ? 'Task Updated!' : 'Task Added!',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: 'rounded-xl shadow-lg' }
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff2056',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-[2rem] p-8',
      confirmButton: 'flex-[2] bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-rose-200 transition-all mx-2 outline-none',
      cancelButton: 'flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-4 px-8 rounded-2xl transition-all mx-2 outline-none',
      actions: 'flex w-full mt-6',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/tasks/${id}`)
          setTasks(tasks.filter(task => task._id !== id))
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1000, showConfirmButton: false });
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error')
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-300/50 max-w-md w-full">
        
        <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-2">
          Task List
        </h1>

        <div className="space-y-4 mb-8">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">No tasks yet. Start by adding one!</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 min-h-[70px] flex items-center ${
                  task.completed ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50 shadow-sm'
                }`}
              >
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
            ))
          )}
        </div>

        <button
          onClick={() => { setCurrentTaskId(null); setShowForm(true); }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus className="w-6 h-6" /> Add New Task
        </button>

        {showForm && (
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
        )}
      </div>
    </div>
  )
}

export default App