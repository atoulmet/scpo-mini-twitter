import React, { useState } from 'react';

const LoginPage = ({ supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
      setError(error.message === 'Invalid login credentials'
        ? 'Identifiants invalides' 
        : error.message);
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    if (!username || username.length < 3) {
      setError('Le nom d\'utilisateur doit comporter au moins 3 caractères');
      setLoading(false);
      return;
    }
    
    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores');
      setLoading(false);
      return;
    }
    
    try {
      // Vérifier si le nom d'utilisateur existe déjà
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
        
      if (usernameCheck) {
        setError('Ce nom d\'utilisateur est déjà pris');
        setLoading(false);
        return;
      }
      
      // Créer un nouvel utilisateur
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Ajouter l'utilisateur à la table users avec le username
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { id: data.user.id, username, email }
          ]);
          
        if (profileError) throw profileError;
        
        setMessage('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
        setIsSignUp(false);
      }
      
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Mini Twitter</h1>
          <p>Pour le cours HTTP à Sciences Po</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="auth-container">
          <div className="tabs">
            <button 
              className={!isSignUp ? "active" : ""} 
              onClick={() => setIsSignUp(false)}
            >
              Connexion
            </button>
            <button 
              className={isSignUp ? "active" : ""} 
              onClick={() => setIsSignUp(true)}
            >
              Inscription
            </button>
          </div>
          
          {isSignUp ? (
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur"
                  required
                  minLength="3"
                  maxLength="15"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Création du compte...' : 'S\'inscrire'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;