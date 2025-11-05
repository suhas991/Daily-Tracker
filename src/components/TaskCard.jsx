import { Link } from "react-router-dom";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TaskCard({ task, onToggle, onDelete }) {
  const getTaskTypeLabel = () => {
    if (!task.isRecurring) return { icon: "📅", text: "One-time" };
    if (task.recurType === 'daily') return { icon: "🔄", text: "Daily" };
    if (task.recurType === 'weekly') {
      const days = task.recurDays?.map(d => DAYS_OF_WEEK[d]).join(', ');
      return { icon: "📆", text: `Weekly (${days})` };
    }
    return { icon: "🔄", text: "Recurring" };
  };

  const taskType = getTaskTypeLabel();

  return (
    <div className={`rounded-lg border p-4 transition hover:shadow-md ${
      task.completed 
        ? 'bg-green-50 border-green-300' 
        : 'bg-white border-slate-200 hover:border-indigo-400'
    }`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className={`text-xl shrink-0 ${task.completed ? 'opacity-50' : ''}`}>
            {task.completed ? '✅' : '📋'}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-base font-semibold wrap-break-word ${
                task.completed ? "line-through text-slate-500" : "text-slate-900"
              }`}
            >
              {task.title}
            </div>
            {task.notes && (
              <div className="text-sm text-slate-600 mt-1 wrap-break-word">{task.notes}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">
            {taskType.text}
          </span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onToggle(task)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                task.completed
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {task.completed ? "Undo" : "Done"}
            </button>
            <Link
              to={`/editor/${task.id}`}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center justify-center"
            >
              <span>✏️</span>
              <span className="hidden sm:inline ml-1">Edit</span>
            </Link>
            <button
              onClick={() => onDelete(task.id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline ml-1">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
