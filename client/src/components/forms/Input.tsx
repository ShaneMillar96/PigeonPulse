import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    as?: 'input' | 'select';
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode; // For select options
}

export function Input({
                                  as = 'input',
                                  className = '',
                                  icon,
                                  children,
                                  ...props
                              }: InputProps) {
    const Component = as === 'select' ? 'select' : 'input';

    return (
        <div className="relative">
            <Component
                className={`pr-10 ${className}`}
                {...props}
            >
                {children}
            </Component>
            {icon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                </div>
            )}
        </div>
    );
}