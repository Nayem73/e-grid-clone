import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'jp' ? 'en' : 'jp');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">e-GRID</Link>
          <div className={styles.socialIcons}>
            <FaFacebook />
            <FaTwitter />
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
        <button onClick={toggleLanguage} className={styles.languageButton}>
          {language === 'jp' ? 'EN' : 'JP'}
        </button>
      </div>
    </header>
  );
};

export default Header;
