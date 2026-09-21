import React, { useState, useEffect, useRef } from 'react';
import {
    Sparkles,
    Heart,
    Baby,
    Volume2,
    VolumeX,
    ChevronRight,
    ChevronLeft,
    Play,
    Pause,
    RotateCcw,
    Lock,
    CheckCircle2,
    AlertCircle,
    PartyPopper,
    Smile
} from 'lucide-react';

const TAGALOG_JOKES = [
    "Yung akala mo si baby ang naglilihi, 'yun pala si Mommy lang talaga ang gustong kumain ng manggang hilaw ng 2 AM.",
    "9 months na pregnancy, pero pakiramdam ni Daddy 9 years siyang nag-driver at errand boy.",
    "Pumunta ng mall para bumili ng damit ni Mommy at Daddy, umuwing may 15 sets ng cute baby socks at walang natira sa wallet.",
    "Parenthood: yung makatulog ka lang ng dalawang oras, feeling mo nag-out of town ka na.",
    "Ang hirap pumili ng pangalan ni baby—dapat tunog CEO sa board room, pero madaling isigaw 'pag nagtatapon na ng pagkain.",
    "Magbasa ka man ng 100 parenting books, balewala rin lahat 'yan kapag nag-concert na si baby ng hatinggabi.",
    "Sabi nila \"sleep when the baby sleeps.\" Paano kung ang sched ni baby ay gising magdamag?",
    "Wala pa man si baby, mas mataas na ang authority niya sa bahay kesa kay Daddy.",
    "Excited na sina Lolo at Lola! Ready na silang i-spoil si baby at pagalitan ang parents kapag sinaway ang apo."
];

const HYPE_MESSAGES = [
    { text: "is it a boy?", bg: "#a2d2ff", textColor: "#0f2b5c", badge: "BOY OR GIRL?" },
    { text: "is it a girl?", bg: "#ffafcc", textColor: "#5c0f2b", badge: "BOY OR GIRL?" },
    { text: "what is your take?", bg: "#fcf6bd", textColor: "#4d4100", badge: "WHAT DO YOU THINK?" },
    { text: "raise your hand if you vote for a girl 🙋‍♀️", bg: "#ffafcc", textColor: "#5c0f2b", badge: "TEAM GIRL VOTE" },
    { text: "raise your hand if you vote for a boy 🙋‍♂️", bg: "#a2d2ff", textColor: "#0f2b5c", badge: "TEAM BOY VOTE" },
    { text: "blink your eyes 10 times if you really want a girl 👁️✨", bg: "#ffafcc", textColor: "#5c0f2b", badge: "TEAM GIRL CHALLENGE" },
    { text: "nod 10 times if you really want a boy 🙇‍♂️✨", bg: "#a2d2ff", textColor: "#0f2b5c", badge: "TEAM BOY CHALLENGE" },
    { text: 'again', bg: "#fcf6bd", textColor: "#4d4100", badge: "LOUDER!" },
    { text: 'do 3 jumping jacks if you really want a girl', bg: "#ffafcc", textColor: "#5c0f2b", badge: "TEAM GIRL CHALLENGE" },
    { text: 'do 3 push ups if you really want a boy', bg: "#a2d2ff", textColor: "#0f2b5c", badge: "TEAM BOY CHALLENGE" },
    { text: "again again again! 🙌", bg: "#fcf6bd", textColor: "#4d4100", badge: "LOUDER!" },
    { text: "is it a boy?", bg: "#a2d2ff", textColor: "#0f2b5c", badge: "SECOND THOUGHTS?" },
    { text: "is it a girl?", bg: "#ffafcc", textColor: "#5c0f2b", badge: "SECOND THOUGHTS?" },
    { text: "tally your votes now! 📊", bg: "#fcf6bd", textColor: "#4d4100", badge: "FINAL COUNT" },
    { text: "last question, is it a boy or a girl? ❓", bg: "#fcf6bd", textColor: "#4d4100", badge: "MOMENT OF TRUTH" },
];

// Helper to shuffle arrays cleanly
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

