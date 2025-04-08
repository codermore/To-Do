import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import TaskFormPage from './pages/TaskFormPage'
import Navigation from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'


import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='container mx-auto'>
          <Navigation />
          <Routes>
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<HomePage />} />

            {/* 🔒 Agrupar rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Navigate to="/tasks" />} />
              <Route path='/tasks' element={<TasksPage />} />
              <Route path='/tasks-create' element={<TaskFormPage />} />
              <Route path='/tasks/:id' element={<TaskFormPage />} />
            </Route>


          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App