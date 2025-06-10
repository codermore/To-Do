import API from "./api";

export const getAllGoals = () => {
    return API.get('/goals')
}

export const getGoal = (id) => {
    return API.get(`/goals/${id}/`)
}

export const createGoal = (goal) => {
    return API.post('/goals/', goal)
}

export const deleteGoal = (id) => {
    return API.delete(`/goals/${id}/`)
}

export const updateGoal = (id, goal) => {
    return API.put(`/goals/${id}/`, goal)
}