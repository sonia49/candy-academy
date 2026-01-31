import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialisation Supabase
const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- BANQUE D'EXERCICES 6ÈME (20 PAR MATIÈRE) ---
const QUESTIONS = {
  math: {
    '6ème': [
      { q: "15 × 12 ?", r: "180" }, { q: "456 + 789 ?", r: "1245" }, { q: "144 ÷ 12 ?", r: "12" },
      { q: "25 × 4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" }, { q: "1/4 de 100 ?", r: "25" },
      { q: "2.5 + 3.5 ?", r: "6" }, { q: "Côtés d'un hexagone ?", r: "6" }, { q: "Périmètre carré côté 5cm ?", r: "20" },
      { q: "Angles droits d'un carré ?", r: "4" }, { q: "1000 - 1 ?", r: "999" }, { q: "Double de 15 ?", r: "30" },
      { q: "0.5 × 10 ?", r: "5" }, { q: "Côtés d'un triangle ?", r: "3" }, { q: "100 ÷ 4 ?", r: "25" },
      { q: "9 × 8 ?", r: "72" }, { q: "7 × 7 ?", r: "49" }, { q: "Rayon si diamètre = 10 ?", r: "5" },
      { q: "3 × 3 × 3 ?", r: "27" }, { q: "150 + 150 ?", r: "300" }
    ],
    '5ème': [{ q: "-5 + 8 ?", r: "3" }, { q: "10% de 200 ?", r: "20" }] // (Simplifié pour l'exemple)
  },
  french: {
    '6ème': [
      { q: "Nature de 'rapidement' ?", r: "adverbe" }, { q: "COD : 'Je mange une pomme'", r: "une pomme" },
      { q: "Sujet : 'Le chat dort'", r: "le chat" }, { q: "Présent 'faire' (nous) ?", r: "faisons" },
      { q: "Imparfait 'avoir' (je) ?", r: "avais" }, { q: "Futur 'aller' (tu) ?", r: "iras" },
      { q: "Pluriel de 'cheval' ?", r: "chevaux" }, { q: "Féminin de 'acteur' ?", r: "actrice" },
      { q: "Synonyme de 'joyeux' ?", r: "heureux" }, { q: "Contraire de 'grand' ?", r: "petit" },
      { q: "Infinitif de 'mangeons' ?", r: "manger" }, { q: "Type de phrase : 'Sortez !'", r: "imperative" },
      { q: "Feminin de 'lion' ?", r: "lionne" }, { q: "Nombre de syllabes dans 'bateau' ?", r: "2" },
      { q: "Pluriel de 'gaz' ?", r: "gaz" }, { q: "Contraire de 'froid' ?", r: "chaud" },
      { q: "Sujet de 'Tu chantes' ?", r: "tu" }, { q: "Nature de 'petit' ?", r: "adjectif" },
      { q: "Verbe : 'Il finit son devoir' ?", r: "finit" }, { q: "Synonyme de 'belle' ?", r: "jolie" }
    ]
  },
  english: {
    '6ème': [
      { q: "Chien ?", r: "dog" }, { q: "Chat ?", r: "cat" }, { q: "Maison ?", r: "house" },
      { q: "École ?", r: "school" }, { q: "15 ?", r: "fifteen" }, { q: "Rouge ?", r: "red" },
      { q: "Bleu ?", r: "blue" }, { q: "I (to be) happy ?", r: "am" }, { q: "He (to have) a dog ?", r: "has" },
      { q: "Famille ?", r: "family" }, { q: "Pomme ?", r: "apple" }, { q: "Livre ?", r: "book" },
      { q: "Bonjour ?", r: "hello" }, { q: "Merci ?", r: "thank you" }, { q: "Jaune ?", r: "yellow" },
      { q: "Vert ?", r: "green" }, { q: "Frère ?", r: "brother" }, { q: "Sœur ?", r: "sister" },
      { q: "Soleil ?", r: "sun" }, { q: "Eau ?", r: "water" }
    ]
  }
};

