import React from 'react';

const DeviceMockup = ({ type, image }) => {
    if (type === 'laptop') {
        return (
            <div className="relative mx-auto w-full max-w-[600px] perspective-1000">
                <div className="relative transition-transform duration-500 transform-gpu rotate-y-[-15deg] rotate-x-[5deg] hover:rotate-0 group">
                    {/* Laptop Screen */}
                    <div className="relative bg-zinc-800 rounded-t-xl p-2 pb-0 shadow-2xl border-x border-t border-zinc-700">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-black">
                            <img
                                src={image}
                                className="w-full h-full object-cover"
                                alt="Laptop Screenshot"
                            />
                            {/* Screen Glare */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    {/* Laptop Base */}
                    <div className="relative height-2 bg-zinc-700 rounded-b-xl shadow-xl border-x border-b border-zinc-600">
                        <div className="h-2 w-full bg-zinc-800 rounded-b-xl flex justify-center">
                            <div className="w-20 h-1 bg-zinc-900/50 rounded-full mt-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-auto w-[280px] perspective-1000">
            <div className="relative transition-transform duration-500 transform-gpu rotate-y-[15deg] rotate-x-[5deg] hover:rotate-0 group">
                {/* Phone Frame */}
                <div className="relative bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border-[3px] border-zinc-700 h-[560px]">
                    {/* Internal Screen */}
                    <div className="relative w-full h-full overflow-hidden rounded-[2.2rem] bg-black">
                        <img
                            src={image}
                            className="w-full h-full object-cover"
                            alt="Phone Screenshot"
                        />

                        {/* Dynamic Island */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full flex items-center justify-end px-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        </div>

                        {/* Screen Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Side Buttons */}
                    <div className="absolute left-[-4px] top-24 w-1 h-12 bg-zinc-700 rounded-l" />
                    <div className="absolute left-[-4px] top-40 w-1 h-12 bg-zinc-700 rounded-l" />
                    <div className="absolute right-[-4px] top-32 w-1 h-16 bg-zinc-700 rounded-r" />
                </div>
            </div>
        </div>
    );
};

export default DeviceMockup;
