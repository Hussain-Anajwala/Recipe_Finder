"""
ingredient_vocab.py
Master vocabulary list of ~150 common cooking ingredients.
Used by:
  - CLIP zero-shot classification (candidate labels)
  - spaCy voice-search noun filtering
"""

INGREDIENT_VOCAB = [
    # Proteins
    "chicken", "beef", "pork", "lamb", "turkey", "fish", "salmon", "tuna",
    "shrimp", "prawn", "crab", "lobster", "tofu", "tempeh", "eggs", "egg",

    # Vegetables
    "tomato", "tomatoes", "onion", "onions", "garlic", "ginger", "potato",
    "potatoes", "carrot", "carrots", "broccoli", "spinach", "kale", "lettuce",
    "cabbage", "cauliflower", "bell pepper", "zucchini", "eggplant", "mushroom",
    "mushrooms", "celery", "cucumber", "corn", "peas", "green beans",
    "asparagus", "leek", "beetroot", "radish", "artichoke", "okra",
    "sweet potato", "yam", "pumpkin", "squash", "chili", "jalapeno",

    # Fruits
    "lemon", "lime", "orange", "apple", "banana", "mango", "avocado",
    "tomato", "pineapple", "strawberry", "blueberry", "raspberry", "grape",
    "peach", "plum", "cherry", "coconut", "date", "fig", "pomegranate",

    # Grains & Legumes
    "rice", "pasta", "flour", "bread", "oats", "quinoa", "couscous", "barley",
    "lentils", "chickpeas", "black beans", "kidney beans", "white beans",
    "soy beans", "noodles", "breadcrumbs",

    # Dairy & Alternatives
    "milk", "cream", "butter", "cheese", "parmesan", "mozzarella", "cheddar",
    "feta", "ricotta", "yogurt", "sour cream", "cream cheese", "ghee",

    # Herbs & Spices
    "salt", "pepper", "cumin", "coriander", "turmeric", "paprika", "oregano",
    "basil", "thyme", "rosemary", "bay leaf", "cinnamon", "cardamom", "cloves",
    "nutmeg", "chili powder", "cayenne", "saffron", "dill", "mint", "parsley",
    "cilantro", "sage", "tarragon", "fennel", "star anise",

    # Oils & Condiments
    "olive oil", "vegetable oil", "sesame oil", "coconut oil", "vinegar",
    "soy sauce", "fish sauce", "oyster sauce", "hot sauce", "ketchup",
    "mustard", "mayonnaise", "honey", "maple syrup", "sugar", "brown sugar",
    "salt", "pepper",

    # Nuts & Seeds
    "almonds", "walnuts", "cashews", "peanuts", "pine nuts", "sesame seeds",
    "sunflower seeds", "chia seeds", "flaxseed", "pistachios", "hazelnuts",

    # Liquids & Stocks
    "water", "broth", "chicken stock", "beef stock", "vegetable stock",
    "wine", "beer", "coconut milk", "tomato paste", "tomato sauce",
]

# Deduplicate while preserving order
seen = set()
INGREDIENT_VOCAB_UNIQUE = []
for item in INGREDIENT_VOCAB:
    if item not in seen:
        seen.add(item)
        INGREDIENT_VOCAB_UNIQUE.append(item)

INGREDIENT_VOCAB = INGREDIENT_VOCAB_UNIQUE
