import ServiceSection from '../components/ServiceSection';
import ProductSection from '../components/ProductSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';
import Carousel from '../components/Carousel';
import styles from './Home.module.css';
import PressSection from '../components/PressSection';

const Home = () => (
  <div className={styles.homeContainer}>
    <Carousel />
    <ServiceSection />
    <ProductSection />
    <NewsSection limit={3} />
    <PressSection limit={3} />
    <RecruitSection />
  </div>
);

export default Home;