import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { GAMES } from '../constants';
import { addTournament } from '../services/mockFirebase';
import { BackIcon, DollarSignIcon, TrophyIcon, ShieldCheckIcon } from './icons/UIIcons';

interface CreateTournamentWizardProps {
  setCurrentPage: (page: Page) => void;
}

const StepIndicator: React.FC<{ currentStep: number, totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex justify-between items-center mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <React.Fragment key={i}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i < currentStep ? 'bg-brand-primary text-white' : 'bg-brand-bg/50 border-2 border-brand-primary/30 text-brand-primary'}`}>
          {i + 1}
        </div>
        {i < totalSteps - 1 && <div className={`flex-grow h-0.5 mx-2 ${i < currentStep - 1 ? 'bg-brand-primary' : 'bg-brand-primary/30'}`}></div>}
      </React.Fragment>
    ))}
  </div>
);

const CreateTournamentWizard: React.FC<CreateTournamentWizardProps> = ({ setCurrentPage }) => {
  const { currentUser } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    game: GAMES[0].id,
    mode: 'Solo',
    startTime: '',
    prizePool: 1000,
    entryFee: 10,
    maxParticipants: 100,
    rules: 'Standard esports rules apply. No cheating allowed.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'prizePool' || name === 'entryFee' || name === 'maxParticipants' ? Number(value) : value }));
  };

  const platformFeePercent = currentUser?.subscription?.planId.includes('pro') ? 10 : currentUser?.subscription?.planId.includes('enterprise') ? 5 : 20;
  const platformFee = Math.ceil(formData.entryFee * (platformFeePercent / 100));
  const totalEntry = formData.entryFee + platformFee;
  const estimatedRevenue = (formData.entryFee * formData.maxParticipants) * (platformFeePercent / 100);

  const handleSubmit = () => {
    if (!currentUser) return;
    const selectedGame = GAMES.find(g => g.id === formData.game);
    if (!selectedGame) return;

    addTournament({
      organizerName: currentUser.name,
      game: selectedGame,
      name: formData.name,
      prizePool: formData.prizePool,
      entryFee: formData.entryFee,
      participants: 0,
      maxParticipants: formData.maxParticipants,
      mode: formData.mode as 'Solo' | 'Duo' | 'Squad',
      startTime: new Date(formData.startTime),
      rules: formData.rules,
      status: 'upcoming',
      isRecommended: true
    });
    alert('Tournament created successfully!');
    setCurrentPage('organizer-dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Basic Details
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Tournament Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Game</label>
                <select name="game" value={formData.game} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20 appearance-none">
                  {GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300">Mode</label>
                <select name="mode" value={formData.mode} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20 appearance-none">
                  <option>Solo</option><option>Duo</option><option>Squad</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300">Start Time</label>
              <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
            </div>
          </div>
        );
      case 2: // Financials
        return (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Entry Fee (₹)</label>
                  <input type="number" name="entryFee" value={formData.entryFee} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Prize Pool (₹)</label>
                  <input type="number" name="prizePool" value={formData.prizePool} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
                </div>
            </div>
             <div>
                <label className="text-sm text-gray-300">Slots (Players/Teams)</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
            </div>
             <div className="bg-brand-bg/50 rounded-lg p-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Your Entry Fee</span><span>₹{formData.entryFee}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Platform Fee ({platformFeePercent}%)</span><span>₹{platformFee}</span></div>
                <hr className="border-brand-primary/20"/>
                <div className="flex justify-between font-bold"><span className="text-white">Total Player Entry</span><span className="text-brand-primary">₹{totalEntry}</span></div>
                <hr className="border-brand-primary/20"/>
                <div className="flex justify-between text-green-400"><span >Est. Revenue (Full Lobby)</span><span>₹{estimatedRevenue.toLocaleString()}</span></div>
             </div>
          </div>
        );
      case 3: // Rules & Finalize
        return (
          <div className="space-y-4">
             <div>
                <label className="text-sm text-gray-300">Rules (Optional)</label>
                <textarea name="rules" rows={5} value={formData.rules} onChange={handleInputChange} className="w-full bg-brand-bg/50 p-3 rounded-lg border border-brand-primary/20" />
            </div>
            <div className="bg-brand-bg/50 rounded-lg p-4 mt-4">
                <h4 className="font-bold text-white mb-2">Review Details</h4>
                <p className="text-sm text-gray-300"><strong>Name:</strong> {formData.name}</p>
                <p className="text-sm text-gray-300"><strong>Game:</strong> {GAMES.find(g => g.id === formData.game)?.name}</p>
                <p className="text-sm text-gray-300"><strong>Prize:</strong> ₹{formData.prizePool.toLocaleString()}</p>
                <p className="text-sm text-gray-300"><strong>Entry:</strong> ₹{formData.entryFee}</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const stepTitles = ["Tournament Details", "Fees & Prizes", "Review & Publish"];

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => setCurrentPage('organizer-dashboard')} className="p-2 mr-2">
            <BackIcon className="w-6 h-6 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-white">Create Tournament</h1>
      </div>
      
      <div className="glass-effect rounded-2xl p-5">
        <StepIndicator currentStep={step} totalSteps={3} />
        <h2 className="text-xl font-semibold text-center text-brand-primary mb-6">{stepTitles[step-1]}</h2>
        
        <div className="min-h-[250px]">
         {renderStep()}
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="bg-brand-bg/50 text-white py-2 px-6 rounded-lg disabled:opacity-50">Back</button>
          {step < 3 ? (
            <button onClick={() => setStep(s => Math.min(3, s + 1))} className="bg-brand-secondary text-white py-2 px-6 rounded-lg neon-glow">Next</button>
          ) : (
            <button onClick={handleSubmit} className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-6 rounded-lg neon-glow">Publish</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentWizard;
