import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- TES 60 EXERCICES (20 PAR MATIÈRE) ---
const QUESTIONS = {
  math: {
    '6ème': [
      { q: "15 × 12 ?", r: "180" }, { q: "456 + 789 ?", r: "1245" }, { q: "144 ÷ 12 ?", r: "12" }, { q: "25 × 4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" },
      { q: "1/4 de 100 ?", r: "25" }, { q: "2.5 + 3.5 ?", r: "6" }, { q: "Côtés hexagone ?", r: "6" }, { q: "Périmètre carré côté 5 ?", r: "20" }, { q: "Angles droits carré ?", r: "4" },
      { q: "1000 - 1 ?", r: "999" }, { q: "Double de 15 ?", r: "30" }, { q: "0.5 × 10 ?", r: "5" }, { q: "Côtés triangle ?", r: "3" }, { q: "100 ÷ 4 ?", r: "25" },
      { q: "9 × 8 ?", r: "72" }, { q: "7 × 7 ?", r: "49" }, { q: "Rayon si diamètre 10 ?", r: "5" }, { q: "3 × 3 × 3 ?", r: "27" }, { q: "150 + 150 ?", r: "300" }
    ]
  },
  french: {
    '6ème': [
      { q: "Nature de 'vite' ?", r: "adverbe" }, { q: "COD : 'Il lit un livre'", r: "un livre" }, { q: "Sujet : 'La pluie tombe'", r: "la pluie" }, { q: "Faire (nous, présent) ?", r: "faisons" }, { q: "Avoir (je, imparfait) ?", r: "avais" },
      { q: "Futur 'aller' (tu) ?", r: "iras" }, { q: "Pluriel 'journal' ?", r: "journaux" }, { q: "Féminin 'boulanger' ?", r: "boulangère" }, { q: "Synonyme 'triste' ?", r: "malheureux" }, { q: "Contraire 'chaud' ?", r: "froid" },
      { q: "Infinitif 'dormons' ?", r: "dormir" }, { q: "Type : 'Sortez !'", r: "imperative" }, { q: "Féminin 'lion' ?", r: "lionne" }, { q: "Syllabes 'bateau' ?", r: "2" }, { q: "Pluriel 'gaz' ?", r: "gaz" },
      { q: "Contraire 'petit' ?", r: "grand" }, { q: "Sujet 'Tu chantes' ?", r: "tu" }, { q: "Nature 'belle' ?", r: "adjectif" }, { q: "Verbe 'Il finit' ?", r: "finit" }, { q: "Synonyme 'joyeux' ?", r: "heureux" }
    ]
  },
  english: {
    '6ème': [
      { q: "Dog ?", r: "chien" }, { q: "Cat ?", r: "chat" }, { q: "House ?", r: "maison" }, { q: "School ?", r: "école" }, { q: "15 ?", r: "fifteen" },
      { q: "Red ?", r: "rouge" }, { q: "Blue ?", r: "bleu" }, { q: "I (to be) happy ?", r: "am" }, { q: "He (to have) a dog ?", r: "has" }, { q: "Family ?", r: "famille" },
      { q: "Apple ?", r: "pomme" }, { q: "Book ?", r: "livre" }, { q: "Hello ?", r: "bonjour" }, { q: "Thank you ?", r: "merci" }, { q: "Yellow ?", r: "jaune" },
      { q: "Green ?", r: "vert" }, { q: "Brother ?", r: "frère" }, { q: "Sister ?", r: "soeur" }, { q: "Sun ?", r: "soleil" }, { q: "Water ?", r: "eau" }
    ]
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [screen, setScreen] = useState('auth'); // auth, menu, quiz
  const [category, setCategory] = useState('math');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');

  // 1. Charger le profil dès qu'on a un utilisateur
  const loadProfile = async (userId) => {
    let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    // SI LE PROFIL N'EXISTE PAS ENCORE (Nouveau joueur)
    if (error || !data) {
      const { data: newProf } = await supabase.from('profiles').insert([
        { id: userId, email: username || "Joueur", diamonds: 100, level: 1, streak: 0 }
      ]).select().single();
      setProfile(newProf);
    } else {
      setProfile(data);
    }
    setScreen('menu');
  };

  // 2. Connexion / Inscription
  const handleAuth = async (type) => {
    const email = `${username.toLowerCase().trim()}@candy.app`;
    let result;
    
    if (type === 'signup') {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error) alert("Compte créé ! Connecte-toi.");
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (result.data?.user) {
        setUser(result.data.user);
        loadProfile(result.data.user.id);
      }
    }
    if (result.error) alert(result.error.message);
  };

  // --- INTERFACE ---

  if (screen === 'auth') {
    return (
      <div className="app auth-bg">
        <h1 className="logo">🍭 Candy Academy</h1>
        <div className="auth-card">
          <input placeholder="Pseudo" onChange={e => setUsername(e.target.value)} className="input-candy" />
          <input type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} className="input-candy" />
          <button onClick={() => handleAuth('login')} className="btn-primary">ENTRER 🚀</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">S'INSCRIRE ✨</button>
        </div>
      </div>
    );
  }

  if (screen === 'menu' && profile) {
    return (
      <div className="app">
        <div className="header">
          <span>💎 {profile.diamonds}</span>
          <span>🔥 {profile.streak}</span>
          <button onClick={() => setScreen('auth')}>🚪</button>
        </div>
        <div className="menu-grid">
          <button onClick={() => {setCategory('math'); setScreen('quiz')}} className="card">🍩 MATHS</button>
          <button onClick={() => {setCategory('french'); setScreen('quiz')}} className="card">🍬 FRANÇAIS</button>
          <button onClick={() => {setCategory('english'); setScreen('quiz')}} className="card">🍦 ANGLAIS</button>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const q = QUESTIONS[category]['6ème'][currentQ];
    return (
      <div className="app">
        <button onClick={() => setScreen('menu')}>← Retour</button>
        <div className="quiz-box">
          <h2>{q.q}</h2>
          <input value={answer} onChange={e => setAnswer(e.target.value)} className="answer-input" />
          <button onClick={() => {
            if (answer.toLowerCase().trim() === q.r.toLowerCase().trim()) {
              alert("BRAVO ! +15 💎");
              setProfile({...profile, diamonds: profile.diamonds + 15});
              setCurrentQ((currentQ + 1) % 20);
              setAnswer('');
            } else {
              alert("Essaye encore !");
            }
          }} className="btn-primary">VALIDER</button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
