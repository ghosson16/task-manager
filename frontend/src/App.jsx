function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          Task Manager <span className="text-indigo-600">Pro</span>
        </h1>
        <p className="text-slate-500 mb-6">Tailwind + React is ready to go!</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Let's Start 🚀
        </button>
      </div>
    </div>
  )
}

export default App