'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, GitCommit, GitBranch, Star, Eye, Calendar, ExternalLink } from 'lucide-react';

interface RepoDetails {
    id: number;
    name: string;
    owner: string;
    url: string;
    last_checked: string;
}

interface HistoryPoint {
    stars: number;
    view: number;
    unique_views: number;
    clones: number;
    unique_clone: number;
    timestamp: string;
}

interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    html_url: string;
}

export default function RepoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [repo, setRepo] = useState<RepoDetails | null>(null);
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [commits, setCommits] = useState<Commit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // Fetch Repos to find name/owner
                const resRepos = await fetch('http://127.0.0.1:5000/api/repos');
                const dataRepos = await resRepos.json();
                const foundRepo = dataRepos.repos.find((r: any) => r.id === Number(params.id));

                if (foundRepo) {
                    setRepo(foundRepo);

                    // Fetch History
                    const resHistory = await fetch(`http://127.0.0.1:5000/api/history/${params.id}`);
                    const dataHistory = await resHistory.json();

                    // Transform history for charts (format dates)
                    const formattedHistory = Array.isArray(dataHistory) ? dataHistory.map((h: any) => ({
                        ...h,
                        date: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    })) : [];
                    setHistory(formattedHistory);

                    // Fetch Commits
                    const resCommits = await fetch(`http://127.0.0.1:5000/api/commits/${params.id}`);
                    const dataCommits = await resCommits.json();
                    setCommits(Array.isArray(dataCommits) ? dataCommits : []);
                }
            } catch (error) {
                console.error("Failed to load repo details", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-mono text-zinc-500">Loading neural data...</div>;

    if (!repo) return <div className="min-h-screen flex items-center justify-center font-mono text-zinc-500">Repository node not found.</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-12">
                <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 mb-6 font-mono text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} /> Return to Grid
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-zinc-500 font-mono text-sm mb-1">{repo.owner} /</div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">{repo.name}</h1>
                    </div>
                    <div>
                        <a href={repo.url} target="_blank" className="btn-ghost flex items-center gap-2 px-6 py-3 text-xs uppercase font-mono">
                            View on GitHub <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <section className="glass-card p-6">
                    <div className="section-header !mb-6 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                        <Star size={12} className="text-yellow-500" /> Star Growth
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px' }}
                                    itemStyle={{ color: '#e4e4e7', fontSize: '12px', fontFamily: 'monospace' }}
                                />
                                <Area type="monotone" dataKey="stars" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorStars)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="glass-card p-6">
                    <div className="section-header !mb-6 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                        <Eye size={12} className="text-emerald-500" /> Traffic & Clones
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px' }}
                                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                                <Bar dataKey="view" fill="#10b981" radius={[4, 4, 0, 0]} name="Views" />
                                <Bar dataKey="clones" fill="#ec4899" radius={[4, 4, 0, 0]} name="Clones" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>

            {/* Timeline Section */}
            <section className="glass-card p-8">
                <div className="section-header !mb-8 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                    <GitCommit size={12} className="text-zinc-400" /> Activity Timeline
                </div>

                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-zinc-800"></div>

                    {commits.length === 0 ? (
                        <div className="text-zinc-500 font-mono text-sm pl-12 py-4">No recent activity detected.</div>
                    ) : (
                        commits.map((commit) => (
                            <div key={commit.sha} className="relative flex items-start gap-6 group">
                                <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex flex-shrink-0 items-center justify-center z-10 group-hover:border-indigo-500/50 transition-colors">
                                    <GitCommit size={16} className="text-zinc-500 group-hover:text-indigo-400" />
                                </div>
                                <div className="flex-1 pt-2">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h3 className="text-zinc-200 font-medium text-sm line-clamp-1">{commit.commit.message}</h3>
                                        <span className="text-zinc-500 font-mono text-[10px] whitespace-nowrap">{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                                        <span>{commit.commit.author.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                        <span className="text-zinc-600 truncate max-w-[100px]">{commit.sha.substring(0, 7)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
