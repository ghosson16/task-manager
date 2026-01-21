import { useState, useEffect } from 'react'
import axios from 'axios'
import {Plus} from 'lucide-react';
import Swal from 'sweetalert2'
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import TaskFilters from './components/TaskFilters';

function App() {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks()
  }, [])

  const openEditForm = (task) => {
  setCurrentTaskId(task._id);
  setNewTitle(task.title);
  setPriority(task.priority || "low");
  setCategory(task.category || "personal");
  if (task.dueDate) {
    setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
  } else {
    setDueDate("");
  }
  setShowForm(true);
};

  const closeForm = () => {
    setShowForm(false);
    setCurrentTaskId(null);
    setNewTitle("");
    setPriority("low");
    setCategory("personal");
    setDueDate("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: newTitle,
      priority,
      category,
      dueDate: dueDate || null
    };

    try {
      if (currentTaskId) {
        const response = await axios.patch(`http://localhost:3000/api/tasks/${currentTaskId}`, taskData);
        setTasks(tasks.map(t => t._id === currentTaskId ? response.data : t));
      } else {
        const response = await axios.post('http://localhost:3000/api/tasks', taskData);
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
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
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
          console.error('Error deleting task:', error)
        }
      }
    })
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true :
      filterStatus === "completed" ? task.completed : !task.completed;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-300/50 max-w-md w-full">
        
        <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-2">
          Task List
        </h1>

        <div className="space-y-4 mb-8">
          <TaskFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            />
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">No tasks yet. Start by adding one!</div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              openEditForm={openEditForm}
              />
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
          <TaskModal
          currentTaskId={currentTaskId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          handleSave={handleSave}
          closeForm={closeForm}
          />
        )}
      </div>
    </div>
  )
}

export default App