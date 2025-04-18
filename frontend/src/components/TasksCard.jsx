import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateTask, deleteTask } from '../api/tasks';
import { toast } from 'react-hot-toast';
import { Pencil, Trash } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

function TasksCard({ task, onUpdateTask, onDeleteTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [completed, setCompleted] = useState(task.completed);

    const {
        register,
        handleSubmit,
        reset,
        watch
    } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description
        }
    });

    const onSubmit = (data) => {
        try {
            const updatedTask = {
                ...task,
                ...data,
                completed,
            };
            onUpdateTask(task.id, updatedTask);
            setIsEditing(false);
        } catch {
            toast.error("Error al actualizar");
        }
    };

    const toggleCompleted = () => {
        try {
            const newValue = !completed;
            const updatedTask = {
                ...task,
                title: watch('title'),
                description: watch('description'),
                completed: newValue,
            };
            setCompleted(newValue);
            onUpdateTask(task.id, updatedTask); // 🔁 actualiza en TasksPage
        } catch {
            toast.error('No se pudo actualizar el estado');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('¿Seguro que querés eliminar esta tarea?');
        if (!confirmDelete) return;
        try {
            onDeleteTask?.(task.id); // ✅ llama si está definida
        } catch {
            toast.error('Error al eliminar la tarea');
        }
    };

    return (
        <div className="bg-zinc-800 p-3 hover:cursor-pointer self-start relative group transition-all duration-300">
            {!isEditing ? (
                <>
                    <div className="hidden group-hover:flex absolute top-2 bottom-2 right-2 flex-col items-end justify-between">
                        <button
                            className="text-slate-400 hover:text-white"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            className="text-red-400 hover:text-red-600"
                            onClick={handleDelete}
                        >
                            <Trash size={16} />
                        </button>
                    </div>

                    <div className="hidden group-hover:block absolute left-2 top-1/2 -translate-y-1/2">
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={toggleCompleted}
                            className="rounded-full accent-indigo-500"
                        />
                    </div>

                    <div className="transition-all duration-200 group-hover:ml-6">
                        <h1 className={`font-bold uppercase ${completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                        </h1>
                        <p className="text-slate-400">{task.description}</p>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <input
                        className="bg-zinc-700 p-2 rounded"
                        {...register('title', { required: true })}
                    />
                    <TextareaAutosize
                        className="bg-zinc-700 p-2 rounded w-full resize-none"
                        {...register('description')}
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-700"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
                            onClick={() => {
                                reset();
                                setIsEditing(false);
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TasksCard;