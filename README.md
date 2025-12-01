# Projet_DevOPS_L3

=======

## 📄 README.md

````markdown
# Woyofal Frontend - Application de Simulation Senelec

Application React pour la simulation de recharges électriques Woyofal.

## Démarrage rapide

### Prérequis

- Node.js 16+ et npm

### Installation

\`\`\`bash
npm install
\`\`\`

### Configuration

1. Copiez le fichier d'exemple d'environnement :
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Modifiez `.env` avec l'URL de votre backend :
   \`\`\`env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_MOCK_API=false
   \`\`\`

### Lancement en mode développement

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur http://localhost:3000

### Mode Mock API

Si le backend n'est pas disponible, activez le mode mock :
\`\`\`env
REACT_APP_MOCK_API=true
\`\`\`

### Tests

\`\`\`bash
npm test
\`\`\`

### Build de production

\`\`\`bash
npm run build
\`\`\`

## 🐳 Docker

### Build et démarrage

\`\`\`bash
cd docker
docker-compose up --build
\`\`\`

L'application sera accessible sur http://localhost:3000

## 📖 Documentation

Voir `frontend-report.md` pour la documentation complète.

## 🎨 Palette de couleurs

- Primaire (Rouge Woyofal) : #E63946
- Secondaire (Bleu) : #1E88E5
- Accent (Gradient) : #8E24AA → #FF6F00
- Neutre : #F5F5F5

## 🔗 Endpoints Backend Requis

- POST /auth/login
- GET /auth/me
- POST /simulation/run
- POST /simulation/save
- GET /simulation/history/{compteur}
- GET /ml/recommendation/{compteur}
  \`\`\`

---

## 🌐 public/index.html

```html
Woyofal - Simulation Vous devez activer JavaScript pour utiliser cette application.
```
````

---
