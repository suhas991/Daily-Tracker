import React, { useEffect, useMemo } from "react";
import { useTaskStore } from "../store/taskStore";
import { Link } from "react-router-dom";

export default function Today() {
  const tasks = useTaskStore((state) => state.tasks);
  const completions = useTaskStore((state) => state.completions);
  const loading = useTaskStore((state) => state.loading);
  const loadFromIDB = useTaskStore((state) => state.loadFromIDB);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const removeTask = useTaskStore((state) => state.removeTask);
  
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    loadFromIDB();
  }, [loadFromIDB]);

  const tasksForToday = useMemo(() => {
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();
    
    return tasks.filter((task) => {
      if (task.isRecurring && task.recurType === 'daily') {
        return true;
      }
      if (task.isRecurring && task.recurType === 'weekly') {
        return task.recurDays?.includes(dayOfWeek) || false;
      }
      if (!task.isRecurring && task.date === selectedDate) {
        return true;
      }
      return false;
    }).map((task) => {
      // For recurring tasks, check completion for this specific date
      if (task.isRecurring) {
        const isCompletedToday = completions[task.id]?.[selectedDate] || false;
        return { ...task, completed: isCompletedToday };
      }
      return task;
    });
  }, [tasks, completions, selectedDate]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600">Loading your tasks...</p>
      </div>
    </div>
  );

  const today = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === today;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isToday ? "Today's Tasks" : "Tasks"}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric', 
                month: 'short',
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
            />
            {!isToday && (
              <button
                onClick={() => setSelectedDate(today)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium text-sm whitespace-nowrap"
              >
                Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasksForToday.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-600 text-base mb-4">No tasks for this date.</p>
            <Link 
              to="/editor" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium text-sm"
            >
              <span>+</span>
              Add Task
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <p className="text-slate-700 font-medium text-sm mb-2">
                {tasksForToday.filter(t => t.completed).length} of {tasksForToday.length} completed
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(tasksForToday.filter(t => t.completed).length / tasksForToday.length) * 100}%` }}
                />
              </div>
            </div>
            {tasksForToday.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                  t.completed 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`text-xl shrink-0 ${t.completed ? 'opacity-50' : ''}`}>
                      {t.completed ? '✅' : '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-base font-semibold wrap-break-word ${
                          t.completed ? "line-through text-slate-500" : "text-slate-900"
                        }`}
                      >
                        {t.title}
                      </div>
                      {t.notes && (
                        <div className="text-sm text-slate-600 mt-1 wrap-break-word">{t.notes}</div>
                      )}
                      {t.isRecurring && (
                        <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded mt-2">
                          {t.recurType === 'daily' ? '🔄 Daily' : '📅 Weekly'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleTaskCompletion(t.id, selectedDate, t.isRecurring)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        t.completed
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {t.completed ? "Undo" : "Done"}
                    </button>
                    <Link
                      to={`/editor/${t.id}`}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center justify-center"
                    >
                      <span>✏️</span>
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Link>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      <span>🗑️</span>
                      <span className="hidden sm:inline ml-1">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {tasksForToday.length > 0 && (
        <div className="mt-6 text-center">
          <Link 
            to="/editor" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium text-sm"
          >
            <span>+</span>
            Add Task
          </Link>
        </div>
      )}
    </div>
  );
}
