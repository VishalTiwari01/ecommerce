// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   ArrowLeft,
//   Star,
//   Heart,
//   ShoppingCart,
//   Shield,
//   Truck,
//   RotateCcw,
// } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { useCart } from '../contexts/CartContext';
// import { toast } from '../hooks/use-toast';
// import { getProductsId } from '../api/api';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addItem, openCart } = useCart();

//   const [product, setProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedColorIndex, setSelectedColorIndex] = useState(0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const fetchedProduct = await getProductsId(id);
//         setProduct(fetchedProduct);
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Error fetching product details:', err);
//         setError(err.message);
//         toast({
//           title: 'Error fetching product',
//           description: err.message,
//           variant: 'destructive',
//         });
//         setIsLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading product details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😅</div>
//           <h2 className="text-2xl font-bold mb-4">Product not found</h2>
//           <button onClick={() => navigate('/')} className="btn-hero">
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     addItem({
//       id: product._id,
//       name: product.name,
//       price: product.price,
//       selectedColor: product.colors?.[selectedColorIndex],
//       category: product.category,
//       quantity: quantity,
//     });

//     toast({
//       title: 'Added to cart! 🎉',
//       description: `${quantity} x ${product.name} has been added to your cart.`,
//     });

//     setTimeout(() => {
//       openCart();
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <motion.button
//           className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
//           onClick={() => navigate(-1)}
//           whileHover={{ x: -5 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <ArrowLeft size={20} />
//           <span>Back to products</span>
//         </motion.button>

//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* LEFT: IMAGE GALLERY */}
//           <motion.div
//             className="space-y-4"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="relative">
//               {product.imageUrl?.length > 0 ? (
//                 <motion.img
//                   key={product.imageUrl[selectedImageIndex]?.imageUrl}
//                   src={product.imageUrl[selectedImageIndex]?.imageUrl}
//                   alt={product.name}
//                   className="w-full h-96 object-contain bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl shadow-card"
//                   whileHover={{ scale: 1.03 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               ) : (
//                 <div className="w-full h-96 bg-muted rounded-3xl flex items-center justify-center text-xl text-muted-foreground">
//                   No Image Available
//                 </div>
//               )}

//               <motion.button
//                 className="absolute top-4 right-4 p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-card"
//                 onClick={() => setIsLiked(!isLiked)}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <Heart
//                   size={24}
//                   className={`transition-colors ${
//                     isLiked ? 'text-secondary fill-current' : 'text-muted-foreground'
//                   }`}
//                 />
//               </motion.button>
//             </div>

//             {/* Thumbnail Row */}
//             {product.imageUrl?.length > 1 && (
//               <div className="flex space-x-3 overflow-x-auto pb-1">
//                 {product.imageUrl.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img.imageUrl}
//                     alt={`Thumb ${index + 1}`}
//                     onClick={() => setSelectedImageIndex(index)}
//                     className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
//                       selectedImageIndex === index ? 'border-primary' : 'border-muted'
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* RIGHT: PRODUCT INFO */}
//           <motion.div
//             className="space-y-6"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
//                 {product.category}
//               </span>
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center space-x-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={`${
//                         i < Math.floor(product.rating)
//                           ? 'text-accent fill-current'
//                           : 'text-muted-foreground'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   ({product.reviewCount || 0} reviews)
//                 </span>
//               </div>
//             </div>

//             <div>
//               <h1 className="text-4xl font-bold text-foreground font-kids mb-2">
//                 {product.name}
//               </h1>

//               {product.shortDescription && (
//                 <p className="text-muted-foreground mb-4">{product.shortDescription}</p>
//               )}

//               {product.color && (
//                 <div className="text-muted-foreground mb-4">
//                   <strong>Base Color:</strong> {product.color}
//                 </div>
//               )}

//               <div className="flex items-center space-x-4">
//                 <span className="text-3xl font-bold text-primary">₹{product.salePrice}</span>
//                 {product.price && (
//                   <>
//                     <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
//                     <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-sm font-semibold">
//                       Save ₹{(product.price - product.salePrice).toFixed(2)}
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <p className="text-muted-foreground leading-relaxed">{product.description}</p>

//             {product.colors && product.colors.length > 0 && (
//               <div>
//                 <h3 className="font-semibold text-foreground mb-3">
//                   Color: {product.colorNames?.[selectedColorIndex] || product.colors[selectedColorIndex]}
//                 </h3>
//                 <div className="flex space-x-3">
//                   {product.colors.map((color, index) => (
//                     <motion.button
//                       key={index}
//                       className={`w-12 h-12 rounded-full border-4 transition-all ${
//                         selectedColorIndex === index
//                           ? 'border-primary scale-110'
//                           : 'border-border hover:border-primary/50'
//                       }`}
//                       style={{ backgroundColor: color }}
//                       onClick={() => setSelectedColorIndex(index)}
//                       whileHover={{ scale: selectedColorIndex === index ? 1.1 : 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <span className="font-semibold text-foreground">Quantity:</span>
//                 <div className="flex items-center border border-border rounded-lg">
//                   <button
//                     className="p-2 hover:bg-muted transition-colors"
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   >
//                     -
//                   </button>
//                   <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">{quantity}</span>
//                   <button
//                     className="p-2 hover:bg-muted transition-colors"
//                     onClick={() => setQuantity(quantity + 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <motion.button
//                 className="flex-1 btn-cart flex items-center justify-center space-x-3 py-4"
//                 style={{ backgroundColor: '#F7D2CF' }}
//                 onClick={handleAddToCart}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <ShoppingCart size={20} />
//                 <span>Add to Cart</span>
//               </motion.button>
//             </div>

//             {/* Extra Info */}
//             <div className="space-y-2 text-muted-foreground">
//               {product.material && <div><strong>Material:</strong> {product.material}</div>}
//               {product.dimensions && <div><strong>Dimensions:</strong> {product.dimensions}</div>}
//               {product.weight && <div><strong>Weight:</strong> {product.weight} kg</div>}
//               {product.warrantyPeriod && <div><strong>Warranty:</strong> {product.warrantyPeriod} months</div>}
//               {product.careInstructions && <div><strong>Care:</strong> {product.careInstructions}</div>}
//             </div>

//             {/* Features List */}
//             {product.features && product.features.length > 0 && (
//               <div>
//                 <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
//                   <span>✨ Key Features</span>
//                 </h3>
//                 <ul className="space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="flex items-center space-x-2 text-muted-foreground">
//                       <span className="text-success">✓</span>
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="flex items-center justify-between py-6 border-t border-border">
//               <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <Shield size={16} className="text-success" />
//                 <span>Safe & Tested</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <Truck size={16} className="text-primary" />
//                 <span>Free Shipping</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <RotateCcw size={16} className="text-secondary" />
//                 <span>30-Day Returns</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProductDetail;




import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from '../hooks/use-toast';
import { getProductsId } from '../APi/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false); // 🔽 Dropdown toggle state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductsId(id);
        setProduct(fetchedProduct);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message);
        toast({
          title: 'Error fetching product',
          description: err.message,
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate('/')} className="btn-hero">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      selectedColor: product.colors?.[selectedColorIndex],
      category: product.category,
      quantity: quantity,
    });

    toast({
      title: 'Added to cart! 🎉',
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });

    setTimeout(() => {
      openCart();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          onClick={() => navigate(-1)}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to products</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: IMAGE GALLERY */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {product.imageUrl?.length > 0 ? (
                <motion.img
                  key={product.imageUrl[selectedImageIndex]?.imageUrl}
                  src={product.imageUrl[selectedImageIndex]?.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl shadow-card"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-96 bg-muted rounded-3xl flex items-center justify-center text-xl text-muted-foreground">
                  No Image Available
                </div>
              )}

              <motion.button
                className="absolute top-4 right-4 p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-card"
                onClick={() => setIsLiked(!isLiked)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isLiked ? 'text-secondary fill-current' : 'text-muted-foreground'
                  }`}
                />
              </motion.button>
            </div>

            {/* Thumbnail Row */}
            {product.imageUrl?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {product.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`Thumb ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                      selectedImageIndex === index ? 'border-primary' : 'border-muted'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: PRODUCT INFO */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'text-accent fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-foreground font-kids mb-2">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-muted-foreground mb-4">{product.shortDescription}</p>
              )}

              {product.color && (
                <div className="text-muted-foreground mb-4">
                  <strong>Base Color:</strong> {product.color}
                </div>
              )}

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">₹{product.salePrice}</span>
                {product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
                    <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-sm font-semibold">
                      Save ₹{(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 🔽 DROPDOWN DESCRIPTION */}
            <div className="border border-border rounded-lg">
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-foreground bg-muted hover:bg-muted/70 transition"
                onClick={() => setShowDescription((prev) => !prev)}
              >
                <span>📄 Product Description</span>
                <span className="text-xl">{showDescription ? '−' : '+'}</span>
              </button>
              {showDescription && (
                <div className="px-4 py-3 text-muted-foreground leading-relaxed border-t border-border">
                  {product.description}
                </div>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Color: {product.colorNames?.[selectedColorIndex] || product.colors[selectedColorIndex]}
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColorIndex === index
                          ? 'border-primary scale-110'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColorIndex(index)}
                      whileHover={{ scale: selectedColorIndex === index ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-border min-w-[60px] text-center">{quantity}</span>
                  <button
                    className="p-2 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                className="flex-1 btn-cart flex items-center justify-center space-x-3 py-4"
                style={{ backgroundColor: '#F7D2CF' }}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </motion.button>
            </div>

            {/* Extra Info */}
            <div className="space-y-2 text-muted-foreground">
              {product.material && <div><strong>Material:</strong> {product.material}</div>}
              {product.dimensions && <div><strong>Dimensions:</strong> {product.dimensions}</div>}
              {product.weight && <div><strong>Weight:</strong> {product.weight} kg</div>}
              {product.warrantyPeriod && <div><strong>Warranty:</strong> {product.warrantyPeriod} months</div>}
              {product.careInstructions && <div><strong>Care:</strong> {product.careInstructions}</div>}
            </div>

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <span>✨ Key Features</span>
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                      <span className="text-success">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between py-6 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-success" />
                <span>Safe & Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Truck size={16} className="text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RotateCcw size={16} className="text-secondary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
