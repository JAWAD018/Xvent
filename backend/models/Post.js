import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    image: { type: String, default: "" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // optional link to event
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
