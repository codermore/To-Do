import { create } from 'zustand';
import { getUser, createUser, login, logout } from '../api/users';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    errors: [],
    loading: true,

    checkAuth: async () => {
        try {
            console.log("checkAuth")
            const res = await getUser();
            set({
                user: res.data,
                isAuthenticated: true
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false
            });
        } finally {
            set({ loading: false });
        }
    },

    signup: async (userData) => {
        try {
            await createUser(userData);
            set({ errors: [] });
        } catch (error) {
            const err = error.response?.data?.errors || ['Error en el registro'];
            set({ errors: err });
            throw new Error(err);
        }
    },

    signin: async (userData) => {
        try {
            const res = await login(userData);
            set({
                user: res.data,
                isAuthenticated: true,
                errors: []
            });
        } catch (error) {
            const err = error.response?.data?.errors || ['Error al iniciar sesión'];
            set({ errors: err });
            throw new Error(err);
        }
    },

    signout: async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        } finally {
            set({ user: null, isAuthenticated: false });
        }
    },

    setErrors: (errors) => set({ errors }),
}));

export default useAuthStore;
