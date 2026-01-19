import { useState, useEffect } from 'react'
import axios from 'axios'

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
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`)
      setTasks(tasks.filter(task => task._id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }


  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        
        {!showForm ? (
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Task List</h1>
            <div className="space-y-3 mb-6">
              {tasks.length === 0 ? (
                <p className="text-slate-500">No tasks available.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50">
                    <span className="text-gray-800 font-medium">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                    <button
                      onClick={() => openEditForm(task)}
                      className="text-blue-500 hover:underline mx-2">
                        edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition">
                        delete
                    </button>
                  </div>
                ))
              )}
            </div>
            <button onClick={openEditForm} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
              + Add New Task
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">
              {currentTaskId ? "Edit Task" : "Add Task"}
              </h2>
              <form onSubmit={handleSave} className="flex flex-col text-left">
              <label className="mb-1 font-semibold">Task Title:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <label className="font-semibold">Completed</label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
                  Save Task
                </button>
                <button type="button" onClick={closeForm} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default App