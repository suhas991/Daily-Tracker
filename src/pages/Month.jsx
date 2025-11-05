// ------------------ pages/Month.js ------------------
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import TaskList from '../components/TaskList';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Month() {
  const tasks = useTaskStore((state) => state.tasks);
  const completions = useTaskStore((state) => state.completions);
  const loading = useTaskStore((state) => state.loading);
  const loadFromIDB = useTaskStore((state) => state.loadFromIDB);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const removeTask = useTaskStore((state) => state.removeTask);
  
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    loadFromIDB();
  }, [loadFromIDB]);

  const getTasksForDate = useCallback((dateStr) => {
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    
    return tasks.filter((task) => {
      if (task.isRecurring && task.recurType === 'daily') {
        return true;
      }
      if (task.isRecurring && task.recurType === 'weekly') {
        return task.recurDays?.includes(dayOfWeek) || false;
      }
      if (!task.isRecurring && task.date === dateStr) {
        return true;
      }
      return false;
    }).map((task) => {
      // For recurring tasks, check completion for this specific date
      if (task.isRecurring) {
        const isCompletedToday = completions[task.id]?.[dateStr] || false;
        return { ...task, completed: isCompletedToday };
      }
      return task;
    });
  }, [tasks, completions]);

  const [year, mon] = month.split('-').map(Number);
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const firstDay = new Date(year, mon - 1, 1).getDay();

  // Export monthly report
  const exportMonthlyReport = () => {
    const monthName = new Date(year, mon - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    let report = `📊 DAILY TRACKER - MONTHLY REPORT\n`;
    report += `═══════════════════════════════════════════\n`;
    report += `Month: ${monthName}\n`;
    report += `Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n`;
    report += `═══════════════════════════════════════════\n\n`;

    // Calculate statistics
    let totalTasks = 0;
    let completedTasks = 0;
    let dailyStats = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = getTasksForDate(dateStr);
      const dayCompleted = dayTasks.filter(t => t.completed).length;
      
      totalTasks += dayTasks.length;
      completedTasks += dayCompleted;

      if (dayTasks.length > 0) {
        dailyStats.push({
          date: dateStr,
          day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          total: dayTasks.length,
          completed: dayCompleted,
          percentage: Math.round((dayCompleted / dayTasks.length) * 100),
          tasks: dayTasks
        });
      }
    }

    // Summary Statistics
    report += `📈 SUMMARY STATISTICS\n`;
    report += `─────────────────────────────────────────\n`;
    report += `Total Tasks: ${totalTasks}\n`;
    report += `Completed Tasks: ${completedTasks}\n`;
    report += `Pending Tasks: ${totalTasks - completedTasks}\n`;
    report += `Overall Completion Rate: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%\n`;
    report += `Active Days: ${dailyStats.length} days\n\n`;

    // Daily Breakdown
    report += `📅 DAILY BREAKDOWN\n`;
    report += `─────────────────────────────────────────\n\n`;

    dailyStats.forEach((stat) => {
      report += `${stat.day} - ${stat.date}\n`;
      report += `  Progress: ${stat.completed}/${stat.total} tasks (${stat.percentage}%)\n`;
      report += `  Tasks:\n`;
      
      stat.tasks.forEach((task) => {
        const status = task.completed ? '✓' : '○';
        const taskType = task.isRecurring ? (task.recurType === 'daily' ? '[Daily]' : '[Weekly]') : '[Once]';
        report += `    ${status} ${taskType} ${task.title}\n`;
        if (task.notes) {
          report += `       Notes: ${task.notes}\n`;
        }
      });
      report += `\n`;
    });

    // Task Categories
    const recurringTasks = tasks.filter(t => t.isRecurring);
    if (recurringTasks.length > 0) {
      report += `🔄 RECURRING TASKS\n`;
      report += `─────────────────────────────────────────\n`;
      recurringTasks.forEach((task) => {
        const type = task.recurType === 'daily' ? 'Daily' : `Weekly (${task.recurDays?.join(', ')})`;
        report += `• ${task.title} - ${type}\n`;
        if (task.notes) report += `  Notes: ${task.notes}\n`;
      });
      report += `\n`;
    }

    // Footer
    report += `═══════════════════════════════════════════\n`;
    report += `Generated by Daily Tracker App\n`;
    report += `Keep up the great work! 🎯\n`;

    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DailyTracker_Report_${year}-${String(mon).padStart(2, '0')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600">Loading calendar...</p>
      </div>
    </div>
  );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {new Date(year, mon - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Tap any day to view tasks</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={exportMonthlyReport}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all font-medium shadow-lg shadow-green-200 hover:shadow-xl md:hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              title="Export monthly progress report"
            >
              <span>📊</span>
              <span>Export Report</span>
            </button>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 border-2 border-slate-200 rounded-lg px-3 sm:px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm sm:text-base"
            />
            <button
              onClick={() => setSelectedDate(today)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl md:hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center font-bold text-indigo-600 py-1 sm:py-2 text-xs sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1 sm:p-2" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = getTasksForDate(dateStr);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const completedCount = dayTasks.filter(t => t.completed).length;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 min-h-14 sm:min-h-16 md:min-h-20 flex flex-col justify-between text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-lg sm:shadow-2xl scale-105 border border-indigo-600 sm:border-2'
                    : isToday
                    ? 'bg-linear-to-br from-amber-100 to-orange-100 border border-amber-400 sm:border-2 hover:shadow-lg'
                    : dayTasks.length > 0
                    ? 'bg-indigo-50 border border-indigo-200 sm:border-2 hover:border-indigo-400 hover:shadow-lg md:hover:scale-105'
                    : 'bg-slate-50 border border-slate-200 sm:border-2 hover:border-slate-300 hover:shadow-md md:hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-sm sm:text-base md:text-lg font-bold ${isSelected ? 'text-white' : isToday ? 'text-amber-700' : 'text-slate-800'}`}>
                    {day}
                  </div>
                  {isToday && !isSelected && (
                    <span className="text-[10px] sm:text-xs bg-amber-500 text-white px-1 sm:px-2 py-0.5 rounded-full font-medium">Today</span>
                  )}
                </div>
                {dayTasks.length > 0 && (
                  <div className={`text-[10px] sm:text-xs font-semibold text-center py-1 ${isSelected ? 'text-white' : 'text-indigo-700'}`}>
                    {completedCount}/{dayTasks.length}
                  </div>
                )}
                {dayTasks.length === 0 && !isSelected && (
                  <div className="flex items-center justify-center py-1">
                    <span className="text-base sm:text-lg opacity-20">📝</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks for selected day */}
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: window.innerWidth < 640 ? 'short' : 'long',
                month: window.innerWidth < 640 ? 'short' : 'long',
                day: 'numeric' 
              })}
            </h3>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">{getTasksForDate(selectedDate).length} tasks</p>
          </div>
          <Link 
            to="/editor"
            state={{ date: selectedDate }}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200 hover:shadow-xl md:hover:scale-105 text-sm sm:text-base text-center whitespace-nowrap"
          >
            + Add Task
          </Link>
        </div>
        <TaskList
          tasks={getTasksForDate(selectedDate)}
          onToggle={(task) => toggleTaskCompletion(task.id, selectedDate, task.isRecurring)}
          onDelete={removeTask}
        />
      </div>
    </div>
  );
}
