import React, { useEffect, useState } from 'react'
import { getAllTasks } from '../api/tasks.api'
import TasksCard from './TasksCard'


function TasksList() {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        async function loadTasks() {
            const res = await getAllTasks()
            setTasks(res.data)
        }
        loadTasks();
    }, [])

    return (
        <div>
            {tasks.map(task => (
                <TasksCard key={task.id} task={task} />
            ))}
        </div>
    )
}

export default TasksList