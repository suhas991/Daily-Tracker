import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  completions: {},
  loading: false,

  // Load tasks from Supabase
  loadFromSupabase: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Load completions
      const { data: completions, error: completionsError } = await supabase
        .from('completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) throw completionsError;

      // Convert completions array to object format
      const completionsObj = {};
      completions?.forEach(comp => {
        if (!completionsObj[comp.task_id]) {
          completionsObj[comp.task_id] = {};
        }
        completionsObj[comp.task_id][comp.date] = comp.completed;
      });

      // Load from localStorage as backup
      const localCompletions = JSON.parse(localStorage.getItem('taskCompletions') || '{}');

      set({ 
        tasks: tasks || [], 
        completions: { ...localCompletions, ...completionsObj },
        loading: false 
      });
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      set({ loading: false });
    }
  },

  // Add task to Supabase
  addTask: async (taskData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newTask = {
        ...taskData,
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tasks')
        .insert([newTask]);

      if (error) throw error;

      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  },

  // Update task in Supabase
  updateTask: async (updatedTask) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', updatedTask.id);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  // Remove task from Supabase
  removeTask: async (id) => {
    try {
      // Delete task
      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (taskError) throw taskError;

      // Delete associated completions
      await supabase
        .from('completions')
        .delete()
        .eq('task_id', id);

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        completions: Object.fromEntries(
          Object.entries(state.completions).filter(([taskId]) => taskId !== id)
        ),
      }));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (taskId, dateStr, isRecurring) => {
    const state = get();
    const currentStatus = state.completions[taskId]?.[dateStr] || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isRecurring) {
        // For recurring tasks, use completions table
        if (newStatus) {
          // Add completion
          await supabase
            .from('completions')
            .upsert([{
              user_id: user.id,
              task_id: taskId,
              date: dateStr,
              completed: true,
            }]);
        } else {
          // Remove completion
          await supabase
            .from('completions')
            .delete()
            .eq('task_id', taskId)
            .eq('date', dateStr);
        }

        // Update local state
        set((state) => {
          const newCompletions = { ...state.completions };
          if (!newCompletions[taskId]) {
            newCompletions[taskId] = {};
          }
          newCompletions[taskId][dateStr] = newStatus;
          
          // Also save to localStorage
          localStorage.setItem('taskCompletions', JSON.stringify(newCompletions));
          
          return { completions: newCompletions };
        });
      } else {
        // For one-time tasks, update the task itself
        await supabase
          .from('tasks')
          .update({ completed: newStatus })
          .eq('id', taskId);

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: newStatus } : t
          ),
        }));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  },

  // Get tasks for a specific date
  getTasksForDate: (dateStr) => {
    const state = get();
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();

    return state.tasks
      .filter((task) => {
        if (task.isRecurring && task.recurType === 'daily') return true;
        if (task.isRecurring && task.recurType === 'weekly') {
          return task.recurDays?.includes(dayOfWeek) || false;
        }
        if (!task.isRecurring && task.date === dateStr) return true;
        return false;
      })
      .map((task) => {
        if (task.isRecurring) {
          const isCompletedToday = state.completions[task.id]?.[dateStr] || false;
          return { ...task, completed: isCompletedToday };
        }
        return task;
      });
  },
}));
