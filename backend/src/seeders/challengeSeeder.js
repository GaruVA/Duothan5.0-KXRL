const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Judge0Service = require('../services/judge0Service');
require('dotenv').config();

// Sample challenges data
const sampleChallenges = [
  {
    title: "Hello World",
    description: "Write a program that prints 'Hello World'",
    problemStatement: `
Write a program that prints exactly "Hello World" to the standard output.

This is a simple introductory problem to test your setup.
    `,
    inputFormat: "No input is required.",
    outputFormat: "Output should be exactly: Hello World",
    constraints: "No constraints.",
    examples: [
      {
        input: "",
        output: "Hello World",
        explanation: "Simply print 'Hello World'"
      }
    ],
    testCases: [
      {
        input: "",
        expectedOutput: "Hello World",
        isHidden: false,
        points: 1
      }
    ],
    difficulty: "Easy",
    category: "Basic Programming",
    tags: ["hello-world", "basic", "introduction"],
    timeLimit: 1,
    memoryLimit: 64000,
    allowedLanguages: [
      { languageId: Judge0Service.LANGUAGES.C, languageName: "C" },
      { languageId: Judge0Service.LANGUAGES.CPP, languageName: "C++" },
      { languageId: Judge0Service.LANGUAGES.JAVA, languageName: "Java" },
      { languageId: Judge0Service.LANGUAGES.PYTHON, languageName: "Python" },
      { languageId: Judge0Service.LANGUAGES.JAVASCRIPT, languageName: "JavaScript" }
    ],
    points: 10,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true
  },
  {
    title: "Add Two Numbers",
    description: "Given two integers, return their sum",
    problemStatement: `
Given two integers A and B, calculate and return their sum.

Read two integers from input and print their sum.
    `,
    inputFormat: "Two integers A and B separated by a space.",
    outputFormat: "A single integer representing A + B.",
    constraints: "-10^9 ≤ A, B ≤ 10^9",
    examples: [
      {
        input: "3 5",
        output: "8",
        explanation: "3 + 5 = 8"
      },
      {
        input: "-1 7",
        output: "6",
        explanation: "-1 + 7 = 6"
      }
    ],
    testCases: [
      {
        input: "3 5",
        expectedOutput: "8",
        isHidden: false,
        points: 1
      },
      {
        input: "-1 7",
        expectedOutput: "6",
        isHidden: false,
        points: 1
      },
      {
        input: "100 200",
        expectedOutput: "300",
        isHidden: true,
        points: 1
      },
      {
        input: "-50 -30",
        expectedOutput: "-80",
        isHidden: true,
        points: 1
      },
      {
        input: "0 0",
        expectedOutput: "0",
        isHidden: true,
        points: 1
      }
    ],
    difficulty: "Easy",
    category: "Mathematics",
    tags: ["addition", "arithmetic", "basic"],
    timeLimit: 1,
    memoryLimit: 64000,
    allowedLanguages: [
      { languageId: Judge0Service.LANGUAGES.C, languageName: "C" },
      { languageId: Judge0Service.LANGUAGES.CPP, languageName: "C++" },
      { languageId: Judge0Service.LANGUAGES.JAVA, languageName: "Java" },
      { languageId: Judge0Service.LANGUAGES.PYTHON, languageName: "Python" },
      { languageId: Judge0Service.LANGUAGES.JAVASCRIPT, languageName: "JavaScript" }
    ],
    points: 50,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true
  },
  {
    title: "Reverse a String",
    description: "Given a string, return its reverse",
    problemStatement: `
Given a string S, return the reverse of the string.

For example, if the input is "hello", the output should be "olleh".
    `,
    inputFormat: "A single string S.",
    outputFormat: "The reverse of string S.",
    constraints: "1 ≤ |S| ≤ 1000, S contains only printable ASCII characters",
    examples: [
      {
        input: "hello",
        output: "olleh",
        explanation: "Reverse of 'hello' is 'olleh'"
      },
      {
        input: "world",
        output: "dlrow",
        explanation: "Reverse of 'world' is 'dlrow'"
      }
    ],
    testCases: [
      {
        input: "hello",
        expectedOutput: "olleh",
        isHidden: false,
        points: 1
      },
      {
        input: "world",
        expectedOutput: "dlrow",
        isHidden: false,
        points: 1
      },
      {
        input: "a",
        expectedOutput: "a",
        isHidden: true,
        points: 1
      },
      {
        input: "programming",
        expectedOutput: "gnimmargorpn",
        isHidden: true,
        points: 1
      },
      {
        input: "12345",
        expectedOutput: "54321",
        isHidden: true,
        points: 1
      }
    ],
    difficulty: "Easy",
    category: "String Manipulation",
    tags: ["string", "reverse", "basic"],
    timeLimit: 2,
    memoryLimit: 128000,
    allowedLanguages: [
      { languageId: Judge0Service.LANGUAGES.C, languageName: "C" },
      { languageId: Judge0Service.LANGUAGES.CPP, languageName: "C++" },
      { languageId: Judge0Service.LANGUAGES.JAVA, languageName: "Java" },
      { languageId: Judge0Service.LANGUAGES.PYTHON, languageName: "Python" },
      { languageId: Judge0Service.LANGUAGES.JAVASCRIPT, languageName: "JavaScript" }
    ],
    points: 75,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true
  },
  {
    title: "Find Maximum in Array",
    description: "Given an array of integers, find the maximum element",
    problemStatement: `
Given an array of N integers, find and return the maximum element in the array.

The first line contains N, the number of elements in the array.
The second line contains N space-separated integers representing the array elements.
    `,
    inputFormat: `
Line 1: Integer N (1 ≤ N ≤ 1000)
Line 2: N space-separated integers
    `,
    outputFormat: "A single integer representing the maximum element.",
    constraints: "1 ≤ N ≤ 1000, -10^9 ≤ array elements ≤ 10^9",
    examples: [
      {
        input: "5\n3 1 4 1 5",
        output: "5",
        explanation: "The maximum element in [3, 1, 4, 1, 5] is 5"
      },
      {
        input: "3\n-1 -5 -3",
        output: "-1",
        explanation: "The maximum element in [-1, -5, -3] is -1"
      }
    ],
    testCases: [
      {
        input: "5\n3 1 4 1 5",
        expectedOutput: "5",
        isHidden: false,
        points: 2
      },
      {
        input: "3\n-1 -5 -3",
        expectedOutput: "-1",
        isHidden: false,
        points: 2
      },
      {
        input: "1\n42",
        expectedOutput: "42",
        isHidden: true,
        points: 1
      },
      {
        input: "4\n10 20 30 25",
        expectedOutput: "30",
        isHidden: true,
        points: 2
      },
      {
        input: "6\n-10 -20 -5 -15 -1 -8",
        expectedOutput: "-1",
        isHidden: true,
        points: 3
      }
    ],
    difficulty: "Medium",
    category: "Arrays",
    tags: ["array", "maximum", "iteration"],
    timeLimit: 2,
    memoryLimit: 128000,
    allowedLanguages: [
      { languageId: Judge0Service.LANGUAGES.C, languageName: "C" },
      { languageId: Judge0Service.LANGUAGES.CPP, languageName: "C++" },
      { languageId: Judge0Service.LANGUAGES.JAVA, languageName: "Java" },
      { languageId: Judge0Service.LANGUAGES.PYTHON, languageName: "Python" },
      { languageId: Judge0Service.LANGUAGES.JAVASCRIPT, languageName: "JavaScript" }
    ],
    points: 100,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true
  },
  {
    title: "Two Sum",
    description: "Find two numbers in an array that add up to a target sum",
    problemStatement: `
Given an array of integers and a target sum, find two distinct elements in the array that add up to the target sum.

Return the indices of the two numbers (0-indexed) in ascending order.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
    `,
    inputFormat: `
Line 1: Integer N (number of elements)
Line 2: N space-separated integers (the array)
Line 3: Integer target (the target sum)
    `,
    outputFormat: "Two integers representing the indices of the two numbers that add up to target, separated by a space.",
    constraints: "2 ≤ N ≤ 1000, -10^9 ≤ array elements ≤ 10^9, -10^9 ≤ target ≤ 10^9",
    examples: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]"
      },
      {
        input: "3\n3 2 4\n6",
        output: "1 2",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2]"
      }
    ],
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        isHidden: false,
        points: 2
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        isHidden: false,
        points: 2
      },
      {
        input: "2\n1 2\n3",
        expectedOutput: "0 1",
        isHidden: true,
        points: 2
      },
      {
        input: "5\n1 3 5 7 9\n12",
        expectedOutput: "2 3",
        isHidden: true,
        points: 2
      },
      {
        input: "4\n-1 -2 -3 -4\n-7",
        expectedOutput: "2 3",
        isHidden: true,
        points: 2
      }
    ],
    difficulty: "Medium",
    category: "Arrays",
    tags: ["array", "hash-table", "two-pointers"],
    timeLimit: 3,
    memoryLimit: 256000,
    allowedLanguages: [
      { languageId: Judge0Service.LANGUAGES.C, languageName: "C" },
      { languageId: Judge0Service.LANGUAGES.CPP, languageName: "C++" },
      { languageId: Judge0Service.LANGUAGES.JAVA, languageName: "Java" },
      { languageId: Judge0Service.LANGUAGES.PYTHON, languageName: "Python" },
      { languageId: Judge0Service.LANGUAGES.JAVASCRIPT, languageName: "JavaScript" }
    ],
    points: 150,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true
  }
];

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/duothan');
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert sample challenges
    const insertedChallenges = await Challenge.insertMany(sampleChallenges);
    console.log(`Inserted ${insertedChallenges.length} sample challenges`);

    // Print challenge IDs for reference
    insertedChallenges.forEach((challenge, index) => {
      console.log(`${index + 1}. ${challenge.title} - ID: ${challenge._id}`);
    });

    console.log('\nSample challenges seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding challenges:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedChallenges();
}

module.exports = { seedChallenges, sampleChallenges };
