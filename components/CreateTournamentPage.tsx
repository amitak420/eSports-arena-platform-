import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { GAMES } from '../constants';
import { addTournament } from '../services/mockFirebase';
import { Tournament, Game } from '../types';

interface CreateTournamentPageProps {
  setCurrentPage: (page: Page) => void;
}

const FormRow: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="mb-4">{children}</div>
);

const FormLabel: React.FC<{children: React.ReactNode, htmlFor?: string}> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-gray-300 font-semibold mb-2">{children}</label>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full px-4 py-3 bg-white/5 rounded-xl border border-brand-primary/30 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white placeholder:text-gray-400" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select {...props} className="w-full px-4 py-3 bg-white/5 rounded-xl border border-brand-primary/30 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none text-white" />
);


const CreateTournamentPage: React.FC<CreateTournamentPageProps> = ({ setCurrentPage }) => {
  // FIX: Get current user from context to use their name as organizerName.
  const { currentUser } = useAppContext();
  
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameName = formData.get('game') as string;
    const selectedGame = GAMES.find(g => g.name === gameName);

    if (!selectedGame) {
      alert('Please select a valid game.');
      return;
    }

    if (!currentUser) {
      alert('You must be logged in to create a tournament.');
      return;
    }

    const newTournamentData = {
      // FIX: Add missing properties to satisfy the Tournament type.
      organizerName: currentUser.name,
      status: 'upcoming' as const,
      game: selectedGame,
      name: formData.get('name') as string,
      prizePool: Number(formData.get('prize')),
      entryFee: Number(formData.get('entry')),
      participants: 0, // Starts with 0 participants
      maxParticipants: Number(formData.get('maxTeams')),
      mode: formData.get('size') as 'Solo' | 'Duo' | 'Squad',
      startTime: new Date(formData.get('startTime') as string),
      isRecommended: Math.random() > 0.5, // Randomly feature it
    };

    addTournament(newTournamentData);

    alert('Tournament ban gaya! Jald hi live ho jayega.');
    setCurrentPage('tournaments');
  };

  return (
    <div className="p-4">
        <h2 className="text-white text-3xl font-bold mb-4 px-2">Naya Tournament Banao</h2>
        
        <div className="glass-effect rounded-2xl p-5">
            <form onSubmit={handleCreate}>
                <FormRow>
                    <FormLabel htmlFor="name">Tournament Name</FormLabel>
                    <FormInput name="name" id="name" type="text" placeholder="e.g., BGMI Weekend Warriors" required />
                </FormRow>

                <FormRow>
                    <FormLabel htmlFor="game">Select Game</FormLabel>
                    <FormSelect name="game" id="game" required>
                        {GAMES.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                    </FormSelect>
                </FormRow>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <FormLabel htmlFor="size">Team Size</FormLabel>
                        <FormSelect name="size" id="size" required>
                            <option>Solo</option>
                            <option>Duo</option>
                            <option>Squad</option>
                        </FormSelect>
                    </div>
                    <div>
                        <FormLabel htmlFor="maxTeams">Max Players/Teams</FormLabel>
                        <FormInput name="maxTeams" id="maxTeams" type="number" placeholder="e.g., 100" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <FormLabel htmlFor="entry">Entry Fee (₹)</FormLabel>
                        <FormInput name="entry" id="entry" type="number" placeholder="0 for free" required />
                    </div>
                    <div>
                        <FormLabel htmlFor="prize">Prize Pool (₹)</FormLabel>
                        <FormInput name="prize" id="prize" type="number" placeholder="e.g., 10000" required />
                    </div>
                </div>

                <FormRow>
                    <FormLabel htmlFor="startTime">Start Date & Time</FormLabel>
                    <FormInput name="startTime" id="startTime" type="datetime-local" required />
                </FormRow>

                <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3.5 rounded-xl font-semibold text-lg neon-glow">
                    Banao Tournament 🎮
                </button>
            </form>
        </div>
    </div>
  );
};

export default CreateTournamentPage;
