import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { getUserInfo, clearUserSession } from '../utils/storageUtils';

function Navbar() {
  const [name, setName] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { name, firstVisit } = getUserInfo();
    setName(name);
    setIsFirstVisit(firstVisit);
  }, []);

  const greeting = isFirstVisit ? 'Chaire' : 'Welcome back';

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <span className="welcome">
          {greeting}, {name}
        </span>
      </div>
      <div className="navbar-right">
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/archive" className="nav-link">
          Archive
        </Link>
        <div
          className="profile-menu"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="nav-link">Profile</span>
          {showDropdown && (
            <div className="dropdown">
              <Link to="/edit" className="dropdown-link">Edit</Link>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;