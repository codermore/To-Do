import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import TaskFormPage from './pages/TaskFormPage'
import Navigation from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
// 👇 Zustand store
import useAuthStore from './store/useAuthStore'

function App() {
  const loading = useAuthStore(state => state.loading);
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth(); // 👈 Esto debe ejecutarse una vez al inicio
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Cargando...</div>;

  return (
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
  );
}

export default App;
