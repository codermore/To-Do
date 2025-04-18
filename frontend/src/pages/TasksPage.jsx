import React from "react";
import { useTasks, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import TasksList from "../components/TasksList";
import { toast } from "react-hot-toast";

function TasksPage() {
  const { data: tasks, isLoading, isError } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError) return <p>Hubo un error al cargar las tareas</p>;

  const handleUpdate = (id, data) => {
    console.log("handleUpdate id", id)
    console.log("handleUpdate data", data)
    updateTask.mutate({ id, data }, {
      onSuccess: () => toast.success("Tarea actualizada"),
      onError: () => toast.error("Error al actualizar"),
    });
  };

  const handleDelete = (id) => {
    deleteTask.mutate(id, {
      onSuccess: () => toast.success("Tarea eliminada"),
      onError: () => toast.error("Error al eliminar"),
    });
  };

  return (
    <TasksList
      tasks={tasks}
      onUpdateTask={handleUpdate}
      onDeleteTask={handleDelete}
    />
  );
}

export default TasksPage;
