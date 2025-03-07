import axios from 'axios'

const taskApi = axios.create ({
    baseURL: 'http://127.0.0.1:8000/api/tasks/'
})

export const getAllTasks = () => {
    //return axios.get('http://127.0.0.1:8000/api/tasks/')
    return taskApi.get('/')
}

export const getTask = (id) => {
    return taskApi.get(`/${id}/`)
}

export const createTask = (task) => {
    return taskApi.post('/', task)
}

export const deleteTask = (id) => {
    return taskApi.delete(`/${id}/`)
}

export const updateTask = (id, task) => {
    return taskApi.put(`/${id}/`, task)
}