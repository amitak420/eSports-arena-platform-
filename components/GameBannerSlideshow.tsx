import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '../types';

interface GameBannerSlideshowProps {
  games: Game[];
}

const GameBannerSlideshow: React.FC<GameBannerSlideshowProps> = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === games.length - 1 ? 0 : prevIndex + 1));
  }, [games.length]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-[16/8] overflow-hidden rounded-2xl shadow-lg">
      {/* Slides container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {games.map(game => (
          <div key={game.id} className="w-full flex-shrink-0 h-full relative">
            <img src={game.bannerUrl} alt={`${game.name} banner`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-2xl font-bold drop-shadow-md">{game.name}</h3>
                <p className="text-white/80 text-sm drop-shadow-md">Join the Action!</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBannerSlideshow;
