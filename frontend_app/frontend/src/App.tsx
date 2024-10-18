import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import supabase from './supabase/supabaseClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blog" element={user ? <BlogPage /> : <Navigate to="/login" />} />
            <Route path="/post/:id" element={user ? <PostPage /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
};

export default App;
