import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navigation() {

  const { isAuthenticated, signout, user } = useAuth()

  return (
    <div className='flex justify-between py-3'>
      <Link to='/tasks'>
        <h1 className='font-bold text-3xl mb-4'>Task App</h1>
      </Link>
      {isAuthenticated ? (
        <>
          <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
            <Link to="/tasks-create">Create Task</Link>
          </button>
          <h3>{user.username}</h3>
          <button onClick={signout} className='bg-red-500 px-3 py-2 rounded-lg ml-2'>
            Cerrar Sesion
          </button>
        </>
      ) : (
        <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
          <Link to="/login">Iniciar Sesion</Link>
        </button>
      )}

    </div>
  )
}

export default Navigation