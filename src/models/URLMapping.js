/**
 * URL Mapping Model
 * Stores shortened URL mappings with analytics data
 */

const mongoose = require('mongoose');

const urlMappingSchema = new mongoose.Schema(
  {
    // Original long URL
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
      maxlength: [2048, 'URL cannot exceed 2048 characters'],
      lowercase: true,
      index: true,
    },

    // Unique short code
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      sparse: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      index: true,
      match: [/^[a-zA-Z0-9]+$/, 'Short code must contain only alphanumeric characters'],
    },

    // User who created the short URL (optional)
    createdBy: {
      type: String,
      trim: true,
      default: null,
    },

    // Total click count
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    // Last accessed timestamp
    lastAccessedAt: {
      type: Date,
      default: null,
      index: true,
    },

    // Custom alias or description
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // TTL (Time to Live) - optional expiration
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    // Is URL active/enabled
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Analytics tracking array
    analytics: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
          index: true,
        },
        userAgent: {
          type: String,
          trim: true,
        },
        ipAddress: {
          type: String,
          trim: true,
        },
        referer: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'url_mappings',
  }
);

// Compound index for frequently queried fields
urlMappingSchema.index({ shortCode: 1, isActive: 1 });
urlMappingSchema.index({ originalUrl: 1, isActive: 1 });
urlMappingSchema.index({ createdAt: -1, isActive: 1 });

/**
 * Pre-save hook: Validate expiration
 */
urlMappingSchema.pre('save', function(next) {
  // Ensure expiresAt is after createdAt if set
  if (this.expiresAt && this.createdAt && this.expiresAt <= this.createdAt) {
    return next(new Error('Expiration date must be after creation date'));
  }
  next();
});

/**
 * Instance method: Check if URL has expired
 */
urlMappingSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

/**
 * Instance method: Get analytics summary
 */
urlMappingSchema.methods.getAnalyticsSummary = function() {
  const summary = {
    totalClicks: this.clickCount,
    lastAccessedAt: this.lastAccessedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    recentAccesses: this.analytics.slice(-10).map(a => ({
      timestamp: a.timestamp,
      userAgent: a.userAgent,
      ipAddress: a.ipAddress,
    })),
  };
  return summary;
};

/**
 * Instance method: Add analytics entry and increment click count
 */
urlMappingSchema.methods.recordAccess = function(userAgent, ipAddress, referer) {
  this.clickCount += 1;
  this.lastAccessedAt = new Date();
  this.analytics.push({
    timestamp: new Date(),
    userAgent: userAgent || 'Unknown',
    ipAddress: ipAddress || 'Unknown',
    referer: referer || null,
  });
  return this.save();
};

/**
 * Static method: Find active URL by shortCode
 */
urlMappingSchema.statics.findByShortCode = function(shortCode) {
  return this.findOne({ shortCode, isActive: true, expiresAt: { $exists: false } }).select('+createdAt');
};

/**
 * Static method: Find by short code with expired check
 */
urlMappingSchema.statics.findActiveByShortCode = function(shortCode) {
  return this.findOne({
    shortCode,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  });
};

const URLMapping = mongoose.model('URLMapping', urlMappingSchema);

module.exports = URLMapping;
