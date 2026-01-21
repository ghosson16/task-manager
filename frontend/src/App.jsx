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
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const priorityWeight = { high: 3, medium: 2, low: 1 };

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
  const matchesCategory =
    filterCategory === "all" ? true : task.category === filterCategory;

  return matchesSearch && matchesStatus && matchesCategory;
});

  const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;

  if (sortBy === "priority") {
    if (a.priority !== b.priority) return priorityWeight[b.priority] - priorityWeight[a.priority];
    return (new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));
  } else {
    const dateA = new Date(a.dueDate || '9999');
    const dateB = new Date(b.dueDate || '9999');
    if (dateA - dateB !== 0) return dateA - dateB;
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  }
});

  const toggleComplete = async (task) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/tasks/${task._id}`, {
      completed: !task.completed
    });
    setTasks(tasks.map(t => t._id === task._id ? response.data : t));
  } catch (error) {
    console.error("Error updating status:", error);
    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to update task status' });
  }
};

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-300/50 max-w-xl w-full">
        
        <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-2">
          Task List
        </h1>

        <div className="space-y-4 mb-8">
          <TaskFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          />
          
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort by:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
              onClick={() => setSortBy("priority")}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${sortBy === 'priority' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                Priority
              </button>
              <button
              onClick={() => setSortBy("dueDate")}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${sortBy === 'dueDate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                Deadline
              </button>
            </div>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">No tasks yet. Start by adding one!</div>
          ) : (
            sortedTasks.map((task) => (
              <TaskItem
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              openEditForm={openEditForm}
              toggleComplete={toggleComplete}
              filterCategory={filterCategory}
              sortBy={sortBy}
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
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          dueDate={dueDate}
          setDueDate={setDueDate}
          handleSave={handleSave}
          closeForm={closeForm}
          />
        )}
      </div>
    </div>
  )
}

export default App