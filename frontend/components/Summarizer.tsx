"use client";

import { useState, useRef } from "react";
import { Container } from "./Container";
import { SummaryStyleSelector } from "./Summarizer-Components/SummaryStyleSelector";
import { TextInput } from "./Summarizer-Components/TextInput";
import { SummaryOutput } from "./Summarizer-Components/SummaryOutput";
import { TextMetadata } from "./Summarizer-Components/TextMetadata";

import { useHistory } from "@/hooks/useHistory";

type SummaryStyle = 'harsh' | 'standard' | 'detailed';

export const Summarizer = () => {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [selectedStyle, setSelectedStyle] = useState<SummaryStyle>('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const { addHistoryItem } = useHistory();

    // Still needs to be implemented and connected to the backend
    const handleSummarize = async () => {
        if (!inputText.trim()) {
            setError("Please enter some text to summarize");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary("");

        setTimeout(() => {
            const generatedSummary = inputText;
            setSummary(generatedSummary);
            setIsLoading(false);

            addHistoryItem({
                inputText: inputText,
                style: selectedStyle,
                summary: generatedSummary
            });

            setTimeout(() => {
                summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }, 500);
    };

    return (
        <Container>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-center">
                    <SummaryStyleSelector
                        selectedStyle={selectedStyle}
                        onSelect={setSelectedStyle}
                    />
                </div>

                <TextInput
                    value={inputText}
                    onChange={setInputText}
                    placeholder="Paste your article, document, or any text you want to summarize..."
                />

                <div className="flex justify-center">
                    <button
                        onClick={handleSummarize}
                        disabled={isLoading || !inputText.trim()}
                        className="
                            px-8 py-4 rounded-lg font-semibold text-lg
                            bg-indigo-500 hover:bg-indigo-600
                            dark:bg-indigo-600 dark:hover:bg-indigo-700
                            text-white
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-200
                            shadow-lg hover:shadow-xl
                            transform hover:scale-105
                        "
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </span>
                        ) : (
                            'Generate Summary'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
                    </div>
                )}

                {summary && (
                    <div ref={summaryRef} className="space-y-4 scroll-mt-24 max-w-5xl mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                            Here's your generated summary!
                        </h3>
                        <SummaryOutput summary={summary} isLoading={isLoading} />

                        {!isLoading && (
                            <TextMetadata text={summary} />
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
};