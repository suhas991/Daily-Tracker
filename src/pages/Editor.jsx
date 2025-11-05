// ------------------ pages/Editor.js ------------------
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const editing = tasks.find((t) => t.id === id);

  // Get date from location state (passed from Month page) or use editing date or today
  const initialDate = location.state?.date || editing?.date || new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(editing?.title || '');
  const [notes, setNotes] = useState(editing?.notes || '');
  const [taskType, setTaskType] = useState(editing?.isRecurring ? editing?.recurType : 'once'); // 'once', 'daily', 'weekly'
  const [date, setDate] = useState(initialDate);
  const [recurDays, setRecurDays] = useState(editing?.recurDays || []);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setNotes(editing.notes);
      setDate(editing.date || initialDate);
      setTaskType(editing.isRecurring ? editing.recurType : 'once');
      setRecurDays(editing.recurDays || []);
    }
  }, [id, editing, initialDate]);

  const toggleDay = (dayIndex) => {
    setRecurDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const save = async () => {
    if (!title.trim()) return alert('Title required');
    
    const data = {
      id,
      title: title.trim(),
      notes: notes.trim(),
      date: taskType === 'once' ? date : null,
      isRecurring: taskType !== 'once',
      recurType: taskType,
      recurDays: taskType === 'weekly' ? recurDays : [],
      completed: editing?.completed || false,
    };
    
    if (id) await updateTask({ ...editing, ...data });
    else await addTask(data);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {id ? '✏️ Edit Task' : '✨ Create New Task'}
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            {id ? 'Update your task details' : 'Add a new task to stay organized'}
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning workout, Team meeting..."
              className="w-full border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-base sm:text-lg"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Task Type</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <label className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                taskType === 'once'
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="once"
                  checked={taskType === 'once'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl sm:text-3xl">📅</span>
                <span className={`text-xs sm:text-sm font-medium ${taskType === 'once' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  One-time
                </span>
              </label>
              <label className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                taskType === 'daily'
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="daily"
                  checked={taskType === 'daily'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl sm:text-3xl">🔄</span>
                <span className={`text-xs sm:text-sm font-medium ${taskType === 'daily' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  Daily
                </span>
              </label>
              <label className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                taskType === 'weekly'
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="weekly"
                  checked={taskType === 'weekly'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl sm:text-3xl">📆</span>
                <span className={`text-xs sm:text-sm font-medium ${taskType === 'weekly' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  Weekly
                </span>
              </label>
            </div>
          </div>

          {taskType === 'once' && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm sm:text-base"
              />
            </div>
          )}

          {taskType === 'weekly' && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Select Days</label>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {DAYS_OF_WEEK.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      recurDays.includes(index)
                        ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details or notes..."
              className="w-full border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition h-28 sm:h-32 resize-none text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <button 
              onClick={save} 
              className="flex-1 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-indigo-200 hover:shadow-xl md:hover:scale-105 text-base sm:text-lg"
            >
              {id ? '💾 Update Task' : '✨ Create Task'}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2.5 sm:py-3 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-50 transition-all font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
