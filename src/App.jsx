import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// --- DONNÉES (MATHS, FRANÇAIS, ENGLISH) ---
const QUESTIONS = {
  math: { '6ème': [{ q: "15 × 12 ?", r: "180" }, { q: "456 + 789 ?", r: "1245" }, { q: "144 ÷ 12 ?", r: "12" }, { q: "25 × 4 ?", r: "100" }, { q: "Moitié de 50 ?", r: "25" }, { q: "1/4 de 100 ?", r: "25" }, { q: "2.5 + 3.5 ?", r: "6" }, { q: "Côtés hexagone ?", r: "6" }, { q: "Périmètre carré 5cm ?", r: "20" }, { q: "Angles droits carré ?", r: "4" }, { q: "1000 - 1 ?", r: "999" }, { q: "Double de 15 ?", r: "30" }, { q: "0.5 × 10 ?", r: "5" }, { q: "Côtés triangle ?", r: "3" }, { q: "100 ÷ 4 ?", r: "25" }, { q: "9 × 8 ?", r: "72" }, { q: "7 × 7 ?", r: "49" }, { q: "Rayon diamètre 10 ?", r: "5" }, { q: "3 × 3 × 3 ?", r: "27" }, { q: "150 + 150 ?", r: "300" }] },
  french: { '6ème': [{ q: "Nature 'vite' ?", r: "adverbe" }, { q: "COD: 'Il lit un livre'", r: "un livre" }, { q: "Sujet: 'La pluie tombe'", r: "la pluie" }, { q: "Faire (nous, présent) ?", r: "faisons" }, { q: "Avoir (je, imparfait) ?", r: "avais" }, { q: "Aller (tu, futur) ?", r: "iras" }, { q: "Pluriel 'journal' ?", r: "journaux" }, { q: "Féminin 'boulanger' ?", r: "boulangère" }, { q: "Synonyme 'triste' ?", r: "malheureux" }, { q: "Contraire 'chaud' ?", r: "froid" }, { q: "Infinitif 'dormons' ?", r: "dormir" }, { q: "Type: 'Viens ici !'", r: "imperative" }, { q: "Féminin 'canard' ?", r: "cane" }, { q: "Syllabes 'école' ?", r: "3" }, { q: "Pluriel 'nez' ?", r: "nez" }, { q: "Contraire 'petit' ?", r: "grand" }, { q: "Sujet 'Je pars' ?", r: "je" }, { q: "Nature 'belle' ?", r: "adjectif" }, { q: "Verbe 'Il court' ?", r: "court" }, { q: "Synonyme 'maison' ?", r: "habitation" }] },
  english: { '6ème': [{ q: "Apple ?", r: "pomme" }, { q: "Dog ?", r: "chien" }, { q: "Yellow ?", r: "jaune" }, { q: "School ?", r: "école" }, { q: "Brother ?", r: "frère" }, { q: "Thirteen ?", r: "13" }, { q: "Water ?", r: "eau" }, { q: "Sun ?", r: "soleil" }, { q: "Green ?", r: "vert" }, { q: "To be (I) ?", r: "am" }, { q: "To have (He) ?", r: "has" }, { q: "Friend ?", r: "ami" }, { q: "Good morning ?", r: "bonjour" }, { q: "Red ?", r: "rouge" }, { q: "Thank you ?", r: "merci" }, { q: "Cat ?", r: "chat" }, { q: "House ?", r: "maison" }, { q: "Book ?", r: "livre" }, { q: "Sister ?", r: "soeur" }, { q: "Blue ?", r: "bleu" }] }
};

const AVATARS = ['🧁', '🍭', '🍩', '🍦', '🌈', '💎', '🦄'];

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);

  // 1. VÉRIFICATION DE LA SESSION AU DÉMARRAGE
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchProfile(session.user.id);
    } else {
      setLoading(false);
    }
  }

  async function fetchProfile(userId) {
    console.log("Chargement du profil pour:", userId);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (error) {
      console.error("Erreur Profil:", error);
      // Si le compte Auth existe mais pas le profil, on le crée
      const { data: newProf } = await supabase.from('profiles').insert([{ id: userId, email: 'Élève', diamonds: 100, level: 1, streak: 0 }]).select().single();
      setProfile(newProf);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  // 2. CONNEXION / INSCRIPTION
  const handleAuth = async (type) => {
    if (!username || password.length < 6) return alert("Pseudo et mot de passe (6 car.) requis !");
    setLoading(true);
    const email = `${username.toLowerCase().trim()}@candy.app`;

    try {
      if (type === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Compte créé ! Connecte-toi maintenant.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        fetchProfile(data.user.id);
      }
    } catch (err) {
      alert("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setGameMode('menu');
  };

  // 3. JEU
  const checkAnswer = async () => {
    const q = QUESTIONS[category]['6ème'][currentQ];
    if (answer.toLowerCase().trim() === q.r.toLowerCase().trim()) {
      setShowResult('correct');
      const newDiamonds = (profile.diamonds || 0) + 15;
      await supabase.from('profiles').update({ diamonds: newDiamonds }).eq('id', profile.id);
      setProfile({ ...profile, diamonds: newDiamonds });
      setTimeout(() => {
        setShowResult(null);
        setCurrentQ((currentQ + 1) % QUESTIONS[category]['6ème'].length);
        setAnswer('');
      }, 1500);
    } else {
      setShowResult('wrong');
      setTimeout(() => setShowResult(null), 1500);
    }
  };

  // --- RENDU ---
  if (loading) return <div className="app"><h1>Chargement... 🍬</h1></div>;

  if (!profile) {
    return (
      <div className="app auth-screen">
        <h1 className="logo">🍭 Candy Academy</h1>
        <div className="auth-box">
          <input placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">CRÉER COMPTE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {gameMode === 'menu' ? (
        <div className="menu">
          <div className="header">
            <span>💎 {profile.diamonds}</span>
            <button onClick={logout}>🚪</button>
          </div>
          <h1>Bonjour !</h1>
          <div className="grid">
            <button onClick={() => {setCategory('math'); setGameMode('quiz')}}>🍩 MATHS</button>
            <button onClick={() => {setCategory('french'); setGameMode('quiz')}}>🍬 FRANÇAIS</button>
            <button onClick={() => {setCategory('english'); setGameMode('quiz')}}>🍦 ANGLAIS</button>
          </div>
        </div>
      ) : (
        <div className="quiz">
          <button onClick={() => setGameMode('menu')}>← Retour</button>
          <h2>{QUESTIONS[category]['6ème'][currentQ].q}</h2>
          <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Réponse..." />
          <button onClick={checkAnswer}>Valider</button>
          {showResult && <div className={`notif ${showResult}`}>{showResult === 'correct' ? 'BRAVO ! +15💎' : 'ERREUR ❌'}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
