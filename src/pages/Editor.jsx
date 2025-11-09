// ------------------ pages/Editor.js ------------------
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTaskStore } from '../store/taskStoreSupabase';

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {id ? 'Edit Task' : 'New Task'}
          </h2>
          <p className="text-slate-600 mt-1 text-sm">
            {id ? 'Update your task' : 'Create a new task'}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning workout"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Task Type</label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                taskType === 'once'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-indigo-400'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="once"
                  checked={taskType === 'once'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">📅</span>
                <span className={`text-xs font-medium ${taskType === 'once' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  Once
                </span>
              </label>
              <label className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                taskType === 'daily'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-indigo-400'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="daily"
                  checked={taskType === 'daily'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">🔄</span>
                <span className={`text-xs font-medium ${taskType === 'daily' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  Daily
                </span>
              </label>
              <label className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                taskType === 'weekly'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-indigo-400'
              }`}>
                <input
                  type="radio"
                  name="taskType"
                  value="weekly"
                  checked={taskType === 'weekly'}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl">📆</span>
                <span className={`text-xs font-medium ${taskType === 'weekly' ? 'text-indigo-700' : 'text-slate-600'}`}>
                  Weekly
                </span>
              </label>
            </div>
          </div>

          {taskType === 'once' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
              />
            </div>
          )}

          {taskType === 'weekly' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Days</label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`p-2 rounded-lg text-xs font-semibold transition ${
                      recurDays.includes(index)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition h-24 resize-none text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={save} 
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold text-base"
            >
              {id ? 'Update' : 'Create'}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
