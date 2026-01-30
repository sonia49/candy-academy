import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Configuration Supabase
const supabase = createClient(
  'https://lcbwehiwjowgthazrydy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYndlaGl3am93Z3RoYXpyeWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTg4NjIsImV4cCI6MjA4NDkzNDg2Mn0.2nP42Uh262Jt-1stolzSVM8_EEzrAdCutKgd7B2MurY'
);

// Questions par catégorie
const QUESTIONS = {
  math: [
    { q: "5 + 8", a: "13" }, { q: "12 × 3", a: "36" }, { q: "20 - 7", a: "13" }, { q: "15 ÷ 3", a: "5" },
    { q: "9 + 6", a: "15" }, { q: "7 × 4", a: "28" }, { q: "18 - 9", a: "9" }, { q: "24 ÷ 6", a: "4" },
    { q: "11 + 14", a: "25" }, { q: "6 × 7", a: "42" }, { q: "30 - 12", a: "18" }, { q: "45 ÷ 9", a: "5" },
    { q: "8 + 17", a: "25" }, { q: "9 × 5", a: "45" }, { q: "50 - 23", a: "27" }, { q: "36 ÷ 4", a: "9" },
  ],
  french: [
    { q: "Pluriel de 'Cheval'", a: "chevaux" }, { q: "Pluriel de 'Hibou'", a: "hiboux" },
    { q: "Pluriel de 'Œuf'", a: "œufs" }, { q: "Pluriel de 'Chat'", a: "chats" },
    { q: "Pluriel de 'Gâteau'", a: "gâteaux" }, { q: "Pluriel de 'Journal'", a: "journaux" },
  ],
  english: [
    { q: "'Chat' en anglais", a: "cat" }, { q: "'Chien' en anglais", a: "dog" },
    { q: "'Maison' en anglais", a: "house" }, { q: "'Livre' en anglais", a: "book" },
    { q: "'Soleil' en anglais", a: "sun" }, { q: "'Lune' en anglais", a: "moon" },
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

// TETRIS CONFIGURATION
const ROWS = 16;
const COLS = 10;
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#FFB4D4', number: '1' },
  O: { shape: [[2, 2], [2, 2]], color: '#B5E7FF', number: '2' },
  T: { shape: [[0, 3, 0], [3, 3, 3]], color: '#C1F7DC', number: '3' },
  S: { shape: [[0, 4, 4], [4, 4, 0]], color: '#FFE5B4', number: '4' },
  Z: { shape: [[5, 5, 0], [0, 5, 5]], color: '#E0BBE4', number: '5' },
  J: { shape: [[6, 0, 0], [6, 6, 6]], color: '#FFD4B8', number: '6' },
  L: { shape: [[0, 0, 7], [7, 7, 7]], color: '#C8F7DC', number: '7' }
};

function App() {
  // États d'authentification
  const [screen, setScreen] = useState('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  // États du jeu
  const [category, setCategory] = useState('math');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  // États de personnalisation
  const [selectedAvatar, setSelectedAvatar] = useState('🧁');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('candy');

  // États Tetris
  const [showTetris, setShowTetris] = useState(false);
  const [tetrisBoard, setTetrisBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [tetrisScore, setTetrisScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef(null);

  function createEmptyBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  }

  function getRandomPiece() {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return { ...TETROMINOS[randomPiece], type: randomPiece };
  }

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
      
      // Charger préférences
      const savedAvatar = localStorage.getItem('selectedAvatar');
      if (savedAvatar) setSelectedAvatar(savedAvatar);
    }
  };

  // Gestion des questions
  const handleCheckAnswer = async () => {
    const correctAnswer = QUESTIONS[category][currentQuestion].a.toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    const newStats = { ...stats, total: stats.total + 1 };

    if (userAnswer === correctAnswer) {
      newStats.correct++;
      
      // Confetti effect
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }

      const updatedProfile = {
        ...profile,
        diamonds: profile.diamonds + 10,
        streak: profile.streak + 1
      };

      await supabase.from('profiles').update({
        diamonds: updatedProfile.diamonds,
        streak: updatedProfile.streak
      }).eq('id', profile.id);

      setProfile(updatedProfile);
      setShowQuestion(false);
      setCurrentQuestion((currentQuestion + 1) % QUESTIONS[category].length);
      setAnswer('');
    } else {
      alert("❌ Essaie encore !");
    }

    setStats(newStats);
  };

  // TETRIS LOGIC
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

    // Clear lines
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Check same row again
      }
    }

    setTetrisScore(prev => prev + linesCleared * 100);
    setTetrisBoard(newBoard);

    // Spawn new piece
    const newPiece = getRandomPiece();
    const newPos = { x: 4, y: 0 };

    if (!canMove(newPiece, newPos, newBoard)) {
      setGameOver(true);
      setIsPaused(true);
    } else {
      setCurrentPiece(newPiece);
      setPosition(newPos);
    }
  }, [tetrisBoard, currentPiece, position, canMove]);

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

  // Initialize tetris
  const startTetris = () => {
    setTetrisBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setPosition({ x: 4, y: 0 });
    setTetrisScore(0);
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
          return (
            <div
              key={`${y}-${x}`}
              className={`tetris-cell ${cell ? 'filled' : ''}`}
              style={{
                backgroundColor: cell ? pieceType?.color : 'rgba(255,255,255,0.1)',
              }}
            >
              {cell ? pieceType?.number : ''}
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
            <h2 className="tetris-title">🎮 Math Tetris 🎮</h2>
            <div className="tetris-stats">
              <div className="tetris-stat">Score: {tetrisScore}</div>
              <div className="tetris-stat">{isPaused ? '⏸️ PAUSE' : '▶️ JOUE'}</div>
            </div>
          </div>

          <div className="tetris-game">
            <div className="tetris-board">
              {renderBoard()}
            </div>

            <div className="tetris-controls">
              <h3>🎯 Contrôles</h3>
              <div className="control-grid">
                <div className="control-item">← → Déplacer</div>
                <div className="control-item">↑ Rotation</div>
                <div className="control-item">↓ Descendre</div>
                <div className="control-item">ESPACE Chute rapide</div>
                <div className="control-item">P Pause</div>
              </div>

              <div className="control-buttons">
                <button onClick={() => moveHorizontal(-1)} className="btn-control">←</button>
                <button onClick={rotate} className="btn-control">↻</button>
                <button onClick={() => moveHorizontal(1)} className="btn-control">→</button>
                <button onClick={hardDrop} className="btn-control">⬇</button>
              </div>

              {gameOver && (
                <div className="game-over-card">
                  <h3>🎮 Game Over!</h3>
                  <p>Score final: {tetrisScore}</p>
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
          🎮 Jouer à Math Tetris 🎮
        </button>

        {/* Categories */}
        <div className="categories">
          {['math', 'french', 'english'].map(cat => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'math' ? '🍩 Maths' : cat === 'french' ? '🍬 Français' : '🍦 English'}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="question-card glass-card" onClick={() => setShowQuestion(true)}>
          <div className="emoji-big">
            {category === 'math' ? '🍩' : category === 'french' ? '🍬' : '🍦'}
          </div>
          <h3 className="question-title">Vœu Magique #{currentQuestion + 1}</h3>
          <div className="reward-badge">💎 +10 Diamants</div>
        </div>

        {/* Navigation */}
        <div className="nav-arrows">
          <button
            className="nav-btn"
            onClick={() => setCurrentQuestion((currentQuestion - 1 + QUESTIONS[category].length) % QUESTIONS[category].length)}
          >
            👈
          </button>
          <button
            className="nav-btn"
            onClick={() => setCurrentQuestion((currentQuestion + 1) % QUESTIONS[category].length)}
          >
            👉
          </button>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestion && (
        <div className="modal-overlay" onClick={() => setShowQuestion(false)}>
          <div className="modal-card cloud-shape" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">🎯 Question Magique</h3>
            <p className="question-text">{QUESTIONS[category][currentQuestion].q}</p>
            <input
              type="text"
              placeholder="Ta réponse magique..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input-premium"
              onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
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