import { useState, useEffect } from 'react';
import { tweetService } from '../services/api';
import Tweet from '../components/Tweet';
import CreateTweetForm from '../components/CreateTweetForm';

const HomePage = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchTweets();
  }, []);
  
  const fetchTweets = async () => {
    try {
      setLoading(true);
      const data = await tweetService.getAllTweets();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setError('Impossible de charger les tweets. Réessaye plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
//   const handleTweetCreated = (newTweet) => {
//     // Recharger tous les tweets pour avoir les informations complètes
//     fetchTweets();
//   };
  
  const handleTweetDeleted = (deletedTweetId) => {
    setTweets(tweets.filter(tweet => tweet.id !== deletedTweetId));
  };
  
  return (
    <div className="max-w-2xl mx-auto pt-20 pb-10">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Accueil</h1>
        </div>
        
        {/* <CreateTweetForm onTweetCreated={handleTweetCreated} /> */}
        
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Chargement des tweets...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchTweets} 
              className="mt-3 text-twitter-blue hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : tweets.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Aucun tweet pour le moment.</p>
            <p className="mt-2 text-gray-500">Sois le premier à tweeter !</p>
          </div>
        ) : (
          <div>
            {tweets.map(tweet => (
              <Tweet 
                key={tweet.id} 
                tweet={tweet} 
                onDelete={handleTweetDeleted} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;