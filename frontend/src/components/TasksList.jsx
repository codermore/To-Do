import React, { useEffect, useState } from 'react'
import { getAllTasks } from '../api/tasks'
import TasksCard from './TasksCard'


function TasksList() {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        async function loadTasks() {
            const res = await getAllTasks()
            console.log(res)
            setTasks(res.data)
        }
        loadTasks();
    }, [])

    return (
        <div className='grid grid-cols-3 gap-3'>
            {tasks.map(task => (
                <TasksCard key={task.id} task={task} />
            ))}
        </div>
    )
}

export default TasksList