
import React from 'react';

interface EditorPanelProps {
    text: string;
    setText: (text: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    supportedLanguages: { code: string; name: string }[];
    onCheckText: () => void;
    isLoading: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    text,
    setText,
    language,
    setLanguage,
    supportedLanguages,
    onCheckText,
    isLoading
}) => {
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
            <div className="flex-grow flex flex-col">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe o pega tu texto aquí para analizarlo..."
                    className="w-full flex-grow bg-slate-800 text-slate-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none text-lg leading-relaxed"
                    disabled={isLoading}
                />
            </div>
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-auto">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-700 text-white py-2 pl-3 pr-10 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                        disabled={isLoading}
                    >
                        {supportedLanguages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                <button
                    onClick={onCheckText}
                    disabled={isLoading || !text.trim()}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analizando...
                        </>
                    ) : 'Calificar Texto'}
                </button>
            </div>
        </div>
    );
};

export default EditorPanel;
