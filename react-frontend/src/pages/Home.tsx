<<<<<<< HEAD
=======
import React from 'react';
import HeroSection from '../components/HeroSection';
import ServiceSection from '../components/ServiceSection';
import ProductsSection from '../components/ProductsSection';
import NewsSection from '../components/NewsSection';
import RecruitSection from '../components/RecruitSection';
>>>>>>> 7d09d76 (remove unused models, migrations, and controllers for media and page components and created dummy pages in react)

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