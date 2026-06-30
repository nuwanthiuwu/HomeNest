// /client/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400">About Us</Link></li>
            <li><Link to="/" className="hover:text-blue-400">Careers</Link></li>
            <li><Link to="/" className="hover:text-blue-400">Press</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400">Help Center</Link></li>
            <li><Link to="/" className="hover:text-blue-400">Contact</Link></li>
            <li><Link to="/" className="hover:text-blue-400">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400">Privacy</Link></li>
            <li><Link to="/" className="hover:text-blue-400">Terms</Link></li>
            <li><Link to="/" className="hover:text-blue-400">Cookies</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Follow</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400">Facebook</a></li>
            <li><a href="#" className="hover:text-blue-400">Twitter</a></li>
            <li><a href="#" className="hover:text-blue-400">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
        <p>&copy; 2026 HomeNest. All rights reserved.</p>
      </div>
    </footer>
  );
}
