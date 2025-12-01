import { NextRequest, NextResponse } from 'next/server';

// Hugging Face Inference API configuration
// Get your API token from: https://huggingface.co/settings/tokens
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const HF_MODEL = process.env.HUGGINGFACE_MODEL || 't5-small';

// Style-based generation parameters
const STYLE_PARAMS = {
    harsh: { max_length: 50, min_length: 20 },
    balanced: { max_length: 100, min_length: 40 },
    detailed: { max_length: 200, min_length: 80 },
};

interface HuggingFaceResponse {
    summary_text?: string;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, summary_style } = body;

        if (!text || !summary_style) {
            return NextResponse.json(
                { error: 'Missing required fields: text and summary_style' },
                { status: 400 }
            );
        }

        if (!HF_API_TOKEN) {
            return NextResponse.json(
                { error: 'Hugging Face API token not configured. Please set HUGGINGFACE_API_TOKEN environment variable.' },
                { status: 500 }
            );
        }

        const style = summary_style.toLowerCase();
        if (!STYLE_PARAMS[style as keyof typeof STYLE_PARAMS]) {
            return NextResponse.json(
                { error: 'Invalid summary style. Use: harsh, balanced, or detailed' },
                { status: 400 }
            );
        }

        const params = STYLE_PARAMS[style as keyof typeof STYLE_PARAMS];

        // Call Hugging Face Inference API
        const hfResponse = await fetch(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: {
                        max_length: params.max_length,
                        min_length: params.min_length,
                        do_sample: false,
                        num_beams: 4,
                        length_penalty: 2.0,
                        early_stopping: true,
                    },
                }),
                signal: AbortSignal.timeout(30000), // 30 second timeout
            }
        );

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error('HF API Error:', errorText);

            // Handle model loading (cold start)
            if (hfResponse.status === 503) {
                return NextResponse.json(
                    { error: 'Model is loading. Please try again in a few seconds.' },
                    { status: 503 }
                );
            }

            // Return specific error from HF
            return NextResponse.json(
                { error: `Hugging Face API Error: ${errorText}` },
                { status: hfResponse.status }
            );
        }

        const hfData = await hfResponse.json() as HuggingFaceResponse[] | HuggingFaceResponse;

        // Handle response format
        let summary = '';
        if (Array.isArray(hfData) && hfData.length > 0) {
            summary = hfData[0].summary_text || '';
        } else if (typeof hfData === 'object' && 'summary_text' in hfData) {
            summary = hfData.summary_text || '';
        }

        if (!summary) {
            return NextResponse.json(
                { error: 'No summary generated. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            summary,
            style,
        });

    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Request timeout. The summarization is taking too long.' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: 'An error occurred while generating the summary. Please try again.' },
            { status: 500 }
        );
    }
}
