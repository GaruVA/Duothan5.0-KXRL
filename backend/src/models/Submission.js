const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  sourceCode: {
    type: String,
    required: true
  },
  languageId: {
    type: Number,
    required: true
  },
  languageName: {
    type: String,
    required: true
  },
  judge0Token: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    id: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  stdout: {
    type: String,
    default: null
  },
  stderr: {
    type: String,
    default: null
  },
  compileOutput: {
    type: String,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  time: {
    type: String,
    default: null
  },
  memory: {
    type: Number,
    default: null
  },
  exitCode: {
    type: Number,
    default: null
  },
  exitSignal: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  finishedAt: {
    type: Date,
    default: null
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    executionTime: String,
    memory: Number
  }],
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ teamId: 1, challengeId: 1 });
submissionSchema.index({ judge0Token: 1 });
submissionSchema.index({ createdAt: -1 });

// Virtual for getting submission time in a readable format
submissionSchema.virtual('formattedTime').get(function() {
  if (this.time) {
    return `${parseFloat(this.time).toFixed(3)}s`;
  }
  return 'N/A';
});

// Virtual for getting memory in MB
submissionSchema.virtual('formattedMemory').get(function() {
  if (this.memory) {
    return `${(this.memory / 1024).toFixed(2)} MB`;
  }
  return 'N/A';
});

// Method to check if submission is completed
submissionSchema.methods.isCompleted = function() {
  return this.status.id >= 3; // Status 3 and above are final states
};

// Method to check if submission passed
submissionSchema.methods.isPassed = function() {
  return this.status.id === 3; // Status 3 is "Accepted"
};

// Static method to get latest submission for a team and challenge
submissionSchema.statics.getLatestSubmission = function(teamId, challengeId) {
  return this.findOne({ teamId, challengeId })
    .sort({ createdAt: -1 })
    .populate('teamId', 'teamName')
    .populate('challengeId', 'title difficulty');
};

// Static method to get team's best score for a challenge
submissionSchema.statics.getBestScore = function(teamId, challengeId) {
  return this.findOne({ teamId, challengeId, isCorrect: true })
    .sort({ score: -1, createdAt: 1 }) // Best score, earliest if tied
    .select('score createdAt');
};

// Static method to get submission statistics for a challenge
submissionSchema.statics.getChallengeStats = async function(challengeId) {
  const stats = await this.aggregate([
    { $match: { challengeId: new mongoose.Types.ObjectId(challengeId) } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        correctSubmissions: {
          $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] }
        },
        uniqueTeams: { $addToSet: '$teamId' },
        avgScore: { $avg: '$score' },
        maxScore: { $max: '$score' },
        minScore: { $min: '$score' }
      }
    },
    {
      $project: {
        _id: 0,
        totalSubmissions: 1,
        correctSubmissions: 1,
        uniqueTeamsCount: { $size: '$uniqueTeams' },
        avgScore: { $round: ['$avgScore', 2] },
        maxScore: 1,
        minScore: 1,
        successRate: {
          $round: [
            { $multiply: [{ $divide: ['$correctSubmissions', '$totalSubmissions'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  return stats[0] || {
    totalSubmissions: 0,
    correctSubmissions: 0,
    uniqueTeamsCount: 0,
    avgScore: 0,
    maxScore: 0,
    minScore: 0,
    successRate: 0
  };
};

module.exports = mongoose.model('Submission', submissionSchema);
