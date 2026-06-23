import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-extrabold text-emerald-800 mb-4 tracking-tight">NYAAY AI</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          An AI-powered legal assistant focused on the Indian judiciary ecosystem.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition">
            Login
          </Link>
          <Link to="/signup" className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Page</h2>
        <p className="text-gray-500 mb-6">Auth placeholder. Logic will be implemented in Phase 2.</p>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function Signup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up Page</h2>
        <p className="text-gray-500 mb-6">Signup placeholder. Logic will be implemented in Phase 2.</p>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="text-gray-500 mb-6">Dashboard placeholder. Layout and views will be implemented in Phase 3.</p>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
