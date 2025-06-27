
import React, { useMemo } from 'react';
import type { LTError } from '../types';

interface ErrorListProps {
    errors: LTError[];
}

const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('ortografía') || lowerCategory.includes('spelling')) {
        return 'border-red-500';
    }
    if (lowerCategory.includes('gramática') || lowerCategory.includes('grammar')) {
        return 'border-yellow-500';
    }
    if (lowerCategory.includes('estilo') || lowerCategory.includes('style')) {
        return 'border-blue-500';
    }
    return 'border-slate-600';
};


const ErrorCard: React.FC<{ error: LTError }> = ({ error }) => {
    const categoryName = error.rule.category.name;
    const borderColorClass = getCategoryColor(categoryName);

    return (
        <div className={`bg-slate-800/50 p-4 rounded-lg border-l-4 ${borderColorClass} mb-4`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-200">{error.message}</h4>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full whitespace-nowrap">{categoryName}</span>
            </div>
            <div className="text-sm text-slate-400 italic bg-slate-900/50 p-3 rounded-md">
                "...{error.context.text.substring(0, error.context.offset)}
                <span className="bg-red-900/50 text-red-300 rounded px-1">{error.context.text.substring(error.context.offset, error.context.offset + error.context.length)}</span>
                {error.context.text.substring(error.context.offset + error.context.length)}..."
            </div>
            {error.replacements.length > 0 && (
                <div className="mt-3 text-sm">
                    <span className="text-green-400 font-semibold">Sugerencias: </span>
                    <span className="text-green-300">{error.replacements.map(r => r.value).join(', ')}</span>
                </div>
            )}
        </div>
    );
};


const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
    const sortedErrors = useMemo(() => {
        const categoryPriority = {
            'ortografía': 1, 'spelling': 1,
            'gramática': 2, 'grammar': 2,
            'estilo': 3, 'style': 3,
        };
        return [...errors].sort((a, b) => {
            const catA = a.rule.category.name.toLowerCase();
            const catB = b.rule.category.name.toLowerCase();
            const priorityA = Object.entries(categoryPriority).find(([key]) => catA.includes(key))?.[1] || 99;
            const priorityB = Object.entries(categoryPriority).find(([key]) => catB.includes(key))?.[1] || 99;
            return priorityA - priorityB;
        });
    }, [errors]);

    if (errors.length === 0) {
        return <p className="text-center text-slate-400">No se encontraron errores. ¡Felicidades!</p>;
    }

    return (
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {sortedErrors.map((error, index) => (
                <ErrorCard key={`${error.offset}-${index}`} error={error} />
            ))}
        </div>
    );
};

export default ErrorList;
