const express = require('express');
const router = express.Router();
const Judge0Service = require('../services/judge0Service');
const authenticateToken = require('../middleware/auth');

const judge0 = new Judge0Service();

// @route   POST /api/judge0/test
// @desc    Test Judge0 connection and authentication
// @access  Private
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const result = await judge0.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Judge0 test error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to test Judge0 connection',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/languages
// @desc    Get available programming languages
// @access  Private
router.get('/languages', authenticateToken, async (req, res) => {
  try {
    const languages = await judge0.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      error: 'Failed to get programming languages',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/languages/:id
// @desc    Get specific language details
// @access  Private
router.get('/languages/:id', authenticateToken, async (req, res) => {
  try {
    const language = await judge0.getLanguage(parseInt(req.params.id));
    res.json(language);
  } catch (error) {
    console.error('Get language error:', error);
    res.status(500).json({ 
      error: 'Failed to get language details',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/statuses
// @desc    Get available submission statuses
// @access  Private
router.get('/statuses', authenticateToken, async (req, res) => {
  try {
    const statuses = await judge0.getStatuses();
    res.json(statuses);
  } catch (error) {
    console.error('Get statuses error:', error);
    res.status(500).json({ 
      error: 'Failed to get submission statuses',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/config
// @desc    Get Judge0 configuration information
// @access  Private
router.get('/config', authenticateToken, async (req, res) => {
  try {
    const config = await judge0.getConfigInfo();
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ 
      error: 'Failed to get Judge0 configuration',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/system
// @desc    Get Judge0 system information
// @access  Private
router.get('/system', authenticateToken, async (req, res) => {
  try {
    const systemInfo = await judge0.getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({ 
      error: 'Failed to get Judge0 system information',
      message: error.message 
    });
  }
});

// @route   POST /api/judge0/submit
// @desc    Submit code directly to Judge0 (for testing purposes)
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { 
      source_code, 
      language_id, 
      stdin, 
      expected_output,
      wait = false 
    } = req.body;

    if (!source_code || !language_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: source_code, language_id' 
      });
    }

    const submission = {
      source_code,
      language_id: parseInt(language_id),
      stdin,
      expected_output
    };

    const result = await judge0.submitCode(submission, wait);
    res.json(result);
  } catch (error) {
    console.error('Judge0 submit error:', error);
    res.status(500).json({ 
      error: 'Failed to submit code to Judge0',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/submission/:token
// @desc    Get submission result by token
// @access  Private
router.get('/submission/:token', authenticateToken, async (req, res) => {
  try {
    const { fields } = req.query;
    const result = await judge0.getSubmission(req.params.token, fields);
    res.json(result);
  } catch (error) {
    console.error('Get Judge0 submission error:', error);
    res.status(500).json({ 
      error: 'Failed to get submission from Judge0',
      message: error.message 
    });
  }
});

// @route   POST /api/judge0/poll/:token
// @desc    Poll submission until completion
// @access  Private
router.post('/poll/:token', authenticateToken, async (req, res) => {
  try {
    const { maxAttempts = 30, interval = 1000 } = req.body;
    const result = await judge0.pollSubmission(
      req.params.token, 
      parseInt(maxAttempts), 
      parseInt(interval)
    );
    res.json(result);
  } catch (error) {
    console.error('Poll Judge0 submission error:', error);
    res.status(500).json({ 
      error: 'Failed to poll submission from Judge0',
      message: error.message 
    });
  }
});

// @route   POST /api/judge0/batch/submit
// @desc    Submit multiple codes to Judge0
// @access  Private
router.post('/batch/submit', authenticateToken, async (req, res) => {
  try {
    const { submissions } = req.body;

    if (!submissions || !Array.isArray(submissions)) {
      return res.status(400).json({ 
        error: 'Missing or invalid submissions array' 
      });
    }

    const result = await judge0.submitCodeBatch(submissions);
    res.json(result);
  } catch (error) {
    console.error('Judge0 batch submit error:', error);
    res.status(500).json({ 
      error: 'Failed to submit batch to Judge0',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/batch/submissions
// @desc    Get multiple submissions by tokens
// @access  Private
router.get('/batch/submissions', authenticateToken, async (req, res) => {
  try {
    const { tokens, fields } = req.query;

    if (!tokens) {
      return res.status(400).json({ 
        error: 'Missing tokens parameter' 
      });
    }

    const tokenArray = tokens.split(',');
    const result = await judge0.getSubmissionBatch(tokenArray, fields);
    res.json(result);
  } catch (error) {
    console.error('Judge0 batch get error:', error);
    res.status(500).json({ 
      error: 'Failed to get batch submissions from Judge0',
      message: error.message 
    });
  }
});

// @route   GET /api/judge0/health
// @desc    Get comprehensive Judge0 health status
// @access  Private
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const startTime = Date.now();
    
    const [
      connectionTest,
      languages,
      statuses,
      configInfo,
      systemInfo
    ] = await Promise.allSettled([
      judge0.testConnection(),
      judge0.getLanguages(),
      judge0.getStatuses(),
      judge0.getConfigInfo(),
      judge0.getSystemInfo()
    ]);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const health = {
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      connection: connectionTest.status === 'fulfilled' ? connectionTest.value : { 
        success: false, 
        error: connectionTest.reason?.message 
      },
      services: {
        languages: {
          status: languages.status === 'fulfilled' ? 'ok' : 'error',
          count: languages.status === 'fulfilled' ? languages.value.length : 0,
          error: languages.status === 'rejected' ? languages.reason?.message : null
        },
        statuses: {
          status: statuses.status === 'fulfilled' ? 'ok' : 'error',
          count: statuses.status === 'fulfilled' ? statuses.value.length : 0,
          error: statuses.status === 'rejected' ? statuses.reason?.message : null
        },
        config: {
          status: configInfo.status === 'fulfilled' ? 'ok' : 'error',
          error: configInfo.status === 'rejected' ? configInfo.reason?.message : null
        },
        system: {
          status: systemInfo.status === 'fulfilled' ? 'ok' : 'error',
          error: systemInfo.status === 'rejected' ? systemInfo.reason?.message : null
        }
      },
      overall: {
        status: connectionTest.status === 'fulfilled' && connectionTest.value.success ? 'healthy' : 'unhealthy'
      }
    };

    const statusCode = health.overall.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Judge0 health check error:', error);
    res.status(500).json({ 
      timestamp: new Date().toISOString(),
      overall: { status: 'unhealthy' },
      error: 'Failed to perform health check',
      message: error.message 
    });
  }
});

module.exports = router;
