import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- TES 60 EXERCICES (20 PAR MATIÈRE) ---
const QUESTIONS = {
  math: { '6ème': [{ q: "15 × 12 ?", r: "180" }, { q: "456+789 ?", r: "1245" }, { q: "144÷12 ?", r: "12" }, { q: "25×4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" }, { q: "1/4 de 100 ?", r: "25" }, { q: "2.5+3.5 ?", r: "6" }, { q: "Côtés hexagone ?", r: "6" }, { q: "Périmètre carré 5 ?", r: "20" }, { q: "Angles droits carré ?", r: "4" }, { q: "1000-1 ?", r: "999" }, { q: "Double 15 ?", r: "30" }, { q: "0.5×10 ?", r: "5" }, { q: "Côtés triangle ?", r: "3" }, { q: "100÷4 ?", r: "25" }, { q: "9×8 ?", r: "72" }, { q: "7×7 ?", r: "49" }, { q: "Rayon si diam 10 ?", r: "5" }, { q: "3×3×3 ?", r: "27" }, { q: "150+150 ?", r: "300" }] },
  french: { '6ème': [{ q: "Nature de 'vite' ?", r: "adverbe" }, { q: "COD: Il lit un livre", r: "un livre" }, { q: "Sujet: Le chat dort", r: "le chat" }, { q: "Faire (nous, prés.) ?", r: "faisons" }, { q: "Avoir (je, imparf) ?", r: "avais" }, { q: "Aller (tu, fut.) ?", r: "iras" }, { q: "Pluriel journal ?", r: "journaux" }, { q: "Féminin boulanger ?", r: "boulangère" }, { q: "Synonyme joyeux ?", r: "heureux" }, { q: "Contraire chaud ?", r: "froid" }, { q: "Infinitif dormons ?", r: "dormir" }, { q: "Type: Sortez !", r: "imperative" }, { q: "Féminin lion ?", r: "lionne" }, { q: "Syllabes bateau ?", r: "2" }, { q: "Pluriel nez ?", r: "nez" }, { q: "Contraire petit ?", r: "grand" }, { q: "Sujet Je pars ?", r: "je" }, { q: "Nature belle ?", r: "adjectif" }, { q: "Verbe Il finit ?", r: "finit" }, { q: "Synonyme maison ?", r: "habitation" }] },
  english: { '6ème': [{ q: "Dog ?", r: "chien" }, { q: "Cat ?", r: "chat" }, { q: "House ?", r: "maison" }, { q: "School ?", r: "école" }, { q: "15 ?", r: "fifteen" }, { q: "Red ?", r: "rouge" }, { q: "Blue ?", r: "bleu" }, { q: "I (be) happy ?", r: "am" }, { q: "He (have) a dog ?", r: "has" }, { q: "Family ?", r: "famille" }, { q: "Apple ?", r: "pomme" }, { q: "Book ?", r: "livre" }, { q: "Hello ?", r: "bonjour" }, { q: "Thank you ?", r: "merci" }, { q: "Yellow ?", r: "jaune" }, { q: "Green ?", r: "vert" }, { q: "Brother ?", r: "frère" }, { q: "Sister ?", r: "soeur" }, { q: "Sun ?", r: "soleil" }, { q: "Water ?", r: "eau" }] }
};

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');

  // --- LE PATCH CORRECTIF ---
  const handleAuth = async (type) => {
    const email = `${username.toLowerCase().trim()}@candy.app`;
    
    if (type === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      // APRÈS INSCRIPTION : Créer obligatoirement le profil
      await supabase.from('profiles').insert([{ id: (await supabase.auth.getUser()).data.user.id, email: username, diamonds: 100 }]);
      alert("Inscrit ! Connecte-toi.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert("Pseudo ou pass incorrect");
      
      // CHARGER LE PROFIL
      let { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      
      // S'IL N'EXISTE PAS (cas critique), ON LE CRÉE
      if (!prof) {
        const { data: newP } = await supabase.from('profiles').insert([{ id: data.user.id, email: username, diamonds: 100 }]).select().single();
        prof = newP;
      }
      
      setProfile(prof);
      setScreen('dashboard'); // On utilise ton nom d'écran
    }
  };

  // --- TON VISUEL ---
  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy 🍬</h1>
          <input className="input-candy" placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="input-candy" type="password" placeholder="Pass" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {gameMode === 'menu' ? (
        <div className="dashboard">
          <div className="header">
            <span>💎 {profile?.diamonds}</span>
            <h2>Bonjour {profile?.email}</h2>
          </div>
          <div className="game-buttons">
            <button className="game-btn math-btn" onClick={() => { setCategory('math'); setGameMode('quiz'); }}>🍩 MATHS</button>
            <button className="game-btn french-btn" onClick={() => { setCategory('french'); setGameMode('quiz'); }}>🍬 FRANÇAIS</button>
            <button className="game-btn english-btn" onClick={() => { setCategory('english'); setGameMode('quiz'); }}>🍦 ENGLISH</button>
          </div>
        </div>
      ) : (
        <div className="quiz-container">
          <button onClick={() => setGameMode('menu')}>← Retour</button>
          <h2>{QUESTIONS[category]['6ème'][currentQ].q}</h2>
          <input className="answer-input" value={answer} onChange={e => setAnswer(e.target.value)} />
          <button className="btn-primary" onClick={() => {
            if (answer.toLowerCase().trim() === QUESTIONS[category]['6ème'][currentQ].r.toLowerCase().trim()) {
              alert("Gagné !");
              setProfile({...profile, diamonds: profile.diamonds + 15});
              setCurrentQ((currentQ + 1) % 20);
              setAnswer('');
            } else { alert("Faux !"); }
          }}>VALIDER</button>
        </div>
      )}
    </div>
  );
}

export default App;
