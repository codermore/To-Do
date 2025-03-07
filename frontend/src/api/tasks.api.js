import axios from 'axios'

const taskApi = axios.create ({
    baseURL: 'http://127.0.0.1:8000/api/tasks/'
})

export const getAllTasks = () => {
    //return axios.get('http://127.0.0.1:8000/api/tasks/')
    return taskApi.get('/')
}

export const createTask = (task) => {
    return taskApi.post('/', task)
}