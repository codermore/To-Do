# 🧠 Flujo de Datos: TasksPage

## 1. Inicialización de tareas
- Al montar el componente:
  - useEffect() llama a `getAllTasks()`
  - Respuesta: lista de tareas
  - `setTasks(res.data)` actualiza el estado
  - Se renderiza `<TasksList tasks={tasks} ... />`

---

## 2. Renderizado de tareas
- `<TasksList />` recibe `tasks` como prop
- Mapea cada tarea a un `<TasksCard task={...} />`

---

## 3. Editar tarea ✏️
- Usuario hace clic en el botón ✏️
- Cambia a modo edición (`setIsEditing(true)`)
- Al enviar el formulario:
  - `updateTask(id, data)` (API)
  - Llama a `onUpdateTask(updatedTask)`
    - En `TasksPage`: `setTasks(prev => prev.map(...))`

---

## 4. Marcar como completada ✅
- Usuario hace clic en el checkbox
- Se llama a `toggleCompleted()`
  - `updateTask(id, data)` (API)
  - Llama a `onUpdateTask(updatedTask)`
    - Actualiza el estado en `TasksPage`

---

## 5. Eliminar tarea 🗑
- Usuario hace clic en el botón 🗑
- Se ejecuta `deleteTask(id)` (API)
- Llama a `onDeleteTask(id)`
  - En `TasksPage`: `setTasks(prev => prev.filter(...))`

---

## 6. Crear tarea ➕ (opcional con `TaskForm`)
- Usuario elige crear o editar una tarea
- `selectedTask` se actualiza con `setSelectedTask(task)`
- Se muestra `<TaskForm task={selectedTask} />`
- Al guardar:
  - Si es nueva: `createTask(data)` + `setTasks([...tasks, newTask])`
  - Si es edición: `updateTask()` + `onUpdateTask()`

