import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Configuration Supabase
const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// EXERCICES COMPLETS 6ÈME/5ÈME
const QUESTIONS = {
  math: [
    // Calcul mental 6ème
    { q: "Combien font 15 × 12 ?", a: "180", level: "6ème" },
    { q: "Calcule : 456 + 789", a: "1245", level: "6ème" },
    { q: "Combien font 144 ÷ 12 ?", a: "12", level: "6ème" },
    { q: "Calcule : 25 × 4", a: "100", level: "6ème" },
    { q: "Combien font 1000 - 347 ?", a: "653", level: "6ème" },
    
    // Fractions 6ème
    { q: "Quelle est la moitié de 50 ?", a: "25", level: "6ème" },
    { q: "Combien font 1/4 de 100 ?", a: "25", level: "6ème" },
    { q: "Calcule : 2/3 de 60", a: "40", level: "6ème" },
    { q: "Combien de quarts dans 3 entiers ?", a: "12", level: "6ème" },
    
    // Nombres décimaux 6ème
    { q: "Combien font 2.5 + 3.5 ?", a: "6", level: "6ème" },
    { q: "Calcule : 10.5 - 4.2", a: "6.3", level: "6ème" },
    { q: "Combien font 0.5 × 10 ?", a: "5", level: "6ème" },
    
    // Géométrie 6ème
    { q: "Combien de côtés a un hexagone ?", a: "6", level: "6ème" },
    { q: "Combien d'angles droits dans un carré ?", a: "4", level: "6ème" },
    { q: "Périmètre d'un carré de côté 5 cm ?", a: "20", level: "6ème" },
    
    // Nombres relatifs 5ème
    { q: "Calcule : -5 + 8", a: "3", level: "5ème" },
    { q: "Combien font -12 + 7 ?", a: "-5", level: "5ème" },
    { q: "Calcule : 10 - 15", a: "-5", level: "5ème" },
    { q: "Combien font -3 × 4 ?", a: "-12", level: "5ème" },
    
    // Fractions 5ème
    { q: "Simplifie : 4/8", a: "1/2", level: "5ème" },
    { q: "Calcule : 1/2 + 1/4 (en quarts)", a: "3/4", level: "5ème" },
    { q: "Combien font 3/5 de 100 ?", a: "60", level: "5ème" },
    
    // Aires et périmètres 5ème
    { q: "Aire d'un rectangle 5×8 ?", a: "40", level: "5ème" },
    { q: "Périmètre d'un rectangle 3×7 ?", a: "20", level: "5ème" },
    { q: "Aire d'un carré de côté 6 cm ?", a: "36", level: "5ème" },
    
    // Pourcentages 5ème
    { q: "10% de 200 ?", a: "20", level: "5ème" },
    { q: "50% de 80 ?", a: "40", level: "5ème" },
    { q: "25% de 60 ?", a: "15", level: "5ème" },
    
    // Priorités opératoires 5ème
    { q: "Calcule : 2 + 3 × 4", a: "14", level: "5ème" },
    { q: "Calcule : (5 + 3) × 2", a: "16", level: "5ème" },
    { q: "Calcule : 20 - 4 × 3", a: "8", level: "5ème" },
  ],
  
  french: [
    // Grammaire 6ème
    { q: "Nature du mot 'rapidement'", a: "adverbe", level: "6ème" },
    { q: "COD dans : 'Je mange une pomme'", a: "une pomme", level: "6ème" },
    { q: "Sujet de : 'Le chat dort'", a: "le chat", level: "6ème" },
    { q: "Type de phrase : 'Viens ici !'", a: "imperative", level: "6ème" },
    
    // Conjugaison 6ème
    { q: "Présent de 'faire' à nous", a: "faisons", level: "6ème" },
    { q: "Imparfait de 'avoir' à je", a: "avais", level: "6ème" },
    { q: "Futur de 'aller' à tu", a: "iras", level: "6ème" },
    { q: "Présent de 'voir' à ils", a: "voient", level: "6ème" },
    { q: "Passé composé de 'finir' à j'", a: "ai fini", level: "6ème" },
    
    // Orthographe 6ème
    { q: "Pluriel de 'cheval'", a: "chevaux", level: "6ème" },
    { q: "Féminin de 'acteur'", a: "actrice", level: "6ème" },
    { q: "Accord : 'Les filles sont (content)'", a: "contentes", level: "6ème" },
    { q: "Pluriel de 'bateau'", a: "bateaux", level: "6ème" },
    
    // Vocabulaire 6ème
    { q: "Synonyme de 'joyeux'", a: "heureux", level: "6ème" },
    { q: "Contraire de 'grand'", a: "petit", level: "6ème" },
    { q: "Famille de 'dent'", a: "dentiste", level: "6ème" },
    
    // Grammaire 5ème
    { q: "Nature de 'que' dans 'Je sais que tu viens'", a: "conjonction", level: "5ème" },
    { q: "Fonction de 'à Paris' dans 'Il va à Paris'", a: "ccl", level: "5ème" },
    { q: "Complément du nom dans 'Le chat de Marie'", a: "de marie", level: "5ème" },
    
    // Conjugaison 5ème
    { q: "Conditionnel présent de 'pouvoir' à je", a: "pourrais", level: "5ème" },
    { q: "Subjonctif présent de 'être' à il", a: "soit", level: "5ème" },
    { q: "Passé simple de 'faire' à il", a: "fit", level: "5ème" },
    { q: "Plus-que-parfait de 'partir' à j'", a: "etais parti", level: "5ème" },
    
    // Figures de style 5ème
    { q: "Figure : 'Il est fort comme un lion'", a: "comparaison", level: "5ème" },
    { q: "Figure : 'La mer est un miroir'", a: "metaphore", level: "5ème" },
    { q: "Figure : 'Je meurs de faim'", a: "hyperbole", level: "5ème" },
    
    // Analyse de phrase 5ème
    { q: "Proposition principale dans 'Je pense qu'il viendra'", a: "je pense", level: "5ème" },
    { q: "Type de verbe : 'sembler'", a: "etat", level: "5ème" },
  ],
  
  english: [
    // Vocabulaire de base 6ème
    { q: "Translate 'chien'", a: "dog", level: "6ème" },
    { q: "Translate 'chat'", a: "cat", level: "6ème" },
    { q: "Translate 'maison'", a: "house", level: "6ème" },
    { q: "Translate 'école'", a: "school", level: "6ème" },
    { q: "Translate 'ami'", a: "friend", level: "6ème" },
    { q: "Translate 'famille'", a: "family", level: "6ème" },
    
    // Nombres 6ème
    { q: "How do you say '15' in English?", a: "fifteen", level: "6ème" },
    { q: "How do you say '20' in English?", a: "twenty", level: "6ème" },
    { q: "How do you say '100' in English?", a: "hundred", level: "6ème" },
    
    // Couleurs 6ème
    { q: "Translate 'rouge'", a: "red", level: "6ème" },
    { q: "Translate 'bleu'", a: "blue", level: "6ème" },
    { q: "Translate 'vert'", a: "green", level: "6ème" },
    { q: "Translate 'jaune'", a: "yellow", level: "6ème" },
    
    // Verbes de base 6ème
    { q: "Present simple 'I (to be) happy'", a: "am", level: "6ème" },
    { q: "Present simple 'He (to have) a dog'", a: "has", level: "6ème" },
    { q: "Present simple 'They (to go) to school'", a: "go", level: "6ème" },
    
    // Questions 6ème
    { q: "How do you say 'Comment t'appelles-tu?'", a: "what is your name", level: "6ème" },
    { q: "How do you say 'Quel âge as-tu?'", a: "how old are you", level: "6ème" },
    
    // Verbes irréguliers 5ème
    { q: "Past simple of 'go'", a: "went", level: "5ème" },
    { q: "Past simple of 'eat'", a: "ate", level: "5ème" },
    { q: "Past simple of 'see'", a: "saw", level: "5ème" },
    { q: "Past simple of 'make'", a: "made", level: "5ème" },
    { q: "Past simple of 'take'", a: "took", level: "5ème" },
    
    // Present continuous 5ème
    { q: "Present continuous 'I (read) a book'", a: "am reading", level: "5ème" },
    { q: "Present continuous 'She (play) tennis'", a: "is playing", level: "5ème" },
    { q: "Present continuous 'They (watch) TV'", a: "are watching", level: "5ème" },
    
    // Comparatifs 5ème
    { q: "Comparative of 'big'", a: "bigger", level: "5ème" },
    { q: "Comparative of 'good'", a: "better", level: "5ème" },
    { q: "Superlative of 'happy'", a: "happiest", level: "5ème" },
    
    // Questions complexes 5ème
    { q: "Question tag : 'You like pizza, ... ?'", a: "don't you", level: "5ème" },
    { q: "Indirect question : 'Where does he live?' → 'I don't know ...'", a: "where he lives", level: "5ème" },
  ]
};

