import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiLogIn, FiUser } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";

function Navigation() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signout = useAuthStore((state) => state.signout);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 500);
  };

  const handleLogout = () => {
    signout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between py-8 relative">
      <Link to="/">
        <h1 className="font-bold text-5xl transition-transform transform hover:scale-110">
          To-Do App
        </h1>
      </Link>

      {isAuthenticated ? (
        <div className="relative flex items-center space-x-4">
          <button className="bg-emerald-600 transition hover:bg-emerald-800 px-3 py-2 rounded-lg text-white">
            <Link to="/tasks-create">Crear Tarea</Link>
          </button>

          <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="p-3 text-white font-semibold transition-transform transform hover:scale-125">
              {user.username}
            </button>

            <div
              className={`absolute right-0 mt-2 w-40 
                bg-white shadow-lg rounded-lg z-50 
                transition-opacity duration-500 
                ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              <ul className="py-2 text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <FiUser className="text-2xl mr-2" /> Perfil
                </li>
                <li
                  className="px-4 py-2 flex items-center cursor-pointer transition hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  <FiLogOut className="text-2xl mr-2" /> Salir
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <button className="bg-indigo-500 transition hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-2">
          <Link to="/login" className="flex items-center gap-2">
            <FiLogIn className="text-2xl" /> Iniciar Sesión
          </Link>
        </button>
      )}
    </div>
  );
}

export default Navigation;
