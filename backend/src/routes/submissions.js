const express = require('express');
const router = express.Router();
const Judge0Service = require('../services/judge0Service');
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const authenticateToken = require('../middleware/auth');

const judge0 = new Judge0Service();

// @route   POST /api/submissions
// @desc    Submit code for evaluation
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      challengeId, 
      sourceCode, 
      languageId, 
      languageName 
    } = req.body;

    // Validate required fields
    if (!challengeId || !sourceCode || !languageId || !languageName) {
      return res.status(400).json({
        error: 'Missing required fields: challengeId, sourceCode, languageId, languageName'
      });
    }

    // Get challenge details
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if challenge is active
    if (!challenge.isCurrentlyActive) {
      return res.status(400).json({ error: 'Challenge is not currently active' });
    }

    // Check if language is allowed for this challenge
    if (!challenge.isLanguageAllowed(languageId)) {
      return res.status(400).json({ 
        error: 'Programming language not allowed for this challenge',
        allowedLanguages: challenge.allowedLanguages
      });
    }

    // Submit to Judge0 for initial compilation check
    const judge0Submission = {
      source_code: sourceCode,
      language_id: languageId,
      cpu_time_limit: challenge.timeLimit,
      memory_limit: challenge.memoryLimit
    };

    const judge0Response = await judge0.submitCode(judge0Submission);

    // Create submission record
    const submission = new Submission({
      teamId: req.team._id,
      challengeId,
      sourceCode,
      languageId,
      languageName,
      judge0Token: judge0Response.token,
      status: {
        id: 1, // In Queue
        description: 'In Queue'
      }
    });

    await submission.save();

    // Increment challenge submission count
    await Challenge.findByIdAndUpdate(challengeId, {
      $inc: { submissionCount: 1 }
    });

    res.status(201).json({
      message: 'Code submitted successfully',
      submissionId: submission._id,
      judge0Token: judge0Response.token,
      status: submission.status
    });

    // Start processing test cases in background
    processSubmissionTestCases(submission._id, challenge, judge0Response.token)
      .catch(error => console.error('Error processing test cases:', error));

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit code',
      message: error.message 
    });
  }
});

// @route   GET /api/submissions/:id
// @desc    Get submission by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('teamId', 'teamName')
      .populate('challengeId', 'title difficulty points');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if team owns this submission
    if (submission.teamId._id.toString() !== req.team._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ 
      error: 'Failed to get submission',
      message: error.message 
    });
  }
});

// @route   GET /api/submissions/:id/status
// @desc    Get submission status and results
// @access  Private
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if team owns this submission
    if (submission.teamId.toString() !== req.team._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If submission is not completed, try to get latest status from Judge0
    if (!submission.isCompleted()) {
      try {
        const judge0Result = await judge0.getSubmission(submission.judge0Token);
        
        // Update submission with latest status
        submission.status = judge0Result.status;
        submission.stdout = judge0Result.stdout;
        submission.stderr = judge0Result.stderr;
        submission.compileOutput = judge0Result.compile_output;
        submission.message = judge0Result.message;
        submission.time = judge0Result.time;
        submission.memory = judge0Result.memory;
        submission.exitCode = judge0Result.exit_code;
        submission.exitSignal = judge0Result.exit_signal;

        if (judge0Result.finished_at) {
          submission.finishedAt = new Date(judge0Result.finished_at);
        }

        await submission.save();
      } catch (judge0Error) {
        console.error('Error getting Judge0 status:', judge0Error);
      }
    }

    res.json({
      id: submission._id,
      status: submission.status,
      stdout: submission.stdout,
      stderr: submission.stderr,
      compileOutput: submission.compileOutput,
      message: submission.message,
      time: submission.time,
      memory: submission.memory,
      score: submission.score,
      isCorrect: submission.isCorrect,
      testCases: submission.testCases,
      formattedTime: submission.formattedTime,
      formattedMemory: submission.formattedMemory,
      createdAt: submission.createdAt,
      finishedAt: submission.finishedAt
    });
  } catch (error) {
    console.error('Get submission status error:', error);
    res.status(500).json({ 
      error: 'Failed to get submission status',
      message: error.message 
    });
  }
});

