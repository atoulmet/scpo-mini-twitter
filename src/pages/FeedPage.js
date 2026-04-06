import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeedPage = ({ supabase, user }) => {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState({});
  const [newTweet, setNewTweet] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Déterminer si l'utilisateur est connecté
  const isLoggedIn = !!user;

  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      // Charger tous les tweets
      const { data: tweetsData, error: tweetsError } = await supabase
        .from('tweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (tweetsError) throw tweetsError;
      setTweets(tweetsData);

      // Charger les informations des utilisateurs
      const uniqueUserIds = [...new Set(tweetsData.map(tweet => tweet.user_id))];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', uniqueUserIds);

      if (usersError) throw usersError;
      
      // Créer un objet pour faciliter l'accès aux données utilisateur
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
      
      setUsers(usersMap);
    } catch (error) {
      console.error('Erreur lors du chargement des tweets:', error);
      setError('Impossible de charger les tweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim() || !isLoggedIn) return;
    
    try {
      const { error } = await supabase
        .from('tweets')
        .insert([
          { content: newTweet, user_id: user.id }
        ]);
        
      if (error) throw error;
      
      setNewTweet('');
      fetchTweets();
    } catch (error) {
      console.error('Erreur lors de la publication du tweet:', error);
      setError('Impossible de publier le tweet');
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const { error } = await supabase
        .from('tweets')
        .delete()
        .eq('id', tweetId);
        
      if (error) throw error;
      
      fetchTweets();
    } catch (error) {
      console.error('Erreur lors de la suppression du tweet:', error);
      setError('Impossible de supprimer le tweet');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="feed-page">
      <header className="app-header">
        <h1>Mini Twitter</h1>
        <nav className="main-nav">
          <Link to="/" className="nav-link active">Accueil</Link>
          <Link to="/users" className="nav-link">Utilisateurs</Link>
        </nav>
        <div className="user-controls">
          {isLoggedIn ? (
            <>
              <Link to={`/profile/${user?.username}`} className="profile-link">
                @{user?.username}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Se connecter
            </Link>
          )}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {isLoggedIn && (
        <div className="tweet-form">
          <form onSubmit={handlePostTweet}>
            <div className="tweet-form-header">
              <img 
                src={user.profile_picture || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.username}`}
                alt="Votre avatar"
                className="tweet-avatar"
              />
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="Quoi de neuf ?"
                maxLength={280}
              />
            </div>
            <div className="form-footer">
              <span className="char-count">{newTweet.length}/280</span>
              <button type="submit" disabled={!newTweet.trim()}>
                Tweeter
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tweets-container">
        <h2>Fil d'actualités</h2>
        {loading ? (
          <p className="loading-message">Chargement des tweets...</p>
        ) : tweets.length === 0 ? (
          <p className="empty-state">Aucun tweet pour le moment.</p>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-header">
                <div className="tweet-user">
                  <img 
                    src={users[tweet.user_id]?.profile_picture || `https://api.dicebear.com/7.x/avatars/svg?seed=${users[tweet.user_id]?.username}`}
                    alt={`Avatar de ${users[tweet.user_id]?.username}`}
                    className="tweet-avatar"
                  />
                  <Link 
                    to={`/profile/${users[tweet.user_id]?.username}`} 
                    className="username-link"
                  >
                    @{users[tweet.user_id]?.username || 'utilisateur'}
                  </Link>
                </div>
                <span className="date">
                  {new Date(tweet.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="content">{tweet.content}</p>
              {isLoggedIn && user.id === tweet.user_id && (
                <button
                  onClick={() => handleDeleteTweet(tweet.id)}
                  className="delete-button"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {!isLoggedIn && (
        <div className="login-prompt">
          <p>Envie de tweeter ? <Link to="/login">Connectez-vous</Link> ou <Link to="/login">créez un compte</Link>.</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;