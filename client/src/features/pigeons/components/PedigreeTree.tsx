import React from 'react';
import { PedigreeNodeType, PedigreeNode} from '../';

interface PedigreeTreeProps {
    pedigree: PedigreeNodeType;
}

export function PedigreeTree({ pedigree }: PedigreeTreeProps) {
    return (
        <div className="relative w-full overflow-x-auto">
            {/* Scrollable Container */}
            <div className="flex justify-center min-w-fit">
                <div className="inline-block p-6">
                    <div className="flex justify-center transform scale-75 md:scale-100 origin-center">
                        <PedigreeNode node={pedigree} />
                    </div>
                </div>
            </div>
        </div>
    );
}