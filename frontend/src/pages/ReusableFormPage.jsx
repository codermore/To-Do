import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createTask } from '../api/tasks';
import { createGoal, getGoal } from '../api/goals'; // Asegurate de tener getGoal
import { createBoard } from '../api/boards';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

function ReusableFormPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const { type, type_id } = useParams();

    const apiMap = {
        task: {
            create: createTask,
            successMessage: 'Tarea creada',
            placeholder: {
                title: 'Título de la tarea',
                description: 'Descripción de la tarea'
            }
        },
        goal: {
            create: createGoal,
            successMessage: 'Meta creada',
            redirect: `/board/${type_id}`,
            placeholder: {
                title: 'Título de la meta',
                description: 'Descripción de la meta'
            }
        },
        board: {
            create: createBoard,
            successMessage: 'Tablero creado',
            redirect: '/dashboard',
            placeholder: {
                title: 'Título del tablero',
                description: 'Descripción del tablero'
            }
        }
    };

    const config = apiMap[type];

    if (!config) {
        return <p className="text-center text-red-500 mt-10">Tipo de entidad no válido.</p>;
    }

    const onSubmit = handleSubmit(async data => {
        const payload = { ...data };

        if (type === 'task') payload.goal_id = type_id;
        else if (type === 'goal') payload.board = type_id;

        try {
            await config.create(payload);
            toast.success(config.successMessage);

            if (type === 'task') {
                // 👇 Buscamos el board del goal para redireccionar correctamente
                const goal = await getGoal(type_id);
                const board_id = goal.data.board;
                navigate(`/board/${board_id}`);
            } else {
                navigate(config.redirect);
            }

        } catch (error) {
            console.error(error);
            toast.error('Error al crear ' + type);
        }
    });

    useEffect(() => {
        setValue('user', user.id);
    }, [setValue, user.id]);

    return (
        <div className='max-w-xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4 capitalize text-center'>
                Crear {type}
            </h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder={config.placeholder.title}
                    {...register("title", { required: true })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                />
                {errors.title && <span className='text-red-500'>El título es requerido</span>}

                <textarea
                    rows="3"
                    placeholder={config.placeholder.description}
                    {...register("description", { required: true })}
                    className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
                ></textarea>
                {errors.description && <span className='text-red-500'>La descripción es requerida</span>}

                <button className='bg-indigo-500 transition hover:bg-indigo-700 p-3 rounded-lg w-full mt-3'>
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default ReusableFormPage;
