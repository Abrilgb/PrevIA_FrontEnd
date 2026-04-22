/**
 * InputField — Campo de entrada reutilizable con label y error.
 * Soporta: text, email, number, date, time, password, textarea, select.
 * Ahora con soporte 100% para Dark Mode 🌙
 */
import React from 'react';

export default function InputField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    suffix,
    rows = 3,
    step,
    options = [],
    className = '',
}) {
    // Estilos base (Normal)
    const baseInputStyles = `w-full bg-slate-50 dark:bg-slate-900 border-2 ${
        error ? 'border-red-400 dark:border-red-500' : 'border-slate-100 dark:border-slate-700'
    } rounded-2xl px-5 py-4 font-bold text-dark-blue dark:text-pure-white outline-none focus:border-teal-dark dark:focus:border-light-teal transition-all`;

    // Estilos cuando está deshabilitado (Disabled)
    const disabledInputStyles = `w-full border-2 rounded-2xl px-5 py-3.5 font-bold outline-none transition-all ${
        disabled
            ? 'bg-transparent border-transparent text-dark-blue/70 dark:text-pure-white/50 cursor-not-allowed'
            : `bg-slate-50 dark:bg-slate-900 text-dark-blue dark:text-pure-white ${error ? 'border-red-400 dark:border-red-500' : 'border-slate-100 dark:border-slate-700'} focus:border-teal-dark dark:focus:border-light-teal`
    }`;

    // Selección final de estilos
    const inputStyles = disabled !== undefined && disabled ? disabledInputStyles : baseInputStyles;

    const renderInput = () => {
        if (type === 'select') {
            return (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${inputStyles} appearance-none cursor-pointer`}
                >
                    {options.map((opt) => (
                        <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-pure-white dark:bg-slate-800 text-dark-blue dark:text-pure-white">
                            {opt.label ?? opt}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    rows={rows}
                    className={`${inputStyles} resize-none text-sm`}
                />
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                step={step}
                className={inputStyles}
            />
        );
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-dark-blue/60 dark:text-pure-white/70 uppercase tracking-widest ml-1 transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                {renderInput()}
                {suffix && (
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] text-dark-blue/30 dark:text-pure-white/30 transition-colors">
                        {suffix}
                    </span>
                )}
            </div>
            {error && (
                <p className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1 ml-1 uppercase transition-colors">{error}</p>
            )}
        </div>
    );
}
