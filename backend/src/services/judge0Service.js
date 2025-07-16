const axios = require('axios');

class Judge0Service {
  constructor() {
    this.baseURL = process.env.JUDGE0_API_URL || 'http://10.3.5.139:2358';
    this.apiToken = process.env.JUDGE0_API_TOKEN || 'ZHVvdGhhbjUuMA==';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.apiToken
      },
      timeout: 30000 // 30 seconds timeout
    });
  }

  /**
   * Submit code for execution
   * @param {Object} submission - Submission data
   * @param {string} submission.source_code - Source code to execute
   * @param {number} submission.language_id - Programming language ID
   * @param {string} [submission.stdin] - Input for the program
   * @param {string} [submission.expected_output] - Expected output for comparison
   * @param {number} [submission.cpu_time_limit] - CPU time limit in seconds
   * @param {number} [submission.memory_limit] - Memory limit in KB
   * @param {boolean} [wait=false] - Whether to wait for result
   * @returns {Promise<Object>} Submission result
   */
  async submitCode(submission, wait = false) {
    try {
      const endpoint = wait ? '/submissions/?wait=true' : '/submissions/';
      const response = await this.client.post(endpoint, submission);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get submission result by token
   * @param {string} token - Submission token
   * @param {string} [fields] - Comma-separated list of fields to return
   * @returns {Promise<Object>} Submission result
   */
  async getSubmission(token, fields = null) {
    try {
      const params = fields ? `?fields=${fields}` : '';
      const response = await this.client.get(`/submissions/${token}${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get multiple submissions by tokens
   * @param {string[]} tokens - Array of submission tokens
   * @param {string} [fields] - Comma-separated list of fields to return
   * @returns {Promise<Object>} Batch submission results
   */
  async getSubmissionBatch(tokens, fields = null) {
    try {
      const tokenString = tokens.join(',');
      let params = `?tokens=${tokenString}`;
      if (fields) {
        params += `&fields=${fields}`;
      }
      const response = await this.client.get(`/submissions/batch${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit multiple code submissions at once
   * @param {Object[]} submissions - Array of submission objects
   * @returns {Promise<Object[]>} Array of submission results
   */
  async submitCodeBatch(submissions) {
    try {
      const response = await this.client.post('/submissions/batch', {
        submissions
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get available programming languages
   * @returns {Promise<Object[]>} Array of available languages
   */
  async getLanguages() {
    try {
      const response = await this.client.get('/languages');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get specific language by ID
   * @param {number} languageId - Language ID
   * @returns {Promise<Object>} Language details
   */
  async getLanguage(languageId) {
    try {
      const response = await this.client.get(`/languages/${languageId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all available statuses
   * @returns {Promise<Object[]>} Array of status objects
   */
  async getStatuses() {
    try {
      const response = await this.client.get('/statuses');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Judge0 configuration information
   * @returns {Promise<Object>} Configuration details
   */
  async getConfigInfo() {
    try {
      const response = await this.client.get('/config_info');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Judge0 system information
   * @returns {Promise<Object>} System information
   */
  async getSystemInfo() {
    try {
      const response = await this.client.get('/system_info');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Test Judge0 API connectivity and authentication
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      const response = await this.client.post('/authenticate');
      return {
        success: true,
        status: response.status,
        message: 'Authentication successful'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }

  /**
   * Poll submission status until completion
   * @param {string} token - Submission token
   * @param {number} [maxAttempts=30] - Maximum polling attempts
   * @param {number} [interval=1000] - Polling interval in milliseconds
   * @returns {Promise<Object>} Final submission result
   */
  async pollSubmission(token, maxAttempts = 30, interval = 1000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.getSubmission(token);
        
        // Check if submission is completed (status id 3 or higher indicates completion)
        if (result.status && result.status.id >= 3) {
          return result;
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw this.handleError(error);
        }
      }
    }
    
    throw new Error('Submission polling timeout');
  }

  /**
   * Handle API errors and provide meaningful error messages
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          return new Error('Authentication failed. Invalid API token.');
        case 403:
          return new Error('Authorization failed. Access denied.');
        case 422:
          return new Error(`Validation error: ${JSON.stringify(data)}`);
        case 503:
          return new Error('Service unavailable. Queue might be full.');
        default:
          return new Error(`API error ${status}: ${data?.error || data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from Judge0 API. Please check the API endpoint.');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Common language mappings for convenience
   */
  static LANGUAGES = {
    C: 50,           // C (GCC 9.2.0)
    CPP: 54,         // C++ (GCC 9.2.0)
    JAVA: 62,        // Java (OpenJDK 13.0.1)
    PYTHON: 71,      // Python (3.8.1)
    PYTHON2: 70,     // Python (2.7.17)
    JAVASCRIPT: 63,  // JavaScript (Node.js 12.14.0)
    TYPESCRIPT: 74,  // TypeScript (3.7.4)
    CSHARP: 51,      // C# (Mono 6.6.0.161)
    GO: 60,          // Go (1.13.5)
    RUST: 73,        // Rust (1.40.0)
    RUBY: 72,        // Ruby (2.7.0)
    PHP: 68,         // PHP (7.4.1)
    BASH: 46,        // Bash (5.0.0)
    PLAIN_TEXT: 43   // Plain Text
  };

  /**
   * Common status mappings
   */
  static STATUS = {
    IN_QUEUE: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    WRONG_ANSWER: 4,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR: 6,
    RUNTIME_ERROR_SIGSEGV: 7,
    RUNTIME_ERROR_SIGXFSZ: 8,
    RUNTIME_ERROR_SIGFPE: 9,
    RUNTIME_ERROR_SIGABRT: 10,
    RUNTIME_ERROR_NZEC: 11,
    RUNTIME_ERROR_OTHER: 12,
    INTERNAL_ERROR: 13,
    EXEC_FORMAT_ERROR: 14
  };
}

module.exports = Judge0Service;
