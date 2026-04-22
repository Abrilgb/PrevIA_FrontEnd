import { motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
        },
    },
    exit: {
        opacity: 0,
        y: -15,
        filter: 'blur(6px)',
        transition: {
            duration: 0.25,
            ease: [0.55, 0.06, 0.68, 0.19], // ease-in-quad
        },
    },
};

/**
 * PageTransition — Envuelve el contenido de una página con animación de entrada/salida.
 * Usa fade + slide vertical + blur para un efecto premium.
 */
export default function PageTransition({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh' }}
        >
            {children}
        </motion.div>
    );
}
