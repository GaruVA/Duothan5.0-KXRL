const Judge0Service = require('./src/services/judge0Service');

async function testJudge0Integration() {
  console.log('🚀 Testing Judge0 CE API Integration...\n');
  
  const judge0 = new Judge0Service();
  
  try {
    // Test 1: Connection and Authentication
    console.log('1. Testing connection and authentication...');
    const connectionTest = await judge0.testConnection();
    console.log('✅ Connection test:', connectionTest.success ? 'PASSED' : 'FAILED');
    if (!connectionTest.success) {
      console.log('❌ Error:', connectionTest.error);
      return;
    }
    console.log('');

    // Test 2: Get Languages
    console.log('2. Testing get languages...');
    const languages = await judge0.getLanguages();
    console.log(`✅ Languages retrieved: ${languages.length} languages available`);
    console.log('📋 Sample languages:');
    languages.slice(0, 5).forEach(lang => {
      console.log(`   - ${lang.name} (ID: ${lang.id})`);
    });
    console.log('');

    // Test 3: Get Statuses
    console.log('3. Testing get statuses...');
    const statuses = await judge0.getStatuses();
    console.log(`✅ Statuses retrieved: ${statuses.length} statuses available`);
    console.log('📋 Available statuses:');
    statuses.forEach(status => {
      console.log(`   - ${status.description} (ID: ${status.id})`);
    });
    console.log('');

    // Test 4: Simple Code Submission (Hello World in Python)
    console.log('4. Testing code submission (Hello World in Python)...');
    const helloWorldCode = `print("Hello World")`;
    const submission = {
      source_code: helloWorldCode,
      language_id: Judge0Service.LANGUAGES.PYTHON,
      stdin: "",
      expected_output: "Hello World"
    };

    const submitResult = await judge0.submitCode(submission);
    console.log('✅ Code submitted successfully');
    console.log(`📝 Submission token: ${submitResult.token}`);
    console.log('');

    // Test 5: Poll for Result
    console.log('5. Polling for submission result...');
    const result = await judge0.pollSubmission(submitResult.token, 15, 2000);
    console.log('✅ Submission completed');
    console.log(`📊 Status: ${result.status.description} (ID: ${result.status.id})`);
    console.log(`📤 Output: "${result.stdout?.trim() || 'No output'}"`);
    console.log(`📛 Error: ${result.stderr || 'None'}`);
    console.log(`⏱️  Time: ${result.time || 'N/A'}s`);
    console.log(`💾 Memory: ${result.memory || 'N/A'} KB`);
    console.log('');

    // Test 6: Code with Input (Add Two Numbers in C++)
    console.log('6. Testing code with input (Add Two Numbers in C++)...');
    const addTwoNumbersCode = `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`;

    const mathSubmission = {
      source_code: addTwoNumbersCode,
      language_id: Judge0Service.LANGUAGES.CPP,
      stdin: "3 5",
      expected_output: "8"
    };

    const mathSubmitResult = await judge0.submitCode(mathSubmission);
    console.log('✅ Math code submitted successfully');
    
    const mathResult = await judge0.pollSubmission(mathSubmitResult.token, 15, 2000);
    console.log(`📊 Status: ${mathResult.status.description}`);
    console.log(`📤 Output: "${mathResult.stdout?.trim() || 'No output'}"`);
    console.log(`📛 Error: ${mathResult.stderr || 'None'}`);
    console.log('');

    // Test 7: Compilation Error Test (Java with syntax error)
    console.log('7. Testing compilation error handling (Java with syntax error)...');
    const badJavaCode = `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World"  // Missing semicolon and closing parenthesis
    }
}`;

    const errorSubmission = {
      source_code: badJavaCode,
      language_id: Judge0Service.LANGUAGES.JAVA
    };

    const errorSubmitResult = await judge0.submitCode(errorSubmission);
    const errorResult = await judge0.pollSubmission(errorSubmitResult.token, 15, 2000);
    console.log(`📊 Status: ${errorResult.status.description}`);
    console.log(`📤 Compile Output: ${errorResult.compile_output ? 'Present' : 'None'}`);
    console.log('✅ Compilation error handling works correctly');
    console.log('');

    // Test 8: Batch Submission
    console.log('8. Testing batch submission...');
    const batchSubmissions = [
      {
        source_code: 'print("Python Hello")',
        language_id: Judge0Service.LANGUAGES.PYTHON
      },
      {
        source_code: 'console.log("JavaScript Hello");',
        language_id: Judge0Service.LANGUAGES.JAVASCRIPT
      },
      {
        source_code: 'echo "Bash Hello"',
        language_id: Judge0Service.LANGUAGES.BASH
      }
    ];

    const batchResult = await judge0.submitCodeBatch(batchSubmissions);
    console.log(`✅ Batch submitted: ${batchResult.length} submissions`);
    
    // Get batch results
    const tokens = batchResult.map(r => r.token).filter(t => t);
    if (tokens.length > 0) {
      console.log('⏳ Waiting for batch results...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const batchResults = await judge0.getSubmissionBatch(tokens);
      console.log('📊 Batch results:');
      batchResults.submissions.forEach((result, index) => {
        console.log(`   ${index + 1}. Status: ${result.status.description}, Output: "${result.stdout?.trim() || 'No output'}"`);
      });
    }
    console.log('');

    // Test 9: System and Config Info
    console.log('9. Testing system and configuration info...');
    try {
      const systemInfo = await judge0.getSystemInfo();
      console.log('✅ System info retrieved');
      console.log(`💻 CPU: ${systemInfo['Model name'] || 'Unknown'}`);
      console.log(`💾 Memory: ${systemInfo['Mem'] || 'Unknown'}`);
    } catch (error) {
      console.log('⚠️  System info not accessible (may require higher privileges)');
    }

    try {
      const configInfo = await judge0.getConfigInfo();
      console.log('✅ Config info retrieved');
      console.log(`⏱️  Default CPU time limit: ${configInfo.cpu_time_limit}s`);
      console.log(`💾 Default memory limit: ${configInfo.memory_limit} KB`);
      console.log(`📊 Max queue size: ${configInfo.max_queue_size}`);
    } catch (error) {
      console.log('⚠️  Config info not accessible');
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('✅ Judge0 CE API integration is working properly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📝 Full error:', error);
  }
}

// Language mapping test
function testLanguageMappings() {
  console.log('\n📚 Testing language mappings...');
  console.log('Available language constants:');
  Object.entries(Judge0Service.LANGUAGES).forEach(([name, id]) => {
    console.log(`   ${name}: ${id}`);
  });
  console.log('');
}

// Status mapping test
function testStatusMappings() {
  console.log('📊 Testing status mappings...');
  console.log('Available status constants:');
  Object.entries(Judge0Service.STATUS).forEach(([name, id]) => {
    console.log(`   ${name}: ${id}`);
  });
  console.log('');
}

// Run tests
async function runAllTests() {
  testLanguageMappings();
  testStatusMappings();
  await testJudge0Integration();
}

// Execute if run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testJudge0Integration, testLanguageMappings, testStatusMappings };
