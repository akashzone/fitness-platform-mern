import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="glass-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/5 flex flex-col h-full animate-pulse">
            <div className="relative aspect-[16/11] bg-white/5 overflow-hidden">
                <div className="absolute top-2 left-2 md:top-6 md:left-6 w-20 h-8 md:w-32 md:h-12 bg-white/5 rounded-lg md:rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-page/40 to-transparent" />
            </div>

            <div className="p-3 md:p-8 flex flex-col items-center text-center flex-grow space-y-4">
                <div className="w-24 h-4 bg-white/5 rounded-full" />
                <div className="w-full h-8 bg-white/10 rounded-xl" />
                <div className="w-5/6 h-4 bg-white/5 rounded-full" />
                <div className="w-4/6 h-4 bg-white/5 rounded-full" />

                <div className="mt-auto w-full grid grid-cols-2 gap-2 md:gap-4 pt-4">
                    <div className="h-10 md:h-14 bg-white/5 rounded-lg md:rounded-xl" />
                    <div className="h-10 md:h-14 bg-white/10 rounded-lg md:rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