// @route   GET /api/submissions
// @desc    Get user submissions
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, challengeId, status } = req.query;
    
    const query = { teamId: req.team._id };
    
    if (challengeId) {
      query.challengeId = challengeId;
    }
    
    if (status) {
      query['status.description'] = status;
    }

    const submissions = await Submission.find(query)
      .populate('challengeId', 'title difficulty points')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSubmissions: total
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ 
      error: 'Failed to get submissions',
      message: error.message 
    });
  }
});

// @route   GET /api/submissions/challenge/:challengeId
// @desc    Get submissions for a specific challenge
// @access  Private
router.get('/challenge/:challengeId', authenticateToken, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { 
      teamId: req.team._id,
      challengeId 
    };

    const submissions = await Submission.find(query)
      .populate('challengeId', 'title difficulty points')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    // Get best submission for this challenge
    const bestSubmission = await Submission.getBestScore(req.team._id, challengeId);

    res.json({
      submissions,
      bestSubmission,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSubmissions: total
    });
  } catch (error) {
    console.error('Get challenge submissions error:', error);
    res.status(500).json({ 
      error: 'Failed to get challenge submissions',
      message: error.message 
    });
  }
});

// Background function to process test cases
async function processSubmissionTestCases(submissionId, challenge, judge0Token) {
  try {
    // Wait for initial compilation to complete
    const initialResult = await judge0.pollSubmission(judge0Token, 10, 2000);
    
    const submission = await Submission.findById(submissionId);
    if (!submission) return;

    // Update submission with initial result
    submission.status = initialResult.status;
    submission.stdout = initialResult.stdout;
    submission.stderr = initialResult.stderr;
    submission.compileOutput = initialResult.compile_output;
    submission.message = initialResult.message;
    submission.time = initialResult.time;
    submission.memory = initialResult.memory;
    submission.exitCode = initialResult.exit_code;
    submission.exitSignal = initialResult.exit_signal;

    if (initialResult.finished_at) {
      submission.finishedAt = new Date(initialResult.finished_at);
    }

    // If compilation failed, save and return
    if (initialResult.status.id === 6) { // Compilation Error
      await submission.save();
      return;
    }

    // Run test cases
    const testCaseResults = [];
    let passedTestCases = 0;
    let totalTestCases = challenge.testCases.length;

    for (let i = 0; i < challenge.testCases.length; i++) {
      const testCase = challenge.testCases[i];
      
      try {
        const testSubmission = {
          source_code: submission.sourceCode,
          language_id: submission.languageId,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
          cpu_time_limit: challenge.timeLimit,
          memory_limit: challenge.memoryLimit
        };

        const testResult = await judge0.submitCode(testSubmission, true);
        
        const passed = testResult.status.id === 3 && 
                      testResult.stdout?.trim() === testCase.expectedOutput.trim();
        
        if (passed) passedTestCases++;

        testCaseResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: testResult.stdout || '',
          passed,
          executionTime: testResult.time,
          memory: testResult.memory
        });

      } catch (testError) {
        console.error(`Error running test case ${i}:`, testError);
        testCaseResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          executionTime: null,
          memory: null
        });
      }
    }

    // Calculate score
    const score = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;
    const isCorrect = passedTestCases === totalTestCases && totalTestCases > 0;

    // Update submission with test results
    submission.testCases = testCaseResults;
    submission.score = score;
    submission.isCorrect = isCorrect;

    await submission.save();

    // Update challenge solved count if this is the first correct submission by this team
    if (isCorrect) {
      const existingCorrectSubmission = await Submission.findOne({
        teamId: submission.teamId,
        challengeId: submission.challengeId,
        isCorrect: true,
        _id: { $ne: submission._id }
      });

      if (!existingCorrectSubmission) {
        await Challenge.findByIdAndUpdate(submission.challengeId, {
          $inc: { solvedCount: 1 }
        });
      }
    }

  } catch (error) {
    console.error('Error processing test cases:', error);
    
    // Update submission with error status
    try {
      await Submission.findByIdAndUpdate(submissionId, {
        status: {
          id: 13, // Internal Error
          description: 'Internal Error'
        },
        message: 'Error processing test cases'
      });
    } catch (updateError) {
      console.error('Error updating submission with error status:', updateError);
    }
  }
}

module.exports = router;
