const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

// Simple challenges data that meets all required fields
const simpleChallenges = [
  {
    title: "Hello World",
    description: "Write a program that prints 'Hello World'",
    problemStatement: "Write a program that prints exactly 'Hello World' to the standard output.",
    inputFormat: "No input is required.",
    outputFormat: "Output should be exactly: Hello World",
    constraints: "No constraints.",
    examples: [
      {
        input: "No input required",
        output: "Hello World",
        explanation: "Simply print 'Hello World'"
      }
    ],
    testCases: [
      {
        input: "No input required",
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
      { languageId: 50, languageName: "C" },
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" },
      { languageId: 63, languageName: "JavaScript" }
    ],
    points: 10,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{hello_world_basic}",
    buildathonProblem: {
      description: "This is a basic hello world challenge",
      requirements: "Print Hello World to standard output",
      deliverables: ["Source code", "Output screenshot"],
      timeLimit: 1
    }
  },
  {
    title: "Sum of Two Numbers",
    description: "Calculate the sum of two integers",
    problemStatement: "Given two integers A and B, calculate their sum.",
    inputFormat: "Two space-separated integers A and B",
    outputFormat: "Output the sum A + B",
    constraints: "1 ≤ A, B ≤ 1000",
    examples: [
      {
        input: "5 3",
        output: "8",
        explanation: "5 + 3 = 8"
      }
    ],
    testCases: [
      {
        input: "5 3",
        expectedOutput: "8",
        isHidden: false,
        points: 1
      },
      {
        input: "100 200",
        expectedOutput: "300",
        isHidden: true,
        points: 1
      }
    ],
    difficulty: "Easy",
    category: "Mathematics",
    tags: ["arithmetic", "basic", "addition"],
    timeLimit: 2,
    memoryLimit: 64000,
    allowedLanguages: [
      { languageId: 50, languageName: "C" },
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" },
      { languageId: 63, languageName: "JavaScript" }
    ],
    points: 25,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{simple_addition}",
    buildathonProblem: {
      description: "Basic arithmetic challenge",
      requirements: "Read two numbers and output their sum",
      deliverables: ["Source code", "Test results"],
      timeLimit: 2
    }
  },
  {
    title: "Fibonacci Sequence",
    description: "Generate the nth Fibonacci number",
    problemStatement: "Given an integer n, find the nth number in the Fibonacci sequence. The sequence starts with 0, 1, 1, 2, 3, 5, 8, ...",
    inputFormat: "A single integer n (1 ≤ n ≤ 30)",
    outputFormat: "Output the nth Fibonacci number",
    constraints: "1 ≤ n ≤ 30",
    examples: [
      {
        input: "5",
        output: "3",
        explanation: "The 5th Fibonacci number is 3 (0, 1, 1, 2, 3)"
      },
      {
        input: "8",
        output: "13",
        explanation: "The 8th Fibonacci number is 13"
      }
    ],
    testCases: [
      {
        input: "5",
        expectedOutput: "3",
        isHidden: false,
        points: 2
      },
      {
        input: "8",
        expectedOutput: "13",
        isHidden: false,
        points: 2
      },
      {
        input: "15",
        expectedOutput: "377",
        isHidden: true,
        points: 3
      }
    ],
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["fibonacci", "recursion", "dp", "sequence"],
    timeLimit: 2,
    memoryLimit: 128000,
    allowedLanguages: [
      { languageId: 50, languageName: "C" },
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" },
      { languageId: 63, languageName: "JavaScript" }
    ],
    points: 75,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{fibonacci_sequence}",
    buildathonProblem: {
      description: "Implement Fibonacci sequence generation",
      requirements: "Calculate nth Fibonacci number efficiently",
      deliverables: ["Source code", "Algorithm explanation", "Time complexity analysis"],
      timeLimit: 4
    }
  },
  {
    title: "Binary Search Implementation",
    description: "Implement binary search algorithm",
    problemStatement: "Given a sorted array and a target value, implement binary search to find the index of the target. Return -1 if not found.",
    inputFormat: "First line: array size n and target value. Second line: n sorted integers.",
    outputFormat: "Output the index (0-based) of target, or -1 if not found",
    constraints: "1 ≤ n ≤ 10^5, array elements are distinct and sorted",
    examples: [
      {
        input: "5 7\\n1 3 5 7 9",
        output: "3",
        explanation: "7 is at index 3 in the array"
      }
    ],
    testCases: [
      {
        input: "5 7\\n1 3 5 7 9",
        expectedOutput: "3",
        isHidden: false,
        points: 3
      },
      {
        input: "5 4\\n1 3 5 7 9",
        expectedOutput: "-1",
        isHidden: false,
        points: 2
      }
    ],
    difficulty: "Hard",
    category: "Algorithms",
    tags: ["binary-search", "sorting", "search", "divide-conquer"],
    timeLimit: 3,
    memoryLimit: 256000,
    allowedLanguages: [
      { languageId: 50, languageName: "C" },
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" }
    ],
    points: 150,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{binary_search_master}",
    buildathonProblem: {
      description: "Advanced search algorithm implementation",
      requirements: "Implement efficient binary search with O(log n) complexity",
      deliverables: ["Source code", "Complexity analysis", "Edge case handling"],
      timeLimit: 6
    }
  },
  {
    title: "Graph Traversal Challenge",
    description: "Implement BFS and DFS on a graph",
    problemStatement: "Given an undirected graph represented as an adjacency list, implement both BFS and DFS traversal starting from node 0.",
    inputFormat: "First line: number of nodes n. Next lines: adjacency list representation.",
    outputFormat: "First line: BFS traversal. Second line: DFS traversal.",
    constraints: "1 ≤ n ≤ 1000",
    examples: [
      {
        input: "4\\n0: 1,2\\n1: 0,3\\n2: 0\\n3: 1",
        output: "0 1 2 3\\n0 1 3 2",
        explanation: "BFS and DFS traversals from node 0"
      }
    ],
    testCases: [
      {
        input: "4\\n0: 1,2\\n1: 0,3\\n2: 0\\n3: 1",
        expectedOutput: "0 1 2 3\\n0 1 3 2",
        isHidden: false,
        points: 5
      }
    ],
    difficulty: "Expert",
    category: "Graph Theory",
    tags: ["graph", "bfs", "dfs", "traversal", "advanced"],
    timeLimit: 5,
    memoryLimit: 512000,
    allowedLanguages: [
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" }
    ],
    points: 250,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{graph_traversal_expert}",
    buildathonProblem: {
      description: "Complex graph algorithm implementation",
      requirements: "Implement both BFS and DFS with optimal space and time complexity",
      deliverables: ["Source code", "Algorithm walkthrough", "Performance benchmarks"],
      timeLimit: 8
    }
  },
  {
    title: "Array Rotation",
    description: "Rotate an array to the right by k steps",
    problemStatement: "Given an array and a number k, rotate the array to the right by k steps.",
    inputFormat: "First line: array size n and rotation steps k. Second line: n integers.",
    outputFormat: "Output the rotated array",
    constraints: "1 ≤ n ≤ 10^4, 0 ≤ k ≤ n",
    examples: [
      {
        input: "5 2\\n1 2 3 4 5",
        output: "4 5 1 2 3",
        explanation: "Rotate [1,2,3,4,5] by 2 steps to get [4,5,1,2,3]"
      }
    ],
    testCases: [
      {
        input: "5 2\\n1 2 3 4 5",
        expectedOutput: "4 5 1 2 3",
        isHidden: false,
        points: 2
      }
    ],
    difficulty: "Medium",
    category: "Array Manipulation",
    tags: ["array", "rotation", "manipulation"],
    timeLimit: 2,
    memoryLimit: 128000,
    allowedLanguages: [
      { languageId: 50, languageName: "C" },
      { languageId: 54, languageName: "C++" },
      { languageId: 62, languageName: "Java" },
      { languageId: 71, languageName: "Python" },
      { languageId: 63, languageName: "JavaScript" }
    ],
    points: 100,
    authorId: new mongoose.Types.ObjectId(),
    isActive: true,
    flag: "CTF{array_rotation}",
    buildathonProblem: {
      description: "Array manipulation challenge",
      requirements: "Implement efficient array rotation algorithm",
      deliverables: ["Source code", "Space optimization explanation"],
      timeLimit: 3
    }
  }
];

const seedChallenges = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert new challenges
    const result = await Challenge.insertMany(simpleChallenges);
    console.log(`Successfully seeded ${result.length} challenges!`);

    console.log('Challenges seeded:');
    result.forEach((challenge, index) => {
      console.log(`${index + 1}. ${challenge.title} (${challenge.difficulty}) - ${challenge.points} points`);
    });

  } catch (error) {
    console.error('Error seeding challenges:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
seedChallenges();
