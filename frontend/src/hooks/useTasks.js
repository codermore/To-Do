// hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, updateTask, getTask, getAllTasks } from '../api/tasks';


// Obtener todas las tareas
export const useTasks = () =>
    useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await getAllTasks();
            return res.data;
        },
    });

// Crear tarea
export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task) => {
            const res = await createTask(task);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });
};

// Actualizar tarea
export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await updateTask(id, data)
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });
};

// Eliminar tarea
export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await deleteTask(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });
};
