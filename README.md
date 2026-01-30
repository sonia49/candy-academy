# 🍭 Candy Dream Academy ULTRA PREMIUM 💎

Application d'apprentissage ludique avec Math Tetris intégré - Version React Ultra Premium

## ✨ Fonctionnalités

- 🎮 **Math Tetris ludique** avec briques colorées et chiffres
- 📚 **Questions éducatives** (Maths, Français, English)
- 👤 **12 avatars personnalisables**
- 🎨 **Personnalisation complète du thème**
- 💎 **Système de récompenses et progression**
- 📊 **Statistiques et suivi des performances**
- ☁️ **Design premium avec bulles et effets**
- 🎊 **Animations et confettis**

## 🚀 Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application en développement
npm run dev

# 3. Ouvrir http://localhost:3000 dans votre navigateur
```

## 📦 Déploiement sur GitHub Pages

### Étape 1 : Créer un repository GitHub

1. Allez sur [GitHub](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Nommez votre repository (exemple: `candy-academy`)
4. Choisissez **Public** ou **Private**
5. Ne cochez PAS "Add a README file"
6. Cliquez sur **"Create repository"**

### Étape 2 : Structure des fichiers sur GitHub

Uploadez tous les fichiers dans cette structure EXACTE :

```
candy-academy/                    ← Repository GitHub
├── index.html                    ← À la racine
├── package.json                  ← À la racine
├── vite.config.js               ← À la racine
├── .gitignore                   ← À la racine (voir ci-dessous)
└── src/                         ← Dossier src
    ├── main.jsx                 ← Dans src/
    ├── App.jsx                  ← Dans src/
    └── App.css                  ← Dans src/
```

### Étape 3 : Créer le fichier .gitignore

Créez un fichier `.gitignore` à la racine avec ce contenu :

```
# dependencies
node_modules
package-lock.json

# production
dist
build

# misc
.DS_Store
*.log
```

### Étape 4 : Modifier vite.config.js pour GitHub Pages

Remplacez le contenu de `vite.config.js` par :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/candy-academy/', // ⚠️ REMPLACEZ par le nom de VOTRE repository
  build: {
    outDir: 'dist'
  }
})
```

**IMPORTANT** : Remplacez `candy-academy` par le nom exact de votre repository GitHub !

### Étape 5 : Upload sur GitHub (via l'interface web)

1. Dans votre repository GitHub, cliquez sur **"Add file"** → **"Upload files"**
2. Faites glisser tous les fichiers ET le dossier `src/` complet
3. Écrivez un message de commit : "Initial commit"
4. Cliquez sur **"Commit changes"**

### Étape 6 : Configurer GitHub Actions

1. Dans votre repository, créez ces dossiers : `.github/workflows/`
2. Dans `.github/workflows/`, créez le fichier `deploy.yml`
3. Contenu du fichier `deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Étape 7 : Activer GitHub Pages

1. Dans votre repository, allez dans **Settings** (Paramètres)
2. Dans le menu de gauche, cliquez sur **Pages**
3. Sous "Build and deployment" :
   - **Source** : Choisissez "GitHub Actions"
4. Cliquez sur **Save**

### Étape 8 : Déclencher le déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vous devriez voir un workflow en cours (cercle orange)
3. Attendez qu'il devienne vert (✓)
4. Votre app est maintenant en ligne ! 🎉

### 📍 URL de votre application

Votre application sera accessible à :
```
https://VOTRE-USERNAME.github.io/candy-academy/
```

Remplacez :
- `VOTRE-USERNAME` par votre nom d'utilisateur GitHub
- `candy-academy` par le nom de votre repository

## 🎮 Contrôles du Tetris

- **← →** : Déplacer la pièce
- **↑** : Rotation
- **↓** : Descente rapide
- **ESPACE** : Chute immédiate
- **P** : Pause

## 🔧 Technologies utilisées

- React 18
- Vite
- Supabase (authentification et base de données)
- Canvas Confetti (effets visuels)
- CSS3 (animations et glassmorphism)

## 📝 Personnalisation

### Changer les couleurs

Modifiez les variables CSS dans `src/App.css` :

```css
:root {
  --bg-primary: #FFE5F1;
  --bg-secondary: #E0BBE4;
  --bg-tertiary: #C1F7DC;
  --accent-main: #FF6B9D;
  --accent-secondary: #C8A2E8;
}
```

### Ajouter des questions

Dans `src/App.jsx`, modifiez l'objet `QUESTIONS` :

```javascript
const QUESTIONS = {
  math: [
    { q: "Votre question", a: "réponse" },
    // Ajoutez vos questions ici
  ]
}
```

## 🐛 Résolution de problèmes

### Le site ne s'affiche pas

1. Vérifiez que `base` dans `vite.config.js` correspond au nom de votre repository
2. Vérifiez que GitHub Pages est activé dans Settings → Pages
3. Attendez 2-3 minutes après le déploiement

### Erreur lors du build

1. Assurez-vous que tous les fichiers sont dans la bonne structure
2. Vérifiez que `package.json` est à la racine
3. Vérifiez les Actions dans l'onglet Actions pour voir les erreurs

## 🆘 Support

Si vous rencontrez des problèmes, vérifiez :
1. La structure des fichiers correspond bien au schéma ci-dessus
2. Le fichier `.github/workflows/deploy.yml` existe
3. GitHub Pages est activé avec "GitHub Actions" comme source
4. Le workflow dans Actions s'est exécuté avec succès (vert ✓)

## 🎉 Crédits

Application créée avec ❤️ pour rendre l'apprentissage magique et ludique !

---

**Astuce** : Pour mettre à jour votre application, modifiez simplement les fichiers sur GitHub, le déploiement se fera automatiquement ! ✨
