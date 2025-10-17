// Comprehensive recipe seeding with real recipes, proper titles, and high-quality images
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';
import User from './models/User.js';

dotenv.config();

const realRecipes = [
  {
    title: "Classic Spaghetti Carbonara",
    description: "Authentic Italian pasta with eggs, cheese, and pancetta",
    category: "Dinner",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale",
      "4 large eggs",
      "100g Pecorino Romano cheese",
      "2 cloves garlic",
      "Black pepper",
      "Salt"
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package directions",
      "Cut pancetta into small cubes and cook in a large skillet until crispy",
      "In a bowl, whisk together eggs, grated cheese, and black pepper",
      "Drain pasta, reserving 1 cup of pasta water",
      "Add hot pasta to the skillet with pancetta, remove from heat",
      "Quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce",
      "Serve immediately with extra cheese and black pepper"
    ],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 24, fat: 18, carbs: 65 }
  },
  {
    title: "Perfect Chocolate Chip Cookies",
    description: "Soft and chewy cookies with the perfect balance of chocolate",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Cream butter and both sugars until fluffy",
      "Beat in eggs one at a time, then vanilla",
      "Gradually mix in flour mixture",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto ungreased baking sheets",
      "Bake 9-11 minutes until golden brown"
    ],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 2, fat: 8, carbs: 25 }
  },
  {
    title: "Beef and Broccoli Stir Fry",
    description: "Quick and healthy Asian-inspired dish with tender beef and crisp vegetables",
    category: "Dinner",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb beef sirloin, sliced thin",
      "4 cups broccoli florets",
      "3 tbsp soy sauce",
      "2 tbsp oyster sauce",
      "1 tbsp cornstarch",
      "2 cloves garlic, minced",
      "1 inch ginger, grated",
      "2 tbsp vegetable oil",
      "1 tsp sesame oil",
      "2 green onions, sliced"
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, and cornstarch in a bowl",
      "Heat oil in a large wok or skillet over high heat",
      "Add beef and stir-fry for 2-3 minutes until browned",
      "Add garlic and ginger, cook for 30 seconds",
      "Add broccoli and stir-fry for 3-4 minutes",
      "Pour sauce over everything and cook until thickened",
      "Garnish with green onions and sesame oil"
    ],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 28, fat: 12, carbs: 15 }
  },
  {
    title: "Mediterranean Quinoa Bowl",
    description: "Nutritious and colorful bowl packed with Mediterranean flavors",
    category: "Lunch",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 cucumber, diced",
      "2 tomatoes, diced",
      "½ red onion, diced",
      "1 cup chickpeas",
      "½ cup kalamata olives",
      "4 oz feta cheese",
      "3 tbsp olive oil",
      "2 tbsp lemon juice",
      "Fresh herbs (parsley, mint)"
    ],
    instructions: [
      "Cook quinoa in vegetable broth according to package directions",
      "Let quinoa cool to room temperature",
      "Dice all vegetables and combine in a large bowl",
      "Add cooked quinoa and chickpeas",
      "Whisk together olive oil and lemon juice for dressing",
      "Toss everything with dressing and fresh herbs",
      "Top with feta cheese and olives"
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 16, carbs: 35 }
  },
  {
    title: "Creamy Mushroom Risotto",
    description: "Rich and creamy Italian rice dish with wild mushrooms",
    category: "Dinner",
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      "1½ cups Arborio rice",
      "4 cups warm chicken stock",
      "1 lb mixed mushrooms",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "½ cup white wine",
      "4 tbsp butter",
      "½ cup Parmesan cheese",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Fresh thyme"
    ],
    instructions: [
      "Heat stock in a saucepan and keep warm",
      "Sauté mushrooms in butter until golden, set aside",
      "Cook onion in olive oil until translucent",
      "Add rice and stir for 2 minutes until lightly toasted",
      "Add wine and stir until absorbed",
      "Add warm stock one ladle at a time, stirring constantly",
      "Continue until rice is creamy and al dente (18-20 minutes)",
      "Stir in mushrooms, cheese, and thyme"
    ],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 14, fat: 18, carbs: 52 }
  },
  {
    title: "Avocado Toast with Poached Egg",
    description: "Perfect breakfast with creamy avocado and perfectly poached egg",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp lemon juice",
      "Salt and pepper",
      "Red pepper flakes",
      "Fresh herbs (optional)"
    ],
    instructions: [
      "Toast bread slices until golden",
      "Mash avocado with lemon juice, salt, and pepper",
      "Bring water to a gentle simmer in a pot",
      "Crack eggs into small bowls",
      "Create a whirlpool and gently drop eggs into water",
      "Poach for 3-4 minutes until whites are set",
      "Spread avocado on toast",
      "Top with poached egg and seasonings"
    ],
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 14, fat: 18, carbs: 22 }
  },
  {
    title: "Thai Green Curry",
    description: "Aromatic and spicy Thai curry with coconut milk and fresh vegetables",
    category: "Dinner",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb chicken breast, sliced",
      "2 cans coconut milk",
      "3 tbsp green curry paste",
      "1 bell pepper, sliced",
      "1 zucchini, sliced",
      "1 cup bamboo shoots",
      "2 tbsp fish sauce",
      "1 tbsp brown sugar",
      "Thai basil leaves",
      "Jasmine rice"
    ],
    instructions: [
      "Heat half the coconut milk in a large pot",
      "Add curry paste and cook until fragrant",
      "Add chicken and cook until no longer pink",
      "Add remaining coconut milk and bring to simmer",
      "Add vegetables and cook until tender",
      "Season with fish sauce and brown sugar",
      "Garnish with Thai basil",
      "Serve over jasmine rice"
    ],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 28, fat: 22, carbs: 18 }
  },
  {
    title: "Classic Caesar Salad",
    description: "Crisp romaine lettuce with homemade Caesar dressing and croutons",
    category: "Salad",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 heads romaine lettuce",
      "1 cup croutons",
      "½ cup Parmesan cheese",
      "2 cloves garlic",
      "2 anchovy fillets",
      "1 egg yolk",
      "2 tbsp lemon juice",
      "½ cup olive oil",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and chop romaine lettuce",
      "Make dressing: blend garlic, anchovies, egg yolk, and lemon juice",
      "Slowly drizzle in olive oil while blending",
      "Season with salt and pepper",
      "Toss lettuce with dressing",
      "Top with croutons and Parmesan cheese"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 8, fat: 18, carbs: 8 }
  },
  {
    title: "Homemade Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil",
    category: "Dinner",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb pizza dough",
      "1 cup tomato sauce",
      "8 oz fresh mozzarella",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Cornmeal for dusting"
    ],
    instructions: [
      "Preheat oven to 500°F (260°C)",
      "Roll out dough on floured surface",
      "Dust pizza stone with cornmeal",
      "Spread tomato sauce on dough",
      "Tear mozzarella into pieces and distribute",
      "Drizzle with olive oil and season",
      "Bake for 12-15 minutes until crust is golden",
      "Top with fresh basil before serving"
    ],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    nutrition: { calories: 450, protein: 20, fat: 18, carbs: 52 }
  },
  {
    title: "Lemon Blueberry Muffins",
    description: "Moist and fluffy muffins bursting with fresh blueberries and lemon zest",
    category: "Breakfast",
    prepTime: 15,
    cookTime: 20,
    servings: 12,
    difficulty: "Easy",
    ingredients: [
      "2 cups all-purpose flour",
      "1 cup sugar",
      "2 tsp baking powder",
      "½ tsp salt",
      "2 eggs",
      "1 cup milk",
      "½ cup melted butter",
      "1 cup fresh blueberries",
      "Zest of 2 lemons",
      "2 tbsp lemon juice"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C)",
      "Mix dry ingredients in a large bowl",
      "Whisk eggs, milk, butter, and lemon juice",
      "Fold wet ingredients into dry ingredients",
      "Gently fold in blueberries and lemon zest",
      "Fill muffin cups ¾ full",
      "Bake for 18-20 minutes until golden",
      "Cool in pan for 5 minutes before removing"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 4, fat: 8, carbs: 26 }
  },
  {
    title: "Beef Tacos with Guacamole",
    description: "Spicy ground beef tacos with fresh guacamole and all the fixings",
    category: "Dinner",
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb ground beef",
      "1 packet taco seasoning",
      "12 taco shells",
      "2 avocados",
      "1 lime",
      "1 tomato, diced",
      "½ red onion, diced",
      "1 cup shredded lettuce",
      "1 cup shredded cheese",
      "Sour cream",
      "Salsa"
    ],
    instructions: [
      "Brown ground beef in a large skillet",
      "Add taco seasoning and water, simmer 5 minutes",
      "Make guacamole: mash avocados with lime juice",
      "Add diced tomato and onion to guacamole",
      "Warm taco shells according to package directions",
      "Fill shells with beef, guacamole, and toppings",
      "Serve with sour cream and salsa"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 22, fat: 24, carbs: 28 }
  },
  {
    title: "Chicken Noodle Soup",
    description: "Comforting homemade soup with tender chicken and egg noodles",
    category: "Soup",
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 whole chicken (3-4 lbs)",
      "8 cups chicken broth",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "8 oz egg noodles",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Fresh parsley"
    ],
    instructions: [
      "Season chicken and roast at 400°F for 45 minutes",
      "Let cool and shred meat, discard bones",
      "Heat oil in large pot, sauté vegetables until soft",
      "Add garlic and cook 1 minute",
      "Add broth and bring to boil",
      "Add noodles and cook until tender",
      "Add shredded chicken and heat through",
      "Season with salt, pepper, and parsley"
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 24, fat: 8, carbs: 28 }
  },
  {
    title: "Chocolate Lava Cake",
    description: "Decadent individual cakes with molten chocolate centers",
    category: "Dessert",
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      "4 oz dark chocolate",
      "½ cup butter",
      "2 eggs",
      "2 egg yolks",
      "¼ cup sugar",
      "2 tbsp flour",
      "Pinch of salt",
      "Powdered sugar for dusting",
      "Vanilla ice cream"
    ],
    instructions: [
      "Preheat oven to 450°F (230°C)",
      "Melt chocolate and butter in double boiler",
      "Beat eggs, yolks, and sugar until pale",
      "Fold in melted chocolate mixture",
      "Add flour and salt, mix until just combined",
      "Grease and flour 4 ramekins",
      "Divide batter among ramekins",
      "Bake 12-14 minutes until edges are set",
      "Invert onto plates and dust with powdered sugar"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 480, protein: 8, fat: 32, carbs: 42 }
  },
  {
    title: "Greek Salad",
    description: "Fresh Mediterranean salad with tomatoes, cucumbers, and feta cheese",
    category: "Salad",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 large tomatoes",
      "1 cucumber",
      "1 red onion",
      "1 green bell pepper",
      "8 oz feta cheese",
      "½ cup kalamata olives",
      "3 tbsp olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp oregano",
      "Salt and pepper"
    ],
    instructions: [
      "Cut tomatoes into wedges",
      "Slice cucumber and onion thinly",
      "Cut bell pepper into strips",
      "Cut feta into cubes",
      "Combine all vegetables in large bowl",
      "Whisk together olive oil, vinegar, and oregano",
      "Toss salad with dressing",
      "Top with feta and olives",
      "Season with salt and pepper"
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 8, fat: 14, carbs: 12 }
  },
  {
    title: "Beef Wellington",
    description: "Elegant dish with beef tenderloin wrapped in puff pastry",
    category: "Dinner",
    prepTime: 45,
    cookTime: 30,
    servings: 6,
    difficulty: "Hard",
    ingredients: [
      "2 lb beef tenderloin",
      "1 lb puff pastry",
      "8 oz mushrooms",
      "2 shallots",
      "2 cloves garlic",
      "2 tbsp Dijon mustard",
      "6 slices prosciutto",
      "2 egg yolks",
      "Salt and pepper",
      "Fresh thyme"
    ],
    instructions: [
      "Season beef and sear on all sides",
      "Brush with mustard and let cool",
      "Sauté mushrooms, shallots, and garlic until dry",
      "Roll out pastry and layer with prosciutto",
      "Spread mushroom mixture over prosciutto",
      "Wrap beef in pastry, sealing edges",
      "Brush with egg wash",
      "Bake at 400°F for 25-30 minutes",
      "Let rest 10 minutes before slicing"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 32, fat: 28, carbs: 35 }
  },
  {
    title: "Banana Pancakes",
    description: "Fluffy pancakes with mashed banana and warm maple syrup",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 cup all-purpose flour",
      "1 tbsp sugar",
      "2 tsp baking powder",
      "½ tsp salt",
      "1 cup milk",
      "1 egg",
      "2 tbsp melted butter",
      "2 ripe bananas",
      "Maple syrup",
      "Butter for serving"
    ],
    instructions: [
      "Mash bananas in a bowl",
      "Mix dry ingredients in another bowl",
      "Whisk milk, egg, and melted butter",
      "Combine wet and dry ingredients",
      "Fold in mashed bananas",
      "Heat griddle and pour batter",
      "Cook until bubbles form, then flip",
      "Serve with butter and maple syrup"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 8, fat: 6, carbs: 38 }
  },
  {
    title: "Shrimp Scampi",
    description: "Garlicky shrimp in white wine sauce over pasta",
    category: "Dinner",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb large shrimp",
      "8 oz linguine",
      "4 cloves garlic",
      "½ cup white wine",
      "4 tbsp butter",
      "2 tbsp olive oil",
      "2 tbsp lemon juice",
      "¼ cup parsley",
      "Red pepper flakes",
      "Salt and pepper"
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Season shrimp with salt and pepper",
      "Heat oil and butter in large skillet",
      "Add garlic and cook until fragrant",
      "Add shrimp and cook 2 minutes per side",
      "Add wine and lemon juice",
      "Toss with cooked pasta",
      "Garnish with parsley and red pepper flakes"
    ],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 28, fat: 16, carbs: 32 }
  },
  {
    title: "Apple Cinnamon Oatmeal",
    description: "Warm and comforting breakfast with fresh apples and cinnamon",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "1 cup rolled oats",
      "2 cups milk",
      "1 apple, diced",
      "2 tbsp brown sugar",
      "1 tsp cinnamon",
      "Pinch of salt",
      "2 tbsp chopped walnuts",
      "Honey for drizzling"
    ],
    instructions: [
      "Combine oats, milk, and salt in saucepan",
      "Bring to boil, then reduce heat",
      "Simmer 5 minutes, stirring occasionally",
      "Add diced apple and cinnamon",
      "Cook 2 more minutes",
      "Sweeten with brown sugar",
      "Top with walnuts and honey"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 8, carbs: 52 }
  },
  {
    title: "Fish and Chips",
    description: "Crispy beer-battered fish with golden french fries",
    category: "Dinner",
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 cod fillets",
      "2 lbs russet potatoes",
      "1 cup flour",
      "1 cup beer",
      "Oil for frying",
      "Salt and pepper",
      "Malt vinegar",
      "Tartar sauce"
    ],
    instructions: [
      "Cut potatoes into thick fries",
      "Soak fries in cold water 30 minutes",
      "Make batter with flour and beer",
      "Heat oil to 375°F",
      "Fry fries until golden, drain on paper towels",
      "Dip fish in batter and fry until golden",
      "Season with salt and serve with vinegar"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 580, protein: 32, fat: 28, carbs: 48 }
  },
  {
    title: "Chocolate Chip Pancakes",
    description: "Fluffy pancakes loaded with chocolate chips",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1½ cups flour",
      "3 tbsp sugar",
      "2 tsp baking powder",
      "½ tsp salt",
      "1¼ cups milk",
      "1 egg",
      "3 tbsp melted butter",
      "½ cup chocolate chips",
      "Maple syrup"
    ],
    instructions: [
      "Mix dry ingredients in bowl",
      "Whisk milk, egg, and butter",
      "Combine wet and dry ingredients",
      "Fold in chocolate chips",
      "Heat griddle and pour batter",
      "Cook until bubbles form",
      "Flip and cook other side",
      "Serve with maple syrup"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 8, fat: 10, carbs: 42 }
  },
  {
    title: "Chicken Parmesan",
    description: "Breaded chicken cutlets with marinara sauce and melted cheese",
    category: "Dinner",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 chicken breasts",
      "1 cup breadcrumbs",
      "½ cup Parmesan cheese",
      "2 eggs",
      "1 cup flour",
      "2 cups marinara sauce",
      "2 cups mozzarella cheese",
      "Oil for frying",
      "Salt and pepper",
      "Fresh basil"
    ],
    instructions: [
      "Pound chicken to even thickness",
      "Set up breading station: flour, eggs, breadcrumbs",
      "Bread chicken and fry until golden",
      "Place in baking dish",
      "Top with marinara and mozzarella",
      "Bake at 400°F for 15 minutes",
      "Garnish with basil"
    ],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 42, fat: 18, carbs: 35 }
  },
  {
    title: "Strawberry Shortcake",
    description: "Classic dessert with sweet biscuits, fresh strawberries, and whipped cream",
    category: "Dessert",
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      "2 cups flour",
      "3 tbsp sugar",
      "1 tbsp baking powder",
      "½ tsp salt",
      "6 tbsp cold butter",
      "¾ cup heavy cream",
      "1 lb fresh strawberries",
      "2 tbsp sugar",
      "1 cup whipped cream"
    ],
    instructions: [
      "Mix dry ingredients",
      "Cut in butter until crumbly",
      "Stir in cream until dough forms",
      "Roll out and cut into circles",
      "Bake at 425°F for 12-15 minutes",
      "Slice strawberries and sweeten",
      "Split biscuits and layer with berries",
      "Top with whipped cream"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 6, fat: 22, carbs: 42 }
  },
  {
    title: "Caesar Salad Wrap",
    description: "Fresh romaine lettuce with Caesar dressing in a tortilla wrap",
    category: "Lunch",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 large tortillas",
      "4 cups romaine lettuce",
      "½ cup Caesar dressing",
      "½ cup croutons",
      "¼ cup Parmesan cheese",
      "2 tbsp lemon juice",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and chop lettuce",
      "Mix dressing with lemon juice",
      "Toss lettuce with dressing",
      "Add croutons and cheese",
      "Season with salt and pepper",
      "Divide mixture between tortillas",
      "Roll up tightly and slice in half"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 18, carbs: 28 }
  },
  {
    title: "Beef Stroganoff",
    description: "Rich and creamy Russian dish with tender beef and mushrooms",
    category: "Dinner",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb beef sirloin",
      "8 oz mushrooms",
      "1 onion",
      "2 cloves garlic",
      "2 cups beef broth",
      "1 cup sour cream",
      "2 tbsp flour",
      "3 tbsp butter",
      "Egg noodles",
      "Salt and pepper"
    ],
    instructions: [
      "Slice beef into strips",
      "Sauté mushrooms and onion",
      "Add garlic and cook 1 minute",
      "Add beef and brown",
      "Sprinkle with flour",
      "Add broth and simmer 20 minutes",
      "Stir in sour cream",
      "Serve over egg noodles"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 28, fat: 18, carbs: 32 }
  },
  {
    title: "French Toast",
    description: "Golden brown toast with cinnamon and vanilla, perfect for breakfast",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "8 slices bread",
      "4 eggs",
      "1 cup milk",
      "2 tbsp sugar",
      "1 tsp vanilla",
      "½ tsp cinnamon",
      "Butter for cooking",
      "Maple syrup"
    ],
    instructions: [
      "Whisk eggs, milk, sugar, vanilla, and cinnamon",
      "Heat griddle with butter",
      "Dip bread in egg mixture",
      "Cook until golden brown",
      "Flip and cook other side",
      "Serve with maple syrup"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 12, fat: 8, carbs: 38 }
  },
  {
    title: "Chicken Tikka Masala",
    description: "Creamy Indian curry with tender chicken and aromatic spices",
    category: "Dinner",
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb chicken breast",
      "1 cup yogurt",
      "2 tbsp garam masala",
      "1 onion",
      "3 cloves garlic",
      "1 inch ginger",
      "1 can tomatoes",
      "1 cup heavy cream",
      "2 tbsp butter",
      "Basmati rice"
    ],
    instructions: [
      "Marinate chicken in yogurt and spices",
      "Sauté onion, garlic, and ginger",
      "Add tomatoes and simmer",
      "Grill or pan-fry chicken",
      "Add chicken to sauce",
      "Stir in cream and butter",
      "Serve over basmati rice"
    ],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 32, fat: 18, carbs: 28 }
  },
  {
    title: "Chocolate Mousse",
    description: "Light and airy chocolate dessert with whipped cream",
    category: "Dessert",
    prepTime: 20,
    cookTime: 0,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      "6 oz dark chocolate",
      "4 eggs, separated",
      "¼ cup sugar",
      "1 cup heavy cream",
      "1 tsp vanilla",
      "Pinch of salt"
    ],
    instructions: [
      "Melt chocolate and let cool",
      "Beat egg yolks with half the sugar",
      "Whip egg whites with remaining sugar",
      "Whip cream until stiff peaks",
      "Fold chocolate into yolks",
      "Fold in egg whites",
      "Fold in whipped cream",
      "Chill for 2 hours"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 8, fat: 24, carbs: 22 }
  },
  {
    title: "Grilled Salmon",
    description: "Perfectly grilled salmon with lemon and herbs",
    category: "Dinner",
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 salmon fillets",
      "2 lemons",
      "3 tbsp olive oil",
      "2 cloves garlic",
      "Fresh dill",
      "Salt and pepper",
      "Lemon wedges"
    ],
    instructions: [
      "Season salmon with salt and pepper",
      "Mix olive oil, garlic, and dill",
      "Brush salmon with oil mixture",
      "Grill 6 minutes per side",
      "Squeeze lemon over fish",
      "Serve with lemon wedges"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 32, fat: 14, carbs: 2 }
  },
  {
    title: "Vegetable Stir Fry",
    description: "Colorful mix of fresh vegetables in a savory sauce",
    category: "Dinner",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 cups broccoli",
      "1 bell pepper",
      "1 carrot",
      "1 zucchini",
      "1 cup snap peas",
      "3 cloves garlic",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 tbsp vegetable oil",
      "Ginger"
    ],
    instructions: [
      "Cut all vegetables into bite-sized pieces",
      "Heat oil in wok or large skillet",
      "Add garlic and ginger",
      "Stir-fry vegetables 5-7 minutes",
      "Add soy sauce and sesame oil",
      "Toss to combine",
      "Serve immediately"
    ],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    nutrition: { calories: 120, protein: 4, fat: 6, carbs: 16 }
  },
  {
    title: "Chocolate Chip Cookies",
    description: "Classic chewy cookies with semi-sweet chocolate chips",
    category: "Dessert",
    prepTime: 15,
    cookTime: 10,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      "2¼ cups flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter",
      "¾ cup brown sugar",
      "¾ cup white sugar",
      "2 eggs",
      "2 tsp vanilla",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Mix flour, baking soda, and salt",
      "Cream butter and sugars",
      "Beat in eggs and vanilla",
      "Mix in flour mixture",
      "Fold in chocolate chips",
      "Drop onto baking sheets",
      "Bake 9-11 minutes"
    ],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 2, fat: 8, carbs: 25 }
  },
  {
    title: "Chicken Noodle Soup",
    description: "Hearty soup with tender chicken and egg noodles",
    category: "Soup",
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 whole chicken",
      "8 cups chicken broth",
      "2 carrots",
      "2 celery stalks",
      "1 onion",
      "2 cloves garlic",
      "8 oz egg noodles",
      "Salt and pepper",
      "Fresh parsley"
    ],
    instructions: [
      "Simmer chicken in broth 45 minutes",
      "Remove chicken and shred meat",
      "Sauté vegetables until soft",
      "Add broth and bring to boil",
      "Add noodles and cook until tender",
      "Add shredded chicken",
      "Season with salt and pepper",
      "Garnish with parsley"
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 24, fat: 8, carbs: 28 }
  },
  {
    title: "Beef Tacos",
    description: "Spicy ground beef tacos with fresh toppings",
    category: "Dinner",
    prepTime: 15,
    cookTime: 15,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb ground beef",
      "1 packet taco seasoning",
      "12 taco shells",
      "1 cup lettuce",
      "1 tomato",
      "½ cup cheese",
      "Sour cream",
      "Salsa"
    ],
    instructions: [
      "Brown ground beef in skillet",
      "Add taco seasoning and water",
      "Simmer 5 minutes",
      "Warm taco shells",
      "Fill with beef and toppings",
      "Serve with sour cream and salsa"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 20, fat: 16, carbs: 24 }
  },
  {
    title: "Pancakes",
    description: "Fluffy buttermilk pancakes perfect for breakfast",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1½ cups flour",
      "3 tbsp sugar",
      "2 tsp baking powder",
      "½ tsp salt",
      "1¼ cups buttermilk",
      "1 egg",
      "3 tbsp melted butter"
    ],
    instructions: [
      "Mix dry ingredients",
      "Whisk wet ingredients",
      "Combine until just mixed",
      "Heat griddle",
      "Pour batter and cook",
      "Flip when bubbles form",
      "Cook until golden"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 8, fat: 6, carbs: 38 }
  },
  {
    title: "Caesar Salad",
    description: "Classic romaine salad with Caesar dressing",
    category: "Salad",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 heads romaine",
      "1 cup croutons",
      "½ cup Parmesan",
      "Caesar dressing",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and chop lettuce",
      "Make Caesar dressing",
      "Toss lettuce with dressing",
      "Add croutons and cheese",
      "Season with salt and pepper"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    nutrition: { calories: 200, protein: 8, fat: 16, carbs: 8 }
  },
  {
    title: "Chicken Stir Fry",
    description: "Quick and healthy chicken with mixed vegetables",
    category: "Dinner",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb chicken breast",
      "2 cups mixed vegetables",
      "3 tbsp soy sauce",
      "2 cloves garlic",
      "1 inch ginger",
      "2 tbsp oil",
      "Sesame seeds"
    ],
    instructions: [
      "Cut chicken into strips",
      "Heat oil in wok",
      "Stir-fry chicken 5 minutes",
      "Add vegetables",
      "Add garlic and ginger",
      "Add soy sauce",
      "Garnish with sesame seeds"
    ],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 28, fat: 6, carbs: 12 }
  },
  {
    title: "Chocolate Cake",
    description: "Rich and moist chocolate layer cake",
    category: "Dessert",
    prepTime: 30,
    cookTime: 30,
    servings: 12,
    difficulty: "Medium",
    ingredients: [
      "2 cups flour",
      "2 cups sugar",
      "¾ cup cocoa",
      "2 tsp baking powder",
      "1 tsp salt",
      "1 cup milk",
      "½ cup oil",
      "2 eggs",
      "2 tsp vanilla"
    ],
    instructions: [
      "Preheat oven to 350°F",
      "Mix dry ingredients",
      "Mix wet ingredients",
      "Combine until smooth",
      "Pour into greased pans",
      "Bake 30 minutes",
      "Cool and frost"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 6, fat: 16, carbs: 58 }
  },
  {
    title: "Beef Stew",
    description: "Hearty stew with tender beef and vegetables",
    category: "Dinner",
    prepTime: 20,
    cookTime: 2,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "2 lbs beef chuck",
      "4 carrots",
      "3 potatoes",
      "1 onion",
      "3 cups beef broth",
      "2 tbsp flour",
      "Salt and pepper",
      "Fresh herbs"
    ],
    instructions: [
      "Cut beef into cubes",
      "Brown beef in pot",
      "Add vegetables",
      "Add broth and herbs",
      "Simmer 2 hours",
      "Season with salt and pepper"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 28, fat: 12, carbs: 24 }
  },
  {
    title: "Omelette",
    description: "Fluffy eggs with cheese and herbs",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      "3 eggs",
      "2 tbsp milk",
      "¼ cup cheese",
      "Salt and pepper",
      "Fresh herbs",
      "Butter"
    ],
    instructions: [
      "Whisk eggs with milk",
      "Season with salt and pepper",
      "Heat butter in pan",
      "Pour in eggs",
      "Add cheese and herbs",
      "Fold in half",
      "Serve immediately"
    ],
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 20, fat: 18, carbs: 4 }
  },
  {
    title: "Pasta Salad",
    description: "Cold pasta salad with vegetables and Italian dressing",
    category: "Salad",
    prepTime: 20,
    cookTime: 10,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb pasta",
      "1 cup cherry tomatoes",
      "1 cucumber",
      "½ red onion",
      "1 bell pepper",
      "Italian dressing",
      "Fresh basil"
    ],
    instructions: [
      "Cook pasta according to directions",
      "Dice all vegetables",
      "Combine pasta and vegetables",
      "Toss with dressing",
      "Add fresh basil",
      "Chill before serving"
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 8, fat: 8, carbs: 48 }
  },
  {
    title: "Grilled Cheese",
    description: "Classic sandwich with melted cheese and crispy bread",
    category: "Lunch",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 slices bread",
      "4 slices cheese",
      "2 tbsp butter",
      "Salt and pepper"
    ],
    instructions: [
      "Butter one side of each bread slice",
      "Place cheese between slices",
      "Heat pan over medium heat",
      "Cook sandwich 3-4 minutes per side",
      "Press down gently",
      "Cut in half and serve"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 16, fat: 18, carbs: 28 }
  },
  {
    title: "Chicken Soup",
    description: "Comforting soup with chicken and vegetables",
    category: "Soup",
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 whole chicken",
      "8 cups water",
      "3 carrots",
      "3 celery stalks",
      "1 onion",
      "2 cloves garlic",
      "Salt and pepper",
      "Fresh parsley"
    ],
    instructions: [
      "Place chicken in large pot",
      "Add water and bring to boil",
      "Simmer 30 minutes",
      "Remove chicken and shred",
      "Add vegetables",
      "Simmer 15 minutes",
      "Add shredded chicken",
      "Season and garnish"
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 20, fat: 4, carbs: 12 }
  },
  {
    title: "Chocolate Chip Muffins",
    description: "Moist muffins with chocolate chips",
    category: "Breakfast",
    prepTime: 15,
    cookTime: 20,
    servings: 12,
    difficulty: "Easy",
    ingredients: [
      "2 cups flour",
      "1 cup sugar",
      "2 tsp baking powder",
      "½ tsp salt",
      "1 cup milk",
      "1 egg",
      "¼ cup oil",
      "1 cup chocolate chips"
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Mix dry ingredients",
      "Mix wet ingredients",
      "Combine until just mixed",
      "Fold in chocolate chips",
      "Fill muffin cups",
      "Bake 18-20 minutes"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 4, fat: 8, carbs: 36 }
  },
  {
    title: "Beef Burger",
    description: "Juicy beef patty with fresh toppings",
    category: "Dinner",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb ground beef",
      "4 burger buns",
      "Lettuce",
      "Tomato",
      "Onion",
      "Cheese",
      "Ketchup",
      "Mustard"
    ],
    instructions: [
      "Form beef into patties",
      "Season with salt and pepper",
      "Grill or pan-fry 4-5 minutes per side",
      "Toast buns",
      "Add cheese to patties",
      "Assemble with toppings",
      "Serve with condiments"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 24, fat: 18, carbs: 32 }
  },
  {
    title: "Fruit Salad",
    description: "Fresh mixed fruit salad",
    category: "Snack",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 apples",
      "2 bananas",
      "1 cup grapes",
      "1 cup strawberries",
      "1 orange",
      "1 tbsp honey",
      "1 tbsp lemon juice"
    ],
    instructions: [
      "Wash and cut all fruit",
      "Combine in large bowl",
      "Mix honey and lemon juice",
      "Toss fruit with dressing",
      "Chill before serving"
    ],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    nutrition: { calories: 120, protein: 2, fat: 0, carbs: 32 }
  },
  {
    title: "Mac and Cheese",
    description: "Creamy pasta with melted cheese",
    category: "Dinner",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb pasta",
      "2 cups cheese",
      "2 cups milk",
      "3 tbsp butter",
      "3 tbsp flour",
      "Salt and pepper"
    ],
    instructions: [
      "Cook pasta according to directions",
      "Make cheese sauce",
      "Melt butter, add flour",
      "Whisk in milk",
      "Add cheese and stir",
      "Combine with pasta",
      "Season with salt and pepper"
    ],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    nutrition: { calories: 480, protein: 20, fat: 18, carbs: 58 }
  },
  {
    title: "Chicken Wings",
    description: "Crispy wings with buffalo sauce",
    category: "Snack",
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "2 lbs chicken wings",
      "½ cup hot sauce",
      "4 tbsp butter",
      "Salt and pepper",
      "Blue cheese dressing"
    ],
    instructions: [
      "Season wings with salt and pepper",
      "Bake at 400°F for 20 minutes",
      "Make buffalo sauce",
      "Toss wings with sauce",
      "Bake 5 more minutes",
      "Serve with blue cheese"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 28, fat: 18, carbs: 8 }
  },
  {
    title: "Chocolate Pudding",
    description: "Rich and creamy chocolate dessert",
    category: "Dessert",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "¼ cup sugar",
      "3 tbsp cocoa",
      "3 tbsp cornstarch",
      "2 cups milk",
      "1 tsp vanilla",
      "Whipped cream"
    ],
    instructions: [
      "Mix dry ingredients",
      "Heat milk in saucepan",
      "Whisk in dry ingredients",
      "Cook until thickened",
      "Remove from heat",
      "Add vanilla",
      "Chill and serve with cream"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 6, fat: 4, carbs: 32 }
  },
  {
    title: "Veggie Wrap",
    description: "Fresh vegetables in a tortilla wrap",
    category: "Lunch",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 large tortillas",
      "1 cup lettuce",
      "1 tomato",
      "1 cucumber",
      "½ avocado",
      "Hummus",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and slice vegetables",
      "Spread hummus on tortillas",
      "Add vegetables",
      "Season with salt and pepper",
      "Roll up tightly",
      "Cut in half"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    nutrition: { calories: 240, protein: 8, fat: 12, carbs: 28 }
  },
  {
    title: "Chicken Quesadilla",
    description: "Grilled tortilla with chicken and cheese",
    category: "Lunch",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 tortillas",
      "1 cup chicken",
      "1 cup cheese",
      "Salsa",
      "Sour cream",
      "Oil"
    ],
    instructions: [
      "Heat oil in pan",
      "Place tortilla in pan",
      "Add chicken and cheese",
      "Top with second tortilla",
      "Cook until golden",
      "Flip and cook other side",
      "Serve with salsa and sour cream"
    ],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 24, fat: 18, carbs: 28 }
  },
  {
    title: "Chocolate Milkshake",
    description: "Rich and creamy chocolate milkshake",
    category: "Beverage",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 cups vanilla ice cream",
      "1 cup milk",
      "3 tbsp chocolate syrup",
      "Whipped cream",
      "Chocolate shavings"
    ],
    instructions: [
      "Add ice cream to blender",
      "Add milk and chocolate syrup",
      "Blend until smooth",
      "Pour into glasses",
      "Top with whipped cream",
      "Garnish with chocolate shavings"
    ],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 8, fat: 16, carbs: 38 }
  }
];

async function ensureSeederUser() {
  // Prefer admin if exists
  const admin = await User.findOne({ role: 'admin' });
  if (admin) return admin._id;

  // Fallback: create or find a dedicated seeder user
  let seeder = await User.findOne({ email: 'seeder@recipe.com' });
  if (seeder) return seeder._id;

  seeder = await User.create({
    firstName: 'Seeder',
    lastName: 'User',
    username: 'seeder',
    email: 'seeder@recipe.com',
    password: 'not-used-in-seeding',
    role: 'admin'
  });
  return seeder._id;
}

async function seedRecipes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const submittedByUserId = await ensureSeederUser();

    // Clear existing sample recipes
    await Recipe.deleteMany({ title: { $regex: /^Sample Recipe / } });
    console.log('🗑️  Cleared old sample recipes');

    // Insert new real recipes
    const recipesWithUser = realRecipes.map(recipe => ({
      ...recipe,
      submittedBy: submittedByUserId,
      status: 'approved'
    }));

    const inserted = await Recipe.insertMany(recipesWithUser, { ordered: false });
    console.log(`✅ Inserted ${inserted.length} real recipes with proper titles and ingredients`);
    console.log('📸 All recipes include high-quality Unsplash images');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedRecipes();
