import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductShowcase from '../components/ProductShowcase';
import CategoriesSection from '../components/CategoriesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-kids">
      {/* <Navbar /> */}
      <main>
        <HeroSection />
        <ProductShowcase />
        <CategoriesSection />
      </main>
      
      {/* Simple Footer */}
      {/* <footer className="bg-card/50 border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🎈</span>
                </div>
                <span className="text-2xl font-bold gradient-text font-kids">KidsWorld</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Making childhood magical with safe, fun, and educational products that inspire creativity and learning.
              </p>
              <div className="flex space-x-4">
                {['🌟', '🎨', '🚀', '💖'].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Newsletter</h4>
              <p className="text-muted-foreground mb-4 text-sm">Get updates on new products and special offers!</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg hover:bg-primary-glow transition-colors text-sm font-medium">
                  ✨
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 KidsWorld. Made with 💖 for amazing kids and parents.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;