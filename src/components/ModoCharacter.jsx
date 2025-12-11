import React from 'react';

const ModoCharacter = ({ state }) => {
  const getImagePath = () => {
    switch (state) {
      case 'eating': return '/img/senang.jpg';
      case 'angry': return '/img/marah.jpg';
      case 'full': return '/img/mati.jpg';
      case 'happy': return '/img/happy.jpg';
      default: return '/img/idle.jpg';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'eating': return 'animate-bounce';
      case 'angry': return 'animate-pulse'; 
      case 'full': return 'opacity-75';
      default: return '';
    }
  };

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 transition-all duration-300">
      <div className={`w-full h-full flex items-center justify-center shadow-2xl border-4 border-black rounded-full overflow-hidden ${getAnimation()}`}>
        <img 
          src={getImagePath()} 
          alt="Modo Character" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
        MODO
      </div>
    </div>
  );
};

export default ModoCharacter;