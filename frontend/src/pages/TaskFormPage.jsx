import { useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { createTask, deleteTask, updateTask, getTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function TaskFormPage() {

  const {
    register, //Registra los campos del formulario y permite definir validaciones.
    handleSubmit, //Maneja el envío del formulario y ejecuta la función onSubmit solo si los datos son válidos.
    formState: { errors }, // formState es un objeto que contiene información sobre el estado del formulario.  { errors } extrae solo la propiedad errors, que almacena los errores de validación de los campos.
    setValue
  } = useForm();
  const navigate = useNavigate()
  const params = useParams()

  /* 
  🔹 Cuando llamamos a useForm(), esta función nos devuelve un objeto con varias propiedades y métodos que facilitan la gestión de formularios en React. 
  Lo que hacemos en esta línea es extraer solo las partes que necesitamos mediante desestructuración de objetos.

  1️⃣ El usuario hace clic en el botón del formulario (<form>).
  2️⃣ El evento onSubmit se dispara y llama a la función handleSubmit().
  3️⃣ handleSubmit() valida los datos antes de ejecutar la función asíncrona.
    Si hay errores (por ejemplo, title está vacío), handleSubmit evita que se ejecute la función.
    Si todo está correcto, ejecuta onSubmit.
  4️⃣ onSubmit llama a createTask(data), enviando los datos a la API.
  5️⃣ Cuando la API responde, console.log(res) muestra la respuesta en la consola.

  ✅ onSubmit es una constante que almacena una función.
  ✅ Esa función NO es async data => {...} directamente, sino una versión modificada por handleSubmit().
  ✅ handleSubmit() actúa como filtro: primero valida, y solo si todo está bien, ejecuta async data => {...}.
  ✅ onSubmit es una función, pero su comportamiento fue modificado por handleSubmit().

  ✅ <form onSubmit={onSubmit}> está diciendo:
    Cuando el usuario haga submit, ejecuta onSubmit.
    Pero onSubmit primero validará los datos antes de ejecutar la función final.
  */

  const onSubmit = handleSubmit(async data => {
    if (params.id) {
      await updateTask(params.id, data)
    } else {
      await createTask(data);
      toast.success('Tarea creada', {
        position: 'bottom-right'
      })
    }
    navigate("/tasks")
  })

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const res = await getTask(params.id)
        setValue('title', res.data.title)
        setValue('description', res.data.description)
      }
    }
    loadTask();
  }, [])

  return (
    <div className='max-w-xl mx-auto'>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder='title'
          {...register("title", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        />
        {errors.title && <span>titulo es requerido</span>}

        <textarea
          rows="3"
          placeholder='description'
          {...register("description", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        ></textarea>
        {errors.description && <span>descripcion es requerido</span>}

        <button
          className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'
        >Save</button>
      </form>

      {params.id &&
        <button
          className='bg-red-500 p-3 rounded-lg w-48 mt-3'
          onClick={async () => {
            const accepted = window.confirm('estas seguro?')
            if (accepted) {
              await deleteTask(params.id)
              navigate("/tasks")
            }
          }}
        >Delete</button>}
    </div>
  )
}

export default TaskFormPage