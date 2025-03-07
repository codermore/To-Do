import { useNavigate } from 'react-router-dom'


function TasksCard({task}) {

    const navigate = useNavigate()

    return (
        <div
        onClick={() => {
            navigate("/tasks/" + task.id)
        }}
        >
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <hr />
        </div>
    )
}

export default TasksCard