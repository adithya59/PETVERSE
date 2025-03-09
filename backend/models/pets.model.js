import mongoose from "mongoose";

const Pets = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["dog", "cat", "bird", "other"],
      default: "other",
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    vaccinations: [
      {
        vaccineName: String,
        dueDate: Date,
        completed: { type: Boolean, default: false },
      },
    ],
    buyerEmail: {
      type: String,
      trim: true, // Store buyer email for reminders
    },
  },
  {
    timestamps: true,
  }
);

export const Pet = mongoose.model("Pet", Pets);
