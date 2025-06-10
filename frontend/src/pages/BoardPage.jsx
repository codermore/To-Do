import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard } from '../api/boards';
import TasksCard from '../components/TasksCard';
import { Plus } from 'lucide-react';

function BoardPage() {
    const { id: boardId } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState({ title: '', goals: [] });

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

    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-1">Tablero {board.title}</h1>
            <hr />
            <div className="mt-6 overflow-x-auto">
                <div className="grid grid-flow-col auto-cols-[300px] gap-4 items-start">
                    {board.goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="bg-zinc-700 p-4 rounded-lg shadow w-full"
                        >
                            <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>

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
                    ))}

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
    );

}

export default BoardPage;
