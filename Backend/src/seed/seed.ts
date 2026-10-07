import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { MenuItem } from '../models/MenuItem';
import { RestaurantTable } from '../models/RestaurantTable';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Cleaning up existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await RestaurantTable.deleteMany({});

    console.log('[Seed] Creating Admin and Demo Customer Users...');
    const adminUser = await User.create({
      name: 'Gotham Administrator',
      email: 'admin@gothamrestaurant.com',
      password: 'AdminPassword123!',
      phone: '+1 (555) 999-8888',
      role: 'admin',
      address: {
        street: '100 Wayne Manor Blvd',
        city: 'Gotham City',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      }
    });

    const customerUser = await User.create({
      name: 'Bruce Wayne',
      email: 'customer@gothamrestaurant.com',
      password: 'CustomerPassword123!',
      phone: '+1 (555) 123-4567',
      role: 'customer',
      loyaltyPoints: 2400,
      loyaltyTier: 'Silver Sentinel',
      address: {
        street: '100 Wayne Manor Blvd',
        city: 'Gotham City',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      }
    });

    console.log(`[Seed] Users created:\n - Admin: ${adminUser.email}\n - Customer: ${customerUser.email}`);

    console.log('[Seed] Creating Categories...');
    const categoriesData = [
      {
        name: 'Starters',
        description: 'Exquisite appetizers crafted to stimulate your palate.',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
        isActive: true
      },
      {
        name: 'Main Course',
        description: 'Masterfully cooked meats, fresh seafood, and rich vegetarian entrees.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
        isActive: true
      },
      {
        name: 'Artisanal Pizza',
        description: 'Wood-fired Neapolitan sourdough pizza topped with imported Italian cheeses.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        isActive: true
      },
      {
        name: 'Desserts',
        description: 'Decadent chocolate creations and artisanal European pastries.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
        isActive: true
      },
      {
        name: 'Cocktails',
        description: 'Bespoke mixology and hand-selected rare vintage wines.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
        isActive: true
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Created ${createdCategories.length} categories.`);

    const catMap = new Map(createdCategories.map((c) => [c.name, c._id]));

    console.log('[Seed] Creating Menu Items...');
    const menuItemsData = [
      // STARTERS
      {
        category: catMap.get('Starters'),
        name: 'Truffle & Burrata Bruschetta',
        description: 'Creamy Puglia burrata served on toasted sourdough, shaved black summer truffle, and aged balsamic glaze.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Puglia Burrata', 'Black Truffle', 'Wild Mushrooms', 'Sourdough', 'Aged Balsamic'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 15
      },
      {
        category: catMap.get('Starters'),
        name: 'Wagyu Beef Tartare',
        description: 'Hand-cut A5 Wagyu beef, quail egg yolk, capers, microgreens, and crisp crostini.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
        ingredients: ['A5 Wagyu Beef', 'Quail Egg', 'Dijon Mustard', 'Capers', 'Shallots'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 15
      },
      {
        category: catMap.get('Starters'),
        name: 'Pan-Seared Hokkaido Scallops',
        description: 'Pan-seared Japanese scallops served over cauliflower purée, crispy prosciutto, and white wine lemon reduction.',
        price: 520,
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Hokkaido Scallops', 'Cauliflower Purée', 'Crispy Prosciutto', 'Lemon White Wine Reduction'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 15
      },
      {
        category: catMap.get('Starters'),
        name: 'Wild Forest Mushroom Soup',
        description: 'Rich and velvety roasted wild mushroom soup with black truffle oil and freshly baked herb garlic crostini.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Porcini Mushrooms', 'Heavy Cream', 'Black Truffle Oil', 'Herb Crostini'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 12
      },
      {
        category: catMap.get('Starters'),
        name: 'Crispy Calamari Fritti',
        description: 'Tender squid rings lightly dusted in seasoned flour, fried to golden perfection, served with spicy smoked paprika aioli.',
        price: 360,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Wild Squid', 'Smoked Paprika Aioli', 'Charred Lemon', 'Fresh Parsley'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 12
      },

      // MAIN COURSE
      {
        category: catMap.get('Main Course'),
        name: 'Prime Ribeye Steak (300g)',
        description: '28-day dry-aged Angus ribeye, truffle mashed potatoes, roasted garlic bulb, and rosemary jus.',
        price: 950,
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Dry-Aged Angus Ribeye', 'Truffle Potato Purée', 'Garlic', 'Rosemary Red Wine Jus'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 25
      },
      {
        category: catMap.get('Main Course'),
        name: 'Pan-Seared Chilean Sea Bass',
        description: 'Pan-seared Chilean sea bass in saffron butter broth served over asparagus risottino.',
        price: 880,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Chilean Sea Bass', 'Saffron Broth', 'Asparagus', 'Arborio Rice', 'Micro Herbs'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 25
      },
      {
        category: catMap.get('Main Course'),
        name: 'Wild Mushroom Risotto',
        description: 'Creamy Carnaroli rice cooked with porcini and chanterelle mushrooms, 24-month Parmigiano-Reggiano, and truffle oil.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Carnaroli Rice', 'Porcini Mushrooms', 'Parmigiano-Reggiano', 'White Truffle Oil'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 20
      },
      {
        category: catMap.get('Main Course'),
        name: 'Slow-Braised Black Angus Short Rib',
        description: '12-hour braised beef short rib in Barolo red wine reduction, served with creamy polenta and glazed baby carrots.',
        price: 920,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Black Angus Short Rib', 'Barolo Red Wine', 'Creamy Polenta', 'Baby Carrots', 'Fresh Thyme'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 30
      },
      {
        category: catMap.get('Main Course'),
        name: 'Grilled Atlantic Salmon Fillet',
        description: 'Crispy skin Atlantic salmon with dill caper butter sauce, crushed heirloom potatoes, and steamed broccolini.',
        price: 780,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Wild Atlantic Salmon', 'Dill Caper Butter', 'Heirloom Potatoes', 'Broccolini'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 20
      },
      {
        category: catMap.get('Main Course'),
        name: 'Roasted Rack of New Zealand Lamb',
        description: 'Herb and Dijon-crusted New Zealand lamb chops with mint infused jus and roasted root vegetables.',
        price: 980,
        image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?auto=format&fit=crop&q=80&w=800',
        ingredients: ['New Zealand Lamb', 'Dijon Mustard', 'Fresh Rosemary', 'Mint Jus', 'Root Vegetables'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 25
      },
      {
        category: catMap.get('Main Course'),
        name: 'Truffle Tagliolini Cacio e Pepe',
        description: 'Handmade egg tagliolini tossed with Pecorino Romano, coarse cracked black pepper, and shaved fresh black truffle.',
        price: 460,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Handmade Pasta', 'Pecorino Romano', 'Tellicherry Black Pepper', 'Fresh Black Truffle'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 18
      },

      // ARTISANAL PIZZA
      {
        category: catMap.get('Artisanal Pizza'),
        name: 'Tartufata & Fior di Latte Pizza',
        description: 'Black truffle cream base, Fior di Latte mozzarella, wild oyster mushrooms, fresh thyme, and sea salt.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Black Truffle Cream', 'Fior di Latte', 'Oyster Mushrooms', 'Thyme'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 18
      },
      {
        category: catMap.get('Artisanal Pizza'),
        name: 'Diavola & Spicy Nduja Pizza',
        description: 'San Marzano tomato sauce, spicy Calabrian Nduja sausage, artisan pepperoni, and fresh basil.',
        price: 490,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
        ingredients: ['San Marzano Tomato', 'Calabrian Nduja', 'Pepperoni', 'Fresh Basil'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 18
      },
      {
        category: catMap.get('Artisanal Pizza'),
        name: 'Quattro Formaggi & Honey Drizzle',
        description: 'Mozzarella di Bufala, Gorgonzola Dolce, Smoked Provola, Parmigiano, finished with wildflower truffle honey.',
        price: 460,
        image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Mozzarella di Bufala', 'Gorgonzola', 'Provola', 'Parmigiano', 'Truffle Honey'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 16
      },
      {
        category: catMap.get('Artisanal Pizza'),
        name: 'Prosciutto di Parma & Arugula',
        description: 'San Marzano base, fresh Fior di Latte, aged Prosciutto di Parma, wild arugula, and shaved Parmesan flakes.',
        price: 520,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
        ingredients: ['San Marzano Tomato', 'Prosciutto di Parma', 'Wild Arugula', 'Parmesan Flakes'],
        isVegetarian: false,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 18
      },

      // DESSERTS
      {
        category: catMap.get('Desserts'),
        name: 'Valrhona Chocolate Fondant',
        description: 'Warm dark Valrhona chocolate molten cake served with Madagascar vanilla bean gelato.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Valrhona Dark Chocolate', 'Madagascar Vanilla Gelato', 'Berry Coulis'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 15
      },
      {
        category: catMap.get('Desserts'),
        name: 'Classic Venetian Tiramisu',
        description: 'Savoiardi ladyfingers soaked in espresso and dark rum, layered with whipped mascarpone and cocoa powder.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Savoiardi', 'Espresso', 'Dark Rum', 'Mascarpone', 'Cocoa Powder'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 10
      },
      {
        category: catMap.get('Desserts'),
        name: 'Pistachio & White Chocolate Cannoli',
        description: 'Crispy Sicilian pastry shells filled with sweetened ricotta, white chocolate chips, and crushed Sicilian pistachios.',
        price: 270,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Sicilian Cannoli Shell', 'Sweet Ricotta', 'Bronte Pistachios', 'White Chocolate'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 10
      },
      {
        category: catMap.get('Desserts'),
        name: 'Vanilla Bean Panna Cotta',
        description: 'Silky smooth Madagascar vanilla bean panna cotta served with wild blackberry coulis and edible gold leaf.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Heavy Cream', 'Madagascar Vanilla Bean', 'Wild Blackberry Coulis', 'Gold Leaf'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 10
      },

      // COCKTAILS
      {
        category: catMap.get('Cocktails'),
        name: 'Gotham Dark Knight Smoked Old Fashioned',
        description: 'Bourbon whiskey infused with charred oak smoke, Angostura bitters, orange peel, and maraschino cherry.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Bourbon Whiskey', 'Oak Smoke', 'Angostura Bitters', 'Orange Peel'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 8
      },
      {
        category: catMap.get('Cocktails'),
        name: 'Gotham Royal Velvet Espresso Martini',
        description: 'Belvedere vodka, freshly pulled Gotham espresso, Kahlúa liqueur, and dark chocolate cocoa nibs.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Belvedere Vodka', 'Fresh Espresso', 'Kahlúa', 'Dark Chocolate Nibs'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: false,
        isActive: true,
        preparationTime: 6
      },
      {
        category: catMap.get('Cocktails'),
        name: 'Smoked Rosemary Mezcalita',
        description: 'Artisanal Mezcal, fresh lime juice, agave nectar, smoked rosemary sprig, and black lava salt rim.',
        price: 370,
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Artisanal Mezcal', 'Fresh Lime', 'Agave Nectar', 'Smoked Rosemary', 'Black Lava Salt'],
        isVegetarian: true,
        isAvailable: true,
        isFeatured: true,
        isActive: true,
        preparationTime: 7
      }
    ];

    const createdMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`[Seed] Created ${createdMenuItems.length} menu items.`);

    console.log('[Seed] Creating Restaurant Tables...');
    const tablesData = [
      { tableNumber: 'T-01', capacity: 2, location: 'Window Side', status: 'available', isActive: true },
      { tableNumber: 'T-02', capacity: 2, location: 'Window Side', status: 'available', isActive: true },
      { tableNumber: 'T-03', capacity: 4, location: 'Main Dining Room', status: 'available', isActive: true },
      { tableNumber: 'T-04', capacity: 4, location: 'Main Dining Room', status: 'available', isActive: true },
      { tableNumber: 'T-05', capacity: 4, location: 'Main Dining Room', status: 'available', isActive: true },
      { tableNumber: 'T-06', capacity: 6, location: 'Patio Terrace', status: 'available', isActive: true },
      { tableNumber: 'T-07', capacity: 6, location: 'Patio Terrace', status: 'available', isActive: true },
      { tableNumber: 'T-08', capacity: 8, location: 'VIP Lounge', status: 'available', isActive: true },
      { tableNumber: 'T-09', capacity: 8, location: 'VIP Lounge', status: 'available', isActive: true },
      { tableNumber: 'T-10', capacity: 10, location: 'Private Chef Table', status: 'available', isActive: true }
    ];

    const createdTables = await RestaurantTable.insertMany(tablesData);
    console.log(`[Seed] Created ${createdTables.length} restaurant tables.`);

    console.log('[Seed] Database seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