class SoundFx {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playKeypadTap() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playBeep(isFinal = false) {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isFinal ? 'triangle' : 'sine';
        const freq = isFinal ? 900 : 520;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (isFinal ? 0.4 : 0.15));
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + (isFinal ? 0.4 : 0.15));
    }

    playFanfare() {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 1.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.12);
            osc.stop(this.ctx.currentTime + idx * 0.12 + 1.2);
        });
    }
}

const audioFX = new SoundFx();

const ConfettiCanvas = ({ active, gender }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const particles = [];
        const colors = gender === 'girl'
            ? ['#ffafcc', '#ffc8dd', '#ffb703', '#ffffff', '#e0aaff', '#f72585']
            : ['#a2d2ff', '#bde0fe', '#00b4d8', '#ffffff', '#ffb703', '#48cae4'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 12 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 4 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 6 - 3,
                shape: Math.random() > 0.3 ? 'rect' : 'circle'
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.y += p.speedY;
                p.x += Math.sin(p.y / 30) + p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y > height) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, gender]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        />
    );
};

export default function App() {
    // Application State
    const [phase, setPhase] = useState(1); // 1: Code Entry, 2: Jokes, 3: Audience Hype, 4: Readiness, 5: Countdown, 6: Grand Reveal
    const [pin, setPin] = useState('');
    const [gender, setGender] = useState(null); // 'girl' | 'boy'
    const [pinError, setPinError] = useState('');
    const [pinSuccess, setPinSuccess] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Phase 2: Jokes state
    const [jokes, setJokes] = useState([]);
    const [jokeIndex, setJokeIndex] = useState(0);

    // Phase 3: Hype state
    const [hypeIndex, setHypeIndex] = useState(0);

    // Shared 10-second timer state for Phase 2 & 3
    const [progressMs, setProgressMs] = useState(0); // 0 to 10000 ms
    const [isPaused, setIsPaused] = useState(false);

    // Phase 5: Countdown state
    const [countdown, setCountdown] = useState(10);

    // Shuffling jokes on initial render
    useEffect(() => {
        setJokes(shuffleArray(TAGALOG_JOKES));
    }, []);

    // Keypad helper mapping
    const keypadButtons = [
        { num: '1', sub: ' ' },
        { num: '2', sub: 'ABC' },
        { num: '3', sub: 'DEF' },
        { num: '4', sub: 'GHI' },
        { num: '5', sub: 'JKL' },
        { num: '6', sub: 'MNO' },
        { num: '7', sub: 'PQRS' },
        { num: '8', sub: 'TUV' },
        { num: '9', sub: 'WXYZ' },
        { num: 'C', sub: 'CLEAR' },
        { num: '0', sub: '+' },
        { num: '⌫', sub: 'DEL' },
    ];

    const handleKeyPress = (val) => {
        if (soundEnabled) audioFX.playKeypadTap();
        setPinError('');

        if (val === 'C') {
            setPin('');
            setPinSuccess(false);
            setGender(null);
            return;
        }

        if (val === '⌫') {
            const nextPin = pin.slice(0, -1);
            setPin(nextPin);
            setPinSuccess(false);
            setGender(null);
            return;
        }

        if (pin.length < 4 && !pinSuccess) {
            const newPin = pin + val;
            setPin(newPin);

            if (newPin.length === 4) {
                if (newPin === '4475') {
                    setGender('girl');
                    setPinSuccess(true);
                } else if (newPin === '0269') {
                    setGender('boy');
                    setPinSuccess(true);
                } else {
                    setPinError('Invalid Code. Please check your phone keypad and try again!');
                    setPinSuccess(false);
                    setGender(null);
                }
            }
        }
    };

    useEffect(() => {
        if ((phase !== 2 && phase !== 3) || isPaused) {
            return;
        }

        const tickInterval = 50; // update progress bar every 50ms
        const timer = setInterval(() => {
            setProgressMs((prev) => {
                if (prev + tickInterval >= 10000) {
                    // Time expired for current slide! Advance to next index
                    if (phase === 2) {
                        setJokeIndex((curr) => {
                            if (curr + 1 >= jokes.length) {
                                // Done with jokes, advance to Phase 3
                                setPhase(3);
                                setHypeIndex(0);
                                return 0;
                            }
                            return curr + 1;
                        });
                    } else if (phase === 3) {
                        setHypeIndex((curr) => {
                            if (curr + 1 >= HYPE_MESSAGES.length) {
                                // Done with hype messages, advance to Phase 4
                                setPhase(4);
                                return 0;
                            }
                            return curr + 1;
                        });
                    }
                    return 0; // Reset progress bar for next item
                }
                return prev + tickInterval;
            });
        }, tickInterval);

        return () => clearInterval(timer);
    }, [phase, isPaused, jokes.length]);

    // Reset timer progress whenever active index changes manually
    const resetTimer = () => {
        setProgressMs(0);
    };

    useEffect(() => {
        if (phase !== 5) return;

        if (countdown > 0) {
            if (soundEnabled) audioFX.playBeep(false);
            const timer = setTimeout(() => {
                setCountdown((c) => c - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            if (soundEnabled) {
                audioFX.playBeep(true);
                setTimeout(() => audioFX.playFanfare(), 300);
            }
            setPhase(6);
        }
    }, [phase, countdown, soundEnabled]);

    // Handle Full Application Reset
    const handleReset = () => {
        setPhase(1);
        setPin('');
        setGender(null);
        setPinError('');
        setPinSuccess(false);
        setJokes(shuffleArray(TAGALOG_JOKES));
        setJokeIndex(0);
        setHypeIndex(0);
        setProgressMs(0);
        setIsPaused(false);
        setCountdown(10);
    };

    // Determine dynamic background for Phase 3 and 6
    const getBackgroundColor = () => {
        if (phase === 3) {
            return HYPE_MESSAGES[hypeIndex].bg;
        }
        if (phase === 6) {
            return gender === 'girl' ? '#ffafcc' : '#a2d2ff';
        }
        return '#f8fafc'; // soft slate default for other phases
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col justify-between transition-colors duration-1000 ease-in-out relative overflow-hidden select-none font-sans"
            style={{ backgroundColor: getBackgroundColor() }}
        >
            {/* Top Header Bar */}
            <header className="p-4 sm:p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50">
                    <Baby className="w-5 h-5 text-pink-500" />
                    <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
                        Gender Reveal Live
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Sound Toggle */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md text-slate-700 transition-transform active:scale-95"
                        title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                    </button>

                    {/* Reset App button if beyond Phase 1 */}
                    {phase > 1 && (
                        <button
                            onClick={handleReset}
                            className="p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md text-slate-700 transition-transform active:scale-95"
                            title="Restart Application"
                        >
                            <RotateCcw className="w-5 h-5 text-slate-600" />
                        </button>
                    )}
                </div>
            </header>

            {/* PHASE 1: SECRET CODE ENTRY */}
            {phase === 1 && (
                <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
                    {/* streaming chunk marker inside jsx */}
                    { }
                    <div className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">

                        <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white">
                            <Lock className="w-8 h-8" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">
                            Secret Gender Code
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mb-6">
                            Enter the 4-digit code from your phone keypad
                        </p>

                        {/* PIN Display */}
                        <div className="flex gap-3 mb-6 justify-center">
                            {[0, 1, 2, 3].map((idx) => {
                                const digit = pin[idx];
                                return (
                                    <div
                                        key={idx}
                                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black shadow-inner transition-all duration-300 ${digit
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900 scale-105'
                                            : 'border-slate-200 bg-slate-50/50 text-slate-400'
                                            }`}
                                    >
                                        {digit ? '•' : ''}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Error Message */}
                        {pinError && (
                            <div className="flex items-center gap-2 text-rose-600 text-xs sm:text-sm bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl mb-4 animate-bounce">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{pinError}</span>
                            </div>
                        )}

                        {/* Success Message & Next Action Button */}
                        {pinSuccess ? (
                            <div className="w-full flex flex-col items-center gap-4 my-2 animate-fade-in">
                                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Code Verified! Ready to begin.</span>
                                </div>

                                <button
                                    onClick={() => {
                                        if (soundEnabled) audioFX.playFanfare();
                                        setPhase(2);
                                    }}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white font-extrabold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <span className='font-black'>Let's start the Gender Reveal</span>
                                </button>
                            </div>
                        ) : (
                            /* Keypad grid */
                            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                                {keypadButtons.map((btn) => (
                                    <button
                                        key={btn.num}
                                        onClick={() => handleKeyPress(btn.num)}
                                        className="flex flex-col items-center justify-center h-14 sm:h-16 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/80 rounded-2xl shadow-sm transition-all active:scale-95"
                                    >
                                        <span className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                                            {btn.num}
                                        </span>
                                        {btn.sub && (
                                            <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-0.5">
                                                {btn.sub}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            )}

            {/* PHASE 2: TAGALOG PREGNANCY JOKES CAROUSEL */}
            {phase === 2 && (
                <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 text-center max-w-5xl mx-auto w-full">
                    { }
                    {/* <div className="mb-6 inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 border border-amber-300/60 px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
                        <Smile className="w-4 h-4 text-amber-600" />
                        <span>PREGNANCY JOURNEY JOKES ({jokeIndex + 1} / {jokes.length})</span>
                    </div> */}

                    <div className="bg-white/90 backdrop-blur-xl border border-white/80 p-8 sm:p-14 rounded-3xl shadow-2xl min-h-[260px] sm:min-h-[300px] flex items-center justify-center w-full transition-all duration-500 transform">
                        <p className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
                            "{jokes[jokeIndex]}"
                        </p>
                    </div>

                    <p className="mt-4 text-slate-500 font-semibold text-xs sm:text-sm tracking-wide">
                        Read it out loud! Next joke in {Math.ceil((10000 - progressMs) / 1000)}s...
                    </p>

                    {/* Carousel Navigation & Controls */}
                    <div className="flex items-center gap-4 mt-8">
                        <button
                            onClick={() => {
                                setJokeIndex((prev) => (prev > 0 ? prev - 1 : jokes.length - 1));
                                resetTimer();
                            }}
                            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-700 transition-transform active:scale-95"
                            title="Previous Joke"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-700 transition-transform active:scale-95"
                            title={isPaused ? "Resume Timer" : "Pause Timer"}
                        >
                            {isPaused ? <Play className="w-6 h-6 text-emerald-600" /> : <Pause className="w-6 h-6 text-amber-600" />}
                        </button>

                        <button
                            onClick={() => {
                                if (jokeIndex + 1 >= jokes.length) {
                                    setPhase(3);
                                    setHypeIndex(0);
                                } else {
                                    setJokeIndex((prev) => prev + 1);
                                }
                                resetTimer();
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold rounded-full shadow-lg flex items-center gap-2 hover:opacity-95 transition-transform active:scale-95"
                        >
                            <span>{jokeIndex + 1 >= jokes.length ? "Start Hype Sequence" : "Next Joke"}</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </main>
            )}

            {/* PHASE 3: AUDIENCE HYPE MESSAGES */}
            {phase === 3 && (
                <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 text-center max-w-6xl mx-auto w-full">
                    { }
                    {/* <div
                        className="mb-8 inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-6 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase shadow-md"
                        style={{ color: HYPE_MESSAGES[hypeIndex].textColor }}
                    >
                        <span>{HYPE_MESSAGES[hypeIndex].badge} ({hypeIndex + 1} / {HYPE_MESSAGES.length})</span>
                    </div> */}

                    <h2
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase drop-shadow-sm px-4 py-8 transition-all duration-700"
                        style={{ color: HYPE_MESSAGES[hypeIndex].textColor }}
                    >
                        {HYPE_MESSAGES[hypeIndex].text}
                    </h2>

                    {/* Interactive controls */}
                    <div className="flex items-center gap-4 mt-12">
                        <button
                            onClick={() => {
                                setHypeIndex((prev) => (prev > 0 ? prev - 1 : HYPE_MESSAGES.length - 1));
                                resetTimer();
                            }}
                            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-800 transition-transform active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-800 transition-transform active:scale-95"
                        >
                            {isPaused ? <Play className="w-6 h-6 text-emerald-600" /> : <Pause className="w-6 h-6 text-amber-600" />}
                        </button>

                        <button
                            onClick={() => {
                                if (hypeIndex + 1 >= HYPE_MESSAGES.length) {
                                    setPhase(4);
                                } else {
                                    setHypeIndex((prev) => prev + 1);
                                }
                                resetTimer();
                            }}
                            className="px-6 py-3 bg-slate-900 text-white font-extrabold rounded-full shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-transform active:scale-95"
                        >
                            <span>{hypeIndex + 1 >= HYPE_MESSAGES.length ? "Ready Screen" : "Next Message"}</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </main>
            )}

            {/* PHASE 4: READINESS CHECK SCREEN */}
            {phase === 4 && (
                <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center max-w-4xl mx-auto w-full">
                    { }
                    <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 sm:p-16 rounded-3xl shadow-2xl flex flex-col items-center text-center w-full animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 via-amber-300 to-sky-400 rounded-full flex items-center justify-center shadow-lg mb-8 animate-bounce">
                            <PartyPopper className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8 uppercase tracking-tight">
                            Are you ready to reveal the gender?
                        </h1>

                        <button
                            onClick={() => {
                                setCountdown(10);
                                setPhase(5);
                            }}
                            className="py-5 px-10 sm:py-6 sm:px-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 text-white font-black text-2xl sm:text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse flex items-center gap-3"
                        >
                            <span className='font-black'>Show Gender</span>
                        </button>
                    </div>
                </main>
            )}

            {/* PHASE 5: CODE REVEAL & 10-SECOND COUNTDOWN */}
            {phase === 5 && (
                <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center w-full">
                    { }
                    <div className="bg-white/85 backdrop-blur-2xl border border-white p-8 sm:p-14 rounded-3xl shadow-2xl flex flex-col items-center max-w-3xl w-full">

                        <p className="text-xs sm:text-sm font-black tracking-widest text-slate-400 uppercase mb-2">
                            Verifying Original Mobile Code
                        </p>

                        <div className="text-6xl sm:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 mb-1 animate-pulse">
                            {pin}
                        </div>

                        <p className="text-sm sm:text-lg font-bold text-slate-600 uppercase tracking-widest mb-10 bg-slate-100 px-6 py-2 rounded-full border border-slate-200">
                            Check your keypad! 📱
                        </p>

                        {/* Huge Timer Circle */}
                        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-500 p-1.5 shadow-2xl flex items-center justify-center">
                            <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                <span className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tighter animate-ping-once">
                                    {countdown}
                                </span>
                                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                                    SECONDS
                                </span>
                            </div>
                        </div>

                    </div>
                </main>
            )}

            {/* PHASE 6: THE GRAND REVEAL */}
            {phase === 6 && (
                <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center w-full">
                    { }
                    <ConfettiCanvas active={true} gender={gender} />

                    <div className="flex flex-col items-center justify-center z-20 animate-scale-up">

                        <div className="mb-6 inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-xl border border-white">
                            <Heart className={`w-6 h-6 fill-current ${gender === 'girl' ? 'text-pink-500' : 'text-sky-500'}`} />
                            <span className="text-sm sm:text-lg font-black tracking-widest text-slate-800 uppercase">
                                GENDER REVEAL ANNOUNCEMENT
                            </span>
                            <Heart className={`w-6 h-6 fill-current ${gender === 'girl' ? 'text-pink-500' : 'text-sky-500'}`} />
                        </div>

                        <h1
                            className={`text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-2xl mb-6 ${gender === 'girl' ? 'text-pink-900' : 'text-sky-950'
                                }`}
                        >
                            {gender === 'girl' ? 'IT IS A GIRL! 🎀' : 'IT IS A BOY! 💙'}
                        </h1>

                        <p className="text-lg sm:text-2xl font-extrabold text-slate-800/80 mb-10 max-w-xl">
                            {gender === 'girl'
                                ? 'Welcome to the world, beautiful baby girl! 💕'
                                : 'Welcome to the world, handsome baby boy! 👶'}
                        </p>

                        <button
                            onClick={handleReset}
                            className="py-4 px-8 bg-white/90 hover:bg-white text-slate-900 font-black rounded-full shadow-2xl flex items-center gap-3 text-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <RotateCcw className="w-5 h-5 text-indigo-600" />
                            <span>Play Reveal Again</span>
                        </button>
                    </div>
                </main>
            )}

            {/* Bottom Progress Bar for Phase 2 & 3 */}
            {(phase === 2 || phase === 3) && (
                <footer className="p-4 z-20">
                    <div className="max-w-md mx-auto bg-white/60 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/80">
                        <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 h-full transition-all duration-75 ease-linear rounded-full"
                                style={{ width: `${(progressMs / 10000) * 100}%` }}
                            />
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}