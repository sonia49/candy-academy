import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// QUESTIONS AMÉLIORÉES - PLUS CLAIRES ET COMPLÈTES
const QUESTIONS = {
  math: {
    '6ème': [
      { q: "Combien font 15 × 12 ?", r: "180" },
      { q: "Calcule : 456 + 789 = ?", r: "1245" },
      { q: "Combien font 144 ÷ 12 ?", r: "12" },
      { q: "Calcule : 25 × 4 = ?", r: "100" },
      { q: "Quelle est la moitié de 50 ?", r: "25" },
      { q: "Combien font 1/4 de 100 ?", r: "25" },
      { q: "Calcule : 2,5 + 3,5 = ?", r: "6" },
      { q: "Combien de côtés a un hexagone ?", r: "6" },
      { q: "Périmètre d'un carré de côté 5 cm ?", r: "20" },
      { q: "Combien d'angles droits dans un carré ?", r: "4" },
      { q: "Calcule : 1000 - 1 = ?", r: "999" },
      { q: "Quel est le double de 15 ?", r: "30" },
      { q: "Combien font 0,5 × 10 ?", r: "5" },
      { q: "Combien de côtés a un triangle ?", r: "3" },
      { q: "Calcule : 100 ÷ 4 = ?", r: "25" },
      { q: "Table de 9 : 9 × 8 = ?", r: "72" },
      { q: "Combien font 7 × 7 ?", r: "49" },
      { q: "Si le diamètre = 10 cm, rayon = ?", r: "5" },
      { q: "Calcule : 3 × 3 × 3 = ?", r: "27" },
      { q: "Combien font 150 + 150 ?", r: "300" }
    ],
    '5ème': [
      { q: "Calcule : -5 + 8 = ?", r: "3" },
      { q: "Combien font -12 + 7 ?", r: "-5" },
      { q: "Calcule : 10 - 15 = ?", r: "-5" },
      { q: "Combien font -3 × 4 ?", r: "-12" },
      { q: "Simplifie la fraction : 4/8", r: "1/2" },
      { q: "Aire d'un rectangle 5 cm × 8 cm ?", r: "40" },
      { q: "Combien font 10% de 200 ?", r: "20" },
      { q: "Calcule : 2 + 3 × 4 = ? (ordre !)", r: "14" },
      { q: "Calcule : (5 + 3) × 2 = ?", r: "16" },
      { q: "Aire d'un carré de côté 6 cm ?", r: "36" }
    ]
  },
  french: {
    '6ème': [
      { q: "Quelle est la nature de 'rapidement' ?", r: "adverbe" },
      { q: "COD dans : 'Je mange une pomme'", r: "une pomme" },
      { q: "Sujet dans : 'Le chat dort'", r: "le chat" },
      { q: "Conjugue 'faire' au présent (nous)", r: "faisons" },
      { q: "Conjugue 'avoir' à l'imparfait (je)", r: "avais" },
      { q: "Conjugue 'aller' au futur (tu)", r: "iras" },
      { q: "Quel est le pluriel de 'cheval' ?", r: "chevaux" },
      { q: "Féminin de 'acteur' ?", r: "actrice" },
      { q: "Synonyme de 'joyeux' ?", r: "heureux" },
      { q: "Contraire de 'grand' ?", r: "petit" },
      { q: "Infinitif du verbe 'nous dormons'", r: "dormir" },
      { q: "Type de phrase : 'Sortez !' ?", r: "imperative" },
      { q: "Féminin de 'lion' ?", r: "lionne" },
      { q: "Combien de syllabes : 'bateau' ?", r: "2" },
      { q: "Pluriel de 'gaz' ?", r: "gaz" },
      { q: "Contraire de 'petit' ?", r: "grand" },
      { q: "Sujet dans 'Tu chantes' ?", r: "tu" },
      { q: "Nature de 'belle' ?", r: "adjectif" },
      { q: "Verbe dans 'Il finit' ?", r: "finit" },
      { q: "Synonyme de 'triste' ?", r: "malheureux" }
    ],
    '5ème': [
      { q: "Conditionnel présent de 'pouvoir' (je)", r: "pourrais" },
      { q: "Subjonctif présent de 'être' (il)", r: "soit" },
      { q: "Passé simple de 'faire' (il)", r: "fit" },
      { q: "Figure de style : 'Fort comme un lion'", r: "comparaison" },
      { q: "Figure de style : 'La mer est un miroir'", r: "metaphore" },
      { q: "Figure de style : 'Je meurs de faim'", r: "hyperbole" },
      { q: "Type de verbe : 'sembler'", r: "etat" },
      { q: "Pluriel de 'bijou' ?", r: "bijoux" },
      { q: "Féminin de 'directeur' ?", r: "directrice" },
      { q: "Conjugue 'venir' au présent (nous)", r: "venons" }
    ]
  },
  english: {
    '6ème': [
      { q: "Traduis 'chien' en anglais", r: "dog" },
      { q: "Traduis 'chat' en anglais", r: "cat" },
      { q: "Traduis 'maison' en anglais", r: "house" },
      { q: "Traduis 'école' en anglais", r: "school" },
      { q: "Comment dit-on '15' ?", r: "fifteen" },
      { q: "Traduis 'rouge' en anglais", r: "red" },
      { q: "Traduis 'bleu' en anglais", r: "blue" },
      { q: "I (to be) happy → I ... happy", r: "am" },
      { q: "He (to have) a dog → He ... a dog", r: "has" },
      { q: "Traduis 'famille' en anglais", r: "family" },
      { q: "Traduis 'pomme' en anglais", r: "apple" },
      { q: "Traduis 'livre' en anglais", r: "book" },
      { q: "Comment dit-on 'bonjour' ?", r: "hello" },
      { q: "Comment dit-on 'merci' ?", r: "thank you" },
      { q: "Traduis 'jaune' en anglais", r: "yellow" },
      { q: "Traduis 'vert' en anglais", r: "green" },
      { q: "Traduis 'frère' en anglais", r: "brother" },
      { q: "Traduis 'sœur' en anglais", r: "sister" },
      { q: "Traduis 'soleil' en anglais", r: "sun" },
      { q: "Traduis 'eau' en anglais", r: "water" }
    ],
    '5ème': [
      { q: "Passé simple de 'go' ?", r: "went" },
      { q: "Passé simple de 'eat' ?", r: "ate" },
      { q: "Passé simple de 'see' ?", r: "saw" },
      { q: "Passé simple de 'make' ?", r: "made" },
      { q: "Present continuous: I (read) a book", r: "am reading" },
      { q: "Present continuous: She (play) tennis", r: "is playing" },
      { q: "Comparatif de 'big' ?", r: "bigger" },
      { q: "Comparatif de 'good' ?", r: "better" },
      { q: "Superlatif de 'happy' ?", r: "happiest" },
      { q: "Passé simple de 'take' ?", r: "took" }
    ]
  }
};

