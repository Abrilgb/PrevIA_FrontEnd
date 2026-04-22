import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="text-sm px-8 py-5  w-full transition-colors">
      <ul className="flex items-center gap-3 text-dark-blue/60 dark:text-pure-white/60 font-medium">
        
        {/* Inicio siempre está */}
        <li>
          <Link to="/dashboard" className="hover:text-teal-dark dark:hover:text-light-teal transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Inicio
          </Link>
        </li>

        {/* Mapeamos el resto de las rutas con un separador ( / ) */}
        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Capitalizar la primera letra (perfil -> Perfil)
          const title = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              {/* Separador Visual */}
              <li>
                <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
              </li>
              
              {/* Nombre de la página */}
              <li>
                {isLast ? (
                  <span className="text-dark-blue dark:text-pure-white font-bold cursor-default">
                    {title}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-teal-dark dark:hover:text-light-teal transition-colors">
                    {title}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
        
      </ul>
    </div>
  );
}