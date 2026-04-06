import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UsersPage = ({ supabase, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Déterminer si l'utilisateur est connecté
  const isLoggedIn = !!user;

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Appel à la fonction RPC que nous avons créée
      const { data, error } = await supabase
        .rpc('get_users_with_tweet_count');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Impossible de charger la liste des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="users-page">
      <header className="app-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-button">
            &larr; Retour
          </button>
          <h1>Utilisateurs</h1>
        </div>
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

      <div className="users-container">
        <h2>Tous les utilisateurs</h2>
        {loading ? (
          <p className="loading-message">Chargement des utilisateurs...</p>
        ) : users.length === 0 ? (
          <p className="empty-state">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="users-grid">
            {users.map((userItem) => (
              <Link 
                key={userItem.id} 
                to={`/profile/${userItem.username}`}
                className="user-card"
              >
                <div className="user-avatar">
                  <img src={userItem.profile_picture || `https://api.dicebear.com/9.x/avataaars/svg?seed=${userItem.username}`} alt={`Avatar de ${userItem.username}`} />
                </div>
                <div className="user-info">
                  <h3>@{userItem.username}</h3>
                  <p className="tweet-count">
                    {userItem.tweet_count} tweet{userItem.tweet_count !== 1 ? 's' : ''}
                  </p>
                  <p className="join-date">
                    Membre depuis: {new Date(userItem.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;