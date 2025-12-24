import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    productUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);

export default History;
