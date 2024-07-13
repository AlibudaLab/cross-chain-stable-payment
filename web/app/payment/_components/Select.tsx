import React from 'react';
import clsx from 'clsx';

type SelectProps = {
  id: string;
  value: string;
  onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  required: boolean;
  children: React.ReactNode;
};

export default function Select({
  id,
  value,
  onChange,
  disabled,
  required,
  children,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={clsx([
        'block w-full rounded-lg border border-gray-600 bg-boat-color-gray-900',
        'p-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500',
        'appearance-none', // Remove default styling
        'bg-no-repeat bg-right', // Position the custom arrow
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E")]',
        'bg-[length:1.5em_1.5em]',
        disabled && 'opacity-50 cursor-not-allowed',
      ])}
    >
      {children}
    </select>
  );
}