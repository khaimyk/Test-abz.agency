import React from 'react';
import logo from '../../assets/Logo.svg';
import './Header.scss';
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <nav className="nav" aria-label="Main navigation">
          <a href="#users">Users</a>
          <a href="#sign-up">Sign up</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
