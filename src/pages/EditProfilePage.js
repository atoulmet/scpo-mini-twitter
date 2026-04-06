import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EditProfilePage = ({ supabase, user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="error-page">
        <h1>Non connecté</h1>
        <p>Vous devez être connecté pour modifier votre profil.</p>
        <Link to="/login" className="back-link">Se connecter</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
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
      // Vérifier si le username est déjà pris par quelqu'un d'autre
      if (username !== user.username) {
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .single();

        if (existing) {
          setError('Ce nom d\'utilisateur est déjà pris');
          setLoading(false);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          username,
          profile_picture: profilePicture || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Profil mis à jour avec succès !');
      setTimeout(() => navigate(`/profile/${username}`), 1000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <header className="app-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-button">
            &larr; Retour
          </button>
          <h1>Modifier le profil</h1>
        </div>
      </header>

      <div className="edit-profile-container">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="edit-profile-avatar">
          <img
            src={profilePicture || `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`}
            alt="Aperçu avatar"
          />
        </div>

        <form onSubmit={handleSubmit}>
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
              value={user.email}
              disabled
            />
            <small style={{ color: '#536471' }}>L'email ne peut pas être modifié</small>
          </div>

          <div className="form-group">
            <label htmlFor="profile_picture">URL de la photo de profil</label>
            <input
              id="profile_picture"
              type="url"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="https://exemple.com/photo.jpg"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
