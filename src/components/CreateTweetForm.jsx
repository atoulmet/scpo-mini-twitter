import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tweetService } from '../services/api';

const CreateTweetForm = ({ onTweetCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  // Nombre maximum de caractères autorisés
  const MAX_CHARS = 280;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Le contenu ne peut pas être vide');
      return;
    }
    
    if (content.length > MAX_CHARS) {
      setError(`Le tweet ne peut pas dépasser ${MAX_CHARS} caractères`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      const newTweet = await tweetService.createTweet(content);
      setContent('');
      if (onTweetCreated) onTweetCreated(newTweet);
    } catch (error) {
      console.error('Error creating tweet:', error);
      setError('Erreur lors de la création du tweet. Réessaye plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="border-b border-gray-200 p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img 
              className="h-10 w-10 rounded-full object-cover"
              src={currentUser?.avatar_url || 'https://via.placeholder.com/40'}
              alt="Your avatar"
            />
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Quoi de neuf ?"
              className="w-full border-none focus:ring-0 resize-none"
              rows={3}
              maxLength={MAX_CHARS}
              disabled={isSubmitting}
            />
            
            <div className="flex items-center justify-between mt-2">
              <div className={`text-sm ${content.length > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/{MAX_CHARS}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || content.length > MAX_CHARS}
                className="btn-primary"
              >
                {isSubmitting ? 'Envoi...' : 'Tweeter'}
              </button>
            </div>
            
            {error && (
              <div className="mt-2 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTweetForm;