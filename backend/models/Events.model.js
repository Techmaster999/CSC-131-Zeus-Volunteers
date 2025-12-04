import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },

    // Optional content fields
    announcements: {
      type: String,
      default: "",
    },

    commitments: {
      type: String,
      default: "",
    },

    organizer: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    reviewNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

export default Event;
