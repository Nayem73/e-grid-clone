import HeroSection from '../components/HeroSection';
import ServiceSection from '../components/ServiceSection';
import ProductsSection from '../components/ProductsSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';

const Home = () => (
  <div>
    <HeroSection />
    <ServiceSection />
    <ProductsSection />
    <NewsSection />
    <RecruitSection />
    {/* Add other sections here */}
  </div>
);

export default Home;