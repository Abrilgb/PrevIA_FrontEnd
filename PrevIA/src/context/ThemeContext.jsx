import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    const [daltonismType, setDaltonismType] = useState(() => {
        return localStorage.getItem('daltonismType') || 'none';
    });

    const [isGrayscale, setIsGrayscale] = useState(() => {
        return localStorage.getItem('isGrayscale') === 'true';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = () => {
            let activeTheme = theme;
            if (theme === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                activeTheme = systemDark ? 'dark' : 'light';
            }

            console.log(`[ThemeContext] Setting theme to: ${activeTheme} (selected: ${theme})`);

            if (activeTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove existing daltonism classes
        const daltonismClasses = ['daltonism-protanopia', 'daltonism-deuteranopia', 'daltonism-tritanopia', 'daltonism-achromatopsia'];
        root.classList.remove(...daltonismClasses);

        // Apply new daltonism class
        if (daltonismType !== 'none') {
            root.classList.add(`daltonism-${daltonismType}`);
        }

        localStorage.setItem('daltonismType', daltonismType);
    }, [daltonismType]);

    useEffect(() => {
        const root = window.document.documentElement;
        
        if (isGrayscale) {
            root.classList.add('grayscale-filter');
        } else {
            root.classList.remove('grayscale-filter');
        }

        localStorage.setItem('isGrayscale', isGrayscale);
    }, [isGrayscale]);

    return (
        <ThemeContext.Provider value={{ 
            theme, setTheme, 
            daltonismType, setDaltonismType,
            isGrayscale, setIsGrayscale 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
