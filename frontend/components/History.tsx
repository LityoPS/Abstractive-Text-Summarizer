'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/History-Components/table';
import { Badge } from '@/components/History-Components/badge';
import { useHistory, HistoryItem } from '@/hooks/useHistory';
import { Container } from './Container';
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Tooltip } from './Tooltip';

function getStyleBadge(style: HistoryItem['style']) {
  switch (style) {
    case 'detailed':
      return (
        <Badge
          variant="outline"
          className="border-0 bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        >
          Detailed
        </Badge>
      );
    case 'standard':
      return (
        <Badge
          variant="outline"
          className="border-0 bg-yellow-500/15 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
        >
          Standard
        </Badge>
      );
    case 'harsh':
      return (
        <Badge
          variant="outline"
          className="border-0 bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        >
          Harsh
        </Badge>
      );
    default:
      return null;
  }
}

export default function History() {
  const { history } = useHistory();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'summary'>('summary');
  const [copied, setCopied] = useState(false);

  const toggleRow = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
      setActiveTab('summary');
    }
  };

  const handleCopy = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container>
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1c]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-800 hover:bg-transparent">
              <TableHead className="h-14 px-4 font-medium text-gray-900 dark:text-gray-200">Input Text</TableHead>
              <TableHead className="h-14 px-4 font-medium text-gray-900 dark:text-gray-200">Style</TableHead>
              <TableHead className="h-14 px-4 font-medium text-gray-900 dark:text-gray-200">Summary</TableHead>
              <TableHead className="h-14 px-4 text-right font-medium text-gray-900 dark:text-gray-200">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length > 0 ? (
              history.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow
                    onClick={() => toggleRow(item.id)}
                    className={`
                      border-b border-gray-200 dark:border-gray-800 
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 
                      cursor-pointer
                      ${expandedRowId === item.id ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                    `}
                  >
                    <TableCell className="h-12 px-4 font-medium text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {item.inputText}
                    </TableCell>
                    <TableCell className="h-14 px-4">
                      {getStyleBadge(item.style)}
                    </TableCell>
                    <TableCell className="h-12 px-4 font-medium text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {item.summary}
                    </TableCell>
                    <TableCell className="h-14 px-4 text-right text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </TableCell>
                  </TableRow>
                  {expandedRowId === item.id && (
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <TableCell colSpan={4} className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-center">
                            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTab('input'); }}
                                className={`
                                  w-32 py-1.5 text-xs font-medium rounded-md
                                  ${activeTab === 'input'
                                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
                                `}
                              >
                                Input Text
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTab('summary'); }}
                                className={`
                                  w-32 py-1.5 text-xs font-medium rounded-md
                                  ${activeTab === 'summary'
                                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
                                `}
                              >
                                Summary
                              </button>
                            </div>
                          </div>

                          <div className="relative">
                            <textarea
                              readOnly
                              value={activeTab === 'summary' ? item.summary : item.inputText}
                              className="
                                w-full h-48 p-4 pr-14 rounded-lg
                                bg-white dark:bg-[#1c1c1c]
                                border border-gray-200 dark:border-gray-700
                                text-gray-900 dark:text-gray-100
                                focus:outline-none resize-none
                                font-normal text-sm leading-relaxed
                              "
                            />
                            <div className="absolute top-3 right-3">
                              <Tooltip content="Copy to clipboard" side="left">
                                <button
                                  onClick={(e) => handleCopy(activeTab === 'summary' ? item.summary : item.inputText, e)}
                                  className="
                                    p-2 rounded-lg
                                    bg-gray-100 dark:bg-gray-800
                                    hover:bg-gray-200 dark:hover:bg-gray-700
                                    text-gray-600 dark:text-gray-300
                                  "
                                >
                                  {copied ? (
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <ClipboardDocumentIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  No history found. Start summarizing!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}