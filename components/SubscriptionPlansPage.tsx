import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { SUBSCRIPTION_PLANS } from '../constants';
import { updateUserByUid } from '../services/mockFirebase';
import { BackIcon, CheckIcon } from './icons/UIIcons';

interface SubscriptionPlansPageProps {
  setCurrentPage: (page: Page) => void;
}

const PlanCard: React.FC<{ plan: typeof SUBSCRIPTION_PLANS[0]; onSelect: () => void; isCurrent: boolean }> = ({ plan, onSelect, isCurrent }) => (
  <div className={`glass-effect rounded-2xl p-6 border-2 ${isCurrent ? 'border-brand-primary' : 'border-transparent'}`}>
    <h3 className="text-2xl font-bold text-brand-primary">{plan.name}</h3>
    <p className="text-3xl font-extrabold text-white mt-2">
      ₹{plan.price}<span className="text-base font-medium text-gray-400">/{plan.pricePeriod}</span>
    </p>
    {plan.platformFee !== undefined && (
      <p className="text-yellow-400 font-semibold mt-1">Platform Fee: {plan.platformFee}%</p>
    )}
    <ul className="space-y-2 mt-6 text-gray-300 text-sm">
      {plan.features.map(feat => (
        <li key={feat} className="flex items-start gap-2">
          <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{feat}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      disabled={isCurrent}
      className="w-full mt-8 py-3 rounded-lg font-semibold text-white bg-brand-secondary neon-glow disabled:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isCurrent ? 'Current Plan' : 'Choose Plan'}
    </button>
  </div>
);

const SubscriptionPlansPage: React.FC<SubscriptionPlansPageProps> = ({ setCurrentPage }) => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState(currentUser?.role || 'player');

  const handleSubscribe = (planId: string) => {
    if (!currentUser) return;
    
    const newSubscription = {
      planId: planId,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Mock 1 year
    };
    
    const updatedUser = updateUserByUid(currentUser.uid, { subscription: newSubscription });
    if(updatedUser) {
        setCurrentUser(updatedUser);
        alert(`Successfully subscribed to the ${planId} plan!`);
        setCurrentPage(`${currentUser.role}-dashboard` as Page);
    }
  };

  const relevantPlans = SUBSCRIPTION_PLANS.filter(p => p.forRole === activeTab);

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => setCurrentPage(`${currentUser?.role || 'player'}-dashboard` as Page)} className="p-2 mr-2">
            <BackIcon className="w-6 h-6 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
      </div>

      {/* Role switcher for demo purposes */}
      <div className="flex justify-center mb-6">
          <div className="glass-effect p-1 rounded-full flex space-x-1">
              <button
                  onClick={() => setActiveTab('organizer')}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      activeTab === 'organizer' ? 'bg-brand-primary text-white shadow' : 'text-gray-300'
                  }`}
              >
                  For Organizers
              </button>
              <button
                  onClick={() => setActiveTab('player')}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      activeTab === 'player' ? 'bg-brand-primary text-white shadow' : 'text-gray-300'
                  }`}
              >
                  For Players
              </button>
          </div>
      </div>
      
      <div className="space-y-6">
        {relevantPlans.map(plan => (
          <PlanCard 
            key={plan.id} 
            plan={plan}
            isCurrent={currentUser?.subscription?.planId === plan.id}
            onSelect={() => handleSubscribe(plan.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;