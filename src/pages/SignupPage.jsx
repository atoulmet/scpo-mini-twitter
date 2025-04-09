import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    avatar_url: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur spécifique lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Validation de l'URL de l'avatar (optionnel)
    if (formData.avatar_url && !formData.avatar_url.startsWith('http')) {
      newErrors.avatar_url = 'L\'URL doit commencer par http:// ou https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setGeneralError('');
      
      // Inscription
      await signup(
        formData.email,
        formData.password,
        formData.username,
        formData.description,
        formData.avatar_url
      );
      
      // Connexion automatique après inscription
      await login(formData.email, formData.password);
      
      // Redirection vers la page d'accueil
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.message?.includes('already exists')) {
        if (error.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé' }));
        } else if (error.message.includes('username')) {
          setErrors(prev => ({ ...prev, username: 'Ce nom d\'utilisateur est déjà pris' }));
        } else {
          setGeneralError('Erreur lors de l\'inscription. Réessaye plus tard.');
        }
      } else {
        setGeneralError('Erreur lors de l\'inscription. Réessaye plus tard.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center pt-12 pb-16">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-twitter-blue">Rejoins Mini Twitter</h1>
        
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {generalError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${errors.username ? 'border-red-500' : ''}`}
              placeholder="pseudo"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="toi@exemple.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="6 caractères minimum"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Parle-nous un peu de toi"
              rows="3"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="avatar_url" className="block text-gray-700 mb-1">URL de l'avatar (optionnel)</label>
            <input
              type="text"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              className={`input-field ${errors.avatar_url ? 'border-red-500' : ''}`}
              placeholder="https://exemple.com/ton-image.jpg"
            />
            {errors.avatar_url && <p className="text-red-500 text-sm mt-1">{errors.avatar_url}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-2"
          >
            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Tu as déjà un compte ?{' '}
          <Link to="/login" className="text-twitter-blue hover:underline">
            Connecte-toi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;