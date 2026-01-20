import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['attraction', 'food', 'tips', 'budget'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    default: null, 
  },
  icon: {
    type: String,
    default: null, 
  },
  color: {
    type: String,
    default: null, 
  },
});

const activitySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true, 
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null, 
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true, 
  },
  imageUrl: {
    type: String,
    required: true,
  },
  activities: {
    type: [activitySchema],
    required: true,
  },
});

const travelPlanSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true, 
    },
    title: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true, 
    },
    imageUrl: {
      type: String,
      required: true,
    },
    highlights: {
      type: [highlightSchema],
      required: true,
      default: [],
    },
    itinerary: {
      type: [daySchema],
      required: true,
      default: [],
    },
    budget: {
      type: String,
      default: null, 
    },
  },
  {
    timestamps: true, 
  }
);

// Create index on destination and duration for faster lookups
travelPlanSchema.index({ destination: 1, duration: 1 });

// Create index on createdAt for sorting latest plans
travelPlanSchema.index({ createdAt: -1 });

const TravelPlan =
  mongoose.models.TravelPlan || mongoose.model('TravelPlan', travelPlanSchema);

export default TravelPlan;

