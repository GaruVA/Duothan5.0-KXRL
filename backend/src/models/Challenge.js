const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 1,
    min: 0
  }
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  examples: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      default: ''
    }
  }],
  testCases: [testCaseSchema],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    default: 2, // seconds
    min: 0.1,
    max: 10
  },
  memoryLimit: {
    type: Number,
    default: 128000, // KB (128 MB)
    min: 16000,      // 16 MB
    max: 512000      // 512 MB
  },
  allowedLanguages: [{
    languageId: {
      type: Number,
      required: true
    },
    languageName: {
      type: String,
      required: true
    }
  }],
  points: {
    type: Number,
    default: 100,
    min: 1,
    max: 1000
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  hints: [{
    content: {
      type: String,
      required: true
    },
    pointsDeduction: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    }
  }],
  submissionCount: {
    type: Number,
    default: 0
  },
  solvedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Buildathon-specific fields
  flag: {
    type: String,
    required: true
  },
  buildathonProblem: {
    description: {
      type: String,
      required: true
    },
    requirements: {
      type: String,
      required: true
    },
    deliverables: [{
      type: String
    }],
    timeLimit: {
      type: Number,
      default: 24 // hours
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
challengeSchema.index({ difficulty: 1, category: 1 });
challengeSchema.index({ isActive: 1, startTime: 1, endTime: 1 });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ createdAt: -1 });

// Virtual for difficulty points multiplier
challengeSchema.virtual('difficultyMultiplier').get(function() {
  const multipliers = {
    'Easy': 1,
    'Medium': 1.5,
    'Hard': 2,
    'Expert': 3
  };
  return multipliers[this.difficulty] || 1;
});

// Virtual for success rate
challengeSchema.virtual('successRate').get(function() {
  if (this.submissionCount === 0) return 0;
  return Math.round((this.solvedCount / this.submissionCount) * 100);
});

// Virtual to check if challenge is currently active
challengeSchema.virtual('isCurrentlyActive').get(function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  const hasStarted = !this.startTime || now >= this.startTime;
  const notEnded = !this.endTime || now <= this.endTime;
  
  return hasStarted && notEnded;
});

// Method to get public test cases (non-hidden)
challengeSchema.methods.getPublicTestCases = function() {
  return this.testCases.filter(testCase => !testCase.isHidden);
};

// Method to calculate total possible points
challengeSchema.methods.getTotalPoints = function() {
  const basePoints = this.points * this.difficultyMultiplier;
  return Math.round(basePoints);
};

// Method to validate if a language is allowed
challengeSchema.methods.isLanguageAllowed = function(languageId) {
  if (this.allowedLanguages.length === 0) return true; // If no restrictions, all languages allowed
  return this.allowedLanguages.some(lang => lang.languageId === languageId);
};

// Static method to get challenges by difficulty
challengeSchema.statics.getByDifficulty = function(difficulty, isActive = true) {
  const query = { difficulty };
  if (isActive !== null) {
    query.isActive = isActive;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get challenges by category
challengeSchema.statics.getByCategory = function(category, isActive = true) {
  const query = { category: new RegExp(category, 'i') };
  if (isActive !== null) {
    query.isActive = isActive;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to search challenges
challengeSchema.statics.searchChallenges = function(searchTerm, filters = {}) {
  const query = {
    $or: [
      { title: new RegExp(searchTerm, 'i') },
      { description: new RegExp(searchTerm, 'i') },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ],
    ...filters
  };
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get challenge statistics
challengeSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalChallenges: { $sum: 1 },
        activeChallenges: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        easyCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] }
        },
        mediumCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] }
        },
        hardCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] }
        },
        expertCount: {
          $sum: { $cond: [{ $eq: ['$difficulty', 'Expert'] }, 1, 0] }
        },
        totalSubmissions: { $sum: '$submissionCount' },
        totalSolved: { $sum: '$solvedCount' },
        avgSuccessRate: { $avg: '$successRate' }
      }
    }
  ]);

  return stats[0] || {
    totalChallenges: 0,
    activeChallenges: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    expertCount: 0,
    totalSubmissions: 0,
    totalSolved: 0,
    avgSuccessRate: 0
  };
};

// Pre-save middleware to update submission count
challengeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Challenge', challengeSchema);
