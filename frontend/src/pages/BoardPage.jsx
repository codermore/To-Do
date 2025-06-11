import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard } from '../api/boards';
import { updateGoal, deleteGoal } from '../api/goals';
import TasksCard from '../components/TasksCard';
import { Plus, Pencil, Trash } from 'lucide-react';

function BoardPage() {
    const { id: boardId } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState({ title: '', goals: [] });
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [goalTitle, setGoalTitle] = useState('');

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollRef = React.useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 0.5; // sensibilidad
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const res = await getBoard(boardId);
                setBoard(res.data);
            } catch (error) {
                console.error("Error al obtener el board:", error);
            }
        };
        loadBoard();
    }, [boardId]);

    const handleUpdateTask = (updatedTask) => {
        setBoard((prevBoard) => ({
            ...prevBoard,
            goals: prevBoard.goals.map((goal) => ({
                ...goal,
                tasks: goal.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                ),
            })),
        }));
    };

    const handleDeleteTask = (deletedTaskId) => {
        setBoard((prevBoard) => ({
            ...prevBoard,
            goals: prevBoard.goals.map((goal) => ({
                ...goal,
                tasks: goal.tasks.filter((task) => task.id !== deletedTaskId),
            })),
        }));
    };

    const handleUpdateGoalTitle = async (goalId, newTitle) => {
        try {
            // await updateGoal(goalId, { title: newTitle });
            setBoard((prevBoard) => ({
                ...prevBoard,
                goals: prevBoard.goals.map((g) =>
                    g.id === goalId ? { ...g, title: newTitle } : g
                ),
            }));
            setEditingGoalId(null);
        } catch (error) {
            console.error('Error al actualizar el goal:', error);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            // await deleteGoal(goalId);
            setBoard((prevBoard) => ({
                ...prevBoard,
                goals: prevBoard.goals.filter((g) => g.id !== goalId),
            }));
        } catch (error) {
            console.error('Error al eliminar el goal:', error);
        }
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-1">Tablero {board.title}</h1>
            <hr />

            <div className="mt-6">
                <div
                    ref={scrollRef}
                    className="cursor-grab active:cursor-grabbing overflow-x-scroll scrollbar-hide"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="grid grid-flow-col auto-cols-[300px] gap-4 items-start select-none">
                        {board.goals.map((goal) => {
                            const isEditing = editingGoalId === goal.id;

                            return (
                                <div
                                    key={goal.id}
                                    className="bg-zinc-700 p-4 rounded-lg shadow w-full relative"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    value={goalTitle}
                                                    onChange={(e) => setGoalTitle(e.target.value)}
                                                    className="bg-zinc-600 p-1 rounded w-full mr-2"
                                                />
                                                <button
                                                    onClick={() => handleUpdateGoalTitle(goal.id, goalTitle)}
                                                    className="text-green-400 hover:text-green-600"
                                                    title="Guardar cambios"
                                                >
                                                    ✔️
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-semibold">
                                                    {goal.title}
                                                </h3>
                                                <div className="flex gap-2 ml-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingGoalId(goal.id);
                                                            setGoalTitle(goal.title);
                                                        }}
                                                        className="text-zinc-300 hover:text-zinc-100"
                                                        title="Editar lista"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGoal(goal.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Eliminar lista"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={`flex flex-col gap-2 w-full ${goal.tasks.length > 0 ? 'mb-4' : ''}`}>
                                        {goal.tasks.map((task) => (
                                            <div key={task.id} className="w-full">
                                                <TasksCard
                                                    task={task}
                                                    onUpdateTask={handleUpdateTask}
                                                    onDeleteTask={handleDeleteTask}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/create/task/${goal.id}`)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-800 text-white py-2 rounded transition"
                                    >
                                        <Plus size={16} className="inline-block mr-2" />
                                        Nueva Tarea
                                    </button>
                                </div>
                            );
                        })}

                        {/* Columna para crear nueva lista (goal) */}
                        <div className="p-4 rounded-lg shadow w-full flex items-center justify-center">
                            <button
                                onClick={() => navigate(`/create/goal/${boardId}`)}
                                className="bg-emerald-600 hover:bg-emerald-800 text-white px-4 py-2 rounded transition flex items-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Nueva Lista
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default BoardPage;
