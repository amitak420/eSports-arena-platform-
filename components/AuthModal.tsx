import React, { useState } from 'react';
import { GoogleIcon } from './icons/UIIcons';

interface AuthModalProps {
    onClose: () => void;
    onAuth: (user: { name: string; role: 'player' | 'organizer' | 'admin' }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuth }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'player' | 'organizer' | 'admin'>('player');

    const handleAuth = () => {
        if (name.trim()) {
            // Special case for demoing admin
            if (name.trim().toLowerCase() === 'admin') {
                onAuth({ name: 'Admin', role: 'admin' });
                return;
            }
            onAuth({ name: name.trim(), role });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-effect rounded-2xl p-6 w-full max-w-sm relative animate-fadeIn">
                 <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold">&times;</button>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Join the Arena!</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Choose your role to get started.</p>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-primary/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white placeholder:text-gray-400" 
                        placeholder="Enter your gaming name"
                    />
                    
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-brand-primary/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white appearance-none"
                    >
                        <option value="player" style={{backgroundColor: '#0c0a24'}}>I'm a Player</option>
                        <option value="organizer" style={{backgroundColor: '#0c0a24'}}>I'm an Organizer</option>
                         <option value="admin" style={{backgroundColor: '#0c0a24'}}>I'm an Admin (Demo)</option>
                    </select>
                    
                    <button onClick={handleAuth} className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-xl font-semibold neon-glow">
                        Let's Go
                    </button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-primary/20"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-brand-bg text-gray-400">Or</span></div>
                    </div>
                    
                    <button className="w-full glass-effect py-3 rounded-xl font-semibold text-gray-200 flex items-center justify-center border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
                        <GoogleIcon className="w-5 h-5 mr-2" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
