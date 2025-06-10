import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateBoard, deleteBoard } from '../api/boards';
import { toast } from 'react-hot-toast';
import { Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BoardsCard({ board, onUpdateBoard, onDeleteBoard }) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        watch
    } = useForm({
        defaultValues: {
            title: board.title,
        }
    });

    const onSubmit = async (data) => {
        try {
            const updatedBoard = {
                ...board,
                ...data
            };
            await updateBoard(board.id, updatedBoard);
            toast.success('Tarea actualizada');
            onUpdateBoard(updatedBoard); // 🔁 actualiza en BoardsPage
            setIsEditing(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('¿Seguro que querés eliminar esta tarea?');
        if (!confirmDelete) return;
        try {
            console.log("elimando tarea...")
            await deleteBoard(board.id);
            toast.success('Tarea eliminada');
            onDeleteBoard?.(board.id); // ✅ llama si está definida
        } catch {
            toast.error('Error al eliminar la tarea');
        }
    };

    // ✅ Manejar click para navegar
    const handleCardClick = (e) => {
        // 👉 Evita que los botones dentro del card disparen el navigate
        if (e.target.closest('button')) return;
        navigate(`/board/${board.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-zinc-800 p-3 rounded hover:cursor-pointer self-start relative group transition-all duration-300"
        >
            {!isEditing ? (
                <div className='max-h-[50px] min-h-[50px]'>
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

                    <div className="transition-all duration-200 group-hover:ml-6">
                        <h1 className={`font-bold uppercase`}>
                            {board.title}
                        </h1>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <input
                        className="bg-zinc-700 p-2 rounded"
                        {...register('title', { required: true })}
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

export default BoardsCard;