const AVATARS = ['🧁', '🍰', '🍭', '🍬', '🍩', '🍪', '🧋', '🍦', '🌈', '⭐', '💎', '🦄'];
const QUOTES = [
  "Chaque jour est une nouvelle aventure ! ✨",
  "Tu es capable de grandes choses ! 🌟",
  "Apprendre, c'est grandir chaque jour ! 🌱",
  "Ta créativité est magique ! 🎨",
  "Continue, tu es incroyable ! 💫"
];

// TETRIS EXPLOSIF - Configuration
const ROWS = 16;
const COLS = 10;
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#FFB4D4' },        // Rose
  O: { shape: [[2, 2], [2, 2]], color: '#B5E7FF' },      // Bleu ciel
  T: { shape: [[0, 3, 0], [3, 3, 3]], color: '#C1F7DC' }, // Vert menthe
  S: { shape: [[0, 4, 4], [4, 4, 0]], color: '#FFE5B4' }, // Pêche
  Z: { shape: [[5, 5, 0], [0, 5, 5]], color: '#E0BBE4' }, // Lavande
  J: { shape: [[6, 0, 0], [6, 6, 6]], color: '#FFD4B8' }, // Corail
  L: { shape: [[0, 0, 7], [7, 7, 7]], color: '#C8F7DC' }  // Vert clair
};