const CAPITALS_GAME = [
  { country: "France", capital: "Paris" },
  { country: "Espagne", capital: "Madrid" },
  { country: "Italie", capital: "Rome" },
  { country: "Allemagne", capital: "Berlin" },
  { country: "Royaume-Uni", capital: "Londres" }
];

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('selectedAvatar') || '🧁');
  const [showSettings, setShowSettings] = useState(false);

  // --- AUTH LOGIC ---
  const handleAuth = async (type) => {
    if (!username || password.length < 6) {
      alert("⚠️ Pseudo et mot de passe (6+ caractères) requis !");
      return;
    }

    setLoading(true);
    const email = `${username.toLowerCase().trim()}@candy.app`;

    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { alert("❌ " + error.message); setLoading(false); return; }

      if (data?.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id, email: username, diamonds: 100, level: 1, streak: 0
        }]);
        alert("✨ Compte créé ! Connecte-toi maintenant.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { alert("❌ Pseudo ou mot de passe incorrect"); setLoading(false); return; }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      setProfile(prof);
      setScreen('dashboard');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setProfile(null);
    setScreen('auth');
    setGameMode('menu');
  };

  // --- QUIZ LOGIC ---
  const handleCheckAnswer = async () => {
    const questions = QUESTIONS[category][level] || [];
    const correct = questions[currentQ].r.toLowerCase().trim();
    const user = answer.toLowerCase().trim();

    if (user === correct || correct.includes(user)) {
      setShowResult('correct');
      if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });

      const newDiamonds = profile.diamonds + 15;
      const newStreak = profile.streak + 1;
      
      await supabase.from('profiles').update({ diamonds: newDiamonds, streak: newStreak }).eq('id', profile.id);
      setProfile({ ...profile, diamonds: newDiamonds, streak: newStreak });
      setStats(s => ({ correct: s.correct + 1, total: s.total + 1 }));

      setTimeout(() => {
        setShowResult(null);
        setCurrentQ((currentQ + 1) % questions.length);
        setAnswer('');
      }, 1500);
    } else {
      setShowResult('wrong');
      setStats(s => ({ ...s, total: s.total + 1 }));
      setTimeout(() => setShowResult(null), 1500);
    }
  };

  // --- RENDERING ---

  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <input type="text" placeholder="✨ Ton pseudo" value={username} onChange={(e) => setUsername(e.target.value)} className="input-candy" />
          <input type="password" placeholder="🔐 Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="input-candy" />
          <button onClick={() => handleAuth('login')} className="btn-primary" disabled={loading}>{loading ? 'Chargement...' : 'SE CONNECTER'}</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  // Sécurité pour éviter la page blanche si le profil charge
  if (!profile) return <div className="app"><p>Chargement du profil...</p></div>;

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <div className="top-nav">
          <div className="settings-icon" onClick={() => setShowSettings(true)}>⚙️</div>
          <button onClick={handleLogout} className="logout-btn">Quitter 🚪</button>
        </div>
        
        <div className="dashboard">
          <div className="header">
            <div className="avatar-big">{selectedAvatar}</div>
            <div className="user-info">
              <h2>{profile.email?.toUpperCase()}</h2>
              <div className="badges">
                <span className="badge">💎 {profile.diamonds}</span>
                <span className="badge">🔥 {profile.streak}</span>
              </div>
            </div>
          </div>

          <div className="game-buttons">
            <button className="game-btn math-btn" onClick={() => { setGameMode('quiz'); setCategory('math'); }}>🍩 MATHS</button>
            <button className="game-btn french-btn" onClick={() => { setGameMode('quiz'); setCategory('french'); }}>🍬 FRANÇAIS</button>
            <button className="game-btn english-btn" onClick={() => { setScreen('quiz'); setGameMode('quiz'); setCategory('english'); }}>🍦 ENGLISH</button>
          </div>
        </div>

        {showSettings && (
          <div className="modal" onClick={() => setShowSettings(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Change ton avatar</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <div key={av} className={`avatar-option ${selectedAvatar === av ? 'selected' : ''}`} 
                       onClick={() => { setSelectedAvatar(av); localStorage.setItem('selectedAvatar', av); }}>{av}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameMode === 'quiz') {
    const questions = QUESTIONS[category][level] || [];
    const currentQuestion = questions[currentQ];

    return (
      <div className="app">
        <div className="quiz-container">
          <button className="back-btn" onClick={() => setGameMode('menu')}>← Menu</button>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${((currentQ + 1) / questions.length) * 100}%`}}></div>
          </div>
          <div className="question-box">
            <h2 className="question">{currentQuestion?.q}</h2>
            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()} className="answer-input" autoFocus />
            <button onClick={handleCheckAnswer} className="btn-primary">VALIDER ✨</button>
          </div>
          {showResult && (
             <div className={`result-overlay ${showResult}`}>
               <h2>{showResult === 'correct' ? 'BRAVO ! 🎉' : 'OUPS... 😅'}</h2>
               {showResult === 'wrong' && <p>La réponse était : {currentQuestion.r}</p>}
             </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;
