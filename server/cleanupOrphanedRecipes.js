// Script to clean up recipes without valid users
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';
import User from './models/User.js';

dotenv.config();

const cleanupOrphanedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all recipes
    const allRecipes = await Recipe.find();
    console.log(`\n📊 Total recipes in database: ${allRecipes.length}`);

    let orphanedCount = 0;
    const orphanedRecipes = [];

    // Check each recipe
    for (const recipe of allRecipes) {
      if (!recipe.submittedBy) {
        // Recipe has no submittedBy field at all
        orphanedRecipes.push(recipe);
        orphanedCount++;
        console.log(`\n❌ Orphaned Recipe (No User):`);
        console.log(`   ID: ${recipe._id}`);
        console.log(`   Title: ${recipe.title}`);
      } else {
        // Check if the user still exists
        const userExists = await User.findById(recipe.submittedBy);
        if (!userExists) {
          orphanedRecipes.push(recipe);
          orphanedCount++;
          console.log(`\n❌ Orphaned Recipe (User Deleted):`);
          console.log(`   ID: ${recipe._id}`);
          console.log(`   Title: ${recipe.title}`);
          console.log(`   User ID: ${recipe.submittedBy}`);
        }
      }
    }

    if (orphanedCount === 0) {
      console.log('\n✅ No orphaned recipes found! Database is clean.');
      process.exit(0);
    }

    console.log(`\n\n⚠️  Found ${orphanedCount} orphaned recipe(s)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Ask for confirmation (in a real scenario, you'd use readline)
    console.log('\n🗑️  Deleting orphaned recipes...');
    
    for (const recipe of orphanedRecipes) {
      await Recipe.findByIdAndDelete(recipe._id);
      console.log(`   ✓ Deleted: ${recipe.title}`);
    }

    console.log(`\n✅ Successfully deleted ${orphanedCount} orphaned recipe(s)!`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupOrphanedRecipes();
