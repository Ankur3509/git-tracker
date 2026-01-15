'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AISummaryContent() {
    const searchParams = useSearchParams();
    const repoId = searchParams.get('repo_id');

    const [repo, setRepo] = useState<any>(null);
    const [platform, setPlatform] = useState<'linkedin' | 'x'>('linkedin');
    const [isGenerating, setIsGenerating] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (repoId) {
            fetchRepoDetails();
        }
    }, [repoId]);

    const fetchRepoDetails = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/repos`);
            const data = await res.json();
            const found = data.repos.find((r: any) => r.id === parseInt(repoId!));
            setRepo(found);
            if (found) {
                // Initial generation
                handleGenerate(found.id);
            }
        } catch (err) {
            console.error("Failed to fetch repo", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async (id: number) => {
        setIsGenerating(true);
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/summary/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ social_type: platform })
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (err) {
            console.error("Failed to generate summary", err);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (repo && !isLoading) {
            handleGenerate(repo.id);
        }
    }, [platform]);

    if (!repoId) return <div className="text-center py-20 font-mono">ERROR: NO_REPO_ID_SPECIFIED</div>;
    if (isLoading) return <div className="text-center py-20 font-mono">INITIALIZING_NEURAL_UPLINK...</div>;
    if (!repo) return <div className="text-center py-20 font-mono text-red-500">NODE_NOT_FOUND: {repoId}</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Navbar Simple */}
            <div className="flex items-center justify-between mb-16">
                <Link href="/dashboard" className="font-mono font-bold text-xl flex items-center gap-2 group">
                    <span className="text-zinc-500 group-hover:text-indigo-500 transition-colors">{'<'}</span>
                    <span>go_back_</span>
                </Link>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    NODE: {repo.owner}/{repo.name}
                </div>
            </div>

            <header className="mb-16">
                <div className="font-mono text-indigo-500 text-sm mb-4">{'// Neural Synthesis Engine'}</div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Growth Recap</h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                    Transforming raw repository telemetry into human-readable growth vectors using llama-3.1-8b-instant.
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Configuration side */}
                <div className="lg:col-span-4 space-y-8">
                    <section>
                        <div className="section-header uppercase tracking-widest text-[10px] font-bold">
                            {'// Parameters'}
                        </div>
                        <div className="glass-card p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] text-zinc-500 font-mono mb-3 uppercase font-bold tracking-widest">Target Platform</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPlatform('linkedin')}
                                        className={`px-4 py-2 rounded font-mono text-xs border transition-all ${platform === 'linkedin' ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                    >
                                        LINKEDIN
                                    </button>
                                    <button
                                        onClick={() => setPlatform('x')}
                                        className={`px-4 py-2 rounded font-mono text-xs border transition-all ${platform === 'x' ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                    >
                                        X_COM
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => handleGenerate(repo.id)}
                                disabled={isGenerating}
                                className="w-full btn-indigo justify-center py-3 text-sm font-mono tracking-widest uppercase disabled:opacity-50"
                            >
                                {isGenerating ? 'RUNNING...' : 'Force Regenerate'}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Output side */}
                <div className="lg:col-span-8 space-y-8">
                    <section>
                        <div className="section-header uppercase tracking-widest text-[10px] font-bold">
                            {'// Neural Analysis'}
                        </div>
                        <div className="terminal-window bg-black/80 backdrop-blur">
                            <div className="terminal-header">
                                <div className="dot dot-red"></div>
                                <div className="dot dot-yellow"></div>
                                <div className="dot dot-green"></div>
                                <span className="ml-4 text-[10px] text-zinc-500 font-mono">analysis_stream.log</span>
                            </div>
                            <div className="terminal-body min-h-[150px]">
                                {isGenerating ? (
                                    <div className="text-zinc-600 animate-pulse">Running inference on Llama-3.1-8B...</div>
                                ) : analysis ? (
                                    <div className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {analysis.summary}
                                    </div>
                                ) : (
                                    <div className="text-zinc-700">Awaiting stream...</div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="section-header uppercase tracking-widest text-[10px] font-bold">
                            {'// Generated Payload'}
                        </div>
                        <div className="glass-card p-8 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => navigator.clipboard.writeText(analysis?.post || '')}
                                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
                                >
                                    [COPY]
                                </button>
                            </div>
                            {isGenerating ? (
                                <div className="h-24 flex items-center justify-center font-mono text-zinc-800 tracking-tighter">RECOMPILING_SOCIAL_GRAPH...</div>
                            ) : analysis ? (
                                <div className="text-zinc-400 font-mono text-sm leading-relaxed whitespace-pre-wrap italic">
                                    "{analysis.post}"
                                </div>
                            ) : (
                                <div className="text-zinc-800 font-mono text-sm">NO_PAYLOAD_READY</div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function AISummary() {
    return (
        <Suspense fallback={<div className="text-center py-20 font-mono">BOOTING_CORE_SYSTEMS...</div>}>
            <AISummaryContent />
        </Suspense>
    );
}
