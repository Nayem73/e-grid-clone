import ServiceSection from '../components/ServiceSection';
import ProductSection from '../components/ProductSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';
import Carousel from '../components/Carousel';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.homeContainer}>
    <Carousel />
    <ServiceSection />
    <ProductSection />
    <NewsSection />
    <RecruitSection />
  </div>
);

export default Home;