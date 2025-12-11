import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/server.js";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing data
    await Recipe.deleteMany({});
    await User.deleteMany({});
    console.log(" Cleared existing data");

    // Create multiple users (chefs)
    const chefs = [
      {
        name: "Chef Example",
        email: "chef@example.com",
        password: await bcrypt.hash("password123", 10),
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      },
      {
        name: "Chef Maria",
        email: "maria@example.com",
        password: await bcrypt.hash("password123", 10),
        avatar: "https://randomuser.me/api/portraits/women/66.jpg",
      },
      {
        name: "Chef Kenji",
        email: "kenji@example.com",
        password: await bcrypt.hash("password123", 10),
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    ];

    const createdUsers = await User.insertMany(chefs);
    console.log(` Created ${createdUsers.length} chefs`);

    // Assign users
    const [chef1, chef2, chef3] = createdUsers;

    const sampleRecipes = [
      {
        title: "Spaghetti Carbonara",
        ingredients: [
          "Spaghetti",
          "Eggs",
          "Parmesan cheese",
          "Black pepper",
          "Pancetta",
        ],
        instructions: [
          "Boil spaghetti until al dente.",
          "Fry pancetta until crisp.",
          "Whisk eggs and cheese together.",
          "Toss pasta with pancetta and egg mixture off heat.",
        ],
        description: "Classic Italian pasta dish made with egg and pancetta.",
        cookingTime: 20,
        servings: 2,
        tags: ["Italian", "Pasta", "Quick Meals"],
        category: "Dinner",
        type: "Non-Vegetarian",
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957543/spaghetti_cabonara_nrlb5z.webp",
        createdBy: chef1._id,
      },
      {
        title: "Vegan Buddha Bowl",
        ingredients: [
          "Brown rice",
          "Chickpeas",
          "Avocado",
          "Spinach",
          "Roasted sweet potatoes",
        ],
        instructions: [
          "Cook rice and roast sweet potatoes.",
          "Assemble bowl with all ingredients.",
          "Drizzle with tahini dressing.",
        ],
        description: "A colorful and nutritious vegan bowl.",
        cookingTime: 25,
        servings: 1,
        category: "Lunch",
        type: "Vegan",
        tags: ["Vegan", "Healthy", "Bowl"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957899/vegan_bowl_f1at01.webp",
        createdBy: chef1._id,
      },
      {
        title: "Chicken Stir Fry",
        ingredients: [
          "Chicken breast",
          "Soy sauce",
          "Garlic",
          "Mixed vegetables",
          "Sesame oil",
        ],
        instructions: [
          "Marinate chicken in soy sauce and garlic.",
          "Stir-fry chicken until golden.",
          "Add vegetables and cook for 5 minutes.",
          "Serve hot with steamed rice.",
        ],
        description: "Quick and flavorful Asian-inspired chicken stir fry.",
        cookingTime: 20,
        servings: 2,
        category: "Dinner",
        type: "Non-Vegetarian",
        tags: ["Asian", "Quick Meals", "Chicken"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764958345/fried_chicked-2_kwm7it.webp",
        createdBy: chef2._id,
      },
      {
        title: "Blueberry Pancakes",
        ingredients: [
          "Flour",
          "Milk",
          "Eggs",
          "Blueberries",
          "Baking powder",
          "Sugar",
        ],
        instructions: [
          "Mix flour, baking powder, and sugar.",
          "Add milk and eggs; whisk until smooth.",
          "Fold in blueberries.",
          "Cook on a greased pan until golden brown.",
        ],
        description: "Fluffy pancakes packed with juicy blueberries.",
        cookingTime: 15,
        servings: 3,
        category: "Breakfast",
        type: "Vegetarian",
        tags: ["Sweet", "Brunch", "Easy"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764958034/blueberry_pancakes_pjgmlc.webp",
        createdBy: chef2._id,
      },
      {
        title: "Beef Tacos",
        ingredients: [
          "Ground beef",
          "Taco shells",
          "Lettuce",
          "Cheddar cheese",
          "Tomatoes",
          "Sour cream",
        ],
        instructions: [
          "Cook ground beef with taco seasoning.",
          "Fill taco shells with beef, lettuce, cheese, and tomatoes.",
          "Top with sour cream.",
        ],
        description:
          "Crispy tacos filled with seasoned beef and fresh toppings.",
        cookingTime: 20,
        servings: 4,
        category: "Dinner",
        type: "Non-Vegetarian",
        tags: ["Mexican", "Street Food", "Quick Meals"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957872/beef_tacos_e6kpzh.webp",
        createdBy: chef3._id,
      },
      {
        title: "Greek Salad",
        ingredients: [
          "Cucumber",
          "Tomatoes",
          "Feta cheese",
          "Red onion",
          "Olives",
          "Olive oil",
        ],
        instructions: [
          "Chop all vegetables and combine in a bowl.",
          "Add feta and olives.",
          "Drizzle with olive oil and toss lightly.",
        ],
        description: "A refreshing salad with Mediterranean flavors.",
        cookingTime: 10,
        servings: 2,
        category: "Salad",
        type: "Vegetarian",
        tags: ["Healthy", "Mediterranean", "Vegetarian"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764958441/greek_salad_rim5nt.webp",
        createdBy: chef3._id,
      },
      {
        title: "Chocolate Chip Cookies",
        ingredients: [
          "Flour",
          "Butter",
          "Brown sugar",
          "White sugar",
          "Chocolate chips",
          "Eggs",
          "Vanilla extract",
        ],
        instructions: [
          "Cream butter and sugars together.",
          "Add eggs and vanilla.",
          "Mix in dry ingredients and fold in chocolate chips.",
          "Bake at 180°C for 10-12 minutes.",
        ],
        description: "Crispy on the edges, chewy in the center cookies.",
        cookingTime: 25,
        servings: 12,
        category: "Dessert",
        type: "Vegetarian",
        tags: ["Baking", "Sweet", "Snack"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957831/cookies_hw6nob.webp",
        createdBy: chef2._id,
      },
      {
        title: "Lentil Soup",
        ingredients: [
          "Red lentils",
          "Carrots",
          "Celery",
          "Onion",
          "Garlic",
          "Vegetable broth",
        ],
        instructions: [
          "Sauté onion, garlic, and celery.",
          "Add carrots and lentils.",
          "Pour in broth and simmer until lentils are soft.",
          "Blend slightly for a creamy texture.",
        ],
        description:
          "Comforting and hearty lentil soup perfect for chilly days.",
        cookingTime: 35,
        servings: 3,
        category: "Soup",
        type: "Vegan",
        tags: ["Vegan", "Comfort Food", "Healthy"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957990/lentil_soup_dojlaz.webp",
        createdBy: chef1._id,
      },
      {
        title: "Garlic Butter Shrimp",
        ingredients: ["Shrimp", "Garlic", "Butter", "Lemon juice", "Parsley"],
        instructions: [
          "Melt butter in a skillet and sauté garlic.",
          "Add shrimp and cook until pink.",
          "Drizzle with lemon juice and garnish with parsley.",
        ],
        description: "Juicy shrimp in a rich garlic butter sauce.",
        cookingTime: 15,
        servings: 2,
        category: "seafood",
        type: "Non-Vegetarian",
        tags: ["Seafood", "Quick Meals", "Dinner"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957948/garlic_shrimp_lrwge3.webp",
        createdBy: chef3._id,
      },
      {
        title: "Avocado Toast",
        ingredients: ["Bread", "Avocado", "Lemon", "Chili flakes", "Olive oil"],
        instructions: [
          "Toast bread slices.",
          "Mash avocado with lemon juice and salt.",
          "Spread on toast and sprinkle chili flakes.",
          "Drizzle with olive oil before serving.",
        ],
        description: "Simple and nutritious breakfast to start your day.",
        cookingTime: 10,
        servings: 1,
        category: "Breakfast",
        type: "Vegan",
        tags: ["Breakfast", "Vegan", "Healthy"],
        imageUrl:
          "https://res.cloudinary.com/dmsicle2b/image/upload/v1764957920/avocado_toast_cz2kke.webp",
        createdBy: chef1._id,
      },
    ];

    const createdRecipes = await Recipe.insertMany(sampleRecipes);
    console.log(` Created ${createdRecipes.length} recipes`);

    await mongoose.disconnect();
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(" Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
