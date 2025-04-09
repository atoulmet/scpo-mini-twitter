import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';
import Tweet from '../components/Tweet';
import placeholderAvatar from '../assets/image.png';

const ProfilePage = () => {
  const { username } = useParams();
//   const { currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchProfileData();
  }, [username]);
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileData = await userService.getUserProfile(username);
      
      if (!profileData) {
        setError('Profil non trouvé');
        return;
      }
      
      setProfile(profileData);
      
      // Récupérer les tweets de l'utilisateur
      const userTweets = await userService.getUserTweets(profileData.id);
      setTweets(userTweets);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Impossible de charger le profil. Réessaye plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTweetDeleted = (deletedTweetId) => {
    setTweets(tweets.filter(tweet => tweet.id !== deletedTweetId));
  };
  
  // Formater la date d'inscription
  const formatJoinDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Vérifier si c'est le profil de l'utilisateur actuel
//   const isCurrentUserProfile = currentUser && profile && currentUser.id === profile.id;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto pt-20 pb-10">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-red-500">{error}</p>
          <Link to="/" className="mt-4 text-twitter-blue hover:underline block">
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto pt-20 pb-10">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* En-tête du profil */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex space-x-4">
              <img
                src={profile.avatar_url || placeholderAvatar}
                alt={`${profile.username}'s avatar`}
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow"
              />
              <div>
                <h1 className="text-xl font-bold">{profile.username}</h1>
                <p className="text-gray-500">
                  A rejoint en {formatJoinDate(profile.created_at)}
                </p>
                {profile.description && (
                  <p className="mt-2 text-gray-800">{profile.description}</p>
                )}
              </div>
            </div>
            
            {/* {isCurrentUserProfile && (
              <Link to="/profile/edit" className="btn-secondary">
                Modifier le profil
              </Link>
            )} */}
          </div>
        </div>
        
        {/* Tweets de l'utilisateur */}
        <div>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold">Tweets</h2>
          </div>
          
          {tweets.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucun tweet pour le moment.</p>
            </div>
          ) : (
            tweets.map(tweet => (
              <Tweet 
                key={tweet.id} 
                tweet={{ ...tweet, users: profile }}
                onDelete={handleTweetDeleted} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;