import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, 
    RefreshCw, 
    Zap, 
    History,
    Search
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './ImageGenarator.css';
import defaultImage from '../Assets/defult_image.svg.webp';

const ImageGenerator = () => {
    const [imageUrl, setImageUrl] = useState("/");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [enhancedPrompt, setEnhancedPrompt] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const inputRef = useRef(null);

    // Initialize Gemini
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const generateImage = async () => {
        const userInput = inputRef.current.value.trim();
        if (!userInput) return;

        setLoading(true);
        setEnhancedPrompt("");
        setStatus("Materializing artifacts...");

        try {
            // Simple direct logic for instant results
            const seed = Math.floor(Math.random() * 1000000);
            const encodedPrompt = encodeURIComponent(userInput);
            const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;
            
            setImageUrl(generatedUrl);
            setHistory(prev => [generatedUrl, ...prev].slice(0, 5));
            
            setTimeout(() => {
                setLoading(false);
                setStatus("");
            }, 800);

        } catch (error) {
            console.error("Critical Failure:", error);
            setStatus("Neural link unstable. Please try again.");
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (imageUrl === "/") return;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `expert-ai-art-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="app-container">
            <div className="aura"></div>

            <div className="minimal-workspace">
                <header className="title-header">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        AI IMAGE <span>EXPERT</span>
                    </motion.h1>
                </header>

                <div className="immersive-viewport">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={imageUrl}
                            src={imageUrl === "/" ? defaultImage : imageUrl}
                            alt="AI Work"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`main-render ${loading ? 'generating' : ''}`}
                        />
                    </AnimatePresence>

                    {loading && (
                        <div className="orbital-spinner">
                            <div className="orbit">
                                <div className="planet"></div>
                            </div>
                            <p style={{ fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.6rem', color: '#833ab4' }}>
                                {status}
                            </p>
                        </div>
                    )}

                    <div className="fab">
                        {!loading && imageUrl !== "/" && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="icon-btn" 
                                onClick={downloadImage}
                            >
                                <Download size={20} />
                            </motion.div>
                        )}
                        <div className="icon-btn" onClick={() => setShowHistory(!showHistory)}>
                            <History size={20} />
                        </div>
                    </div>

                    {/* Simple History Overlay */}
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '20px', backdropFilter: 'blur(10px)', display: 'flex', gap: '10px', zIndex: 100 }}
                            >
                                {history.length === 0 && <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>No recent entries.</p>}
                                {history.map((url, i) => (
                                    <img 
                                        key={i} 
                                        src={url} 
                                        alt="h" 
                                        style={{ width: '60px', height: '60px', borderRadius: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                                        onClick={() => { setImageUrl(url); setShowHistory(false); }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="floating-controls">
                    <div className={`refinement-ticker ${enhancedPrompt ? 'active' : ''}`}>
                        {loading ? status : (enhancedPrompt ? `Refinement: ${enhancedPrompt}` : "Neural Engine: Ready for creative input")}
                    </div>
                    
                    <div className="search-pod">
                        <Search size={20} color="#833ab4" />
                        <input 
                            ref={inputRef}
                            type="text" 
                            className="search-input"
                            placeholder="Type your creative vision here..."
                            onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                        />
                        <button 
                            className={`action-trigger ${loading ? 'loading' : ''}`}
                            onClick={generateImage}
                            disabled={loading}
                        >
                            {loading ? <RefreshCw className="spin-icon" size={20} /> : <Zap size={20} fill="currentColor" />}
                            <span>{loading ? "PROCESSING" : "GENERATE"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
