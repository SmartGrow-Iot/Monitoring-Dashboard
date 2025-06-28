import React from 'react';

const Toggle = ({ 
  checked, 
  onChange, 
  activeColor = 'bg-primary', 
  disabled = false 
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        toggle-switch
        ${checked ? activeColor : 'bg-neutral-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          toggle-switch-circle
          ${checked ? 'translate-x-5' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default Toggle;
