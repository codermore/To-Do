import { createContext, useContext, useState } from "react";
import { createUser, login } from '../api/users';


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

    const signup = async (user) => {
        try {
            const res = await createUser(user)
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
