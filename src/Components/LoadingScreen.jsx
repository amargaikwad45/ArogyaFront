import React, { useState, useEffect } from 'react';
import logo from '../assets/Logo.png'
import logo_sub from '../assets/Logo_sub.png';

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);

    // Effect to simulate loading progress for the bar
    useEffect(() => {
        const timer = setTimeout(() => setProgress(100), 100); // Start loading bar animation
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#25A55F] to-[#56ab2f] text-white p-4">
            <div className="text-center flex flex-col items-center justify-center">
                {/* Simple SVG Logo: A plus sign inside a leaf */}
                <img className='' src={logo_sub} alt="" />
               <img src={logo} alt="" />
            </div>
            <div className="w-full max-w-xs mt-16">
                <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div
                        className="bg-white h-2.5 rounded-full transition-all duration-[2500ms] ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}