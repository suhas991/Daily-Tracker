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
    <div className={`rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
      task.completed 
        ? 'bg-green-50/50 border-green-200' 
        : 'bg-white border-indigo-100 hover:border-indigo-300'
    }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className={`text-2xl ${task.completed ? 'opacity-50' : ''}`}>
              {task.completed ? '✅' : '⭐'}
            </div>
            <div className="flex-1">
              <div
                className={`text-lg font-bold ${
                  task.completed ? "line-through text-slate-400" : "text-slate-800"
                }`}
              >
                {task.title}
              </div>
              {task.notes && (
                <div className="text-sm text-slate-600 mt-2 leading-relaxed">{task.notes}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-11">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium inline-flex items-center gap-1">
              <span>{taskType.icon}</span>
              <span>{taskType.text}</span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggle(task)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              task.completed
                ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200"
            }`}
          >
            {task.completed ? "↩ Undo" : "✓ Done"}
          </button>
          <Link
            to={`/editor/${task.id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
