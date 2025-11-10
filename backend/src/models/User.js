import mongoose from "mongoose";
import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";
import { Filter } from "bad-words";

const filter = new Filter();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow + character and other valid email characters
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name cannot exceed 30 characters"],
      validate: {
        validator: function (v) {
          // Remove HTML tags
          const sanitized = sanitizeHtml(v, {
            allowedTags: [],
            allowedAttributes: {},
          });
          // Check for profanity
          return !filter.isProfane(sanitized);
        },
        message: "Name contains inappropriate language or invalid characters",
      },
    },
    displayName: {
      type: String,
      trim: true,
      minlength: [2, "Display name must be at least 2 characters long"],
      maxlength: [30, "Display name cannot exceed 30 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          // Remove HTML tags
          const sanitized = sanitizeHtml(v, {
            allowedTags: [],
            allowedAttributes: {},
          });
          // Check for profanity
          return !filter.isProfane(sanitized);
        },
        message:
          "Display name contains inappropriate language or invalid characters",
      },
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    showAdminBadge: {
      type: Boolean,
      // Only exists for admins - undefined for regular users
    },
    isSystem: {
      type: Boolean,
      default: false,
      // System accounts (like [Deleted User]) cannot be logged into
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    avatarColor: {
      type: String,
      default: "#6dd5ed", // Default ocean blue color
      validate: {
        validator: function (v) {
          // Validate hex color format
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Avatar color must be a valid hex color (e.g., #6dd5ed)",
      },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          // Only strip HTML tags, preserve spaces, newlines, and emojis
          const sanitized = sanitizeHtml(v, {
            allowedTags: [],
            allowedAttributes: {},
          });
          return !filter.isProfane(sanitized);
        },
        message: "Bio contains inappropriate language",
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          const sanitized = sanitizeHtml(v, {
            allowedTags: [],
            allowedAttributes: {},
          });
          return !filter.isProfane(sanitized);
        },
        message: "Location contains inappropriate language",
      },
    },
    interests: {
      type: String,
      trim: true,
      maxlength: [100, "Interests cannot exceed 100 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          const sanitized = sanitizeHtml(v, {
            allowedTags: [],
            allowedAttributes: {},
          });
          return !filter.isProfane(sanitized);
        },
        message: "Interests contains inappropriate language",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Sanitize name and set displayName before saving
userSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = sanitizeHtml(this.name, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  // Auto-generate displayName from name if not provided
  if (this.isModified("name") && !this.displayName) {
    this.displayName = this.name;
  }

  // Sanitize displayName if modified
  if (this.isModified("displayName") && this.displayName) {
    this.displayName = sanitizeHtml(this.displayName, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Don't return password or email in JSON responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.email;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
