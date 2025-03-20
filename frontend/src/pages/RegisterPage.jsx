import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        isAuthenticated,
        signup,
        errors: signupErrors
    } = useAuth()

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
                    type="email"
                    placeholder='email (opcional)'
                    {...register("email", { required: false })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />

                <input
                    type="password"
                    placeholder='password'
                    {...register("password", { required: true })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />
                {errors.password && <span>password es requerido</span>}

                <button
                    className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
                >Save</button>
            </form>
        </div>
    )
}

export default RegisterPage