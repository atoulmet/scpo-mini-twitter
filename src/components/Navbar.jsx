import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-twitter-blue">
              Mini Twitter
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-twitter-blue">
              Accueil
            </Link>
            <Link to="/users" className="text-gray-700 hover:text-twitter-blue">
              Utilisateurs
            </Link>
            <Link to="/profile/me" className="text-gray-700 hover:text-twitter-blue">
              Profil
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;