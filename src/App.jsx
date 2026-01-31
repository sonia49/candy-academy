import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// J'ai mis ici tes 60 exercices (20 par matière)
const DATA = {
  math: [{q:"15 × 12 ?", r:"180"}, {q:"456+789 ?", r:"1245"}, {q:"144÷12 ?", r:"12"}, {q:"25×4 ?", r:"100"}, {q:"Moitié de 50 ?", r:"25"}, {q:"1/4 de 100 ?", r:"25"}, {q:"2.5+3.5 ?", r:"6"}, {q:"Côtés hexagone ?", r:"6"}, {q:"Périmètre carré 5 ?", r:"20"}, {q:"Angles droits carré ?", r:"4"}, {q:"1000-1 ?", r:"999"}, {q:"Double 15 ?", r:"30"}, {q:"0.5×10 ?", r:"5"}, {q:"Côtés triangle ?", r:"3"}, {q:"100÷4 ?", r:"25"}, {q:"9×8 ?", r:"72"}, {q:"7×7 ?", r:"49"}, {q:"Rayon si diam 10 ?", r:"5"}, {q:"3×3×3 ?", r:"27"}, {q:"150+150 ?", r:"300"}],
  french: [{q:"Nature de 'vite' ?", r:"adverbe"}, {q:"COD: Il mange une pomme", r:"une pomme"}, {q:"Sujet: Le chat dort", r:"le chat"}, {q:"Faire (nous, présent) ?", r:"faisons"}, {q:"Avoir (je, imparf) ?", r:"avais"}, {q:"Futur aller (tu) ?", r:"iras"}, {q:"Pluriel journal ?", r:"journaux"}, {q:"Féminin boulanger ?", r:"boulangère"}, {q:"Synonyme joyeux ?", r:"heureux"}, {q:"Contraire grand ?", r:"petit"}, {q:"Infinitif dormons ?", r:"dormir"}, {q:"Type: Sortez !", r:"imperative"}, {q:"Féminin lion ?", r:"lionne"}, {q:"Syllabes bateau ?", r:"2"}, {q:"Pluriel gaz ?", r:"gaz"}, {q:"Contraire froid ?", r:"chaud"}, {q:"Sujet: Tu chantes", r:"tu"}, {q:"Nature belle ?", r:"adjectif"}, {q:"Verbe: Il finit", r:"finit"}, {q:"Synonyme jolie ?", r:"belle"}],
  english: [{q:"Dog ?", r:"chien"}, {q:"Cat ?", r: "chat"}, {q:"House ?", r:"maison"}, {q:"School ?", r:"école"}, {q:"15 ?", r:"fifteen"}, {q:"Red ?", r:"rouge"}, {q:"Blue ?", r:"bleu"}, {q:"I (be) happy ?", r:"am"}, {q:"He (have) a dog ?", r:"has"}, {q:"Family ?", r:"famille"}, {q:"Apple ?", r:"pomme"}, {q:"Book ?", r:"livre"}, {q:"Hello ?", r:"bonjour"}, {q:"Thank you ?", r:"merci"}, {q:"Yellow ?", r:"jaune"}, {q:"Green ?", r:"vert"}, {q:"Brother ?", r:"frère"}, {q:"Sister ?", r:"soeur"}, {q:"Sun ?", r:"soleil"}, {q:"Water ?", r:"eau"}]
};

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('auth'); // auth, game
  const [cat, setCat] = useState('math');
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState('');

  // FONCTION DE CONNEXION PURE
  async function login() {
    const email = `${username.toLowerCase().trim()}@candy.app`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return alert("Erreur: " + error.message);
    
    if (data.user) {
      setSession(data.user);
      // On cherche le profil, s'il n'existe pas, on le crée en force
      let { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (!p) {
        const { data: n } = await supabase.from('profiles').insert([{ id: data.user.id, email: username, diamonds: 100 }]).select().single();
        p = n;
      }
      setProfile(p);
      setMode('game');
    }
  }

  async function signup() {
    const email = `${username.toLowerCase().trim()}@candy.app`;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Inscrit ! Clique sur CONNEXION.");
  }

  // --- RENDU ---
  if (mode === 'auth') {
    return (
      <div className="app">
        <h1>🍭 CANDY ACADEMY</h1>
        <input placeholder="Pseudo" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Pass" onChange={e => setPassword(e.target.value)} />
        <button onClick={login} style={{background: 'pink'}}>CONNEXION</button>
        <button onClick={signup}>S'INSCRIRE</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <span>👤 {profile?.email}</span> | <span>💎 {profile?.diamonds}</span>
        <button onClick={() => window.location.reload()}>🚪 Quitter</button>
      </div>
      
      <div className="tabs">
        <button onClick={() => setCat('math')}>MATHS</button>
        <button onClick={() => setCat('french')}>FRANÇAIS</button>
        <button onClick={() => setCat('english')}>ANGLAIS</button>
      </div>

      <div className="quiz">
        <h2>{DATA[cat][idx].q}</h2>
        <input value={ans} onChange={e => setAns(e.target.value)} />
        <button onClick={() => {
          if(ans.toLowerCase().trim() === DATA[cat][idx].r.toLowerCase().trim()){
            alert("Gagné ! +15💎");
            setProfile({...profile, diamonds: profile.diamonds + 15});
            setIdx((idx + 1) % 20);
            setAns('');
          } else {
            alert("Faux !");
          }
        }}>Valider</button>
      </div>
    </div>
  );
}

export default App;
