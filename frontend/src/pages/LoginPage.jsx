import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const signin = useAuthStore(state => state.signin);
    const signinErrors = useAuthStore(state => state.errors);
    const setSigninErrors = useAuthStore(state => state.setErrors);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks");

        if (signinErrors.length > 0) {
            signinErrors.forEach(error => {
                toast.error(error);
            });
            setSigninErrors([]);
        }
    }, [isAuthenticated, signinErrors, navigate, setSigninErrors]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signin(data);
            toast.success("Sesión iniciada");

            setTimeout(() => {
                navigate("/tasks");
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    });

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
                    {errors.username && <span className='text-red-500'>username es requerido</span>}

                    <input
                        type="password"
                        placeholder='contraseña'
                        {...register("password", { required: true })}
                        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                    />
                    {errors.password && <span className='text-red-500'>password es requerido</span>}

                    <button
                        className='bg-indigo-500 transition hover:bg-indigo-700 p-3 mb-3 rounded-lg block w-full mt-3'
                    >Iniciar Sesión</button>

                    ¿No tienes una cuenta?{" "}
                    <Link to='/register' className='text-blue-500 transition hover:text-gray-600'>
                        Crear cuenta
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
