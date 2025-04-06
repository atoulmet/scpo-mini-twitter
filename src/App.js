import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import './App.css';

// Initialisation de Supabase - À remplacer par tes propres clés
const supabaseUrl = 'https://mxbgzdxfjfnzsraejwmz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Ymd6ZHhmamZuenNyYWVqd216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTM0MTYsImV4cCI6MjA1OTUyOTQxNn0.OcLng4uz5sOG3_VnJdtcGU-t7hZfuxluLSAFg5gCh8M';

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Mettre en place l'écouteur pour les changements d'état de l'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        if (session) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setUser(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && session) {
    // On affiche le chargement uniquement si on attend les infos d'un utilisateur connecté
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage supabase={supabase} />} />
        <Route path="/" element={<FeedPage supabase={supabase} user={user} />} />
        <Route path="/profile/:username" element={<ProfilePage supabase={supabase} currentUser={user} />} />
        <Route path="/users" element={<UsersPage supabase={supabase} user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;