const CAPITALS_GAME = [
  { country: "France", capital: "Paris" },
  { country: "Espagne", capital: "Madrid" },
  { country: "Italie", capital: "Rome" },
  { country: "Allemagne", capital: "Berlin" },
  { country: "Royaume-Uni", capital: "Londres" },
  { country: "Portugal", capital: "Lisbonne" },
  { country: "Belgique", capital: "Bruxelles" },
  { country: "Pays-Bas", capital: "Amsterdam" },
  { country: "Suisse", capital: "Berne" },
  { country: "Autriche", capital: "Vienne" }
];

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];

// CITATIONS MOTIVANTES
const QUOTES = [
  "Chaque question est une victoire ! 🏆",
  "Tu progresses à chaque réponse ! 📈",
  "Continue, tu es incroyable ! 💪",
  "L'apprentissage est une aventure ! 🚀",
  "Chaque effort compte ! ⭐",
  "Tu es un champion ! 🎯"
];

// FAITS SCIENTIFIQUES SUR LE TEMPS D'ÉCRAN
const SCREEN_TIME_FACTS = {
  // Moins de 30 minutes - OK
  low: [
    "👍 Super ! Moins de 30 min d'écran, c'est parfait pour ton cerveau !",
    "🧠 Le savais-tu ? Ton cerveau apprend mieux avec des pauses régulières !",
    "✨ Bravo ! Tu protèges tes yeux en limitant ton temps d'écran !"
  ],
  // 30 min - 1h - Bien
  moderate: [
    "⏰ 30-60 min d'écran : C'est raisonnable ! Pense à faire une pause bientôt.",
    "👀 Info santé : Toutes les 20 min, regarde au loin pendant 20 secondes !",
    "🧠 Le savais-tu ? Après 45 min d'écran, ton cerveau a besoin de repos !"
  ],
  // 1h - 2h - Attention
  high: [
    "⚠️ 1-2h d'écran : C'est beaucoup ! L'OMS recommande max 2h/jour pour les enfants.",
    "👁️ Fait scientifique : Les écrans fatiguent tes yeux 3x plus vite que la lecture !",
    "🧠 Info cerveau : Après 1h d'écran, ta concentration baisse de 30% !",
    "💡 Le savais-tu ? Les écrans avant de dormir perturbent ton sommeil pendant 2h !"
  ],
  // Plus de 2h - ALERTE
  critical: [
    "🚨 ALERTE : +2h d'écran ! L'OMS dit que c'est trop pour ton âge !",
    "⚠️ Danger santé : +2h d'écran par jour augmente les risques de myopie de 80% !",
    "🧠 Fait scientifique : +2h d'écran réduit la matière grise dans ton cerveau !",
    "💤 Info sommeil : +2h d'écran retarde l'endormissement de 1h en moyenne !",
    "👀 Alerte yeux : +2h d'écran peut causer une fatigue oculaire permanente !",
    "🏃 Conseil santé : Avec +2h d'écran, tu as besoin de 1h d'activité physique !",
    "🧠 Le savais-tu ? Les enfants qui passent +3h sur écran ont 2x plus de troubles de l'attention !"
  ],
  // Plus de 3h - DANGER
  extreme: [
    "🔴 DANGER ! +3h d'écran ! C'est vraiment trop pour ta santé !",
    "🚨 URGENT : Éteins l'écran ! +3h cause des dommages sur ton développement cérébral !",
    "⚠️ Fait alarmant : +3h d'écran par jour = risque de dépression multiplié par 2 !",
    "👀 ALERTE SÉVÈRE : +3h d'écran = risque de myopie avant 18 ans de 90% !",
    "🧠 Info critique : +3h d'écran réduit ta capacité de mémorisation de 40% !",
    "💤 Danger sommeil : +3h d'écran = perte de 1h30 de sommeil par nuit !",
    "🏃 URGENT : Ton corps a besoin de bouger ! Fais du sport maintenant !",
    "📚 Alerte apprentissage : +3h d'écran = baisse de 25% des résultats scolaires !"
  ]
};

