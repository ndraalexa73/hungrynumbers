import React from 'react';

const NumberCard = ({ value, isSelected, onClick, disabled }) => (
  <button
    onClick={disabled ? null : onClick}
    disabled={disabled}
    className={`
      w-14 h-16 md:w-16 md:h-20 
      flex items-center justify-center 
      text-2xl md:text-3xl font-bold rounded-lg 
      border-b-4 transition-all transform select-none
      ${isSelected 
        ? 'bg-yellow-300 border-yellow-600 text-yellow-900 -translate-y-2 ring-2 ring-yellow-400' 
        : 'bg-white border-gray-300 text-gray-700 hover:-translate-y-1'
      }
      ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}
    `}
  >
    {value}
  </button>
);

export default NumberCard;