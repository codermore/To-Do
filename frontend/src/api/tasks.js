import API from "./api";

export const getAllTasks = () => {
    return API.get('/')
}

export const getTask = (id) => {
    return API.get(`/${id}/`)
}

export const createTask = (task) => {
    return API.post('/', task)
}

export const deleteTask = (id) => {
    return API.delete(`/${id}/`)
}

export const updateTask = (id, task) => {
    return API.put(`/${id}/`, task)
}