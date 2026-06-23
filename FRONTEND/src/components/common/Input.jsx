import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 text-left w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#6B6B6B] tracking-wider uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-[#FCFCFB] border ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#E7E7E4] focus:ring-zinc-400 focus:border-zinc-400'
        } rounded-xl text-[#111111] placeholder-zinc-400 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium tracking-tight">{error}</span>}
    </div>
  );
}
