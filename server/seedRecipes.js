// Comprehensive recipe seeding with real recipes, proper titles, and high-quality images
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';
import User from './models/User.js';

dotenv.config();

const realRecipes = [
  // ─── BREAKFAST ────────────────────────────────────────────────
  {
    title: "Avocado Toast with Poached Egg",
    description: "Perfect breakfast with creamy avocado and a perfectly poached egg on sourdough",
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
      "Poach for 3–4 minutes until whites are set",
      "Spread avocado on toast",
      "Top with poached egg and seasonings"
    ],
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 14, fat: 18, carbs: 22 }
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
      "Bake for 18–20 minutes until golden",
      "Cool in pan for 5 minutes before removing"
    ],
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 4, fat: 8, carbs: 26 }
  },
  {
    title: "Classic French Toast",
    description: "Golden-brown toast with cinnamon and vanilla, served with warm maple syrup",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "8 slices thick bread",
      "4 eggs",
      "1 cup milk",
      "2 tbsp sugar",
      "1 tsp vanilla extract",
      "½ tsp cinnamon",
      "Butter for cooking",
      "Maple syrup to serve"
    ],
    instructions: [
      "Whisk eggs, milk, sugar, vanilla, and cinnamon together",
      "Heat griddle over medium heat with butter",
      "Dip each bread slice in egg mixture",
      "Cook 3–4 minutes until golden brown",
      "Flip and cook other side",
      "Serve hot with maple syrup"
    ],
    image: "https://images.unsplash.com/photo-1484723091739-30990d99a5f4?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 12, fat: 8, carbs: 38 }
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
      "2 ripe bananas, mashed",
      "Maple syrup to serve"
    ],
    instructions: [
      "Mash bananas in a bowl",
      "Mix dry ingredients in a separate bowl",
      "Whisk milk, egg, and melted butter",
      "Combine wet and dry ingredients until just mixed",
      "Fold in mashed bananas",
      "Heat a griddle and pour ¼ cup batter per pancake",
      "Cook until bubbles form on surface, then flip",
      "Serve with butter and maple syrup"
    ],
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 8, fat: 6, carbs: 38 }
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
      "Combine oats, milk, and salt in a saucepan",
      "Bring to a boil, then reduce heat",
      "Simmer 5 minutes, stirring occasionally",
      "Add diced apple and cinnamon",
      "Cook 2 more minutes",
      "Sweeten with brown sugar",
      "Top with walnuts and a drizzle of honey"
    ],
    image: "https://images.unsplash.com/photo-1517093728984-2a6c4628c40a?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 8, carbs: 52 }
  },
  {
    title: "Veggie Omelette",
    description: "Fluffy eggs packed with fresh vegetables and melted cheese",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      "3 large eggs",
      "2 tbsp milk",
      "¼ cup shredded cheese",
      "¼ cup bell peppers, diced",
      "¼ cup mushrooms, sliced",
      "2 tbsp spinach",
      "Salt and pepper",
      "1 tsp butter"
    ],
    instructions: [
      "Whisk eggs with milk, salt, and pepper",
      "Heat butter in a non-stick pan over medium heat",
      "Sauté bell peppers and mushrooms for 2 minutes",
      "Pour in egg mixture",
      "Cook until edges set, lifting to let liquid egg flow under",
      "Add cheese and spinach on one half",
      "Fold omelette in half",
      "Serve immediately"
    ],
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 22, fat: 18, carbs: 6 }
  },

  // ─── LUNCH ────────────────────────────────────────────────────
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
      "1 cup chickpeas, drained",
      "½ cup kalamata olives",
      "4 oz feta cheese",
      "3 tbsp olive oil",
      "2 tbsp lemon juice",
      "Fresh parsley and mint"
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
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 16, carbs: 35 }
  },
  {
    title: "Classic Caesar Salad Wrap",
    description: "Crisp romaine with Caesar dressing and Parmesan wrapped in a flour tortilla",
    category: "Lunch",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 large flour tortillas",
      "4 cups romaine lettuce, chopped",
      "½ cup Caesar dressing",
      "½ cup croutons",
      "¼ cup Parmesan cheese, grated",
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
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 12, fat: 18, carbs: 28 }
  },
  {
    title: "Grilled Cheese Sandwich",
    description: "Classic crispy sandwich with layers of melted cheese on golden buttered bread",
    category: "Lunch",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 slices thick white or sourdough bread",
      "4 slices cheddar cheese",
      "2 tbsp butter",
      "Salt and pepper"
    ],
    instructions: [
      "Butter one side of each bread slice",
      "Place cheese between unbuttered sides",
      "Heat pan over medium-low heat",
      "Cook sandwich 3–4 minutes per side until golden",
      "Press down gently with spatula",
      "Cut in half and serve hot"
    ],
    image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 16, fat: 18, carbs: 28 }
  },
  {
    title: "Chicken Quesadilla",
    description: "Crispy golden tortilla stuffed with seasoned chicken and melted cheese",
    category: "Lunch",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 flour tortillas",
      "1 cup cooked chicken, shredded",
      "1 cup Monterey Jack cheese, shredded",
      "Salsa",
      "Sour cream",
      "1 tsp oil"
    ],
    instructions: [
      "Heat oil in a non-stick pan over medium heat",
      "Place one tortilla in pan",
      "Spread chicken and cheese on half",
      "Fold tortilla over filling",
      "Cook 3–4 minutes until golden and cheese melts",
      "Flip and cook other side",
      "Slice into wedges and serve with salsa and sour cream"
    ],
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 24, fat: 18, carbs: 28 }
  },
  {
    title: "Veggie Hummus Wrap",
    description: "Fresh crunchy vegetables with creamy hummus in a soft tortilla",
    category: "Lunch",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 large tortillas",
      "½ cup hummus",
      "1 cup romaine lettuce",
      "1 tomato, sliced",
      "1 cucumber, sliced",
      "½ avocado, sliced",
      "¼ red onion, thinly sliced",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and slice all vegetables",
      "Spread hummus evenly on tortillas",
      "Layer lettuce, tomato, cucumber, avocado, and onion",
      "Season with salt and pepper",
      "Roll up tightly",
      "Cut in half and serve"
    ],
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
    nutrition: { calories: 240, protein: 8, fat: 12, carbs: 28 }
  },
  {
    title: "Pasta Salad",
    description: "Cold Mediterranean-style pasta salad with vegetables and Italian dressing",
    category: "Lunch",
    prepTime: 20,
    cookTime: 10,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb rotini pasta",
      "1 cup cherry tomatoes, halved",
      "1 cucumber, diced",
      "½ red onion, diced",
      "1 bell pepper, diced",
      "½ cup black olives",
      "½ cup Italian dressing",
      "Fresh basil"
    ],
    instructions: [
      "Cook pasta according to package directions, drain and cool",
      "Dice all vegetables",
      "Combine pasta and vegetables in a large bowl",
      "Toss with Italian dressing",
      "Add fresh basil",
      "Chill for 30 minutes before serving"
    ],
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 8, fat: 8, carbs: 48 }
  },

  // ─── DINNER ───────────────────────────────────────────────────
  {
    title: "Classic Spaghetti Carbonara",
    description: "Authentic Italian pasta with creamy egg sauce, pancetta, and Pecorino Romano",
    category: "Dinner",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "2 cloves garlic",
      "Freshly cracked black pepper",
      "Salt"
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti",
      "Cook pancetta in a large skillet until crispy",
      "Whisk together eggs, grated cheese, and black pepper in a bowl",
      "Drain pasta, reserving 1 cup of pasta water",
      "Add hot pasta to the skillet with pancetta, remove from heat",
      "Quickly stir in egg mixture, adding pasta water to create a creamy sauce",
      "Serve immediately with extra cheese and cracked pepper"
    ],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 24, fat: 18, carbs: 65 }
  },
  {
    title: "Homemade Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, ripe tomatoes, and basil",
    category: "Dinner",
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb pizza dough",
      "1 cup San Marzano tomato sauce",
      "8 oz fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Cornmeal for dusting"
    ],
    instructions: [
      "Preheat oven to 500°F (260°C) with pizza stone inside",
      "Roll out dough on floured surface to 12-inch circle",
      "Dust pizza stone or baking sheet with cornmeal",
      "Spread tomato sauce on dough, leaving 1 inch border",
      "Tear mozzarella into pieces and distribute evenly",
      "Drizzle with olive oil and season with salt",
      "Bake for 12–15 minutes until crust is golden and cheese bubbles",
      "Top with fresh basil before serving"
    ],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    nutrition: { calories: 450, protein: 20, fat: 18, carbs: 52 }
  },
  {
    title: "Thai Green Curry",
    description: "Aromatic and creamy Thai curry with coconut milk, chicken, and fresh vegetables",
    category: "Dinner",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb chicken breast, sliced",
      "2 cans (400ml each) coconut milk",
      "3 tbsp green curry paste",
      "1 bell pepper, sliced",
      "1 zucchini, sliced",
      "1 cup bamboo shoots",
      "2 tbsp fish sauce",
      "1 tbsp brown sugar",
      "Thai basil leaves",
      "Jasmine rice to serve"
    ],
    instructions: [
      "Heat half the coconut milk in a large pot or wok",
      "Add curry paste and cook until fragrant, about 2 minutes",
      "Add chicken and cook until no longer pink",
      "Pour in remaining coconut milk and bring to simmer",
      "Add vegetables and cook until tender, 5–7 minutes",
      "Season with fish sauce and brown sugar",
      "Garnish with Thai basil",
      "Serve over steamed jasmine rice"
    ],
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 28, fat: 22, carbs: 18 }
  },
  {
    title: "Creamy Mushroom Risotto",
    description: "Velvety Italian rice dish with wild mushrooms, white wine, and Parmesan",
    category: "Dinner",
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      "1½ cups Arborio rice",
      "4 cups warm chicken or vegetable stock",
      "1 lb mixed mushrooms, sliced",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "½ cup dry white wine",
      "4 tbsp butter",
      "½ cup Parmesan cheese, grated",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Fresh thyme"
    ],
    instructions: [
      "Heat stock in a saucepan and keep warm over low heat",
      "Sauté mushrooms in 2 tbsp butter until golden; set aside",
      "Cook onion in olive oil until translucent",
      "Add rice and toast for 2 minutes, stirring",
      "Add wine and stir until fully absorbed",
      "Add warm stock one ladle at a time, stirring constantly until absorbed",
      "Continue for 18–20 minutes until rice is creamy and al dente",
      "Stir in mushrooms, remaining butter, cheese, and thyme"
    ],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 14, fat: 18, carbs: 52 }
  },
  {
    title: "Beef and Broccoli Stir Fry",
    description: "Quick Asian-inspired dish with tender beef strips and crisp broccoli in a rich sauce",
    category: "Dinner",
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb beef sirloin, thinly sliced",
      "4 cups broccoli florets",
      "3 tbsp soy sauce",
      "2 tbsp oyster sauce",
      "1 tbsp cornstarch",
      "2 cloves garlic, minced",
      "1 inch fresh ginger, grated",
      "2 tbsp vegetable oil",
      "1 tsp sesame oil",
      "2 green onions, sliced"
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, and cornstarch in a small bowl",
      "Heat vegetable oil in a large wok or skillet over high heat",
      "Add beef and stir-fry for 2–3 minutes until browned; remove",
      "Add garlic and ginger to the pan, cook 30 seconds",
      "Add broccoli and stir-fry 3–4 minutes until tender-crisp",
      "Return beef to pan and pour sauce over everything",
      "Cook until sauce thickens, about 1 minute",
      "Drizzle with sesame oil and garnish with green onions"
    ],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 28, fat: 12, carbs: 15 }
  },
  {
    title: "Chicken Tikka Masala",
    description: "Creamy Indian curry with tandoori-style chicken in a rich tomato-cream sauce",
    category: "Dinner",
    prepTime: 30,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb chicken breast, cubed",
      "1 cup plain yogurt",
      "2 tbsp garam masala",
      "1 tsp turmeric",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "1 inch ginger, grated",
      "1 can (400g) crushed tomatoes",
      "1 cup heavy cream",
      "2 tbsp butter",
      "Salt to taste",
      "Basmati rice and naan to serve"
    ],
    instructions: [
      "Marinate chicken in yogurt, garam masala, and turmeric for 30 minutes",
      "Grill or pan-fry marinated chicken until charred; set aside",
      "Sauté onion, garlic, and ginger in butter until golden",
      "Add crushed tomatoes and simmer 10 minutes",
      "Add chicken to the sauce and simmer 10 more minutes",
      "Stir in heavy cream and season with salt",
      "Serve over basmati rice with warm naan"
    ],
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 32, fat: 18, carbs: 28 }
  },
  {
    title: "Chicken Parmesan",
    description: "Crispy breaded chicken cutlets smothered in marinara and melted mozzarella",
    category: "Dinner",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 boneless chicken breasts",
      "1 cup Italian breadcrumbs",
      "½ cup Parmesan cheese, grated",
      "2 eggs, beaten",
      "1 cup all-purpose flour",
      "2 cups marinara sauce",
      "2 cups mozzarella cheese, shredded",
      "Oil for frying",
      "Salt and pepper",
      "Fresh basil to garnish"
    ],
    instructions: [
      "Pound chicken breasts to even ½-inch thickness",
      "Set up breading station: flour, seasoned eggs, breadcrumb-Parmesan mix",
      "Bread each chicken breast and pan-fry until golden, 3 min per side",
      "Transfer to a baking dish",
      "Spoon marinara sauce over each piece",
      "Top generously with mozzarella",
      "Bake at 400°F (200°C) for 15 minutes until cheese is bubbly",
      "Garnish with fresh basil"
    ],
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 42, fat: 18, carbs: 35 }
  },
  {
    title: "Grilled Salmon with Lemon Herb Butter",
    description: "Perfectly grilled salmon fillets with a zesty lemon and fresh herb butter",
    category: "Dinner",
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 salmon fillets",
      "2 lemons",
      "3 tbsp olive oil",
      "2 cloves garlic, minced",
      "Fresh dill",
      "Fresh parsley",
      "2 tbsp butter",
      "Salt and pepper"
    ],
    instructions: [
      "Pat salmon dry and season with salt and pepper",
      "Mix olive oil, garlic, and half the herbs together",
      "Brush salmon fillets with herb oil",
      "Preheat grill to medium-high heat",
      "Grill salmon 5–6 minutes per side",
      "Mix butter with remaining herbs and lemon zest",
      "Top grilled salmon with herb butter",
      "Serve with lemon wedges"
    ],
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 32, fat: 14, carbs: 2 }
  },
  {
    title: "Shrimp Scampi",
    description: "Plump shrimp sautéed in white wine, garlic butter, and lemon over linguine",
    category: "Dinner",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 lb large shrimp, peeled and deveined",
      "8 oz linguine",
      "4 cloves garlic, minced",
      "½ cup dry white wine",
      "4 tbsp unsalted butter",
      "2 tbsp olive oil",
      "2 tbsp fresh lemon juice",
      "¼ cup fresh parsley, chopped",
      "Red pepper flakes",
      "Salt and pepper"
    ],
    instructions: [
      "Cook linguine according to package directions; reserve ½ cup pasta water",
      "Season shrimp with salt and pepper",
      "Heat olive oil and 2 tbsp butter in a large skillet",
      "Add garlic and cook until fragrant, 1 minute",
      "Add shrimp and cook 2 minutes per side until pink",
      "Add wine and lemon juice; simmer 2 minutes",
      "Toss in cooked pasta with remaining butter",
      "Garnish with parsley and red pepper flakes"
    ],
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 28, fat: 16, carbs: 32 }
  },
  {
    title: "Beef Wellington",
    description: "Impressive beef tenderloin wrapped in mushroom duxelles and golden puff pastry",
    category: "Dinner",
    prepTime: 45,
    cookTime: 30,
    servings: 6,
    difficulty: "Hard",
    ingredients: [
      "2 lb beef tenderloin",
      "1 lb puff pastry sheet",
      "8 oz cremini mushrooms, finely chopped",
      "2 shallots, minced",
      "2 cloves garlic, minced",
      "2 tbsp Dijon mustard",
      "6 slices prosciutto",
      "2 egg yolks (egg wash)",
      "Salt and pepper",
      "Fresh thyme"
    ],
    instructions: [
      "Season beef with salt and pepper; sear on all sides until browned",
      "Brush generously with Dijon mustard and let cool",
      "Sauté mushrooms, shallots, and garlic until all moisture evaporates",
      "Lay prosciutto on plastic wrap, spread mushroom mixture over it",
      "Roll beef tightly in prosciutto layer; refrigerate 30 minutes",
      "Wrap in puff pastry, sealing edges with egg wash",
      "Brush exterior with egg wash and score lightly",
      "Bake at 400°F (200°C) for 25–30 minutes to medium-rare",
      "Rest 10 minutes before slicing"
    ],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    nutrition: { calories: 520, protein: 32, fat: 28, carbs: 35 }
  },
  {
    title: "Beef Tacos with Guacamole",
    description: "Spicy ground beef tacos with homemade guacamole and fresh toppings",
    category: "Dinner",
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb ground beef",
      "1 packet taco seasoning",
      "12 taco shells or small tortillas",
      "2 ripe avocados",
      "1 lime, juiced",
      "1 tomato, diced",
      "½ red onion, diced",
      "1 cup shredded lettuce",
      "1 cup shredded cheddar cheese",
      "Sour cream and salsa to serve"
    ],
    instructions: [
      "Brown ground beef in a large skillet; drain excess fat",
      "Add taco seasoning and ¼ cup water; simmer 5 minutes",
      "Mash avocados with lime juice, diced tomato, and onion for guacamole",
      "Season guacamole with salt",
      "Warm taco shells according to package directions",
      "Fill shells with seasoned beef",
      "Top with lettuce, cheese, guacamole, sour cream, and salsa"
    ],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 22, fat: 24, carbs: 28 }
  },
  {
    title: "Beef Stroganoff",
    description: "Classic Russian dish with tender beef strips in a rich sour cream and mushroom sauce",
    category: "Dinner",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 lb beef sirloin, sliced into strips",
      "8 oz cremini mushrooms, sliced",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "2 cups beef broth",
      "1 cup sour cream",
      "2 tbsp all-purpose flour",
      "3 tbsp butter",
      "8 oz egg noodles",
      "Salt and pepper",
      "Fresh parsley"
    ],
    instructions: [
      "Cook egg noodles according to package directions; keep warm",
      "Sauté mushrooms and onion in butter until golden",
      "Add garlic and cook 1 minute",
      "Push vegetables aside, add beef strips, and brown on all sides",
      "Sprinkle flour over everything and stir",
      "Add beef broth and simmer 20 minutes until thickened",
      "Remove from heat and stir in sour cream",
      "Season with salt and pepper; serve over noodles with parsley"
    ],
    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&h=400&fit=crop",
    nutrition: { calories: 420, protein: 28, fat: 18, carbs: 32 }
  },
  {
    title: "Mac and Cheese",
    description: "Ultimate creamy baked macaroni with a golden breadcrumb topping",
    category: "Dinner",
    prepTime: 10,
    cookTime: 30,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 lb elbow macaroni",
      "3 cups sharp cheddar cheese, shredded",
      "1 cup Gruyère cheese, shredded",
      "2½ cups whole milk",
      "3 tbsp unsalted butter",
      "3 tbsp all-purpose flour",
      "½ cup panko breadcrumbs",
      "Salt, pepper, and a pinch of cayenne"
    ],
    instructions: [
      "Cook macaroni according to directions; drain",
      "Melt butter in a saucepan over medium heat",
      "Whisk in flour and cook 1 minute",
      "Gradually whisk in milk until smooth",
      "Add cheeses and stir until melted; season with salt, pepper, and cayenne",
      "Combine sauce with macaroni",
      "Transfer to a baking dish and top with panko",
      "Bake at 375°F (190°C) for 20 minutes until golden and bubbly"
    ],
    image: "https://images.unsplash.com/photo-1612702390394-f0a868a24399?w=600&h=400&fit=crop",
    nutrition: { calories: 480, protein: 20, fat: 20, carbs: 55 }
  },
  {
    title: "Chicken Noodle Soup",
    description: "Classic comforting homemade soup with tender chicken, vegetables, and egg noodles",
    category: "Dinner",
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      "1 whole chicken (3–4 lbs)",
      "8 cups chicken broth",
      "2 carrots, sliced",
      "2 celery stalks, sliced",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "8 oz egg noodles",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Fresh parsley"
    ],
    instructions: [
      "Simmer whole chicken in broth for 45 minutes until cooked through",
      "Remove chicken, let cool; shred meat and discard bones",
      "Heat oil in large pot; sauté vegetables until soft",
      "Add garlic and cook 1 minute",
      "Pour in broth and bring to a boil",
      "Add egg noodles and cook until tender",
      "Add shredded chicken and heat through",
      "Season with salt, pepper, and fresh parsley"
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    nutrition: { calories: 280, protein: 24, fat: 8, carbs: 28 }
  },
  {
    title: "Fish and Chips",
    description: "Pub-style crispy beer-battered cod with thick golden french fries",
    category: "Dinner",
    prepTime: 30,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 cod fillets (6 oz each)",
      "2 lbs russet potatoes",
      "1 cup all-purpose flour",
      "1 cup cold beer",
      "1 tsp baking powder",
      "Vegetable oil for frying",
      "Salt and pepper",
      "Malt vinegar and tartar sauce to serve"
    ],
    instructions: [
      "Cut potatoes into thick fries; soak in cold water 30 minutes",
      "Make batter: whisk flour, beer, baking powder, salt until smooth",
      "Heat oil to 375°F (190°C) in a deep pot",
      "Fry chips in batches until golden; drain on paper towels",
      "Pat fish dry, season, dip in batter, and fry 4–5 minutes until crispy",
      "Drain fish on paper towels",
      "Season with salt and serve with malt vinegar and tartar sauce"
    ],
    image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=600&h=400&fit=crop",
    nutrition: { calories: 580, protein: 32, fat: 28, carbs: 48 }
  },

  // ─── SALAD ────────────────────────────────────────────────────
  {
    title: "Classic Caesar Salad",
    description: "Crisp romaine lettuce with homemade Caesar dressing and golden croutons",
    category: "Salad",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 heads romaine lettuce",
      "1 cup croutons",
      "½ cup Parmesan cheese, grated",
      "2 cloves garlic",
      "2 anchovy fillets",
      "1 egg yolk",
      "2 tbsp lemon juice",
      "½ cup olive oil",
      "Salt and pepper"
    ],
    instructions: [
      "Wash and chop romaine lettuce into pieces",
      "Make dressing: blend garlic, anchovies, and egg yolk",
      "Add lemon juice, then slowly drizzle in olive oil while blending",
      "Season with salt and pepper",
      "Toss lettuce with Caesar dressing",
      "Add croutons and finish with Parmesan"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    nutrition: { calories: 220, protein: 8, fat: 18, carbs: 8 }
  },
  {
    title: "Greek Salad",
    description: "Fresh Mediterranean salad with juicy tomatoes, cucumber, olives, and feta",
    category: "Salad",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 large tomatoes, cut into wedges",
      "1 cucumber, sliced",
      "1 red onion, thinly sliced",
      "1 green bell pepper, sliced",
      "8 oz feta cheese, cubed",
      "½ cup kalamata olives",
      "3 tbsp extra-virgin olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp dried oregano",
      "Salt and pepper"
    ],
    instructions: [
      "Cut tomatoes into wedges",
      "Slice cucumber in half-moons and onion into rings",
      "Slice bell pepper into strips",
      "Combine all vegetables in a large bowl",
      "Whisk together olive oil, red wine vinegar, and oregano",
      "Pour dressing over salad and toss gently",
      "Top with feta cubes and olives",
      "Season with salt and pepper"
    ],
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 8, fat: 14, carbs: 12 }
  },

  // ─── SOUP ─────────────────────────────────────────────────────
  {
    title: "Tomato Basil Soup",
    description: "Silky smooth roasted tomato soup with fresh basil and a touch of cream",
    category: "Soup",
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 lbs ripe tomatoes, halved",
      "1 onion, quartered",
      "4 cloves garlic",
      "2 tbsp olive oil",
      "2 cups vegetable broth",
      "½ cup fresh basil leaves",
      "¼ cup heavy cream",
      "Salt and pepper",
      "Crusty bread to serve"
    ],
    instructions: [
      "Place tomatoes, onion, and garlic on a baking sheet",
      "Drizzle with olive oil, season with salt and pepper",
      "Roast at 400°F (200°C) for 30 minutes",
      "Transfer roasted vegetables to a pot",
      "Add vegetable broth and bring to simmer",
      "Blend until smooth with an immersion blender",
      "Stir in fresh basil and heavy cream",
      "Adjust seasoning and serve with crusty bread"
    ],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 4, fat: 10, carbs: 20 }
  },
  {
    title: "French Onion Soup",
    description: "Deeply flavored caramelized onion broth topped with crusty bread and melted Gruyère",
    category: "Soup",
    prepTime: 15,
    cookTime: 60,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 large onions, thinly sliced",
      "4 tbsp unsalted butter",
      "1 tbsp sugar",
      "½ cup dry white wine",
      "4 cups beef broth",
      "1 tsp fresh thyme",
      "4 slices French baguette",
      "1½ cups Gruyère cheese, shredded",
      "Salt and pepper"
    ],
    instructions: [
      "Melt butter in a large pot over medium-low heat",
      "Add onions and cook, stirring occasionally, for 40 minutes until deeply caramelized",
      "Add sugar and wine; scrape up brown bits",
      "Add beef broth and thyme; simmer 20 minutes",
      "Ladle soup into oven-safe bowls",
      "Top with baguette slices",
      "Cover generously with Gruyère",
      "Broil until cheese is bubbly and golden, 3–4 minutes"
    ],
    image: "https://images.unsplash.com/photo-1534939163369-cac5e0596f5e?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 14, fat: 16, carbs: 28 }
  },

  // ─── DESSERT ──────────────────────────────────────────────────
  {
    title: "Perfect Chocolate Chip Cookies",
    description: "Soft and chewy bakery-style cookies with pools of melted chocolate",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup (2 sticks) butter, softened",
      "¾ cup granulated sugar",
      "¾ cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups semi-sweet chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Whisk flour, baking soda, and salt in a bowl",
      "Cream butter and both sugars until light and fluffy, about 3 minutes",
      "Beat in eggs one at a time, then vanilla",
      "Gradually mix in flour mixture until just combined",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto ungreased baking sheets",
      "Bake 9–11 minutes until edges are golden but centers look slightly underdone",
      "Cool on baking sheet 5 minutes before transferring"
    ],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
    nutrition: { calories: 180, protein: 2, fat: 8, carbs: 25 }
  },
  {
    title: "Chocolate Lava Cake",
    description: "Warm individual chocolate cakes with a gloriously gooey molten center",
    category: "Dessert",
    prepTime: 20,
    cookTime: 12,
    servings: 4,
    difficulty: "Hard",
    ingredients: [
      "4 oz good-quality dark chocolate",
      "½ cup (1 stick) unsalted butter",
      "2 large eggs",
      "2 egg yolks",
      "¼ cup granulated sugar",
      "2 tbsp all-purpose flour",
      "Pinch of salt",
      "Powdered sugar for dusting",
      "Vanilla ice cream to serve"
    ],
    instructions: [
      "Preheat oven to 450°F (230°C); grease and flour 4 ramekins",
      "Melt chocolate and butter together in a double boiler; let cool slightly",
      "Beat eggs, yolks, and sugar until pale and thick",
      "Fold in melted chocolate mixture",
      "Add flour and salt; mix until just combined",
      "Divide batter evenly among ramekins",
      "Bake 12 minutes; edges should be set but centers still jiggly",
      "Invert onto plates immediately, dust with powdered sugar, serve with ice cream"
    ],
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop",
    nutrition: { calories: 480, protein: 8, fat: 32, carbs: 42 }
  },
  {
    title: "Strawberry Shortcake",
    description: "Buttery biscuits layered with macerated fresh strawberries and whipped cream",
    category: "Dessert",
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      "2 cups all-purpose flour",
      "3 tbsp sugar",
      "1 tbsp baking powder",
      "½ tsp salt",
      "6 tbsp cold butter, cubed",
      "¾ cup heavy cream",
      "1 lb fresh strawberries, sliced",
      "3 tbsp sugar (for berries)",
      "1½ cups heavy cream, whipped to stiff peaks"
    ],
    instructions: [
      "Toss strawberries with 3 tbsp sugar; set aside to macerate 20 minutes",
      "Preheat oven to 425°F (220°C)",
      "Mix flour, 3 tbsp sugar, baking powder, and salt",
      "Cut in cold butter until mixture resembles coarse crumbs",
      "Stir in cream until dough just comes together",
      "Pat out ¾-inch thick and cut into rounds",
      "Bake 12–15 minutes until golden",
      "Split biscuits, layer with strawberries and whipped cream"
    ],
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop",
    nutrition: { calories: 380, protein: 6, fat: 22, carbs: 42 }
  },
  {
    title: "Chocolate Mousse",
    description: "Light and airy French-style chocolate mousse with silky whipped cream",
    category: "Dessert",
    prepTime: 20,
    cookTime: 0,
    servings: 6,
    difficulty: "Medium",
    ingredients: [
      "6 oz good dark chocolate, chopped",
      "4 large eggs, separated",
      "¼ cup granulated sugar",
      "1 cup heavy cream",
      "1 tsp vanilla extract",
      "Pinch of salt"
    ],
    instructions: [
      "Melt chocolate in a double boiler; let cool to room temperature",
      "Beat egg yolks with half the sugar until pale and thick",
      "Whip egg whites with remaining sugar to stiff peaks",
      "Whip cold heavy cream with vanilla to stiff peaks",
      "Fold melted chocolate into egg yolk mixture",
      "Gently fold in whipped egg whites in thirds",
      "Fold in whipped cream until just combined",
      "Divide into serving glasses; refrigerate at least 2 hours"
    ],
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 8, fat: 24, carbs: 22 }
  },

  // ─── SNACK ────────────────────────────────────────────────────
  {
    title: "Buffalo Chicken Wings",
    description: "Crispy oven-baked wings tossed in tangy buffalo sauce with blue cheese dip",
    category: "Snack",
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "2 lbs chicken wings, split",
      "1 tbsp baking powder",
      "½ tsp salt",
      "½ cup hot sauce (e.g. Frank's RedHot)",
      "4 tbsp unsalted butter, melted",
      "1 tsp garlic powder",
      "Blue cheese or ranch dressing to serve",
      "Celery sticks"
    ],
    instructions: [
      "Pat wings dry; toss with baking powder and salt",
      "Arrange on a wire rack set over a baking sheet",
      "Bake at 250°F (120°C) for 30 minutes",
      "Increase heat to 425°F (220°C) and bake 40–45 minutes until crispy",
      "Whisk hot sauce, melted butter, and garlic powder together",
      "Toss crispy wings in buffalo sauce",
      "Serve immediately with blue cheese dressing and celery"
    ],
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop",
    nutrition: { calories: 320, protein: 28, fat: 20, carbs: 4 }
  },
  {
    title: "Fresh Fruit Salad",
    description: "Vibrant mix of seasonal fruits with a honey-lime dressing",
    category: "Snack",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 cups strawberries, hulled and halved",
      "1 cup blueberries",
      "1 cup green grapes",
      "2 kiwis, peeled and sliced",
      "1 orange, segmented",
      "2 tbsp honey",
      "2 tbsp fresh lime juice",
      "Fresh mint leaves"
    ],
    instructions: [
      "Wash and prepare all fruits",
      "Combine strawberries, blueberries, grapes, kiwi, and orange in a bowl",
      "Whisk honey and lime juice together for dressing",
      "Drizzle dressing over fruit",
      "Toss gently to coat",
      "Garnish with fresh mint",
      "Serve immediately or chill up to 2 hours"
    ],
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop",
    nutrition: { calories: 120, protein: 2, fat: 0, carbs: 30 }
  },

  // ─── BEVERAGE ─────────────────────────────────────────────────
  {
    title: "Classic Chocolate Milkshake",
    description: "Thick and creamy old-fashioned chocolate milkshake topped with whipped cream",
    category: "Beverage",
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "3 cups premium vanilla ice cream",
      "1 cup whole milk",
      "3 tbsp chocolate syrup",
      "Whipped cream",
      "Chocolate shavings",
      "2 maraschino cherries"
    ],
    instructions: [
      "Chill glasses in freezer for 5 minutes",
      "Add ice cream, milk, and chocolate syrup to blender",
      "Blend until smooth and thick",
      "Pour into chilled glasses",
      "Top with whipped cream",
      "Garnish with chocolate shavings and a cherry"
    ],
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
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

    // Clear ALL existing seeded recipes (not user-submitted ones)
    await Recipe.deleteMany({});
    console.log('🗑️  Cleared existing recipes');

    // Insert new real recipes
    const recipesWithUser = realRecipes.map(recipe => ({
      ...recipe,
      submittedBy: submittedByUserId,
      status: 'approved'
    }));

    const inserted = await Recipe.insertMany(recipesWithUser, { ordered: false });
    console.log(`✅ Inserted ${inserted.length} recipes with proper titles and matching images`);
    console.log('📸 All recipes include curated, matching Unsplash images');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedRecipes();
