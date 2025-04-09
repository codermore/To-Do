import TasksCard from './TasksCard';

function TasksList({ tasks, onUpdateTask, onDeleteTask }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <TasksCard
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </div>
    );
}

export default TasksList;