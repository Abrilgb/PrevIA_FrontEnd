import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

import Home from '../pages/home.jsx';
import Login from '../pages/login.jsx';
import Register from '../pages/register.jsx';
import ForgotPassword from '../pages/forgot_password.jsx';
import ResetPassword from '../pages/reset_password.jsx';
import Dashboard from '../pages/dashboard.jsx';
import Perfil from '../pages/perfil.jsx';
import Sleep from '../pages/sleep.jsx';
import Nutricion from '../pages/nutricion.jsx';
import Walk from '../pages/walk.jsx';
import Configuracion from '../pages/configuracion.jsx';
import FormularioPersonal from '../pages/formulario_personal.jsx';
import NotFound from '../pages/not_found.jsx';
import Bienestar from '../pages/Bienestar.jsx';
import Error401 from '../pages/error_401.jsx';
import Error403 from '../pages/error_403.jsx';
import Error500 from '../pages/error_500.jsx';

/**
 * AnimatedRoutes — Maneja las rutas con transiciones animadas entre páginas.
 * 
 * - Páginas públicas (Home, Login, Register, Formulario): usan PageTransition completo
 * - Páginas con Sidebar (Dashboard, Perfil, etc.): NO se envuelven en PageTransition
 *   porque el Sidebar ya maneja la transición interna del contenido,
 *   manteniendo persistentes el sidebar, footer y AICoach.
 */
export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Rutas públicas — transición completa de página */}
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
                <Route path="/formulario_personal" element={<PageTransition><FormularioPersonal /></PageTransition>} />

                {/* Rutas con Sidebar — sin PageTransition exterior.
                    El Sidebar se mantiene persistente y el contenido interno se anima. */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/nutricion" element={<Nutricion />} />
                <Route path="/walk" element={<Walk />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/bienestar" element={<Bienestar />} />


                {/* Rutas de error */}
                <Route path="/401" element={<Error401 />} />
                <Route path="/403" element={<Error403 />} />
                <Route path="/500" element={<Error500 />} />

                {/* Ruta 404 — catch-all */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
}
