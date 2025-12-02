import { useState, useEffect } from 'react';

export interface HistoryItem {
    id: string;
    inputText: string;
    style: 'harsh' | 'standard' | 'detailed';
    summary: string;
    date: string;
}

const STORAGE_KEY = 'summarizer_history';
const MAX_ITEMS = 5;

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const loadHistory = () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setHistory(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse history", e);
                }
            }
        };

        loadHistory();

        window.addEventListener('history-updated', loadHistory);
        return () => window.removeEventListener('history-updated', loadHistory);
    }, []);

    const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'date'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        };

        const stored = localStorage.getItem(STORAGE_KEY);
        let currentHistory: HistoryItem[] = [];
        if (stored) {
            try {
                currentHistory = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }

        const newHistory = [newItem, ...currentHistory].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

        window.dispatchEvent(new Event('history-updated'));

        setHistory(newHistory);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return { history, addHistoryItem, clearHistory };
};