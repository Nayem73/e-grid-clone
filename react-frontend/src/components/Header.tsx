import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'jp' ? 'en' : 'jp');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link to="/" className={styles.logoLink}>
            <img
              src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/logo.svg"
              alt="e-GRID"
              className={styles.logoImage}
            />
          </Link>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <img
                src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/icon_facebook.png"
                alt="Facebook"
              />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <img
                src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/icon_x.png"
                alt="X"
              />
            </a>
          </div>
        </div>

        <div className={styles.rightSection}>
          <nav className={styles.nav}>
            <Link to="/company">COMPANY</Link>
            <Link to="/service">SERVICE</Link>
            <Link to="/product">PRODUCT</Link>
            <Link to="/recruit">RECRUIT</Link>
            <Link to="/access">ACCESS</Link>
            <Link to="/contact" className={styles.contactButton}>CONTACT</Link>
          </nav>
          {user && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Admin Logout
            </button>
          )}
          <button onClick={toggleLanguage} className={styles.languageButton}>
            {language.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;