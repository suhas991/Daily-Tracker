import { create } from "zustand";
import { IDB } from "../db/indexedDB";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  completions: {}, // { taskId: { 'YYYY-MM-DD': true/false } }
  loading: true,

  // Load all tasks from IndexedDB
  loadFromIDB: async () => {
    set({ loading: true });
    try {
      const all = await IDB.getAll();
      // Sort tasks by creation time
      all.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      
      // Load completions from localStorage
      const savedCompletions = localStorage.getItem('taskCompletions');
      const completions = savedCompletions ? JSON.parse(savedCompletions) : {};
      
      set({ tasks: all, completions, loading: false });
    } catch (e) {
      console.error("IndexedDB load failed:", e);
      set({ tasks: [], loading: false });
    }
  },

  // Get tasks for a specific date (includes recurring daily tasks)
  getTasksForDate(dateStr) {
    const tasks = get().tasks;
    const completions = get().completions;
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0=Sunday, 1=Monday, etc.
    
    return tasks.filter((task) => {
      // Recurring daily tasks
      if (task.isRecurring && task.recurType === 'daily') {
        return true;
      }
      // Recurring weekly tasks (specific days)
      if (task.isRecurring && task.recurType === 'weekly') {
        return task.recurDays?.includes(dayOfWeek) || false;
      }
      // One-time tasks for specific date
      if (!task.isRecurring && task.date === dateStr) {
        return true;
      }
      return false;
    }).map((task) => {
      // For recurring tasks, check completion status for this specific date
      if (task.isRecurring) {
        const isCompletedToday = completions[task.id]?.[dateStr] || false;
        return { ...task, completed: isCompletedToday };
      }
      // For one-time tasks, use the task's own completed status
      return task;
    });
  },

  // Add a new task
  addTask: async (task) => {
    try {
      const id =
        task.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const now = Date.now();
      const newTask = {
        ...task,
        id,
        createdAt: now,
        updatedAt: now,
        isRecurring: task.isRecurring || false,
        recurType: task.recurType || 'once', // 'once', 'daily', 'weekly'
        recurDays: task.recurDays || [], // [0-6] for weekly
        completed: false,
      };
      await IDB.put(newTask);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (e) {
      console.error("Error adding task:", e);
    }
  },

  // Update an existing task (uses IDB.update for consistency)
  updateTask: async (updated) => {
    try {
      const now = Date.now();
      const updatedTask = { ...updated, updatedAt: now };
      await IDB.update(updatedTask.id, updatedTask);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        ),
      }));
    } catch (e) {
      console.error("Error updating task:", e);
    }
  },

  // Toggle completion for a task on a specific date
  toggleTaskCompletion: async (taskId, dateStr, isRecurring) => {
    const state = get();
    
    if (isRecurring) {
      // For recurring tasks, toggle completion for this specific date
      const completions = { ...state.completions };
      if (!completions[taskId]) {
        completions[taskId] = {};
      }
      completions[taskId][dateStr] = !completions[taskId][dateStr];
      
      // Save to localStorage
      localStorage.setItem('taskCompletions', JSON.stringify(completions));
      set({ completions });
    } else {
      // For one-time tasks, toggle the task's completed field
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed, updatedAt: Date.now() };
        await IDB.update(taskId, updatedTask);
        set({
          tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        });
      }
    }
  },

  // Remove a task
  removeTask: async (id) => {
    try {
      await IDB.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (e) {
      console.error("Error removing task:", e);
    }
  },
}));
