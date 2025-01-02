import ServiceSection from '../components/ServiceSection';
import ProductsSection from '../components/ProductsSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';
import Carousel from '../components/Carousel';

const Home = () => (
  <div>
    <Carousel />
    <ServiceSection />
    <ProductsSection />
    <NewsSection />
    <RecruitSection />
    {/* Add other sections here */}
  </div>
);

export default Home;