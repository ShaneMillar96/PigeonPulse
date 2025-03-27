import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'icon';
    className?: string;
}

export function Button({
                                   variant = 'primary',
                                   className = '',
                                   children,
                                   ...props
                               }: ButtonProps) {
    const baseStyles = 'transition focus:outline-none';
    const variantStyles =
        variant === 'icon'
            ? ''
            : 'py-2 px-4 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600';

    return (
        <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
            {children}
        </button>
    );
}