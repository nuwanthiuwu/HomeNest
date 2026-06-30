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
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">HomeNest</Link>

        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>

          {token && user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">{user.name}</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Log In</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
