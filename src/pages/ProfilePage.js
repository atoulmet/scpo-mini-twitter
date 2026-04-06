import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProfilePage = ({ supabase, currentUser }) => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Déterminer si l'utilisateur est connecté
  const isLoggedIn = !!currentUser;
  
  // Déterminer si c'est le profil de l'utilisateur connecté
  const isOwnProfile = isLoggedIn && profileUser && currentUser.id === profileUser.id;

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Récupérer les informations de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) throw userError;
      setProfileUser(userData);

      // Récupérer les tweets de l'utilisateur
      const { data: tweetsData, error: tweetsError } = await supabase
        .from('tweets')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (tweetsError) throw tweetsError;
      setTweets(tweetsData);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Impossible de charger ce profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const { error } = await supabase
        .from('tweets')
        .delete()
        .eq('id', tweetId);
        
      if (error) throw error;
      
      fetchUserProfile();
    } catch (error) {
      console.error('Erreur lors de la suppression du tweet:', error);
      setError('Impossible de supprimer le tweet');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="loading-screen">Chargement du profil...</div>;
  }

  if (!profileUser && !loading) {
    return (
      <div className="error-page">
        <h1>Profil introuvable</h1>
        <p>Cet utilisateur n'existe pas.</p>
        <Link to="/" className="back-link">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="app-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-button">
            &larr; Retour
          </button>
          <h1>Profil</h1>
        </div>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/users" className="nav-link">Utilisateurs</Link>
        </nav>
        <div className="user-controls">
          {isLoggedIn ? (
            isOwnProfile ? (
              <>
                <span className="current-user">@{currentUser.username}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to={`/profile/${currentUser.username}`} className="profile-link">
                  @{currentUser.username}
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Déconnexion
                </button>
              </>
            )
          ) : (
            <Link to="/login" className="login-btn">
              Se connecter
            </Link>
          )}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={profileUser.profile_picture || `https://api.dicebear.com/7.x/avatars/svg?seed=${profileUser.username}`}
            alt={`Avatar de ${profileUser.username}`}
          />
        </div>
        <div className="profile-info">
          <h2>@{profileUser.username}</h2>
          <p className="join-date">Membre depuis: {new Date(profileUser.created_at).toLocaleDateString('fr-FR')}</p>
          <p className="tweet-count">{tweets.length} tweet{tweets.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="tweets-container">
        <h3>Tweets de {profileUser.username}</h3>
        {tweets.length === 0 ? (
          <p className="empty-state">Cet utilisateur n'a pas encore tweeté.</p>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-header">
                <div className="tweet-user">
                  <img 
                    src={profileUser.profile_picture || `https://api.dicebear.com/7.x/avatars/svg?seed=${profileUser.username}`}
                    alt={`Avatar de ${profileUser.username}`}
                    className="tweet-avatar"
                  />
                  <span className="username">@{profileUser.username}</span>
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
              {isOwnProfile && (
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
          <p>Envie d'interagir ? <Link to="/login">Connectez-vous</Link> ou <Link to="/login">créez un compte</Link>.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;