import API from "./api";

export const createUser = (data) => {
    return API.post('/auth/register/', data)
        .then(response => {
            console.log("Respuesta del servidor:", response);
            return response;
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            throw error;
        });
};

export const login = (data) => {
    return API.post('/auth/login/', data)
        .then(response => {
            console.log("respuesta del servidor:", response)
            return response
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            throw error;
        });
}

export const getUser = () => {
    return API.post('/auth/profile/')
        .then(response => {
            console.log("respuesta del servidor:", response)
            return response
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            throw error;
        });
}

export const logout = () => {
    return API.post('/auth/logout/')
        .then(response => {
            console.log("respuesta del servidor:", response)
            return response
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            throw error;
        });
}

