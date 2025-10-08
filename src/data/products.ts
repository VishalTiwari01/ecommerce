// export interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   rating: number;
//   reviewCount: number;
//   category: string;
//   emoji: string;
//   colors: string[];
//   colorNames: string[];
//   images: string[];
//   description: string;
//   features: string[];
//   specifications: Record<string, string>;
//   isNew?: boolean;
//   isBestSeller?: boolean;
//   ageRange: string;
// }

// export const products: Product[] = [
//   {
//     id: 1,
//     name: 'Magic Building Blocks',
//     price: 29.99,
//     originalPrice: 39.99,
//     rating: 4.8,
//     reviewCount: 142,
//     category: 'Educational Toys',
//     emoji: '🧱',
//     colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
//     colorNames: ['Coral Red', 'Turquoise', 'Sky Blue', 'Mint Green'],
//     images: ['🧱', '🔨', '🏗️', '🎨'],
//     description: 'Spark your child\'s creativity with these magical building blocks! Made from safe, eco-friendly materials, these colorful blocks help develop fine motor skills, spatial awareness, and imagination.',
//     features: [
//       'Safe, non-toxic materials',
//       'Develops creativity and motor skills',
//       'Compatible with other block sets',
//       'Ages 3-12 years',
//       'Easy to clean and store'
//     ],
//     specifications: {
//       'Age Range': '3-12 years',
//       'Material': 'BPA-free plastic',
//       'Pieces': '50+ blocks',
//       'Weight': '2.1 lbs',
//       'Dimensions': '12" x 8" x 6"'
//     },
//     isNew: true,
//     ageRange: '3-12'
//   },
//   {
//     id: 2,
//     name: 'Rainbow Water Bottle',
//     price: 19.99,
//     originalPrice: 24.99,
//     rating: 4.9,
//     reviewCount: 87,
//     category: 'Water Bottles',
//     emoji: '🌈',
//     colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF'],
//     colorNames: ['Rainbow Red', 'Sunshine Yellow', 'Nature Green', 'Ocean Blue'],
//     images: ['🌈', '💧', '🍃', '✨'],
//     description: 'Keep your little one hydrated in style with this magical rainbow water bottle! Features temperature control and a fun design that makes drinking water exciting.',
//     features: [
//       'BPA-free and safe materials',
//       'Keeps drinks cold for 12 hours',
//       'Easy-grip design for small hands',
//       'Leak-proof cap',
//       'Fun rainbow design'
//     ],
//     specifications: {
//       'Age Range': '2+ years',
//       'Material': 'Stainless steel',
//       'Capacity': '12 oz',
//       'Weight': '0.8 lbs',
//       'Dimensions': '7.5" x 2.8"'
//     },
//     isBestSeller: true,
//     ageRange: '2+'
//   },
//   {
//     id: 3,
//     name: 'Adventure Backpack',
//     price: 34.99,
//     originalPrice: 44.99,
//     rating: 4.7,
//     reviewCount: 95,
//     category: 'Backpacks',
//     emoji: '🎒',
//     colors: ['#FF6B6B', '#96CEB4', '#F39C12', '#9B59B6'],
//     colorNames: ['Adventure Red', 'Forest Green', 'Sunset Orange', 'Magic Purple'],
//     images: ['🎒', '🗺️', '🧭', '🌟'],
//     description: 'Perfect for school or outdoor adventures! This durable backpack features multiple compartments, reflective strips for safety, and a comfortable padded design.',
//     features: [
//       'Multiple compartments for organization',
//       'Padded straps for comfort',
//       'Reflective safety strips',
//       'Water-resistant material',
//       'Perfect size for kids'
//     ],
//     specifications: {
//       'Age Range': '5-12 years',
//       'Material': 'Durable polyester',
//       'Capacity': '15L',
//       'Weight': '1.2 lbs',
//       'Dimensions': '16" x 12" x 6"'
//     },
//     ageRange: '5-12'
//   },
//   {
//     id: 4,
//     name: 'Musical Learning Tablet',
//     price: 45.99,
//     originalPrice: 59.99,
//     rating: 4.6,
//     reviewCount: 203,
//     category: 'Educational Toys',
//     emoji: '🎵',
//     colors: ['#E74C3C', '#3498DB', '#F1C40F', '#2ECC71'],
//     colorNames: ['Music Red', 'Learning Blue', 'Creative Yellow', 'Growth Green'],
//     images: ['🎵', '🎹', '📚', '🌟'],
//     description: 'Interactive learning tablet that teaches music, letters, numbers, and more! Features lights, sounds, and engaging activities for hours of educational fun.',
//     features: [
//       'Interactive touch screen',
//       'Music and learning games',
//       'Volume control',
//       'Durable and kid-friendly',
//       '50+ learning activities'
//     ],
//     specifications: {
//       'Age Range': '2-6 years',
//       'Material': 'BPA-free plastic',
//       'Battery': '3 AA batteries (included)',
//       'Weight': '1.5 lbs',
//       'Dimensions': '10" x 8" x 1"'
//     },
//     isNew: true,
//     ageRange: '2-6'
//   },
//   {
//     id: 5,
//     name: 'Cuddle Bear Plushie',
//     price: 24.99,
//     rating: 4.9,
//     reviewCount: 156,
//     category: 'Plush Toys',
//     emoji: '🧸',
//     colors: ['#D4A574', '#F5DEB3', '#DEB887', '#CD853F'],
//     colorNames: ['Honey Brown', 'Cream', 'Caramel', 'Golden Brown'],
//     images: ['🧸', '💝', '🌙', '⭐'],
//     description: 'The softest, most huggable bear your child will ever meet! Made with premium materials, this cuddly companion is perfect for bedtime stories and adventures.',
//     features: [
//       'Ultra-soft premium fabric',
//       'Machine washable',
//       'Hypoallergenic filling',
//       'Perfect size for hugging',
//       'Safety tested'
//     ],
//     specifications: {
//       'Age Range': '0+ years',
//       'Material': 'Premium plush fabric',
//       'Filling': 'Hypoallergenic polyester',
//       'Weight': '0.9 lbs',
//       'Dimensions': '12" x 8" x 6"'
//     },
//     isBestSeller: true,
//     ageRange: '0+'
//   },
//   {
//     id: 6,
//     name: 'Art & Craft Set',
//     price: 32.99,
//     originalPrice: 42.99,
//     rating: 4.8,
//     reviewCount: 89,
//     category: 'Arts & Crafts',
//     emoji: '🎨',
//     colors: ['#E74C3C', '#F39C12', '#2ECC71', '#9B59B6'],
//     colorNames: ['Creative Red', 'Artistic Orange', 'Nature Green', 'Imagination Purple'],
//     images: ['🎨', '✏️', '📝', '🌈'],
//     description: 'Unleash your child\'s artistic potential with this comprehensive art set! Includes crayons, markers, colored pencils, paper, and more for endless creativity.',
//     features: [
//       '64-piece complete art set',
//       'Non-toxic materials',
//       'Organized carrying case',
//       'Perfect for travel',
//       'Encourages creativity'
//     ],
//     specifications: {
//       'Age Range': '4-12 years',
//       'Material': 'Non-toxic art supplies',
//       'Pieces': '64 items',
//       'Weight': '2.3 lbs',
//       'Dimensions': '13" x 10" x 3"'
//     },
//     ageRange: '4-12'
//   }
// ];

// export const getProductsByCategory = (category: string): Product[] => {
//   return products.filter(product => 
//     product.category.toLowerCase().includes(category.toLowerCase())
//   );
// };

// export const getProductsByAgeRange = (ageRange: string): Product[] => {
//   return products.filter(product => {
//     switch (ageRange) {
//       case '0-3':
//         return product.ageRange.includes('0') || product.ageRange.includes('2') || product.ageRange.includes('3');
//       case '4-7':
//         return ['4', '5', '6', '7'].some(age => product.ageRange.includes(age));
//       case '8-12':
//         return ['8', '9', '10', '11', '12'].some(age => product.ageRange.includes(age));
//       default:
//         return true;
//     }
//   });
// };

// export const getProductById = (id: number): Product | undefined => {
//   return products.find(product => product.id === id);
// };