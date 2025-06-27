
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-serif">
                        Get<span className="text-sky-400">Inkspired</span>
                    </h1>
                    <p className="text-sm text-slate-400">Asistente de Escritura IA</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
