import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './icons/UIIcons';
import { auth, googleProvider } from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, ConfirmationResult, User as FirebaseUser } from 'firebase/auth';


interface AuthModalProps {
    onClose: () => void;
    onAuth: (user: { name: string; role: 'player' | 'organizer' | 'admin' }) => void;
    onFirebaseAuthSuccess: (user: FirebaseUser) => void;
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuth, onFirebaseAuthSuccess }) => {
    const [step, setStep] = useState<'options' | 'phone' | 'otp' | 'demo'>('options');

    // Demo login state
    const [name, setName] = useState('');
    const [role, setRole] = useState<'player' | 'organizer' | 'admin'>('player');

    // Phone auth state
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (step === 'phone' && !window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {},
            });
            window.recaptchaVerifier.render().catch(err => {
                console.error("Recaptcha render error", err);
                setError("Could not initialize verification. Please refresh and try again.");
            });
        }
    }, [step]);
    
    const handleSendOtp = async () => {
        setError('');
        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }
        setLoading(true);
        if (!window.recaptchaVerifier) {
            setError("Verification service not ready. Please wait a moment.");
            setLoading(false);
            return;
        }
        try {
            const formattedPhoneNumber = `+91${phoneNumber}`;
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
            window.confirmationResult = confirmationResult;
            setLoading(false);
            setStep('otp');
        } catch (err: any) {
            console.error("Error sending OTP", err);
            setError("Failed to send OTP. Too many requests? Please check the number and try again later.");
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        if (!otp || !/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setLoading(true);
        if (!window.confirmationResult) {
             setError("Verification session expired. Please go back and try again.");
             setLoading(false);
             return;
        }
        try {
            const result = await window.confirmationResult.confirm(otp);
            setLoading(false);
            onFirebaseAuthSuccess(result.user);
        } catch (err: any) {
            console.error("Error verifying OTP", err);
            setError("Invalid OTP. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onFirebaseAuthSuccess(result.user);
        } catch (error: any) {
            console.error("Google Sign-In Error", error);
            setError("Could not sign in with Google. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoAuth = () => {
        if (name.trim()) {
            if (name.trim().toLowerCase() === 'admin') {
                onAuth({ name: 'Admin', role: 'admin' });
                return;
            }
            onAuth({ name: name.trim(), role });
        }
    };

    const renderContent = () => {
        switch(step) {
            case 'phone':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Enter Phone Number</h2>
                        <p className="text-center text-sm text-gray-300 mb-6">We'll send you a confirmation code.</p>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">+91</span>
                           <input 
                                type="tel" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-primary/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white placeholder:text-gray-400" 
                                placeholder="98765 43210"
                                maxLength={10}
                            />
                        </div>
                        <button onClick={handleSendOtp} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-xl font-semibold neon-glow disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                        <button onClick={() => setStep('options')} className="w-full mt-2 text-center text-xs text-gray-400 hover:underline">
                            Back to login options
                        </button>
                    </>
                );
            case 'otp':
                return (
                     <>
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Verify OTP</h2>
                        <p className="text-center text-sm text-gray-300 mb-6">Enter the 6-digit code sent to +91 {phoneNumber}.</p>
                        <input 
                            type="tel" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 text-center tracking-[1em] text-2xl rounded-xl border border-brand-primary/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white placeholder:text-gray-400" 
                            placeholder="------"
                            maxLength={6}
                        />
                        <button onClick={handleVerifyOtp} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-xl font-semibold neon-glow disabled:opacity-50">
                           {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                        <button onClick={() => setStep('phone')} className="w-full mt-2 text-center text-xs text-gray-400 hover:underline">
                           Entered wrong number?
                        </button>
                    </>
                );
            case 'demo':
                 return (
                    <>
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Demo Login</h2>
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
                            className="w-full mt-4 px-4 py-3 rounded-xl border border-brand-primary/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white appearance-none"
                        >
                            <option value="player" style={{backgroundColor: '#0c0a24'}}>I'm a Player</option>
                            <option value="organizer" style={{backgroundColor: '#0c0a24'}}>I'm an Organizer</option>
                            <option value="admin" style={{backgroundColor: '#0c0a24'}}>I'm an Admin (Demo)</option>
                        </select>
                        <button onClick={handleDemoAuth} className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-xl font-semibold neon-glow">
                            Let's Go
                        </button>
                         <button onClick={() => setStep('options')} className="w-full mt-2 text-center text-xs text-gray-400 hover:underline">
                            Back to login options
                        </button>
                    </>
                );
            case 'options':
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Join the Arena!</h2>
                        <p className="text-sm text-center text-gray-300 mb-6">Sign in to start competing.</p>
                        <div className="space-y-4">
                            <button onClick={() => setStep('phone')} className="w-full glass-effect py-3 rounded-xl font-semibold text-gray-200 border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
                                Sign in with Phone
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-primary/20"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-brand-bg text-gray-400">Or</span></div>
                            </div>
                            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full glass-effect py-3 rounded-xl font-semibold text-gray-200 flex items-center justify-center border-brand-primary/20 hover:border-brand-primary/40 transition-colors disabled:opacity-50">
                                <GoogleIcon className="w-5 h-5 mr-2" />
                                {loading ? 'Signing in...' : 'Sign in with Google'}
                            </button>
                        </div>
                        <div className="text-center mt-6">
                            <button onClick={() => setStep('demo')} className="text-xs text-gray-500 hover:underline">
                                Use Demo Login
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-effect rounded-2xl p-6 w-full max-w-sm relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold">&times;</button>
                <div id="recaptcha-container"></div>
                {error && <p className="bg-red-500/20 text-red-300 text-xs text-center p-2 rounded-lg mb-4">{error}</p>}
                {renderContent()}
            </div>
        </div>
    );
};

export default AuthModal;