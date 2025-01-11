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
      <div className={styles.headerInner}>
        <div className={styles.description}>
          {language === 'en' ? 'Egrid Inc. Ruby on Rails software development, lab-based development (remote development), agile development, digital marketing'
            : '株式会社イーグリッド　Ruby on Railsソフトウェア開発・ラボ型開発（リモート開発）・アジャイル開発・デジタルマーケティング'}
        </div>

        <div className={styles.container}>
          <div className={styles.logoSection}>
            <Link to="/" className={styles.logoLink}>
              <img
                src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/logo.svg"
                alt="e-GRID"
                className={styles.logoImage}
              />
            </Link>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/egrid.recruit/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <img
                  src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/icon_facebook.png"
                  alt="Facebook"
                />
              </a>
              <a href="https://twitter.com/eGrid_official/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <img
                  src="https://www.e-grid.co.jp/wp3/wp-content/themes/egrid/assets/images/icon_x.png"
                  alt="X"
                />
              </a>
            </div>
          </div>

          <nav className={styles.nav}>
            <Link to="/company">COMPANY</Link>
            <Link to="/service">SERVICE</Link>
            <Link to="/product">PRODUCT</Link>
            <Link to="/recruit">RECRUIT</Link>
            <Link to="/access">ACCESS</Link>
            <Link to="/contact" className={styles.contactButton}>CONTACT</Link>
          </nav>

          <div className={styles.rightSection}>
            <button onClick={toggleLanguage} className={styles.languageButton}>
              {language.toUpperCase()}
            </button>
            {user && (
              <button onClick={handleLogout} className={styles.logoutButton}>
                Admin Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;