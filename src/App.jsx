import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostView from './pages/PostView';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';



import { UserProvider } from './context/UserContext';

function App() {

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const setNewToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  }

  const clearToken = () => {
    setToken(null);
    localStorage.removeItem("token");
  }

  const isAuthenticated = () => !!token;

  return (
      <UserProvider value={{ token, setNewToken, clearToken, isAuthenticated }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/:postId" element={<PostView />} />
            <Route path="/posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/posts/edit/:postId" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </UserProvider>
    );
  }

export default App
