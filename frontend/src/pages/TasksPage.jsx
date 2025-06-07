/* 
Componente -->   Rol
-------------------------
TasksPage  -->   Controla el estado global (lista de tareas)
TasksList  -->   Se encarga de renderizar todas las tarjetas
TasksCard  -->   Se encarga de mostrar/editar/eliminar una tarea individualmente
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TasksList from '../components/TasksList';
import { getAllTasks } from '../api/tasks';
import { Plus } from "lucide-react"; // usa `lucide-react` para íconos


function TasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  // 🔁 Obtener tareas del backend
  useEffect(() => {
    const loadTasks = async () => {
      const res = await getAllTasks();
      setTasks(res.data);
    };
    loadTasks();
  }, []);

  // 🔄 Actualizar tarea en el estado
  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // ❌ Eliminar tarea del estado
  const handleDeleteTask = (deletedTaskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== deletedTaskId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <TasksList
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <button
        onClick={() => navigate("/tasks-create")}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <Plus size={48} />
      </button>
    </div>
  );
}

export default TasksPage;
