
import React, { useState, useCallback } from 'react';
import { checkText } from './services/languageToolService';
import { analyzeErrorsWithGemini } from './services/geminiService';
import type { LTError, AnalysisResult } from './types';
import { SUPPORTED_LANGUAGES } from './constants';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import ResultsPanel from './components/ResultsPanel';

const App: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [language, setLanguage] = useState<string>('es');
    const [errors, setErrors] = useState<LTError[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'errors'>('summary');

    const handleCheckText = useCallback(async () => {
        if (!text.trim()) {
            setApiError("El texto no puede estar vacío.");
            return;
        }
        setIsLoading(true);
        setApiError(null);
        setAnalysis(null);
        setErrors([]);

        try {
            const ltResponse = await checkText(text, language);
            setErrors(ltResponse.matches);

            const geminiResult = await analyzeErrorsWithGemini(ltResponse.matches, text, language);
            setAnalysis(geminiResult);
            setActiveTab('summary');
        } catch (error) {
            console.error("Error during analysis:", error);
            setApiError(error instanceof Error ? error.message : "Ocurrió un error desconocido. Por favor, inténtelo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }, [text, language]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <EditorPanel
                    text={text}
                    setText={setText}
                    language={language}
                    setLanguage={setLanguage}
                    supportedLanguages={SUPPORTED_LANGUAGES}
                    onCheckText={handleCheckText}
                    isLoading={isLoading}
                />
                <ResultsPanel
                    isLoading={isLoading}
                    apiError={apiError}
                    analysis={analysis}
                    errors={errors}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </main>
        </div>
    );
};

export default App;
