import { PracticeProblem } from '../types';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-two-sum',
    title: 'Two Sum in Sorted or Unsorted Array',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    points: 40,
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    tags: ['Arrays', 'Hash Map', 'Two Pointers'],
    isProblemOfTheDay: true,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices \`[i, j]\` of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice. Return the answer with the smaller index first.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6.'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.'
    ],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    functionName: 'twoSum',
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Store seen numbers and their indices in a hash map
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }
    seen[nums[i]] = i;
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`
    },
    solutionCode: {
      javascript: `function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }
    seen[nums[i]] = i;
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`
    },
    hints: [
      'A brute-force approach checks every pair (i, j) in O(N^2) time.',
      'Can you look up the complement (target - nums[i]) in O(1) time using a Hash Map / Dictionary?'
    ],
    testCases: [
      { id: 'tc-1', inputDisplay: 'nums = [2, 7, 11, 15], target = 9', args: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
      { id: 'tc-2', inputDisplay: 'nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expectedOutput: [1, 2] },
      { id: 'tc-3', inputDisplay: 'nums = [3, 3], target = 6', args: [[3, 3], 6], expectedOutput: [0, 1] },
      { id: 'tc-4', inputDisplay: 'nums = [1, 5, 8, 12], target = 17', args: [[1, 5, 8, 12], 17], expectedOutput: [1, 3] }
    ]
  },
  {
    id: 'prob-binary-search',
    title: 'Binary Search in Sorted Array',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Searching & Sorting',
    points: 30,
    companies: ['Amazon', 'Microsoft', 'TCS', 'Flipkart'],
    tags: ['Binary Search', 'Arrays', 'Divide and Conquer'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function \`binarySearch(nums, target)\` to search for \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      'All integers in nums are unique and sorted in ascending order.'
    ],
    expectedTimeComplexity: 'O(log N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'binarySearch',
    starterCode: {
      javascript: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      python: `def binarySearch(nums, target):
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
    },
    solutionCode: {
      javascript: `function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      python: `def binarySearch(nums, target):
    low = 0
    high = len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
    },
    hints: [
      'Compare target with the middle element of the remaining search range [low, high].',
      'If nums[mid] < target, discard the left half by setting low = mid + 1.'
    ],
    testCases: [
      { id: 'bs-1', inputDisplay: 'nums = [-1,0,3,5,9,12], target = 9', args: [[-1, 0, 3, 5, 9, 12], 9], expectedOutput: 4 },
      { id: 'bs-2', inputDisplay: 'nums = [-1,0,3,5,9,12], target = 2', args: [[-1, 0, 3, 5, 9, 12], 2], expectedOutput: -1 },
      { id: 'bs-3', inputDisplay: 'nums = [5], target = 5', args: [[5], 5], expectedOutput: 0 }
    ]
  },
  {
    id: 'prob-kadane',
    title: "Kadane's Algorithm: Maximum Subarray Sum",
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming & Greedy',
    points: 60,
    companies: ['Google', 'Amazon', 'LinkedIn', 'Apple'],
    tags: ['Arrays', 'Dynamic Programming', 'Kadane Algorithm'],
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

This is a classic Code It Out and FAANG interview problem solved optimally in a single pass using **Kadane's Algorithm**.`,
    examples: [
      {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.'
      },
      {
        input: 'nums = [5, 4, -1, 7, 8]',
        output: '23',
        explanation: 'The subarray [5, 4, -1, 7, 8] has the largest sum 23.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'maxSubArray',
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}`,
      python: `def maxSubArray(nums):
    currentMax = nums[0]
    globalMax = nums[0]
    for i in range(1, len(nums)):
        currentMax = max(nums[i], currentMax + nums[i])
        globalMax = max(globalMax, currentMax)
    return globalMax`
    },
    solutionCode: {
      javascript: `function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}`,
      python: `def maxSubArray(nums):
    currentMax = nums[0]
    globalMax = nums[0]
    for i in range(1, len(nums)):
        currentMax = max(nums[i], currentMax + nums[i])
        globalMax = max(globalMax, currentMax)
    return globalMax`
    },
    hints: [
      'At each index i, decide whether to extend the previous subarray sum or start fresh at nums[i].',
      'Maintain currentMax = max(nums[i], currentMax + nums[i]) and update globalMax.'
    ],
    testCases: [
      { id: 'kd-1', inputDisplay: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expectedOutput: 6 },
      { id: 'kd-2', inputDisplay: 'nums = [5,4,-1,7,8]', args: [[5, 4, -1, 7, 8]], expectedOutput: 23 },
      { id: 'kd-3', inputDisplay: 'nums = [-5, -2, -9]', args: [[-5, -2, -9]], expectedOutput: -2 }
    ]
  },
  {
    id: 'prob-valid-brackets',
    title: 'Parenthesis Checker (Balanced Brackets)',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    points: 40,
    companies: ['Amazon', 'Adobe', 'Oracle', 'Goldman Sachs'],
    tags: ['Stack', 'Strings'],
    description: `Given an expression string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string has balanced brackets.

An input string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct LIFO order.`,
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Every opening bracket is matched in order.'
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: 'The square bracket closes before the inner parenthesis.'
      }
    ],
    constraints: ['1 <= s.length <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    functionName: 'isValidParentheses',
    starterCode: {
      javascript: `function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      python: `def isValidParentheses(s):
    stack = []
    for ch in s:
        if ch == '(' or ch == '{' or ch == '[':
            stack.append(ch)
        else:
            if len(stack) == 0:
                return False
            top = stack.pop()
            if ch == ')' and top != '(':
                return False
            if ch == '}' and top != '{':
                return False
            if ch == ']' and top != '[':
                return False
    return len(stack) == 0`
    },
    solutionCode: {
      javascript: `function isValidParentheses(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      python: `def isValidParentheses(s):
    stack = []
    for ch in s:
        if ch == '(' or ch == '{' or ch == '[':
            stack.append(ch)
        else:
            if len(stack) == 0:
                return False
            top = stack.pop()
            if ch == ')' and top != '(':
                return False
            if ch == '}' and top != '{':
                return False
            if ch == ']' and top != '[':
                return False
    return len(stack) == 0`
    },
    hints: [
      'Use a LIFO Stack data structure.',
      'Push opening brackets onto the stack; when encountering a closing bracket, check the top of the stack.'
    ],
    testCases: [
      { id: 'vp-1', inputDisplay: 's = "()[]{}"', args: ['()[]{}'], expectedOutput: true },
      { id: 'vp-2', inputDisplay: 's = "([)]"', args: ['([)]'], expectedOutput: false },
      { id: 'vp-3', inputDisplay: 's = "{[]}"', args: ['{[]}'], expectedOutput: true }
    ]
  },
  {
    id: 'prob-climbing-stairs',
    title: 'Count Ways to Reach the Nth Stair (DP)',
    slug: 'climbing-stairs',
    difficulty: 'Medium',
    category: 'Dynamic Programming & Greedy',
    points: 50,
    companies: ['Amazon', 'Morgan Stanley', 'Flipkart', 'Uber'],
    tags: ['Dynamic Programming', 'Fibonacci', 'Memoization'],
    description: `There are \`n\` stairs, and a person standing at the bottom wants to reach the top. The person can climb either **1 stair** or **2 stairs** at a time. Count the number of distinct ways the person can reach the top (\`n\`-th stair).`,
    examples: [
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Three ways: (1+1+1), (1+2), and (2+1).'
      },
      {
        input: 'n = 5',
        output: '8',
        explanation: '8 distinct combinations to reach step 5.'
      }
    ],
    constraints: ['1 <= n <= 45'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'climbStairs',
    starterCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
      python: `def climbStairs(n):
    if n <= 2:
        return n
    prev2 = 1
    prev1 = 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1`
    },
    solutionCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
      python: `def climbStairs(n):
    if n <= 2:
        return n
    prev2 = 1
    prev1 = 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1`
    },
    hints: [
      'To reach step i, you could only have come from step (i - 1) or step (i - 2).',
      'Therefore ways(n) = ways(n - 1) + ways(n - 2).'
    ],
    testCases: [
      { id: 'cs-1', inputDisplay: 'n = 2', args: [2], expectedOutput: 2 },
      { id: 'cs-2', inputDisplay: 'n = 3', args: [3], expectedOutput: 3 },
      { id: 'cs-3', inputDisplay: 'n = 5', args: [5], expectedOutput: 8 },
      { id: 'cs-4', inputDisplay: 'n = 10', args: [10], expectedOutput: 89 }
    ]
  },
  {
    id: 'prob-trapping-rain',
    title: 'Trapping Rain Water (Two Pointers)',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Arrays & Hashing',
    points: 100,
    companies: ['Google', 'Goldman Sachs', 'Amazon', 'DE Shaw'],
    tags: ['Two Pointers', 'Arrays', 'Dynamic Programming'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water between bars.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: '9 units of water are trapped between bar 4 and bar 5.'
      }
    ],
    constraints: ['1 <= height.length <= 2 * 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'trapRainWater',
    starterCode: {
      javascript: `function trapRainWater(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      python: `def trapRainWater(height):
    left = 0
    right = len(height) - 1
    leftMax = 0
    rightMax = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= leftMax:
                leftMax = height[left]
            else:
                water = water + (leftMax - height[left])
            left = left + 1
        else:
            if height[right] >= rightMax:
                rightMax = height[right]
            else:
                water = water + (rightMax - height[right])
            right = right - 1
    return water`
    },
    solutionCode: {
      javascript: `function trapRainWater(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      python: `def trapRainWater(height):
    left = 0
    right = len(height) - 1
    leftMax = 0
    rightMax = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= leftMax:
                leftMax = height[left]
            else:
                water = water + (leftMax - height[left])
            left = left + 1
        else:
            if height[right] >= rightMax:
                rightMax = height[right]
            else:
                water = water + (rightMax - height[right])
            right = right - 1
    return water`
    },
    hints: [
      'Water trapped above index i is min(maxLeft, maxRight) - height[i].',
      'Use two pointers (left and right) moving inward from whichever side has the smaller boundary.'
    ],
    testCases: [
      { id: 'tr-1', inputDisplay: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expectedOutput: 6 },
      { id: 'tr-2', inputDisplay: 'height = [4,2,0,3,2,5]', args: [[4, 2, 0, 3, 2, 5]], expectedOutput: 9 },
      { id: 'tr-3', inputDisplay: 'height = [2,0,2]', args: [[2, 0, 2]], expectedOutput: 2 }
    ]
  },
  {
    id: 'prob-reverse-string',
    title: 'Reverse a String (Student Warmup)',
    slug: 'reverse-string',
    difficulty: 'Easy',
    category: 'Strings & Basics',
    points: 25,
    companies: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
    tags: ['Strings', 'Two Pointers', 'Beginner'],
    description: `Given a string \`s\`, return a new string with the characters of \`s\` in reverse order.

This is a great first problem to test the Automated Judge in JavaScript or Python!`,
    examples: [
      { input: 's = "hello"', output: '"olleh"', explanation: 'Characters reversed from right to left.' },
      { input: 's = "CodeItOut"', output: '"tuOtIedoC"' }
    ],
    constraints: ['1 <= s.length <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    functionName: 'reverseString',
    starterCode: {
      javascript: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
      python: `def reverseString(s):
    return s[::-1]`
    },
    solutionCode: {
      javascript: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
      python: `def reverseString(s):
    return s[::-1]`
    },
    hints: ['In JS, split(""), reverse(), and join(""). In Python, use slice s[::-1].'],
    testCases: [
      { id: 'rs-1', inputDisplay: 's = "hello"', args: ['hello'], expectedOutput: 'olleh' },
      { id: 'rs-2', inputDisplay: 's = "CodeItOut"', args: ['CodeItOut'], expectedOutput: 'tuOtIedoC' },
      { id: 'rs-3', inputDisplay: 's = "abcde"', args: ['abcde'], expectedOutput: 'edcba' }
    ]
  },
  {
    id: 'prob-palindrome',
    title: 'Check if String is Palindrome',
    slug: 'palindrome-check',
    difficulty: 'Easy',
    category: 'Strings & Basics',
    points: 30,
    companies: ['Amazon', 'Microsoft', 'Accenture'],
    tags: ['Strings', 'Two Pointers'],
    description: `Given a lowercase string \`s\`, return \`true\` if it reads the same forward and backward (a **palindrome**), or \`false\` otherwise.`,
    examples: [
      { input: 's = "racecar"', output: 'true', explanation: 'racecar reversed is racecar.' },
      { input: 's = "coding"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^5'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'isPalindrome',
    starterCode: {
      javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}`,
      python: `def isPalindrome(s):
    return s == s[::-1]`
    },
    solutionCode: {
      javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}`,
      python: `def isPalindrome(s):
    return s == s[::-1]`
    },
    hints: ['Compare characters from both ends moving inward with two pointers.'],
    testCases: [
      { id: 'pal-1', inputDisplay: 's = "racecar"', args: ['racecar'], expectedOutput: true },
      { id: 'pal-2', inputDisplay: 's = "madam"', args: ['madam'], expectedOutput: true },
      { id: 'pal-3', inputDisplay: 's = "coding"', args: ['coding'], expectedOutput: false }
    ]
  },
  {
    id: 'prob-missing-number',
    title: 'Find Missing Number in Range [0..N]',
    slug: 'missing-number',
    difficulty: 'Easy',
    category: 'Arrays & Math',
    points: 35,
    companies: ['Amazon', 'Microsoft', 'Apple', 'Nvidia'],
    tags: ['Arrays', 'Math', 'Bit Manipulation'],
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

Use Gauss's sum formula \`n * (n + 1) / 2\` to solve it in \`O(N)\` time and \`O(1)\` extra space!`,
    examples: [
      { input: 'nums = [3, 0, 1]', output: '2', explanation: 'n = 3 since there are 3 numbers, so all numbers are in [0,3]. 2 is missing.' },
      { input: 'nums = [0, 1]', output: '2' }
    ],
    constraints: ['1 <= nums.length <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'missingNumber',
    starterCode: {
      javascript: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
      python: `def missingNumber(nums):
    n = len(nums)
    expected = (n * (n + 1)) // 2
    actual = 0
    for x in nums:
        actual = actual + x
    return expected - actual`
    },
    solutionCode: {
      javascript: `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
      python: `def missingNumber(nums):
    n = len(nums)
    expected = (n * (n + 1)) // 2
    actual = 0
    for x in nums:
        actual = actual + x
    return expected - actual`
    },
    hints: ['The sum of numbers from 0 to n is n * (n + 1) / 2. Subtract the sum of the array!'],
    testCases: [
      { id: 'mn-1', inputDisplay: 'nums = [3, 0, 1]', args: [[3, 0, 1]], expectedOutput: 2 },
      { id: 'mn-2', inputDisplay: 'nums = [0, 1]', args: [[0, 1]], expectedOutput: 2 },
      { id: 'mn-3', inputDisplay: 'nums = [9,6,4,2,3,5,7,0,1]', args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expectedOutput: 8 }
    ]
  },
  {
    id: 'prob-move-zeroes',
    title: 'Move All Zeroes to End of Array',
    slug: 'move-zeroes',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    points: 35,
    companies: ['Meta', 'Bloomberg', 'Amazon'],
    tags: ['Two Pointers', 'Arrays'],
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements, and return the resulting array.`,
    examples: [
      { input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' },
      { input: 'nums = [0]', output: '[0]' }
    ],
    constraints: ['1 <= nums.length <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'moveZeroes',
    starterCode: {
      javascript: `function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      const temp = nums[insertPos];
      nums[insertPos] = nums[i];
      nums[i] = temp;
      insertPos++;
    }
  }
  return nums;
}`,
      python: `def moveZeroes(nums):
    non_zero = []
    zero_count = 0
    for x in nums:
        if x != 0:
            non_zero.append(x)
        else:
            zero_count = zero_count + 1
    for i in range(zero_count):
        non_zero.append(0)
    return non_zero`
    },
    solutionCode: {
      javascript: `function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      const temp = nums[insertPos];
      nums[insertPos] = nums[i];
      nums[i] = temp;
      insertPos++;
    }
  }
  return nums;
}`,
      python: `def moveZeroes(nums):
    non_zero = []
    zero_count = 0
    for x in nums:
        if x != 0:
            non_zero.append(x)
        else:
            zero_count = zero_count + 1
    for i in range(zero_count):
        non_zero.append(0)
    return non_zero`
    },
    hints: ['Keep a pointer insertPos for the next non-zero element and swap as you scan.'],
    testCases: [
      { id: 'mz-1', inputDisplay: 'nums = [0, 1, 0, 3, 12]', args: [[0, 1, 0, 3, 12]], expectedOutput: [1, 3, 12, 0, 0] },
      { id: 'mz-2', inputDisplay: 'nums = [0, 0, 5]', args: [[0, 0, 5]], expectedOutput: [5, 0, 0] }
    ]
  },
  {
    id: 'prob-max-water',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    points: 60,
    companies: ['Google', 'Amazon', 'Adobe', 'Flipkart'],
    tags: ['Two Pointers', 'Greedy', 'Arrays'],
    description: `You are given an integer array \`height\` of length \`n\`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) have width 7 -> min(8,7) * 7 = 49.' },
      { input: 'height = [1,1]', output: '1' }
    ],
    constraints: ['2 <= height.length <= 10^5'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'maxArea',
    starterCode: {
      javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    if (area > best) best = area;
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
      python: `def maxArea(height):
    l = 0
    r = len(height) - 1
    best = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        if area > best:
            best = area
        if height[l] < height[r]:
            l = l + 1
        else:
            r = r - 1
    return best`
    },
    solutionCode: {
      javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    if (area > best) best = area;
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`,
      python: `def maxArea(height):
    l = 0
    r = len(height) - 1
    best = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        if area > best:
            best = area
        if height[l] < height[r]:
            l = l + 1
        else:
            r = r - 1
    return best`
    },
    hints: ['Start with widest container (l = 0, r = n - 1) and always move the shorter line inward.'],
    testCases: [
      { id: 'cw-1', inputDisplay: 'height = [1,8,6,2,5,4,8,3,7]', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expectedOutput: 49 },
      { id: 'cw-2', inputDisplay: 'height = [1,1]', args: [[1, 1]], expectedOutput: 1 },
      { id: 'cw-3', inputDisplay: 'height = [4,3,2,1,4]', args: [[4, 3, 2, 1, 4]], expectedOutput: 16 }
    ]
  },
  {
    id: 'prob-longest-prefix',
    title: 'Longest Common Prefix in String Array',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    category: 'Strings & Basics',
    points: 35,
    companies: ['Google', 'Amazon', 'Apple'],
    tags: ['Strings', 'Arrays'],
    description: `Write a function \`longestCommonPrefix(strs)\` to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \`""\`.`,
    examples: [
      { input: 'strs = ["flower", "flow", "flight"]', output: '"fl"' },
      { input: 'strs = ["dog", "racecar", "car"]', output: '""' }
    ],
    constraints: ['1 <= strs.length <= 200'],
    expectedTimeComplexity: 'O(S)',
    expectedSpaceComplexity: 'O(1)',
    functionName: 'longestCommonPrefix',
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
      python: `def longestCommonPrefix(strs):
    if len(strs) == 0:
        return ""
    first = strs[0]
    res = ""
    for i in range(len(first)):
        ch = first[i]
        for s in strs:
            if i >= len(s) or s[i] != ch:
                return res
        res = res + ch
    return res`
    },
    solutionCode: {
      javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
      python: `def longestCommonPrefix(strs):
    if len(strs) == 0:
        return ""
    first = strs[0]
    res = ""
    for i in range(len(first)):
        ch = first[i]
        for s in strs:
            if i >= len(s) or s[i] != ch:
                return res
        res = res + ch
    return res`
    },
    hints: ['Compare characters column by column across all strings until a mismatch is found.'],
    testCases: [
      { id: 'lcp-1', inputDisplay: 'strs = ["flower","flow","flight"]', args: [['flower', 'flow', 'flight']], expectedOutput: 'fl' },
      { id: 'lcp-2', inputDisplay: 'strs = ["dog","racecar","car"]', args: [['dog', 'racecar', 'car']], expectedOutput: '' },
      { id: 'lcp-3', inputDisplay: 'strs = ["interview","internet","internal"]', args: [['interview', 'internet', 'internal']], expectedOutput: 'inter' }
    ]
  }
];

