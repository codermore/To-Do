import API from "./api";

export const getAllTasks = () => {
    return API.get('/tasks')
}

export const getTask = (id) => {
    return API.get(`/tasks/${id}/`)
}

export const createTask = (task) => {
    return API.post('/tasks/', task)
}

export const deleteTask = (id) => {
    return API.delete(`/tasks/${id}/`)
}

export const updateTask = (id, task) => {
    return API.put(`/tasks/${id}/`, task)
}