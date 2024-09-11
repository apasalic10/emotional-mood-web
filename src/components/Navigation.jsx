import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../reduxStore/authSlice';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/login');
  };

  return (
    token && (
      <nav className="bg-gray-800 sticky top-0 z-[100] w-full backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-white">Mood Tracker</span>
              </div>
              <div className="flex justify-center flex-1 w-full">
                {token && (
                  <div className="items-center justify-center hidden md:flex">
                    <NavLink to="/" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/users" className={navLinkClass}>
                      Users
                    </NavLink>
                    <NavLink to="/emotions" className={navLinkClass}>
                      Emotions
                    </NavLink>
                    <NavLink to="/activities" className={navLinkClass}>
                      Activities
                    </NavLink>
                    <NavLink to="/resources" className={navLinkClass}>
                      Resources
                    </NavLink>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navigation;
