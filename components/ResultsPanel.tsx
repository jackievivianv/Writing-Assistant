
import React from 'react';
import type { AnalysisResult, LTError } from '../types';
import ScoreGauge from './ScoreGauge';
import ErrorList from './ErrorList';

interface ResultsPanelProps {
    isLoading: boolean;
    apiError: string | null;
    analysis: AnalysisResult | null;
    errors: LTError[];
    activeTab: 'summary' | 'errors';
    setActiveTab: (tab: 'summary' | 'errors') => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
    isLoading,
    apiError,
    analysis,
    errors,
    activeTab,
    setActiveTab
}) => {
    const hasResults = analysis !== null && errors !== null;

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10"><p className="text-lg text-slate-400">Analizando tu texto...</p></div>;
        }
        if (apiError) {
            return <div className="text-center p-10 bg-red-900/20 rounded-lg"><p className="text-lg text-red-400">{apiError}</p></div>;
        }
        if (!hasResults) {
            return (
                <div className="text-center p-10">
                    <p className="text-lg text-slate-400 font-serif">Los resultados de tu análisis aparecerán aquí.</p>
                    <p className="text-slate-500 mt-2">Escribe algo y presiona "Calificar Texto" para empezar.</p>
                </div>
            );
        }

        return (
            <>
                <div className="flex justify-center p-6">
                    <ScoreGauge score={analysis.score} />
                </div>
                <div className="border-b border-slate-700 px-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`${
                                activeTab === 'summary'
                                    ? 'border-sky-500 text-sky-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Resumen IA
                        </button>
                        <button
                            onClick={() => setActiveTab('errors')}
                            className={`${
                                activeTab === 'errors'
                                    ? 'border-sky-500 text-sky-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Errores ({errors.length})
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'summary' ? (
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h3 className="font-serif text-xl text-slate-200 mb-2">Análisis del Editor</h3>
                            <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
                        </div>
                    ) : (
                        <ErrorList errors={errors} />
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg h-auto lg:h-[calc(100vh-200px)] lg:max-h-[700px] flex flex-col">
            <div className="overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResultsPanel;
