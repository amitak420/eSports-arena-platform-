import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse, getStrategicInsight } from '../services/geminiService';
import { SendIcon } from './icons/UIIcons';
import { GAMES } from '../constants';

const SuggestionChip: React.FC<{text: string, onClick: () => void}> = ({text, onClick}) => (
    <button onClick={onClick} className="px-4 py-2 bg-indigo-100/80 text-indigo-700 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-indigo-200/80 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">
        {text}
    </button>
);

const FormLabel: React.FC<{children: React.ReactNode, htmlFor?: string}> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{children}</label>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select {...props} className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 appearance-none text-gray-800 dark:text-white" />
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/50 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" />
);

const StrategyAnalyzer: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<string>(GAMES[0].id);
    const [question, setQuestion] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAnalysis = async () => {
        if (!question.trim()) {
            setError('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis('');

        const gameName = GAMES.find(g => g.id === selectedGame)?.name || 'the selected game';
        const prompt = `Provide a detailed strategic analysis for the game ${gameName}. The user is asking: "${question}"`;

        const result = await getStrategicInsight(prompt);
        setAnalysis(result);
        setIsLoading(false);
    };

    return (
        <div className="page-animation pb-24">
            <div className="glass-effect rounded-2xl p-5">
                <div className="space-y-4">
                    <div>
                        <FormLabel htmlFor="game-select">Select Game</FormLabel>
                        <FormSelect id="game-select" value={selectedGame} onChange={e => setSelectedGame(e.target.value)}>
                            {GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </FormSelect>
                    </div>
                    <div>
                        <FormLabel htmlFor="question-input">Your Question</FormLabel>
                        <FormTextarea
                            id="question-input"
                            rows={4}
                            value={question}
                            onChange={e => {
                                setQuestion(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="e.g., Best team composition for defense on Icebox?"
                        />
                    </div>
                    <button 
                        onClick={handleAnalysis} 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? 'Analyzing...' : 'Get Strategic Advice'}
                    </button>
                </div>
            </div>
            
            {error && <div className="mt-4 text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50 p-3 rounded-lg font-medium">{error}</div>}

            {isLoading && (
                <div className="mt-6 text-center">
                    <div className="flex justify-center items-center space-x-1.5">
                       <span className="w-3 h-3 bg-indigo-400 dark:bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-3 h-3 bg-indigo-400 dark:bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-3 h-3 bg-indigo-400 dark:bg-indigo-500 rounded-full animate-bounce"></span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Our AI expert is crafting a strategy for you...</p>
                </div>
            )}

            {analysis && (
                <div className="mt-6 glass-effect rounded-2xl p-5">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg">AI-Powered Analysis 💡</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 whitespace-pre-wrap leading-relaxed">
                        {analysis}
                    </div>
                </div>
            )}
        </div>
    );
};


const AICoachPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Namaste! Main aapka AI Gaming Coach hun. 🎮\nAsk me anything about BGMI, Free Fire, or Valorant!", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'strategy'>('chat');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
        scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);
  
  const handleSend = async (prompt?: string) => {
    const messageText = prompt || userInput;
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    const botResponseText = await getChatbotResponse(`User is asking in a chat interface. The previous conversation history is not available, so answer based on this new prompt only. User's language seems to be Hinglish, so reply in a similar friendly, Hinglish style. User's question: "${messageText}"`);

    const botMessage: ChatMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const suggestions = [
    "Best BGMI landing spots?",
    "How to improve my aim?",
    "Valorant agent for beginners?"
  ];

  return (
    <div className="p-4 h-full flex flex-col">
        <div className="glass-effect rounded-2xl p-4 mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">AI Gaming Coach 🤖</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Your personal esports expert</p>
        </div>
        
        <div className="flex justify-center mb-4">
            <div className="glass-effect p-1 rounded-full flex space-x-1">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        activeTab === 'chat'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/80'
                    }`}
                >
                    Quick Chat
                </button>
                <button
                    onClick={() => setActiveTab('strategy')}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        activeTab === 'strategy'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/80'
                    }`}
                >
                    Strategy Analysis
                </button>
            </div>
        </div>

        {activeTab === 'chat' ? (
            <>
                <div className="flex-1 overflow-y-auto mb-28">
                    <div className="space-y-4 pr-1">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[80%] shadow-sm rounded-bl-lg">
                                    <div className="flex items-center space-x-1.5">
                                       <span className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                       <span className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                       <span className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef}></div>
                    </div>
                </div>

                <div className="fixed bottom-20 left-0 right-0 p-4 bg-transparent backdrop-blur-sm">
                    {messages.length <= 1 && (
                        <div className="flex gap-2 justify-center mb-3 overflow-x-auto pb-1">
                            {suggestions.map(s => <SuggestionChip key={s} text={s} onClick={() => handleSend(s)} />)}
                        </div>
                    )}
                    <div className="glass-effect rounded-full p-2 flex items-center shadow-lg">
                        <input 
                            type="text" 
                            id="chatInput" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" 
                            placeholder="Ask about strategies, tips..." 
                        />
                        <button onClick={() => handleSend()} className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:bg-indigo-700 transition-colors">
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <StrategyAnalyzer />
        )}
    </div>
  );
};

export default AICoachPage;