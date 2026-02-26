import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search, Trophy, Target, FilterX, CalendarDays, Moon, Sun, LogIn } from 'lucide-react';
import Swal from 'sweetalert2'
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import TaskFilters from './components/TaskFilters';

function App() {
  // --- States ---
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
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('taskSortBy') || "priority");
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // --- Swall Theme Config ---
    const swalConfig = {
    background: darkMode ? '#1e293b' : '#ffffff',
    color: darkMode ? '#f1f5f9' : '#1e293b',
    confirmButtonColor: '#4f46e5', // Indigo 600
    cancelButtonColor: '#f43f5e',  // Rose 500
    customClass: {
      popup: 'rounded-[2rem] border dark:border-slate-700 shadow-2xl'
    }
  };

  // --- Constants ---
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const todayStr = new Date().toISOString().split('T')[0];

  // --- Lifecycle & Themes ---
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- API Handlers ---
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks')
      setTasks(response.data)
    } catch (error) { console.error('Error:', error) }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    const taskData = { title: newTitle, priority, category, dueDate: dueDate || null };
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
        ...swalConfig,
        position: 'top-end', 
        icon: 'success', 
        title: 'Saved Successfully!', 
        showConfirmButton: false, 
        timer: 1500, 
        toast: true 
      });
    } catch (error) { 
      Swal.fire({ ...swalConfig, icon: 'error', title: 'Error saving task' }); 
    }
  };

  const deleteTask = async (id) => {
    Swal.fire({ 
      ...swalConfig,
      title: 'Are you sure?', 
      text: "This task will be permanently removed!",
      icon: 'warning', 
      showCancelButton: true, 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/tasks/${id}`)
          setTasks(tasks.filter(task => task._id !== id))
          Swal.fire({ 
            ...swalConfig, 
            icon: 'success', 
            title: 'Deleted!', 
            toast: true, 
            position: 'top-end', 
            showConfirmButton: false, 
            timer: 1000 
          });
        } catch (error) { 
          Swal.fire({ ...swalConfig, icon: 'error', title: 'Error deleting task' }); 
        }
      }
    })
  }

  const toggleComplete = async (task) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (error) { console.error(error); }
  };

  // --- Form Helpers ---
  const closeForm = () => {
    setShowForm(false); setCurrentTaskId(null); setNewTitle(""); setPriority("low"); setCategory("personal"); setDueDate("");
  };

  const openEditForm = (task) => {
    setCurrentTaskId(task._id); setNewTitle(task.title); setPriority(task.priority || "low");
    setCategory(task.category || "personal"); setDueDate(task.dueDate ? task.dueDate.split('T')[0] : "");
    setShowForm(true);
  };

  // --- Logic & Filtering ---
  const dailyTasks = tasks.filter(t => !t.dueDate || t.dueDate.split('T')[0] === todayStr);
  const dailyCompleted = dailyTasks.filter(t => t.completed).length;
  const dailyPercent = dailyTasks.length === 0 ? 0 : Math.round((dailyCompleted / dailyTasks.length) * 100);

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalPercent = tasks.length === 0 ? 0 : Math.round((totalCompleted / tasks.length) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : filterStatus === "completed" ? task.completed : !task.completed;
    const matchesCategory = filterCategory === "all" ? true : task.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (sortBy === "priority") {
      if (a.priority !== b.priority) return priorityWeight[b.priority] - priorityWeight[a.priority];
      return (new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));
    }
    return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex items-center justify-center p-4">
      
      {/* --- Main Card Container --- */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none max-w-xl w-full border border-slate-100 dark:border-slate-800 relative transition-all duration-500">
        
        {/* --- Top Actions --- */}
        <div className="flex justify-between items-center mb-8 px-1">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
            <LogIn size={16} /> LOGIN
          </button>
        </div>

        {/* --- Dashboard Statistics --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.2rem] p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
            <Target className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-4">Daily Goal</p>
              {dailyTasks.length > 0 ? (
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-black">{dailyPercent}%</h2>
                  <div className="h-10 w-[1px] bg-white/20"></div>
                  <div className="flex flex-col text-[11px] font-black">
                    <span className="opacity-70 text-[9px]">DONE</span>
                    {dailyCompleted} / {dailyTasks.length}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1 opacity-60">
                  <CalendarDays size={18} />
                  <p className="text-xs font-bold italic">No tasks today</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.2rem] p-6 text-white shadow-xl shadow-slate-200 dark:shadow-none relative overflow-hidden group border border-transparent">
            <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-4">Lifetime</p>
              {tasks.length > 0 ? (
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-black">{totalPercent}%</h2>
                  <div className="h-10 w-[1px] bg-white/20"></div>
                  <div className="flex flex-col text-[11px] font-black">
                    <span className="opacity-40 text-[9px]">TOTAL</span>
                    {totalCompleted} / {tasks.length}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1 opacity-20">
                  <Trophy size={18} />
                  <p className="text-xs font-bold italic">Empty list</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Task Management Content --- */}
        <div className="space-y-6 mb-8">
          <TaskFilters
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          />
          
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organize by</span>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
              {['priority', 'dueDate'].map((type) => (
                <button key={type} onClick={() => setSortBy(type)}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${sortBy === type ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400'}`}
                >
                  {type === 'dueDate' ? 'DEADLINE' : 'PRIORITY'}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[300px]">
            {sortedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-700 text-center">
                <FilterX size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-sm italic uppercase tracking-tighter">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <TaskItem 
                    key={task._id} 
                    task={task} 
                    deleteTask={deleteTask} 
                    openEditForm={openEditForm} 
                    toggleComplete={toggleComplete} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- Primary Footer Action --- */}
        <button
          onClick={() => { setCurrentTaskId(null); setShowForm(true); }}
          className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white font-black py-5 rounded-[1.8rem] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.95] group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          ADD NEW TASK
        </button>

        {/* --- Modals & Overlays --- */}
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
  );
}

export default App;