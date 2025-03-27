import React from 'react';
import { PedigreeNode as PedigreeNodeType } from '../';

interface PedigreeNodeProps {
    node: PedigreeNodeType;
    level?: number;
    label?: string;
}

export function PedigreeNode({ node, level = 0, label = 'Pigeon' }: PedigreeNodeProps) {
    const hasChildren = node.father || node.mother;

    return (
        <div className="relative flex flex-row items-center">
            {/* Pigeon Card */}
            <div
                className={`border rounded-lg shadow-md p-3 md:p-4 w-36 md:w-48 text-center ${
                    node.sex === 'Male' ? 'bg-blue-50 border-blue-300' : 'bg-pink-50 border-pink-300'
                }`}
            >
                <p className="text-[10px] md:text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-bold text-xs md:text-sm">{node.ringNumber}</p>
                <p className="text-xs md:text-sm">{node.color || 'Unknown'}</p>
            </div>

            {/* Connector Lines and Children */}
            {hasChildren && (
                <div className="relative ml-2 md:ml-4 h-full flex flex-col justify-center">
                    {/* Horizontal Line to Children */}
                    <div className="absolute top-1/2 left-0 w-2 md:w-4 h-px bg-gray-300"></div>

                    <div className="flex flex-col space-y-4 md:space-y-8 relative">
                        {/* Vertical Line Connecting Children */}
                        <div className="absolute top-1/4 left-2 md:left-4 w-px h-1/2 bg-gray-300"></div>

                        <div className="relative flex-1">
                            {node.father && <PedigreeNode node={node.father} level={level + 1} label="Father" />}
                            {/* Horizontal Line to Father */}
                            {node.father && (
                                <div className="absolute top-1/2 left-[-8px] md:left-[-16px] w-2 md:w-4 h-px bg-gray-300"></div>
                            )}
                        </div>

                        <div className="relative flex-1">
                            {node.mother && <PedigreeNode node={node.mother} level={level + 1} label="Mother" />}
                            {/* Horizontal Line to Mother */}
                            {node.mother && (
                                <div className="absolute top-1/2 left-[-8px] md:left-[-16px] w-2 md:w-4 h-px bg-gray-300"></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}