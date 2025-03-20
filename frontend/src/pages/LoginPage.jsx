import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { login } from '../api/users';
import { toast } from 'react-hot-toast'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'

function LoginPage() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        isAuthenticated,
        signin,
        errors: signinErrors
    } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks")

        if (signinErrors.length > 0) {
            signinErrors.forEach(error => {
                toast.error(error)
            })
        }
    }, [isAuthenticated, signinErrors])

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signin(data);
            toast.success("Sesion iniciada"); 

            setTimeout(() => {
                navigate("/tasks");  // Redirige después de 2 segundos
            }, 2000)
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <div className='max-w-xl mx-auto'>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder='username'
                    {...register("username", { required: true })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />
                {errors.username && <span>username es requerido</span>}

                <input
                    type="password"
                    placeholder='password'
                    {...register("password", { required: true })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />
                {errors.password && <span>password es requerido</span>}

                <button
                    className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
                >Log In</button>
            </form>
        </div>
    )
}

export default LoginPage