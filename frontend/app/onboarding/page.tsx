'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [repoUrl, setRepoUrl] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleNext = async () => {
        if (step === 2) {
            if (!repoUrl) return;
            setIsConnecting(true);
            try {
                const res = await fetch('http://127.0.0.1:5000/api/repos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repo_url: repoUrl })
                });
                if (res.ok) {
                    setStep(3);
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to connect");
                }
            } catch (err) {
                console.error("Connection error", err);
            } finally {
                setIsConnecting(false);
            }
        } else if (step < 3) {
            setStep(step + 1);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-16 opacity-50">
                <div className="font-mono text-[10px] tracking-widest font-bold">INIT_SEQUENCE</div>
                <div className="flex-1 h-[1px] bg-zinc-800"></div>
                <div className="font-mono text-[10px] tracking-widest font-bold">STEP_0{step}/03</div>
            </div>

            <div className="max-w-2xl">
                <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 hidden'}`}>
                    <div className="font-mono text-indigo-500 text-sm mb-4">{'// 01. Welcome'}</div>
                    <h1 className="text-5xl font-bold mb-8 leading-tight">Authorize the agent to track metrics.</h1>
                    <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
                        GitTracker uses public GitHub APIs to capture star counts, views, and clones. No private data is ever stored on our servers.
                    </p>
                    <button onClick={() => setStep(2)} className="btn-indigo px-10 py-4 text-base">
                        Begin Initialization_
                    </button>
                </div>

                <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 hidden'}`}>
                    <div className="font-mono text-indigo-500 text-sm mb-4">{'// 02. Connection'}</div>
                    <h1 className="text-5xl font-bold mb-8 leading-tight">Establish repository uplink.</h1>
                    <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
                        Enter the full GitHub URL of the repository you want to monitor for growth telemetry.
                    </p>

                    <div className="glass-card p-2 mb-12 group focus-within:border-indigo-500/50 transition-all">
                        <input
                            type="text"
                            placeholder="https://github.com/owner/repo"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full bg-transparent p-4 outline-none font-mono text-sm"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="btn-ghost px-8 py-4">Back</button>
                        <button onClick={handleNext} disabled={isConnecting} className="btn-indigo px-10 py-4">
                            {isConnecting ? 'Linking Node...' : 'Connect Repositroy'}
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 hidden'}`}>
                    <div className="font-mono text-indigo-500 text-sm mb-4">{'// 03. Ready'}</div>
                    <h1 className="text-5xl font-bold mb-8 leading-tight">Uplink established successfully.</h1>
                    <p className="text-zinc-500 text-lg mb-12 leading-relaxed">
                        Your repository node is now active in the neural mesh. Initial telemetry analysis is being compiled.
                    </p>

                    <div className="terminal-window mb-12 opacity-80">
                        <div className="terminal-header">
                            <div className="dot dot-red"></div>
                            <div className="dot dot-yellow"></div>
                            <div className="dot dot-green"></div>
                        </div>
                        <div className="terminal-body text-xs py-4">
                            <div>[SYSTEM] Registering node: <span className="text-indigo-400">{repoUrl}</span></div>
                            <div>[SYSTEM] Handshake complete...</div>
                            <div>[SYSTEM] Metrics streaming started...</div>
                            <div className="text-emerald-500">[SYSTEM] Initialization status: SUCCESS</div>
                        </div>
                    </div>

                    <button onClick={() => router.push('/dashboard')} className="btn-indigo px-10 py-4 text-base">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
