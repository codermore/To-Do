import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const {
        isAuthenticated,
        signup,
        errors: signupErrors
    } = useAuth()

    const password = watch("password");
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks")

        if (signupErrors.length > 0) {
            signupErrors.forEach(error => {
                toast.error(error)
            })
        }

    }, [isAuthenticated, signupErrors])

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signup(data);
            toast.success("Registro exitoso");

            setTimeout(() => {
                navigate("/login");  // Redirige después de 2 segundos
            }, 2000)
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className='bg-zinc-800 max-w-md w-full p-6 rounded-md'>
                <h1 className='text-2xl font-bold mb-6'>Crea una cuenta</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder='nombre de usuario'
                        {...register("username", {
                            required: true,
                            pattern: {
                                value: /^[\w.@+-]+$/,
                                message: "Solo se permiten letras, números y los caracteres: @ . + - _"
                            }
                        })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />
                    {errors.username && (
                        <span className='text-red-500'>
                            * {errors.username.message || "nombre de usuario es requerido"}
                        </span>
                    )}

                    <input
                        type="email"
                        placeholder='email (opcional)'
                        {...register("email", { required: false })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />

                    <input
                        type="password"
                        placeholder='contraseña'
                        {...register("password", { required: true })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />
                    {errors.password && <span className='text-red-500'>* constraseña es requerida</span>}

                    <input
                        type="password"
                        placeholder="confirmar contraseña"
                        {...register("confirmPassword", {
                            required: true,
                            validate: (value) => value === password || "Las contraseñas no coinciden"
                        })}
                        className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500">* {errors.confirmPassword.message}</span>
                    )}

                    <button
                        className='bg-indigo-500 p-3 rounded-lg block w-full mt-3 transition hover:bg-indigo-700'
                    >Guardar</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage