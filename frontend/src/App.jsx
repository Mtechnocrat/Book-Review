import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to books if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return !token ? children : <Navigate to="/books" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/books" element={<BookList />} />
            <Route path="/add-book" element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            } />
            <Route path="/book/:id" element={<BookDetail />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;