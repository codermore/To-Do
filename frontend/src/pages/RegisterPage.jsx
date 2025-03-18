import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/users';
import { toast } from 'react-hot-toast'

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate()

    const onSubmit = handleSubmit(async data => {
        try {
            const res = await createUser(data)
            toast.success('Usuario Registrado', {
                position: 'bottom-right'
            })
        }
        catch (error) {
            toast.error(error.response.data.username, {
                position: 'bottom-right'
            })
        }
        //navigate("/login")
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