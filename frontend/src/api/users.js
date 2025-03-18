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

