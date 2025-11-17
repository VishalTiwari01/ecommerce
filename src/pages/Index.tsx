import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductShowcase from '../components/ProductShowcase';
import CategoriesSection from '../components/CategoriesSection';
import InstagramReels from '../components/InstagramReels';
import BannerCarousel from '../components/BannerCarousel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-kids">
      {/* <Navbar /> */}
      <main>
        <HeroSection />
        <ProductShowcase />
        <BannerCarousel/>
        <CategoriesSection />
         <InstagramReels />
      </main>
    </div>
  );
};

export default Index;