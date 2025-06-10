import API from "./api";

export const getAllBoards = () => {
    return API.get('/boards')
}

export const getBoard = (id) => {
    return API.get(`/boards/${id}/`)
}

export const createBoard = (board) => {
    return API.post('/boards/', board)
}

export const deleteBoard = (id) => {
    return API.delete(`/boards/${id}/`)
}

export const updateBoard = (id, board) => {
    return API.put(`/boards/${id}/`, board)
}