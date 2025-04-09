import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmailVerifiedPage = () => {
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirection automatique après 5 secondes
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    
    if (counter === 0) {
      navigate('/');
    }
    
    return () => clearInterval(timer);
  }, [counter, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-twitter-blue flex justify-center">
          <svg className="w-20 h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="text-twitter-blue" cx="26" cy="26" r="25" fill="none" stroke="white" strokeWidth="2" />
            <path fill="none" stroke="white" strokeWidth="2" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        
        <div className="p-6 md:p-8 text-center">
          <h1 className="text-2xl font-bold text-twitter-blue">Ton email a été vérifié avec succès !</h1>
          
          <p className="mt-4 text-gray-600">
            Super ! Ton adresse email est maintenant vérifiée. Tu peux désormais profiter pleinement de Mini Twitter.
          </p>
          
          <div className="mt-8 mb-2">
            <p className="text-sm text-gray-500 mb-3">
              Tu seras redirigé vers l'accueil dans <span className="font-semibold">{counter}</span> secondes
            </p>
            <Link 
              to="/" 
              className="inline-block bg-twitter-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-200 transform hover:-translate-y-1"
            >
              Accéder à Mini Twitter
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 Mini Twitter. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;