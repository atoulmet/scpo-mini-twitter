import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-twitter-blue">404</h1>
      <p className="text-2xl font-medium mt-4 mb-8">Page introuvable</p>
      <p className="text-gray-600 mb-8 max-w-md">
        La page que tu cherches n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary px-8">
        Retourner à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;