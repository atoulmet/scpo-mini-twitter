import { Link } from 'react-router-dom';
import placeholderAvatar from '../assets/image.png';

const Tweet = ({ tweet,  }) => {
//   const [isDeleting, setIsDeleting] = useState(false);
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Gérer la suppression d'un tweet
//   const handleDelete = async () => {
//     if (window.confirm('Es-tu sûr·e de vouloir supprimer ce tweet ?')) {
//       try {
//         setIsDeleting(true);
//         await tweetService.deleteTweet(tweet.id);
//         if (onDelete) onDelete(tweet.id);
//       } catch (error) {
//         console.error('Error deleting tweet:', error);
//         alert('Erreur lors de la suppression du tweet');
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };
  
  // Vérifier si l'utilisateur actuel est l'auteur du tweet
//   const isAuthor = true; // On considère par défaut que l'utilisateur peut supprimer les tweets
  
  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Link to={`/profile/${tweet.users.username}`}>
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={tweet.users.avatar_url || placeholderAvatar}
              alt={`${tweet.users.username}'s avatar`}
            />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/profile/${tweet.users.username}`} className="font-medium text-gray-900 hover:underline">
                {tweet.users.username}
              </Link>
              <span className="text-sm text-gray-500 ml-2">• {formatDate(tweet.created_at)}</span>
            </div>
          </div>
          <p className="text-gray-800 mt-1 whitespace-pre-wrap break-words">{tweet.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Tweet;