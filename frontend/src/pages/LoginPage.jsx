import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom';
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
        errors: signinErrors,
        setErrors: setSigninErrors,
    } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks")

        if (signinErrors.length > 0) {
            signinErrors.forEach(error => {
                toast.error(error)
            })
            setSigninErrors([])
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
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md w-full p-6 rounded-md'>
                <h1 className='text-2xl font-bold mb-6'>Inicia sesión</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder='nombre de usuario'
                        {...register("username", { required: true })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />
                    {errors.username && <span  className='text-red-500'>username es requerido</span>}

                    <input
                        type="password"
                        placeholder='constraseña'
                        {...register("password", { required: true })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />
                    {errors.password && <span  className='text-red-500'>password es requerido</span>}

                    <button
                        className='bg-indigo-500 transition hover:bg-indigo-700 p-3 mb-3 rounded-lg block w-full mt-3'
                    >Iniciar Sesion</button>

                    ¿No tienes una cuenta? <Link to='/register' className='text-blue-500 transition hover:text-gray-600' >Crear cuenta</Link>
                </form>
            </div>
        </div>
    )
}

export default LoginPage