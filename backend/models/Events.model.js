import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    eventName: {
      type: String,
      required: true,
    },
    
    title: {  // ✅ ADDED - Alias for eventName (some code uses this)
      type: String,
    },

    details: {
      type: String,
      required: true,
    },
    
    description: {  // ✅ ADDED - Alias for details
      type: String,
    },

    // ===== CATEGORIZATION (FOR FILTERS) =====
    category: {  // ✅ ADDED - Required for category filter
      type: String,
      enum: ['cultural', 'environmental', 'health', 'education', 'community service', 'other'],
      required: true,
      default: 'other'
    },
    
    skills: [{
      type: String,
      enum: ['Leadership', 'Teaching', 'Physical Labor', 'Technical', 'Creative', 'Administrative']
    }],

    // ===== LOCATION =====
    location: {  // ✅ ADDED - Required for location filter
      type: String,
      required: true
    },
    
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },

    // ===== ORGANIZATION =====
    organizer: {
      type: String,
      required: true,
    },
    
    organization: {  // ✅ ADDED - Optional organization name
      type: String
    },

    // ===== DATE & TIME =====
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
    
    dateTime: {  // ✅ ADDED - Combined date+time for easier filtering/sorting
      type: Date,
      required: true
    },
    
    duration: {  // ✅ ADDED - Event duration in hours
      type: Number,
      default: 2
    },

    // ===== STATUS FIELDS =====
    status: {  // ✅ UPDATED - Changed to event lifecycle status
      type: String,
      enum: ["pending", "upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    
    approvalStatus: {  // ✅ ADDED - Separate admin approval status
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "approved"  // Default to approved for existing events
    },

    // ===== VOLUNTEER MANAGEMENT =====
    maxVolunteers: {  // ✅ ADDED - Max volunteers (0 = unlimited)
      type: Number,
      default: 0
    },

    // ===== IMAGES =====
    imageUrl: {
      type: String,
      default: "",
    },
    
    eventPicture: {  // ✅ ADDED - Alias for imageUrl
      type: String
    },

    // ===== ADDITIONAL CONTENT =====
    announcements: {
      type: String,
      default: "",
    },

    commitments: {
      type: String,
      default: "",
    },

    // ===== CONTACT INFO =====
    contactInfo: {  // ✅ ADDED - Structured contact information
      contactPerson: String,
      email: String,
      phone: String
    },

    // ===== ADMIN FIELDS =====
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    reviewNotes: {
      type: String,
      default: "",
    },
    
    denialReason: {  // ✅ ADDED - Reason if event was denied
      type: String,
      default: ""
    },
    
    createdBy: {  // ✅ ADDED - Track who created the event
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// ===== INDEXES FOR FAST FILTERING =====
// Text search index (for keyword search)
EventSchema.index({ eventName: 'text', details: 'text', title: 'text', description: 'text' });

// Regular indexes (for fast filtering)
EventSchema.index({ category: 1 });
EventSchema.index({ location: 1 });
EventSchema.index({ dateTime: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ approvalStatus: 1 });
EventSchema.index({ skills: 1 });

// Compound index for common query (status + approval)
EventSchema.index({ status: 1, approvalStatus: 1 });

const Event = mongoose.model("Event", EventSchema);

export default Event;