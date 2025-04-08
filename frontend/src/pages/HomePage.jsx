import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Server,
  Database,
  ShieldCheck,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      {/* Hero animado */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-400">
          To-Do App
        </h1>
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
          Una aplicación moderna de gestión de tareas con enfoque en buenas
          prácticas de desarrollo backend y frontend.
        </p>
      </motion.div>

      {/* Cards informativas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          icon={<ClipboardCheck className="w-6 h-6 text-indigo-400" />}
          title="Gestión de Tareas"
          description="Crea, edita y elimina tareas. Cada usuario tiene su propia lista privada protegida por autenticación."
        />

        <Card
          icon={<Server className="w-6 h-6 text-green-400" />}
          title="Backend con Django"
          description="API RESTful robusta construida con Django REST Framework, estructurada en endpoints limpios y seguros."
        />

        <Card
          icon={<Database className="w-6 h-6 text-yellow-400" />}
          title="Base de Datos PostgreSQL"
          description="Base de datos relacional alojada en la nube, escalable y optimizada para producción."
        />

        <Card
          icon={<ShieldCheck className="w-6 h-6 text-red-400" />}
          title="Autenticación Segura"
          description="Sistema de login/register con JWT + Cookies HttpOnly. Protección contra CSRF y limitación de IP para registrar."
        />

        <Card
          icon={<Github className="w-6 h-6 text-white" />}
          title="Código Abierto"
          description="El código está disponible en GitHub. ¡Explorá cómo está hecho por dentro!"
          link="https://github.com/codermore/To-Do"
        />

        <Card
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 
              0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 
              0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 
              1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.064-1.868-3.064-1.869 
              0-2.156 1.46-2.156 2.968v5.7h-3v-10h2.881v1.367h.041c.401-.761 
              1.379-1.562 2.838-1.562 3.034 0 3.593 1.996 3.593 
              4.591v5.604z" />
            </svg>
          }
          title="LinkedIn"
          description="Conectá conmigo en LinkedIn para conocer más sobre mis proyectos y experiencia."
          link="https://www.linkedin.com/in/gabriel-andr%C3%A9s-mas%C3%B3/" // ← cambiá por tu URL real
        />
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <Link
          to="/login"
          className="text-blue-500 transition hover:text-gray-600"
        >
          Empezar a gestionar tareas →
        </Link>
      </div>
    </div>
  );
}

function Card({ icon, title, description, link }) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-zinc-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-zinc-400 text-sm">{description}</p>
    </motion.div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}
