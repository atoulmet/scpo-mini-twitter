# Mini Twitter

Une application React simple qui se connecte à Supabase pour illustrer les requêtes HTTP. Parfait pour les cours et démonstrations pédagogiques.

## Configuration

1. **Créer un compte Supabase**
   - Rendez-vous sur [supabase.com](https://supabase.com) et créez un nouveau projet
   - Exécutez le script SQL fourni dans l'interface SQL de Supabase

2. **Configurer le projet React**
   - Clonez ce dépôt ou créez un nouveau projet React
   - Installez les dépendances:
   ```bash
   npm install
   ```

3. **Connecter l'application à Supabase**
   - Récupérez l'URL et la clé anon de votre projet Supabase dans les paramètres d'API
   - Modifiez les variables `supabaseUrl` et `supabaseKey` dans `App.js` avec vos propres informations

## Fonctionnalités

- Authentification (inscription et connexion)
- Affichage des tweets dans un fil d'actualités
- Publication de nouveaux tweets (limités à 280 caractères)
- Suppression de ses propres tweets

## Structure de la base de données

La base de données contient deux tables principales:

- **users**: id, username, email, created_at
- **tweets**: id, user_id, content, created_at

## Déploiement sur Vercel

1. **Créer un compte Vercel** si ce n'est pas déjà fait
2. **Connecter votre dépôt Git** à Vercel
3. **Configurer le projet**:
   - Framework preset: Create React App
   - Build command: `npm run build`
   - Output directory: `build`
4. **Déployer**
   - Cliquez sur "Deploy"

## Variables d'environnement (optionnel)

Pour une meilleure sécurité, vous pouvez utiliser des variables d'environnement:

1. Créez un fichier `.env` à la racine du projet:
   ```
   REACT_APP_SUPABASE_URL=votre_url_supabase
   REACT_APP_SUPABASE_ANON_KEY=votre_clé_anon
   ```

2. Modifiez `App.js`:
   ```javascript
   const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
   const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
   ```

3. Sur Vercel, ajoutez ces variables dans les paramètres du projet

## Notes pour l'enseignant

Cette application est parfaite pour démontrer:
- Les appels API RESTful (GET, POST, DELETE)
- L'authentification avec JWT
- Les architectures client-serveur
- Les bases de données relationnelles

Elle fonctionne mieux dans le cadre d'une session de 2 heures où les étudiants peuvent également utiliser Postman pour explorer les mêmes API.