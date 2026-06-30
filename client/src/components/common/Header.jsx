// /client/src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, selectAuthToken, logoutUser } from '../../store/authSlice';

export default function Header() {
  const user = useSelector(selectAuthUser);
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">HomeNest</Link>

        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">Products</Link>

          {token && user ? (
            <>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">{user.name}</span>
                <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 text-2xl">
                  🛒
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Log In</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
