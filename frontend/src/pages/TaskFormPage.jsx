import { useForm } from 'react-hook-form'
import { createTask, deleteTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom'

function TaskFormPage() {

  const { 
    register, //Registra los campos del formulario y permite definir validaciones.
    handleSubmit, //Maneja el envío del formulario y ejecuta la función onSubmit solo si los datos son válidos.
    formState:{ errors } // formState es un objeto que contiene información sobre el estado del formulario.  { errors } extrae solo la propiedad errors, que almacena los errores de validación de los campos.
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
    await createTask(data);
    navigate("/tasks")
  })

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder='title'
          {...register("title", { required: true })}
        />
        {errors.title && <span>titulo es requerido</span>}

        <textarea
          rows="3"
          placeholder='description'
          {...register("description", { required: true })}
        ></textarea>
        {errors.description && <span>descripcion es requerido</span>}

        <button>Save</button>
      </form>

      {params.id && <button onClick={async () => {
        const accepted = window.confirm('estas seguro?')
        if (accepted){
          await deleteTask(params.id)
          navigate("/tasks")
        }
      }}
      >Delete</button>}
    </div>
  )
}

export default TaskFormPage