// CONSEILS SANTÉ ÉCRAN
const HEALTH_TIPS = [
  "💡 Règle 20-20-20 : Toutes les 20 min, regarde à 20 pieds (6m) pendant 20 secondes !",
  "🏃 Bouge toutes les heures ! Ton corps et ton cerveau ont besoin de mouvement !",
  "💧 Bois de l'eau régulièrement, les écrans font oublier la soif !",
  "☀️ Va dehors au moins 1h par jour, la lumière naturelle protège tes yeux !",
  "😴 Arrête les écrans 1h avant de dormir pour bien dormir !",
  "🧘 Étire-toi ! Les écrans créent des tensions dans le cou et le dos !",
  "👀 Cligne des yeux souvent, on cligne 3x moins devant un écran !",
  "📏 Garde 50cm de distance minimum avec l'écran !",
  "🌙 Active le mode nuit le soir pour protéger ton sommeil !",
  "🎮 Alternes ! 30 min d'écran = 30 min d'activité physique !"
];

function App() {
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [gameMode, setGameMode] = useState('menu');
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [currentCapital, setCurrentCapital] = useState(0);
  const [capitalScore, setCapitalScore] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('🧁');
  const [showSettings, setShowSettings] = useState(false);
  
  // WIDGETS INNOVANTS
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [questionsToday, setQuestionsToday] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [brainPower, setBrainPower] = useState(0); // Jauge de concentration
  const [motivation, setMotivation] = useState(100); // Jauge de motivation
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  
  // WIDGET SANTÉ ÉCRAN
  const [totalScreenTime, setTotalScreenTime] = useState(0); // En secondes
  const [screenTimeFact, setScreenTimeFact] = useState('');
  const [healthTip, setHealthTip] = useState('');
  const [showScreenAlert, setShowScreenAlert] = useState(false);

  useEffect(() => {
    // Timer session
    const timer = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    
    // Brain power diminue avec le temps (fatigue)
    const brainTimer = setInterval(() => {
      setBrainPower(b => Math.max(0, b - 1));
    }, 10000); // Perd 1 point tous les 10s
    
    // Avatar et données
    const saved = localStorage.getItem('selectedAvatar');
    if (saved) setSelectedAvatar(saved);
    
    const savedQuestions = localStorage.getItem('questionsToday');
    if (savedQuestions) setQuestionsToday(parseInt(savedQuestions));
    
    const savedBest = localStorage.getItem('bestStreak');
    if (savedBest) setBestStreak(parseInt(savedBest));
    
    // CHARGER LE TEMPS D'ÉCRAN TOTAL AUJOURD'HUI
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('screenTimeDate');
    const savedScreenTime = localStorage.getItem('totalScreenTime');
    
    if (savedDate === today && savedScreenTime) {
      setTotalScreenTime(parseInt(savedScreenTime));
    } else {
      // Nouveau jour, reset
      localStorage.setItem('screenTimeDate', today);
      localStorage.setItem('totalScreenTime', '0');
      setTotalScreenTime(0);
    }
    
    return () => {
      clearInterval(timer);
      clearInterval(brainTimer);
    };
  }, []);

  // MISE À JOUR DU TEMPS D'ÉCRAN TOTAL
  useEffect(() => {
    const screenTimer = setInterval(() => {
      const newTotal = totalScreenTime + 1;
      setTotalScreenTime(newTotal);
      localStorage.setItem('totalScreenTime', newTotal.toString());
    }, 1000);
    
    return () => clearInterval(screenTimer);
  }, [totalScreenTime]);

  // GÉNÉRATION DES FAITS SCIENTIFIQUES
  useEffect(() => {
    const minutes = Math.floor(totalScreenTime / 60);
    
    let category = 'low';
    if (minutes >= 180) category = 'extreme'; // 3h+
    else if (minutes >= 120) category = 'critical'; // 2h+
    else if (minutes >= 60) category = 'high'; // 1h+
    else if (minutes >= 30) category = 'moderate'; // 30min+
    
    // Changer le fait toutes les minutes
    const factsList = SCREEN_TIME_FACTS[category];
    const randomFact = factsList[Math.floor(Math.random() * factsList.length)];
    setScreenTimeFact(randomFact);
    
    // Conseil santé aléatoire
    const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
    setHealthTip(randomTip);
    
    // Alertes à 1h, 2h, 3h
    if (minutes === 60 || minutes === 120 || minutes === 180) {
      setShowScreenAlert(true);
      setTimeout(() => setShowScreenAlert(false), 10000); // 10 secondes
    }
  }, [totalScreenTime]);

  // Change quote toutes les 30 secondes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 30000);
    return () => clearInterval(quoteInterval);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const handleAuth = async (type) => {
    if (!username || password.length < 6) return alert("⚠️ Pseudo et mot de passe (6+) !");
    const email = username.toLowerCase().trim() + "@candy.app";
    
    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      await supabase.from('profiles').insert([{ 
        id: data.user.id, 
        email: username, 
        diamonds: 100, 
        level: 1, 
        streak: 0 
      }]);
      alert("✨ Compte créé !");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert("Erreur connexion");
      let { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (!prof) {
        const { data: newProf } = await supabase.from('profiles')
          .insert([{ id: data.user.id, email: username, diamonds: 100, level: 1, streak: 0 }])
          .select()
          .single();
        prof = newProf;
      }
      setProfile(prof);
      setScreen('dashboard');
    }
  };

  const handleCheckAnswer = async () => {
    const questions = QUESTIONS[category][level];
    const correct = questions[currentQ].r.toLowerCase().trim();
    const userAnswer = answer.toLowerCase().trim();
    
    const newStats = { ...stats, total: stats.total + 1 };

    if (userAnswer === correct || correct.includes(userAnswer)) {
      // BONNE RÉPONSE !
      newStats.correct++;
      setShowResult('correct');
      
      // Streak
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('bestStreak', newStreak.toString());
      }
      
      // Brain Power boost !
      setBrainPower(Math.min(100, brainPower + 10));
      
      // Motivation boost !
      setMotivation(Math.min(100, motivation + 5));
      
      // Questions today
      const newCount = questionsToday + 1;
      setQuestionsToday(newCount);
      localStorage.setItem('questionsToday', newCount.toString());
      
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70 });
      }
      
      // Mise à jour profil
      const updatedProfile = {
        ...profile,
        diamonds: profile.diamonds + 15,
        streak: profile.streak + 1
      };
      
      await supabase.from('profiles').update({
        diamonds: updatedProfile.diamonds,
        streak: updatedProfile.streak
      }).eq('id', profile.id);
      
      setProfile(updatedProfile);
      
      setTimeout(() => {
        setShowResult(null);
        setCurrentQ((currentQ + 1) % questions.length);
        setAnswer('');
      }, 2000);
    } else {
      // MAUVAISE RÉPONSE
      setShowResult('wrong');
      setCurrentStreak(0); // Reset streak
      setMotivation(Math.max(0, motivation - 10)); // Perte motivation
      
      setTimeout(() => {
        setShowResult(null);
      }, 2000);
    }
    
    setStats(newStats);
  };

  // FIX CAPITALES : Générer les options UNE SEULE FOIS
  const [capitalOptions, setCapitalOptions] = useState([]);
  
  useEffect(() => {
    if (gameMode === 'capitals') {
      generateCapitalOptions();
    }
  }, [currentCapital, gameMode]);
  
  const generateCapitalOptions = () => {
    const current = CAPITALS_GAME[currentCapital];
    const allCapitals = CAPITALS_GAME.map(c => c.capital);
    const wrongOptions = allCapitals
      .filter(c => c !== current.capital)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [current.capital, ...wrongOptions]
      .sort(() => Math.random() - 0.5);
    
    setCapitalOptions(options);
  };

  const handleCapitalAnswer = (selectedCity) => {
    const correct = CAPITALS_GAME[currentCapital].capital;
    
    if (selectedCity === correct) {
      // BONNE RÉPONSE
      setCapitalScore(capitalScore + 1);
      setBrainPower(Math.min(100, brainPower + 10));
      setMotivation(Math.min(100, motivation + 5));
      
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60 });
      }
      
      if (currentCapital < CAPITALS_GAME.length - 1) {
        setTimeout(() => {
          setCurrentCapital(currentCapital + 1);
        }, 800);
      } else {
        setTimeout(() => {
          alert(`🏆 BRAVO ! Score : ${capitalScore + 1}/${CAPITALS_GAME.length}`);
          setGameMode('menu');
          setCurrentCapital(0);
          setCapitalScore(0);
        }, 1000);
      }
    } else {
      // MAUVAISE RÉPONSE
      setShowResult('wrong');
      setMotivation(Math.max(0, motivation - 10));
      setTimeout(() => {
        setShowResult(null);
      }, 1000);
    }
  };

  const startCapitalsGame = () => {
    setGameMode('capitals');
    setCurrentCapital(0);
    setCapitalScore(0);
  };

  // CALCUL WIDGETS
  const successRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const dailyGoal = 20;
  const goalProgress = Math.min(100, (questionsToday / dailyGoal) * 100);

  if (screen === 'auth') {
    return (
      <div className="app">
        <div className="auth-container">
          <h1 className="logo">🍭 Candy Academy</h1>
          <p className="tagline">Apprends en t'amusant !</p>
          <input 
            className="input-candy" 
            placeholder="✨ Ton pseudo" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            className="input-candy" 
            type="password" 
            placeholder="🔐 Mot de passe (6+)" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAuth('login')}
          />
          <button onClick={() => handleAuth('login')} className="btn-primary">SE CONNECTER</button>
          <button onClick={() => handleAuth('signup')} className="btn-secondary">S'INSCRIRE</button>
        </div>
      </div>
    );
  }

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <div className="settings-icon" onClick={() => setShowSettings(true)}>⚙️</div>
        
        <div className="dashboard">
          {/* HEADER */}
          <div className="header">
            <div className="avatar-big">{selectedAvatar}</div>
            <div className="user-info">
              <h2>{profile?.email?.toUpperCase()}</h2>
              <div className="badges">
                <span className="badge">💎 {profile?.diamonds}</span>
                <span className="badge">⭐ Niv.{profile?.level}</span>
                <span className="badge">🔥 {profile?.streak}</span>
              </div>
            </div>
          </div>

          {/* WIDGETS INNOVANTS */}
          <div className="widgets-container">
            {/* Widget Santé Écran - NOUVEAU */}
            <div className={`widget screen-health-widget ${totalScreenTime >= 7200 ? 'critical' : totalScreenTime >= 3600 ? 'warning' : ''}`}>
              <div className="widget-header-screen">
                <div className="screen-icon">📱</div>
                <div className="screen-info">
                  <div className="screen-title">Temps d'écran aujourd'hui</div>
                  <div className="screen-time">{formatTime(totalScreenTime)}</div>
                </div>
              </div>
              <div className="screen-fact">{screenTimeFact}</div>
              <div className="health-tip">{healthTip}</div>
            </div>

            {/* Widget Citation Motivante */}
            <div className="widget quote-widget">
              <div className="widget-icon">💭</div>
              <div className="widget-text">{currentQuote}</div>
            </div>

            {/* Widget Objectif Quotidien */}
            <div className="widget goal-widget">
              <div className="widget-header">
                <span>🎯 Objectif du jour</span>
                <span className="widget-value">{questionsToday}/{dailyGoal}</span>
              </div>
              <div className="progress-bar-widget">
                <div className="progress-fill-widget" style={{width: `${goalProgress}%`}}></div>
              </div>
            </div>

            {/* Mini Widgets Grid */}
            <div className="mini-widgets-grid">
              {/* Temps de Session */}
              <div className="mini-widget">
                <div className="mini-icon">⏱️</div>
                <div className="mini-value">{formatTime(sessionSeconds)}</div>
                <div className="mini-label">Session</div>
              </div>

              {/* Taux de Réussite */}
              <div className="mini-widget">
                <div className="mini-icon">🎯</div>
                <div className="mini-value">{successRate}%</div>
                <div className="mini-label">Réussite</div>
              </div>

              {/* Série Actuelle */}
              <div className="mini-widget streak-widget">
                <div className="mini-icon">🔥</div>
                <div className="mini-value">{currentStreak}</div>
                <div className="mini-label">Série</div>
              </div>

              {/* Meilleure Série */}
              <div className="mini-widget">
                <div className="mini-icon">🏆</div>
                <div className="mini-value">{bestStreak}</div>
                <div className="mini-label">Record</div>
              </div>
            </div>

            {/* Jauges Innovantes */}
            <div className="gauges-container">
              {/* Jauge Brain Power */}
              <div className="gauge">
                <div className="gauge-header">
                  <span>🧠 Concentration</span>
                  <span className="gauge-value">{brainPower}%</span>
                </div>
                <div className="gauge-bar">
                  <div 
                    className="gauge-fill brain-fill" 
                    style={{width: `${brainPower}%`}}
                  ></div>
                </div>
                <div className="gauge-tip">💡 Diminue avec le temps, boost avec bonnes réponses !</div>
              </div>

              {/* Jauge Motivation */}
              <div className="gauge">
                <div className="gauge-header">
                  <span>💪 Motivation</span>
                  <span className="gauge-value">{motivation}%</span>
                </div>
                <div className="gauge-bar">
                  <div 
                    className="gauge-fill motivation-fill" 
                    style={{width: `${motivation}%`}}
                  ></div>
                </div>
                <div className="gauge-tip">🎊 +5 par bonne réponse, -10 par erreur</div>
              </div>
            </div>
          </div>

          <h3 className="section-title">🎮 Choisis ton jeu</h3>
          
          {/* BOUTONS DE JEU */}
          <div className="game-buttons">
            <button 
              className="game-btn math-btn" 
              onClick={() => {setGameMode('quiz'); setCategory('math'); setCurrentQ(0);}}
            >
              <span className="btn-icon">🍩</span>
              <span className="btn-text">MATHS</span>
            </button>
            
            <button 
              className="game-btn french-btn" 
              onClick={() => {setGameMode('quiz'); setCategory('french'); setCurrentQ(0);}}
            >
              <span className="btn-icon">🍬</span>
              <span className="btn-text">FRANÇAIS</span>
            </button>
            
            <button 
              className="game-btn english-btn" 
              onClick={() => {setGameMode('quiz'); setCategory('english'); setCurrentQ(0);}}
            >
              <span className="btn-icon">🍦</span>
              <span className="btn-text">ENGLISH</span>
            </button>
            
            <button 
              className="game-btn world-btn" 
              onClick={startCapitalsGame}
            >
              <span className="btn-icon">🌍</span>
              <span className="btn-text">CAPITALES</span>
            </button>
          </div>
        </div>

        {/* MODAL SETTINGS */}
        {showSettings && (
          <div className="modal" onClick={() => setShowSettings(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>⚙️ Choisis ton avatar</h3>
              <div className="avatar-grid">
                {AVATARS.map(av => (
                  <div
                    key={av}
                    className={`avatar-option ${selectedAvatar === av ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(av);
                      localStorage.setItem('selectedAvatar', av);
                    }}
                  >
                    {av}
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setShowSettings(false)}>OK</button>
            </div>
          </div>
        )}

        {/* ALERTE TEMPS D'ÉCRAN */}
        {showScreenAlert && (
          <div className="screen-alert-overlay">
            <div className="screen-alert-card">
              <div className="alert-icon">⚠️</div>
              <h2 className="alert-title">ALERTE SANTÉ !</h2>
              <p className="alert-message">
                Tu as déjà passé <strong>{formatTime(totalScreenTime)}</strong> sur écran aujourd'hui !
              </p>
              <div className="alert-fact">{screenTimeFact}</div>
              <div className="alert-actions">
                <button className="btn-primary" onClick={() => setShowScreenAlert(false)}>
                  J'ai compris ! 👍
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MODE QUIZ
  if (gameMode === 'quiz') {
    const questions = QUESTIONS[category][level];
    const currentQuestion = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="app">
        <div className="quiz-container">
          <div className="quiz-header">
            <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
            <div className="quiz-info">
              <span className="category-badge">{category.toUpperCase()}</span>
              <span className="level-badge">{level}</span>
            </div>
          </div>

          <div className="level-selector">
            <button 
              className={`level-btn ${level === '6ème' ? 'active' : ''}`}
              onClick={() => { setLevel('6ème'); setCurrentQ(0); }}
            >
              6ème
            </button>
            <button 
              className={`level-btn ${level === '5ème' ? 'active' : ''}`}
              onClick={() => { setLevel('5ème'); setCurrentQ(0); }}
            >
              5ème
            </button>
          </div>

          <div className="candy-progress-container">
            <div className="candy-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Question {currentQ + 1}/{questions.length}</p>

          <div className="question-box">
            <h2 className="question-text">{currentQuestion?.q}</h2>
            
            <input 
              className="answer-input" 
              value={answer} 
              onChange={e => setAnswer(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleCheckAnswer()}
              placeholder="Ta réponse..."
              autoFocus
            />
            
            <button className="btn-primary" onClick={handleCheckAnswer}>
              VALIDER ✨
            </button>
          </div>

          {showResult && (
            <div className={`result-overlay ${showResult}`}>
              <div className="result-card">
                {showResult === 'correct' ? (
                  <>
                    <div className="result-emoji">🎉</div>
                    <h2>BRAVO !</h2>
                    <p>C'est la bonne réponse !</p>
                    <p className="reward">+15 💎</p>
                  </>
                ) : (
                  <>
                    <div className="result-emoji">😅</div>
                    <h2>PAS TOUT À FAIT...</h2>
                    <p>La bonne réponse était :</p>
                    <p className="correct-answer">{currentQuestion?.r}</p>
                    <p className="encouragement">Réessaie la prochaine !</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MODE CAPITALES (CORRIGÉ)
  if (gameMode === 'capitals') {
    const current = CAPITALS_GAME[currentCapital];
    const progress = ((currentCapital + 1) / CAPITALS_GAME.length) * 100;

    return (
      <div className="app">
        <div className="quiz-container">
          <div className="quiz-header">
            <button className="back-btn" onClick={() => setGameMode('menu')}>← Retour</button>
            <div className="quiz-info">
              <span className="category-badge">CAPITALES</span>
              <span className="score-badge">Score: {capitalScore}/{currentCapital}</span>
            </div>
          </div>

          <div className="candy-progress-container">
            <div className="candy-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Pays {currentCapital + 1}/{CAPITALS_GAME.length}</p>

          <div className="capitals-game">
            <div className="world-map">🗺️</div>
            <h2 className="capitals-question">Quelle est la capitale de :</h2>
            <h1 className="country-name">{current.country}</h1>

            <div className="capitals-grid">
              {capitalOptions.map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  className="capital-option"
                  onClick={() => handleCapitalAnswer(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {showResult === 'wrong' && (
            <div className="result-overlay wrong">
              <div className="result-card">
                <div className="result-emoji">😅</div>
                <h2>Oups !</h2>
                <p>Réessaie !</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default App;
