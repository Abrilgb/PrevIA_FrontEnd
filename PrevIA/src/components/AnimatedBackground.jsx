import React from 'react';

/**
 * AnimatedBackground — Orbes flotantes con animación orgánica.
 * Renderiza un fondo absoluto con esferas animadas usando la paleta de PrevIA.
 * Úsalo envolviendo el contenido de la página o como capa detrás del formulario.
 */
export default function AnimatedBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
            {/* Orbe 1 — Grande, teal claro, esquina superior izquierda */}
            <div className="orb orb-1 absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-light-teal/25 blur-[100px]" />

            {/* Orbe 2 — Mediano, teal oscuro, esquina inferior derecha */}
            <div className="orb orb-2 absolute -bottom-10 -right-10 w-[350px] h-[350px] rounded-full bg-teal-dark/20 blur-[90px]" />

            {/* Orbe 3 — Pequeño, dark blue, centro-derecha */}
            <div className="orb orb-3 absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-dark-blue/15 blur-[80px]" />

            {/* Orbe 4 — Mediano, light teal, centro-izquierda */}
            <div className="orb orb-4 absolute bottom-1/3 left-1/5 w-[280px] h-[280px] rounded-full bg-light-teal/20 blur-[95px]" />

            {/* Orbe 5 — Pequeño y brillante, acento superior derecha */}
            <div className="orb orb-5 absolute top-10 right-1/3 w-[150px] h-[150px] rounded-full bg-teal-dark/10 blur-[70px]" />
        </div>
    );
}
