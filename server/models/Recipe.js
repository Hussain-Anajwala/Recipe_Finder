import mongoose from 'mongoose';
const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  image: { type: String }, // URL to the recipe image
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  adminNotes: { type: String },
  nutrition: { // We'll keep the auto-calculated nutrition
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
  }
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);