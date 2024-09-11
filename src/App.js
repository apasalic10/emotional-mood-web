import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/MoodTracker/Home';
import Users from './pages/MoodTracker/Users';
import UserDetail from './pages/MoodTracker/UserDetail';
import Login from './pages/Login';
import Emotions from './pages/MoodTracker/Emotions';
import Activities from './pages/MoodTracker/Activities';
import EducationResources from './pages/MoodTracker/Resources';
import EditUser from './pages/MoodTracker/EditUser';
import Signup from './pages/Signup';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <p className="mb-8 text-2xl text-gray-600">Oops! Page not found.</p>
        <p className="mb-8 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-4 py-2 font-bold text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/emotions" element={<Emotions />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/resources" element={<EducationResources />} />
            <Route path="/users/:userId/edit" element={<EditUser />} />
          </Route>
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
