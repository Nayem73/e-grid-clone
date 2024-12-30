import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <Link to="/">e-Grid</Link>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </div>
  </header>
);

export default Header;