'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ExternalLink, Star, Eye, Calendar, ArrowRight, GitCommit } from 'lucide-react';

interface Repo {
    id: number;
    url: string;
    owner: string;
    name: string;
    last_checked: string | null;
    stars: number;
    views: number;
    clones: number;
    growth: string;
    previous_stars?: number;
}

interface DashboardStats {
    total_repos: number;
    total_stars: number;
    total_views: number;
    total_clones: number;
    repos: Repo[];
    last_updated: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [newRepoUrl, setNewRepoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/dashboard');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncAll = async () => {
        setIsSyncing(true);
        try {
            await fetch('http://127.0.0.1:5000/api/sync', { method: 'POST' });
            await fetchDashboardData();
        } catch (err) {
            console.error("Sync failed", err);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleAddRepo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRepoUrl) return;

        setIsAdding(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/repos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_url: newRepoUrl })
            });

            if (res.ok) {
                setNewRepoUrl('');
                await fetchDashboardData();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to add repository");
            }
        } catch (err) {
            console.error("Error adding repo", err);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteRepo = async (id: number) => {
        if (!confirm("Remove this repository from tracking?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/repos/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchDashboardData();
            }
        } catch (err) {
            console.error("Error deleting repo", err);
        }
    };

    const filteredRepos = stats?.repos.filter(r =>
        r.name.toLowerCase().includes(filter.toLowerCase()) ||
        r.owner.toLowerCase().includes(filter.toLowerCase())
    ) || [];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Navbar Simple */}
            <div className="flex items-center justify-between mb-16">
                <Link href="/" className="font-mono font-bold text-xl flex items-center gap-2">
                    <span className="text-indigo-500">$</span>
                    <span>git_tracker_</span>
                </Link>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleSyncAll}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900 group transition-all ${isSyncing ? 'opacity-50' : 'hover:border-indigo-500/50'}`}
                    >
                        <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] ${isSyncing ? 'animate-pulse' : ''}`}></div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                            {isSyncing ? 'SYNC_IN_PROGRESS' : 'SYNC_ALL_NODES'}
                        </span>
                    </button>
                </div>
            </div>

            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-2">Command Center</h1>
                    <p className="text-zinc-500 font-mono text-sm leading-relaxed">{'// Distributed intelligence for open source growth.'}</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Last Global Sync</div>
                    <div className="text-xs font-mono text-zinc-400">{stats?.last_updated ? new Date(stats.last_updated).toLocaleString() : 'PENDING'}</div>
                </div>
            </header>

            {/* Stats Summary Area */}
            <section className="mb-20">
                <div className="section-header uppercase tracking-widest text-[10px] font-bold">
                    {'// System Statistics'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-8 border-l-4 border-l-indigo-500">
                        <div className="text-zinc-500 text-xs font-mono mb-2 uppercase">Nodes</div>
                        <div className="text-4xl font-bold">{stats?.total_repos || 0}</div>
                    </div>
                    <div className="glass-card p-8">
                        <div className="text-zinc-500 text-xs font-mono mb-2 uppercase">Total Stars</div>
                        <div className="text-4xl font-bold">{stats?.total_stars.toLocaleString() || 0}</div>
                    </div>
                    <div className="glass-card p-8">
                        <div className="text-zinc-500 text-xs font-mono mb-2 uppercase">Total Views</div>
                        <div className="text-4xl font-bold">{stats?.total_views.toLocaleString() || 0}</div>
                    </div>
                    <div className="glass-card p-8">
                        <div className="text-zinc-500 text-xs font-mono mb-2 uppercase">Total Clones</div>
                        <div className="text-4xl font-bold">{stats?.total_clones.toLocaleString() || 0}</div>
                    </div>
                </div>
            </section>

            {/* Connections Area */}
            <section className="mb-20">
                <div className="section-header uppercase tracking-widest text-[10px] font-bold">
                    {'// Establish Uplink'}
                </div>
                <div className="glass-card p-8">
                    <form onSubmit={handleAddRepo} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs">https://github.com/</span>
                            <input
                                type="text"
                                value={newRepoUrl.replace('https://github.com/', '')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val.startsWith('https://github.com/')) {
                                        setNewRepoUrl('https://github.com/' + val);
                                    } else {
                                        setNewRepoUrl(val);
                                    }
                                }}
                                placeholder="owner/repository"
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-36 pr-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="btn-indigo px-8 py-3 h-auto whitespace-nowrap disabled:opacity-50"
                        >
                            {isAdding ? 'CONNECTING...' : 'Add Node'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Repositories List */}
            <section>
                <div className="flex items-center justify-between section-header-wrapper mb-6">
                    <div className="section-header !mb-0 uppercase tracking-widest text-[10px] font-bold">
                        {'// Active Nodes'}
                    </div>
                    <input
                        type="text"
                        placeholder="Filter nodes..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-b border-zinc-800 focus:border-indigo-500 outline-none font-mono text-xs px-2 py-1 w-48 text-right"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-20 font-mono text-zinc-500">Scanning filesystem...</div>
                ) : !stats || stats.repos.length === 0 ? (
                    <div className="glass-card p-20 text-center border-dashed">
                        <p className="text-zinc-500 font-mono text-sm mb-4">NO_NODES_IDENTIFIED</p>
                        <button onClick={() => document.querySelector('input')?.focus()} className="text-indigo-500 font-mono text-sm hover:underline">Establish first connection _</button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredRepos.map(repo => (
                            <div key={repo.id} className="glass-card p-6 flex flex-col md:row md:items-center justify-between group gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded border border-zinc-800 flex items-center justify-center bg-black/40">
                                        <svg className="w-6 h-6 text-zinc-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    </div>
                                    <div>
                                        <Link href={`/dashboard/repos/${repo.id}`} className="hover:underline decoration-indigo-500 underline-offset-4">
                                            <h3 className="font-bold text-xl">{repo.owner} / <span className="text-indigo-400">{repo.name}</span></h3>
                                        </Link>
                                        <div className="flex gap-4 mt-2">
                                            <span className="flex items-center gap-1 text-zinc-500 font-mono text-[10px] uppercase"><Star size={10} /> {repo.stars}</span>
                                            <span className="flex items-center gap-1 text-zinc-500 font-mono text-[10px] uppercase"><Eye size={10} /> {repo.views}</span>
                                            <span className="flex items-center gap-1 text-zinc-500 font-mono text-[10px] uppercase"><GitCommit size={10} /> {repo.clones}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end md:self-auto">
                                    <Link href={`/dashboard/repos/${repo.id}`} className="btn-ghost px-4 py-2 text-xs font-mono uppercase tracking-widest hover:border-indigo-500/50 group flex items-center gap-2">
                                        Details
                                    </Link>
                                    <Link href={`/dashboard/ai-summary?repo_id=${repo.id}`} className="btn-ghost px-6 py-2 text-xs font-mono uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 group flex items-center gap-2">
                                        Recap
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteRepo(repo.id)}
                                        className="text-zinc-800 hover:text-red-500 transition-colors p-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
