"use client";

import { useState, useRef, useEffect } from "react";
import { Container } from "./Container";
import { SummaryStyleSelector } from "./Summarizer-Components/SummaryStyleSelector";
import { TextInput } from "./Summarizer-Components/TextInput";
import { SummaryOutput } from "./Summarizer-Components/SummaryOutput";
import { TextMetadata } from "./Summarizer-Components/TextMetadata";
import { Client } from "@gradio/client";

import { useHistory } from "@/hooks/useHistory";

type SummaryStyle = 'harsh' | 'standard' | 'detailed';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hiratax-t5-summarizer.hf.space";

const STYLE_MAP: Record<SummaryStyle, string> = {
    'harsh': 'Harsh (Concise)',
    'standard': 'Standard',
    'detailed': 'Detailed (Comprehensive)',
};

export const Summarizer = () => {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [selectedStyle, setSelectedStyle] = useState<SummaryStyle>('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [gradioClient, setGradioClient] = useState<Client | null>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const { addHistoryItem } = useHistory();

    useEffect(() => {
        const initClient = async () => {
            try {
                setModelStatus('loading');
                const client = await Client.connect(API_URL);
                setGradioClient(client);
                setModelStatus('ready');
            } catch (err) {
                console.error("Failed to connect to Gradio space:", err);
                setModelStatus('error');
            }
        };

        initClient();
    }, []);

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            setError("Please enter some text to summarize");
            return;
        }

        if (!gradioClient) {
            setError("Model is still loading. Please wait...");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary("");

        try {
            const result = await gradioClient.predict("/summarize_text", {
                text: inputText,
                style: STYLE_MAP[selectedStyle],
            });

            const data = result.data as string[];
            const generatedSummary = data?.[0] || "";

            if (!generatedSummary) {
                throw new Error("No summary was generated. Please try again.");
            }

            setSummary(generatedSummary);

            addHistoryItem({
                inputText: inputText,
                style: selectedStyle,
                summary: generatedSummary
            });

            setTimeout(() => {
                summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } catch (err) {
            console.error("Summarization error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to generate summary. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
                {modelStatus === 'loading' && (
                    <div className="p-2 md:p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-amber-700 dark:text-amber-400 text-center font-medium text-xs md:text-base">
                                Loading AI Model...
                            </p>
                        </div>
                    </div>
                )}

                {modelStatus === 'error' && (
                    <div className="p-2 md:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400 text-center font-medium text-xs md:text-base">
                            Unable to connect to the summarization service
                        </p>
                    </div>
                )}

                {modelStatus === 'ready' && (
                    <div className="p-2 md:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-700 dark:text-green-400 text-center font-medium text-xs md:text-base">
                            AI Model is ready
                        </p>
                    </div>
                )}

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
                        disabled={isLoading || !inputText.trim() || modelStatus !== 'ready'}
                        className="
                            px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm md:text-lg
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
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </span>
                        ) : (
                            'Generate Summary'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400 text-center text-xs md:text-base">{error}</p>
                    </div>
                )}

                {summary && (
                    <div ref={summaryRef} className="space-y-4 scroll-mt-24 max-w-5xl mx-auto">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
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