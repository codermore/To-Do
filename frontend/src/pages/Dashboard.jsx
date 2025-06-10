/* 
Componente -->   Rol
-------------------------
BoardsPage  -->   Controla el estado global (lista de tareas)
BoardsList  -->   Se encarga de renderizar todas las tarjetas
BoardsCard  -->   Se encarga de mostrar/editar/eliminar una tarea individualmente
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import BoardsList from '../components/BoardsList';
import { getAllBoards } from '../api/boards';
import { Plus } from "lucide-react"; // usa `lucide-react` para íconos


function Dashboard() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);

  // 🔁 Obtener tareas del backend
  useEffect(() => {
    const loadBoards = async () => {
      const res = await getAllBoards();
      console.log(res)
      setBoards(res.data);
    };
    loadBoards();
  }, []);

  // 🔄 Actualizar tarea en el estado
  const handleUpdateBoard = (updatedBoard) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => (board.id === updatedBoard.id ? updatedBoard : board))
    );
  };

  // ❌ Eliminar tarea del estado
  const handleDeleteBoard = (deletedBoardId) => {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== deletedBoardId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <BoardsList
        boards={boards}
        onUpdateBoard={handleUpdateBoard}
        onDeleteBoard={handleDeleteBoard}
      />

      <button
        onClick={() => navigate("/create/board/new")}
        className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        <Plus size={48} />
      </button>
    </div>
  );
}

export default Dashboard;
