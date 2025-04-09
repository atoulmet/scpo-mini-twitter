import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';
import placeholderAvatar from '../assets/image.png';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Impossible de charger les utilisateurs. Réessaye plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.description && user.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Formater la date d'inscription
  const formatJoinDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="max-w-6xl mx-auto pt-20 pb-10 px-4">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h1 className="text-xl font-bold mb-4">Découvrir des utilisateurs</h1>
        
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Chargement des utilisateurs...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchUsers} 
            className="mt-3 text-twitter-blue hover:underline"
          >
            Réessayer
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          {searchTerm ? (
            <p className="text-gray-500">Aucun utilisateur ne correspond à ta recherche.</p>
          ) : (
            <p className="text-gray-500">Aucun utilisateur inscrit pour le moment.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <Link 
              key={user.id} 
              to={`/profile/${user.username}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200 transform hover:-translate-y-1"
            >
              <div className="p-4 pt-0 relative">
                <img
                  src={user.avatar_url || placeholderAvatar}
                  alt={`${user.username}`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white -top-8"
                />
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 text-lg">@{user.username}</h2>
                    {user.email_verified !== undefined && (
                      <div 
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.email_verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.email_verified ? 'Vérifié' : 'Non vérifié'}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Membre depuis {formatJoinDate(user.created_at)}
                  </p>
                  
                  {user.description && (
                    <p className="mt-3 text-gray-600 text-sm line-clamp-3 h-14 overflow-hidden">
                      {user.description}
                    </p>
                  )}
                  
                  <div className="mt-3 text-twitter-blue text-sm font-medium">
                    Voir le profil
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;