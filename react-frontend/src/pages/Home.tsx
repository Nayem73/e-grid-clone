import ServiceSection from '../components/ServiceSection';
import ProductsSection from '../components/ProductsSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';
import Carousel from '../components/Carousel';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.homeContainer}>
    <Carousel />
    <ServiceSection />
    <ProductsSection />
    <NewsSection />
    <RecruitSection />
  </div>
);

export default Home;