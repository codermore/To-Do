import { createContext, useContext, useState, useEffect } from "react";
import { getUser, createUser, login } from '../api/users';

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be within an AuthProvider")
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getUser();
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const signup = async (user) => {
        try {
            const res = await createUser(user)
            setErrors([])
        } catch (error) {
            console.log(error)
            setErrors(error.response.data.errors)
            throw new Error(error.response.data.errors)
        }
    }

    const signin = async (user) => {
        try {
            const res = await login(user)
            console.log(res.data)
            setUser(res.data)
            setIsAuthenticated(true)
            setErrors([])
        } catch (error) {
            console.log(error)
            setErrors(error.response.data.errors)
            throw new Error(error.response.data.errors)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            errors,
            signup,
            signin

        }}>
            {children}
        </AuthContext.Provider>
    )
}
