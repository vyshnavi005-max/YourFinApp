import React from 'react';
import { PulseLoader } from 'react-spinners';
import './Loader.css';

const Loader = ({ size = 12, color = 'var(--primary-color)', speedMultiplier = 0.8 }) => {
  return (
    <div className="loader-container">
      <PulseLoader 
        color={color} 
        size={size} 
        speedMultiplier={speedMultiplier} 
      />
    </div>
  );
};

export default Loader;
