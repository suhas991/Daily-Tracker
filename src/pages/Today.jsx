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
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isToday ? "Today's Tasks" : "Tasks"}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📆</span>
              <span className="font-medium wrap-break-word">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: window.innerWidth < 640 ? 'short' : 'long',
                  year: 'numeric', 
                  month: window.innerWidth < 640 ? 'short' : 'long',
                  day: 'numeric' 
                })}
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm sm:text-base"
            />
            {!isToday && (
              <button
                onClick={() => setSelectedDate(today)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                Jump to Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasksForToday.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📝</div>
            <p className="text-slate-600 text-base sm:text-lg mb-4">No tasks for this date.</p>
            <Link 
              to="/editor" 
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">+</span>
              Add Your First Task
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 bg-white rounded-xl p-4 shadow-md border border-slate-100">
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                {tasksForToday.filter(t => t.completed).length} of {tasksForToday.length} completed
              </p>
              <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-linear-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(tasksForToday.filter(t => t.completed).length / tasksForToday.length) * 100}%` }}
                />
              </div>
            </div>
            {tasksForToday.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl md:hover:scale-[1.02] ${
                  t.completed 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-indigo-100 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`text-xl sm:text-2xl shrink-0 ${t.completed ? 'opacity-50' : ''}`}>
                      {t.completed ? '✅' : '⭐'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-base sm:text-lg font-semibold wrap-break-word ${
                          t.completed ? "line-through text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {t.title}
                      </div>
                      {t.notes && (
                        <div className="text-sm text-slate-600 mt-2 leading-relaxed wrap-break-word">{t.notes}</div>
                      )}
                      {t.isRecurring && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                            🔄 {t.recurType === 'daily' ? 'Daily Task' : `Weekly (${t.recurDays?.join(', ') || 'N/A'})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => toggleTaskCompletion(t.id, selectedDate, t.isRecurring)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        t.completed
                          ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200"
                      }`}
                    >
                      {t.completed ? "↩ Undo" : "✓ Done"}
                    </button>
                    <Link
                      to={`/editor/${t.id}`}
                      className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center"
                    >
                      <span>✏️</span>
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Link>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
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
        <div className="mt-6 sm:mt-8 text-center">
          <Link 
            to="/editor" 
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base"
          >
            <span className="text-lg sm:text-xl">+</span>
            Add Another Task
          </Link>
        </div>
      )}
    </div>
  );
}
