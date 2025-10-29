import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-10 border-t border-brand-primary/10">
      <div className="container mx-auto px-4 text-center text-gray-400 text-xs">
        <p>© 2025 Esports Arena India — Skill-based tournaments only. No betting or gambling.</p>
        <p className="mt-1">All game titles, logos, and trademarks are property of their respective owners.</p>
      </div>
    </footer>
  );
};

export default Footer;