function App() {
  // États d'authentification
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  // États du jeu
  const [category, setCategory] = useState('math');
  const [level, setLevel] = useState('6ème');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  // États de personnalisation
  const [selectedAvatar, setSelectedAvatar] = useState('🧁');
  const [showSettings, setShowSettings] = useState(false);

  // États Tetris
  const [showTetris, setShowTetris] = useState(false);
  const [tetrisBoard, setTetrisBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [tetrisScore, setTetrisScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [explosions, setExplosions] = useState([]);

  const gameLoopRef = useRef(null);

  function createEmptyBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  }

  function getRandomPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return { ...TETROMINOS[randomPiece], type: randomPiece };
  }

  // Filtrer les questions par niveau
  const getFilteredQuestions = () => {
    return QUESTIONS[category].filter(q => q.level === level);
  };

  // Authentification
  const handleAuth = async (type) => {
    if (!username || password.length < 6) {
      alert("⚠️ Pseudo et mot de passe (6+ caractères) requis !");
      return;
    }

    const email = username.toLowerCase() + "@candy.app";

    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("❌ " + error.message);
        return;
      }
      await supabase.from('profiles').insert([{
        id: data.user.id,
        email: username,
        diamonds: 100,
        level: 1,
        streak: 0
      }]);
      alert("✨ Compte créé ! Connecte-toi maintenant.");
      window.location.reload();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("❌ Pseudo ou mot de passe incorrect");
        return;
      }

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
      
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar) setSelectedAvatar(savedAvatar);
    }
  };

  // Gestion des questions
  const handleCheckAnswer = async () => {
    const filteredQuestions = getFilteredQuestions();
    const correctAnswer = filteredQuestions[currentQuestion].a.toLowerCase().trim();
    const userAnswer = answer.toLowerCase().trim();

    const newStats = { ...stats, total: stats.total + 1 };

    if (userAnswer === correctAnswer || correctAnswer.includes(userAnswer)) {
      newStats.correct++;
      
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }

      const updatedProfile = {
        ...profile,
        diamonds: profile.diamonds + 15, // Plus de diamants pour les exercices niveau collège
        streak: profile.streak + 1
      };

      await supabase.from('profiles').update({
        diamonds: updatedProfile.diamonds,
        streak: updatedProfile.streak
      }).eq('id', profile.id);

      setProfile(updatedProfile);
      setShowQuestion(false);
      setCurrentQuestion((currentQuestion + 1) % filteredQuestions.length);
      setAnswer('');
    } else {
      alert("❌ Pas tout à fait ! Réessaie !");
    }

    setStats(newStats);
  };

  // TETRIS EXPLOSIF - Logique
  const canMove = useCallback((piece, pos, board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  }, []);

  // Vérifier et exploser les bonbons de même couleur
  const checkAndExplode = useCallback((board) => {
    let newBoard = board.map(row => [...row]);
    let exploded = false;
    let explosionPositions = [];
    let totalExploded = 0;

    // Vérifier horizontalement
    for (let y = 0; y < ROWS; y++) {
      let colorCount = {};
      let colorPositions = {};
      
      for (let x = 0; x < COLS; x++) {
        const cell = newBoard[y][x];
        if (cell > 0) {
          if (!colorCount[cell]) {
            colorCount[cell] = 0;
            colorPositions[cell] = [];
          }
          colorCount[cell]++;
          colorPositions[cell].push({ x, y });
        }
      }

      // Si 3 ou plus de la même couleur
      for (let color in colorCount) {
        if (colorCount[color] >= 3) {
          exploded = true;
          totalExploded += colorCount[color];
          colorPositions[color].forEach(pos => {
            explosionPositions.push(pos);
            newBoard[pos.y][pos.x] = 0;
          });
        }
      }
    }

    // Vérifier verticalement
    for (let x = 0; x < COLS; x++) {
      let colorCount = {};
      let colorPositions = {};
      
      for (let y = 0; y < ROWS; y++) {
        const cell = newBoard[y][x];
        if (cell > 0) {
          if (!colorCount[cell]) {
            colorCount[cell] = 0;
            colorPositions[cell] = [];
          }
          colorCount[cell]++;
          colorPositions[cell].push({ x, y });
        }
      }

      for (let color in colorCount) {
        if (colorCount[color] >= 3) {
          exploded = true;
          totalExploded += colorCount[color];
          colorPositions[color].forEach(pos => {
            explosionPositions.push(pos);
            newBoard[pos.y][pos.x] = 0;
          });
        }
      }
    }

    // Faire tomber les pièces
    if (exploded) {
      for (let x = 0; x < COLS; x++) {
        let writeY = ROWS - 1;
        for (let y = ROWS - 1; y >= 0; y--) {
          if (newBoard[y][x] !== 0) {
            if (y !== writeY) {
              newBoard[writeY][x] = newBoard[y][x];
              newBoard[y][x] = 0;
            }
            writeY--;
          }
        }
      }

      // Calculer le score avec combo
      const newCombo = combo + 1;
      const points = totalExploded * 50 * newCombo;
      setTetrisScore(prev => prev + points);
      setCombo(newCombo);
      setExplosions(explosionPositions);

      // Confetti pour les explosions
      if (window.confetti) {
        window.confetti({
          particleCount: totalExploded * 10,
          spread: 100,
          origin: { y: 0.6 }
        });
      }

      setTimeout(() => setExplosions([]), 300);

      // Vérifier récursivement s'il y a d'autres explosions possibles
      setTimeout(() => {
        const result = checkAndExplode(newBoard);
        if (!result.exploded) {
          setCombo(0); // Reset combo quand plus d'explosions
        }
      }, 500);

      return { board: newBoard, exploded: true };
    }

    setCombo(0);
    return { board: newBoard, exploded: false };
  }, [combo]);

  const mergePiece = useCallback(() => {
    const newBoard = tetrisBoard.map(row => [...row]);
    
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = value;
          }
        }
      });
    });

    // Vérifier les explosions après avoir posé une pièce
    const { board: explodedBoard, exploded } = checkAndExplode(newBoard);
    setTetrisBoard(explodedBoard);

    // Spawn nouvelle pièce
    const newPiece = getRandomPiece();
    const newPos = { x: 4, y: 0 };

    if (!canMove(newPiece, newPos, explodedBoard)) {
      setGameOver(true);
      setIsPaused(true);
    } else {
      setCurrentPiece(newPiece);
      setPosition(newPos);
    }
  }, [tetrisBoard, currentPiece, position, canMove, checkAndExplode]);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused) return;

    const newPos = { ...position, y: position.y + 1 };
    
    if (canMove(currentPiece, newPos, tetrisBoard)) {
      setPosition(newPos);
    } else {
      mergePiece();
    }
  }, [currentPiece, position, tetrisBoard, canMove, mergePiece, isPaused]);

  const moveHorizontal = useCallback((direction) => {
    if (!currentPiece || isPaused) return;

    const newPos = { ...position, x: position.x + direction };
    
    if (canMove(currentPiece, newPos, tetrisBoard)) {
      setPosition(newPos);
    }
  }, [currentPiece, position, tetrisBoard, canMove, isPaused]);

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused) return;

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );

    const rotatedPiece = { ...currentPiece, shape: rotated };

    if (canMove(rotatedPiece, position, tetrisBoard)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, tetrisBoard, canMove, isPaused]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused) return;

    let newPos = { ...position };
    while (canMove(currentPiece, { ...newPos, y: newPos.y + 1 }, tetrisBoard)) {
      newPos.y++;
    }
    setPosition(newPos);
    setTimeout(mergePiece, 100);
  }, [currentPiece, position, tetrisBoard, canMove, mergePiece, isPaused]);

  // Tetris controls
  useEffect(() => {
    if (!showTetris) return;

    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTetris, moveHorizontal, moveDown, rotate, hardDrop]);

  // Game loop
  useEffect(() => {
    if (!showTetris || isPaused || gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      moveDown();
    }, 800);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [showTetris, moveDown, isPaused, gameOver]);

  const startTetris = () => {
    setTetrisBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setPosition({ x: 4, y: 0 });
    setTetrisScore(0);
    setCombo(0);
    setGameOver(false);
    setIsPaused(false);
    setShowTetris(true);
  };

  const resetTetris = () => {
    startTetris();
  };

  // Render tetris board
  const renderBoard = () => {
    const boardCopy = tetrisBoard.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              boardCopy[boardY][boardX] = value;
            }
          }
        });
      });
    }

    return boardCopy.map((row, y) => (
      <div key={y} className="tetris-row">
        {row.map((cell, x) => {
          const pieceType = Object.values(TETROMINOS).find(t => 
            t.shape.flat().includes(cell)
          );
          const isExploding = explosions.some(exp => exp.x === x && exp.y === y);
          return (
            <div
              key={`${y}-${x}`}
              className={`tetris-cell ${cell ? 'filled' : ''} ${isExploding ? 'exploding' : ''}`}
              style={{
                backgroundColor: cell ? pieceType?.color : 'rgba(255,255,255,0.05)',
              }}
            >
              {isExploding && '💥'}
            </div>
          );
        })}
      </div>
    ));
  };

  // AUTH SCREEN
  if (screen === 'auth') {
    return (
      <div className="app candy-theme">
        <div className="bubbles">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bubble" style={{
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>
        
        <div className="container">
          <div className="glass-card auth-card">
            <h1 className="logo">🍭 Candy Academy 🍬</h1>
            <p className="tagline">Entre dans un monde magique et sucré !</p>
            
            <input
              type="text"
              placeholder="✨ Ton pseudo magique"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-premium"
            />
            <input
              type="password"
              placeholder="🔐 Mot de passe (6+ caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium"
              onKeyPress={(e) => e.key === 'Enter' && handleAuth('login')}
            />
            
            <button onClick={() => handleAuth('login')} className="btn-premium">
              SE CONNECTER 🍬
            </button>
            <button onClick={() => handleAuth('signup')} className="btn-premium btn-secondary">
              CRÉER COMPTE ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TETRIS SCREEN
  if (showTetris) {
    return (
      <div className="app tetris-screen">
        <div className="tetris-container">
          <div className="tetris-header">
            <h2 className="tetris-title">🍬 Candy Tetris Explosif 💥</h2>
            <div className="tetris-stats">
              <div className="tetris-stat">💎 Score: {tetrisScore}</div>
              <div className="tetris-stat">🔥 Combo: x{combo}</div>
              <div className="tetris-stat">{isPaused ? '⏸️ PAUSE' : '▶️ JOUE'}</div>
            </div>
          </div>

          <div className="game-instructions">
            <p>🎯 <strong>BUT :</strong> Aligne 3 bonbons de la même couleur pour les faire exploser ! 💥</p>
            <p>Plus tu fais de combos, plus tu gagnes de points ! 🔥</p>
          </div>

          <div className="tetris-game">
            <div className="tetris-board">
              {renderBoard()}
            </div>

            <div className="tetris-controls">
              <h3>🎮 Contrôles</h3>
              <div className="control-grid">
                <div className="control-item">← → Déplacer</div>
                <div className="control-item">↑ Rotation</div>
                <div className="control-item">↓ Descendre</div>
                <div className="control-item">ESPACE Chute</div>
                <div className="control-item">P Pause</div>
              </div>

              <div className="control-buttons">
                <button onClick={() => moveHorizontal(-1)} className="btn-control">←</button>
                <button onClick={rotate} className="btn-control">↻</button>
                <button onClick={() => moveHorizontal(1)} className="btn-control">→</button>
                <button onClick={hardDrop} className="btn-control">⬇</button>
              </div>

              <div className="color-legend">
                <h4>🎨 Couleurs des bonbons</h4>
                <div className="legend-grid">
                  <div className="legend-item"><span style={{backgroundColor: '#FFB4D4'}} className="color-dot"></span> Rose</div>
                  <div className="legend-item"><span style={{backgroundColor: '#B5E7FF'}} className="color-dot"></span> Bleu</div>
                  <div className="legend-item"><span style={{backgroundColor: '#C1F7DC'}} className="color-dot"></span> Menthe</div>
                  <div className="legend-item"><span style={{backgroundColor: '#FFE5B4'}} className="color-dot"></span> Pêche</div>
                  <div className="legend-item"><span style={{backgroundColor: '#E0BBE4'}} className="color-dot"></span> Lavande</div>
                  <div className="legend-item"><span style={{backgroundColor: '#FFD4B8'}} className="color-dot"></span> Corail</div>
                  <div className="legend-item"><span style={{backgroundColor: '#C8F7DC'}} className="color-dot"></span> Vert</div>
                </div>
              </div>

              {gameOver && (
                <div className="game-over-card">
                  <h3>🎮 Game Over!</h3>
                  <p>Score final: {tetrisScore} 💎</p>
                  <button onClick={resetTetris} className="btn-premium">
                    Rejouer 🔄
                  </button>
                </div>
              )}

              <button onClick={() => setShowTetris(false)} className="btn-premium btn-secondary">
                Retour au Dashboard 🏠
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="app candy-theme">
      <div className="bubbles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble" style={{
            width: `${100 + i * 20}px`,
            height: `${100 + i * 20}px`,
            left: `${10 + i * 20}%`,
            top: `${15 + i * 15}%`,
            animationDelay: `${i * 0.5}s`
          }} />
        ))}
      </div>

      <div className="settings-icon" onClick={() => setShowSettings(!showSettings)}>
        ⚙️
      </div>

      <div className="container">
        {/* Header */}
        <div className="glass-card header-card">
          <div className="header-content">
            <div className="avatar-main" onClick={() => setShowSettings(true)}>
              {selectedAvatar}
            </div>
            <div className="header-info">
              <h2 className="username">{profile?.email.toUpperCase()}</h2>
              <div className="stats-row">
                <span className="stat-badge">💎 {profile?.diamonds}</span>
                <span className="stat-badge">⭐ Niv. {profile?.level}</span>
                <span className="stat-badge">🔥 {profile?.streak}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Widget */}
        <div className="glass-card widget-card">
          <div className="widget-title">💭 Citation du jour</div>
          <p className="widget-quote">{QUOTES[Math.floor(Math.random() * QUOTES.length)]}</p>
        </div>

        {/* Success Rate */}
        <div className="widgets-grid">
          <div className="glass-card mini-widget">
            <div className="widget-title">🎯 Succès</div>
            <div className="widget-value">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
          </div>
          <div className="glass-card mini-widget">
            <div className="widget-title">📊 Questions</div>
            <div className="widget-value">{stats.total}</div>
          </div>
        </div>

        {/* Tetris Button */}
        <button onClick={startTetris} className="btn-premium tetris-btn">
          🍬 Jouer à Candy Tetris Explosif 💥
        </button>

        {/* Level Selector */}
        <div className="level-selector">
          <button
            className={`level-btn ${level === '6ème' ? 'active' : ''}`}
            onClick={() => { setLevel('6ème'); setCurrentQuestion(0); }}
          >
            📚 6ème
          </button>
          <button
            className={`level-btn ${level === '5ème' ? 'active' : ''}`}
            onClick={() => { setLevel('5ème'); setCurrentQuestion(0); }}
          >
            📖 5ème
          </button>
        </div>

        {/* Categories */}
        <div className="categories">
          {['math', 'french', 'english'].map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => { setCategory(cat); setCurrentQuestion(0); }}
            >
              {cat === 'math' ? '🍩 Maths' : cat === 'french' ? '🍬 Français' : '🍦 English'}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="question-card glass-card" onClick={() => setShowQuestion(true)}>
          <div className="level-badge">{level}</div>
          <div className="emoji-big">
            {category === 'math' ? '🍩' : category === 'french' ? '🍬' : '🍦'}
          </div>
          <h3 className="question-title">
            Question #{currentQuestion + 1}/{filteredQuestions.length}
          </h3>
          <div className="reward-badge">💎 +15 Diamants</div>
        </div>

        {/* Navigation */}
        <div className="nav-arrows">
          <button
            className="nav-btn"
            onClick={() => setCurrentQuestion((currentQuestion - 1 + filteredQuestions.length) % filteredQuestions.length)}
          >
            👈
          </button>
          <button
            className="nav-btn"
            onClick={() => setCurrentQuestion((currentQuestion + 1) % filteredQuestions.length)}
          >
            👉
          </button>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestion && (
        <div className="modal-overlay" onClick={() => setShowQuestion(false)}>
          <div className="modal-card cloud-shape" onClick={(e) => e.stopPropagation()}>
            <div className="modal-level-badge">{level} - {category}</div>
            <h3 className="modal-title">🎯 Question Magique</h3>
            <p className="question-text">{filteredQuestions[currentQuestion]?.q}</p>
            <input
              type="text"
              placeholder="Ta réponse magique..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input-premium"
              onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
              autoFocus
            />
            <button onClick={handleCheckAnswer} className="btn-premium">
              Lancer le sort ! 🪄
            </button>
            <p className="link-text" onClick={() => setShowQuestion(false)}>Annuler</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">⚙️ Personnalisation Premium</h3>
            
            <div className="settings-section">
              <h4 className="section-label">👤 Choisis ton avatar</h4>
              <div className="avatar-grid">
                {AVATARS.map(avatar => (
                  <div
                    key={avatar}
                    className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      localStorage.setItem('selectedAvatar', avatar);
                    }}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="btn-premium">
              Sauvegarder ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
