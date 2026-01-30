import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// --- BASE DE DONNÉES DES 60 EXERCICES ---
const QUESTIONS_6EME = {
  math: [
    { q: "15 × 12 ?", a: "180" }, { q: "1/4 de 100 ?", a: "25" }, { q: "456 + 789 ?", a: "1245" },
    { q: "144 ÷ 12 ?", a: "12" }, { q: "25 × 4 ?", a: "100" }, { q: "1000 - 347 ?", a: "653" },
    { q: "Côtés d'un hexagone ?", a: "6" }, { q: "2.5 + 3.5 ?", a: "6" }, { q: "Moitié de 50 ?", a: "25" },
    { q: "Angles droits d'un carré ?", a: "4" }, { q: "10.5 - 4.2 ?", a: "6.3" }, { q: "0.5 × 10 ?", a: "5" },
    { q: "Périmètre carré côté 5 ?", a: "20" }, { q: "3/4 de 80 ?", a: "60" }, { q: "9 × 9 ?", a: "81" },
    { q: "Triple de 15 ?", a: "45" }, { q: "1/2 + 1/2 ?", a: "1" }, { q: "Minutes dans 2h ?", a: "120" },
    { q: "10% de 500 ?", a: "50" }, { q: "Somme des angles triangle ?", a: "180" }
  ],
  french: [
    { q: "Pluriel de 'cheval' ?", a: "chevaux" }, { q: "Féminin de 'acteur' ?", a: "actrice" }, { q: "Contraire de 'grand' ?", a: "petit" },
    { q: "Synonyme de 'joyeux' ?", a: "heureux" }, { q: "Verbe : 'Le chat dort' ?", a: "dort" }, { q: "Sujet : 'Léa mange' ?", a: "léa" },
    { q: "Nature de 'rapidement' ?", a: "adverbe" }, { q: "Pluriel de 'bateau' ?", a: "bateaux" }, { q: "Passé de 'être' (il) ?", a: "était" },
    { q: "Futur de 'aller' (tu) ?", a: "iras" }, { q: "COD : 'Je vois l'oiseau' ?", a: "l'oiseau" }, { q: "Type de 'Stop !' ?", a: "impérative" },
    { q: "Homonyme de 'mer' ?", a: "mère" }, { q: "Verbe 'faire' (nous) ?", a: "faisons" }, { q: "Pluriel de 'hibou' ?", a: "hiboux" },
    { q: "Genre de 'table' ?", a: "féminin" }, { q: "Adjectif : 'La rose rouge' ?", a: "rouge" }, { q: "Verbe 'avoir' (ils) ?", a: "ont" },
    { q: "Orthographe : 'des (sac)' ?", a: "sacs" }, { q: "Le petit de la vache ?", a: "veau" }
  ],
  english: [
    { q: "Chien ?", a: "dog" }, { q: "Chat ?", a: "cat" }, { q: "Rouge ?", a: "red" }, { q: "Pomme ?", a: "apple" },
    { q: "Bonjour (matin) ?", a: "good morning" }, { q: "15 ?", a: "fifteen" }, { q: "20 ?", a: "twenty" },
    { q: "Bleu ?", a: "blue" }, { q: "Maison ?", a: "house" }, { q: "École ?", a: "school" },
    { q: "Vert ?", a: "green" }, { q: "Jaune ?", a: "yellow" }, { q: "Livre ?", a: "book" },
    { q: "Père ?", a: "father" }, { q: "Mère ?", a: "mother" }, { q: "Soleil ?", a: "sun" },
    { q: "Eau ?", a: "water" }, { q: "Merci ?", a: "thank you" }, { q: "Frère ?", a: "brother" }, { q: "Sœur ?", a: "sister" }
  ]
};

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [diamonds, setDiamonds] = useState(100);
  const [currentCat, setCurrentCat] = useState('math');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [wrongAnswer, setWrongAnswer] = useState(false);

  // --- TOUCH HANDLERS POUR TETRIS ---
  const touchStart = useRef(null);
  const handleTouchStart = (e) => touchStart.current = e.touches[0].clientX;
  const handleTouchEnd = (e, moveLeft, moveRight, rotate) => {
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchEnd - touchStart.current;
    if (Math.abs(distance) < 10) rotate(); // Taper pour tourner
    else if (distance > 30) moveRight(); // Glisser droite
    else if (distance < -30) moveLeft(); // Glisser gauche
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.length > 2) setScreen('dashboard');
  };

  const checkAnswer = () => {
    const correct = QUESTIONS_6EME[currentCat][questionIdx].a.toLowerCase();
    if (userAnswer.toLowerCase().trim() === correct) {
      setDiamonds(prev => prev + 20);
      setQuestionIdx(prev => (prev + 1) % 20);
      setUserAnswer('');
      if (window.confetti) window.confetti({ particleCount: 150, spread: 70, shapes: ['circle'], colors: ['#FF6B9D', '#C8A2E8', '#FFD4B8'] });
    } else {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 800);
    }
  };

  return (
    <div className="app candy-theme">
      {wrongAnswer && <div className="error-overlay"><div className="big-pink-cross">❌</div></div>}

      {screen === 'auth' && (
        <div className="container">
          <div className="glass-card auth-card animate-pop">
            <h1 className="logo">CANDY ACADEMY</h1>
            <p className="tagline">60 défis t'attendent ! 🍭</p>
            <form onSubmit={handleLogin}>
              <input className="input-premium" placeholder="Pseudo..." value={username} onChange={e => setUsername(e.target.value)} />
              <input className="input-premium" type="password" placeholder="Mot de passe..." />
              <button className="btn-premium">ENTRER 💎</button>
            </form>
          </div>
        </div>
      )}

      {screen === 'dashboard' && (
        <div className="container mobile-optimized">
          <div className="glass-card header-card">
            <div className="header-content">
              <div className="avatar-main">🍭</div>
              <div className="header-info">
                <h2 className="username">{username}</h2>
                <div className="stat-badge">💎 {diamonds} Diamants</div>
              </div>
            </div>
          </div>

          <div className="categories-scroll">
            {['math', 'french', 'english'].map(cat => (
              <button key={cat} className={`cat-btn ${currentCat === cat ? 'active' : ''}`} onClick={() => {setCurrentCat(cat); setQuestionIdx(0);}}>
                {cat === 'math' ? '🔢 Maths' : cat === 'french' ? '📚 FR' : '🇬🇧 EN'}
              </button>
            ))}
          </div>

          <div className="glass-card question-card">
            <h3 className="question-title">{QUESTIONS_6EME[currentCat][questionIdx].q}</h3>
            <input className="input-premium" placeholder="Réponse..." value={userAnswer} onChange={e => setUserAnswer(e.target.value)} onKeyPress={e => e.key === 'Enter' && checkAnswer()} />
            <button className="btn-premium" onClick={checkAnswer}>VALIDER ✅</button>
          </div>

          <div className="tetris-preview-card glass-card" onTouchStart={handleTouchStart} onTouchEnd={(e) => handleTouchEnd(e, () => {}, () => {}, () => alert('Rotation !'))}>
             <p>🎮 Zone Tetris Tactile</p>
             <small>(Glisse pour bouger, Tape pour tourner)</small>
          </div>
        </div>
      )}

      <style>{`
        .mobile-optimized { max-width: 100%; padding: 10px; }
        .categories-scroll { display: flex; overflow-x: auto; gap: 10px; margin-bottom: 15px; padding: 5px; }
        .error-overlay { position: fixed; inset: 0; background: rgba(255, 107, 157, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .big-pink-cross { font-size: 12rem; animation: shake 0.5s ease-in-out; text-shadow: 0 0 30px white; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-15px); } 75% { transform: translateX(15px); } }
        .tetris-preview-card { padding: 40px; text-align: center; background: rgba(255,255,255,0.4); margin-top: 20px; border: 2px dashed #FF6B9D; }
      `}</style>
    </div>
  );
}

export default App;
