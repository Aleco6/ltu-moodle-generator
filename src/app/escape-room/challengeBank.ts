// Challenge Bank - Coding tasks for the escape room
export interface Task {
  id: string;
  terminalId: number;
  stageNumber: number;
  goal: string;
  starterCode: string;
  solution: string;
  hint: string;
  checkFunction: (code: string) => boolean;
}

// Terminal 1: Syntax Sprint Tasks
export const terminal1Tasks: Task[] = [
  {
    id: 't1_stage1',
    terminalId: 1,
    stageNumber: 1,
    goal: 'Fix the syntax errors in this function',
    starterCode: `function deployFeature() {
  const features = ['login', 'dashboard' 'settings']
  for (let i = 0 i < features.length; i++) {
    console.log("Deploying: " + features[i])
  }
  return true
}

deployFeature()`,
    solution: `function deployFeature() {
  const features = ['login', 'dashboard', 'settings'];
  for (let i = 0; i < features.length; i++) {
    console.log("Deploying: " + features[i]);
  }
  return true;
}

deployFeature();`,
    hint: 'Look for missing commas, semicolons, and comparison operators.',
    checkFunction: (code: string) => {
      return code.includes("'dashboard',") && code.includes("i < features") && code.includes("features[i]);");
    }
  },
  {
    id: 't1_stage2',
    terminalId: 1,
    stageNumber: 2,
    goal: 'Complete the function to calculate the sum of an array',
    starterCode: `function calculateSum(numbers) {
  let total = 0
  // TODO: Add loop to sum all numbers
  return total
}

console.log(calculateSum([1, 2, 3, 4, 5])); // Should return 15`,
    solution: `function calculateSum(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

console.log(calculateSum([1, 2, 3, 4, 5])); // Should return 15`,
    hint: 'Use a for loop to iterate through the array and add each number to total.',
    checkFunction: (code: string) => {
      return code.includes("for") && code.includes("total +=") && code.includes("numbers[i]");
    }
  },
  {
    id: 't1_stage3',
    terminalId: 1,
    stageNumber: 3,
    goal: 'Fix the arrow function syntax',
    starterCode: `const greetUser = (name => {
  return \`Hello, \${name}!\`
}

const processUsers = users => 
  return users.map(u => u.toUpperCase())
}

console.log(greetUser("Alice"));
console.log(processUsers(["bob", "charlie"]));`,
    solution: `const greetUser = (name) => {
  return \`Hello, \${name}!\`;
};

const processUsers = (users) => {
  return users.map(u => u.toUpperCase());
};

console.log(greetUser("Alice"));
console.log(processUsers(["bob", "charlie"]));`,
    hint: 'Check parentheses around parameters and curly braces for function bodies.',
    checkFunction: (code: string) => {
      return code.includes("(name)") && code.includes("(users)") && code.includes("};");
    }
  }
];

// Terminal 2: Transform Test Tasks
export const terminal2Tasks: Task[] = [
  {
    id: 't2_stage1',
    terminalId: 2,
    stageNumber: 1,
    goal: 'Transform user data to group by role',
    starterCode: `const users = [
  { name: "Alice", role: "dev", years: 2 },
  { name: "Bob", role: "designer", years: 3 }
];

// Transform to:
// { devs: ["Alice (2 years)"], designers: ["Bob (3 years)"] }

function transformUsers(users) {
  const result = {};
  // TODO: Write transformation logic
  return result;
}

console.log(transformUsers(users));`,
    solution: `const users = [
  { name: "Alice", role: "dev", years: 2 },
  { name: "Bob", role: "designer", years: 3 }
];

// Transform to:
// { devs: ["Alice (2 years)"], designers: ["Bob (3 years)"] }

function transformUsers(users) {
  const result = {};
  users.forEach(user => {
    const key = user.role + 's';
    if (!result[key]) result[key] = [];
    result[key].push(\`\${user.name} (\${user.years} years)\`);
  });
  return result;
}

console.log(transformUsers(users));`,
    hint: 'Use forEach to iterate and build an object with role-based keys.',
    checkFunction: (code: string) => {
      return code.includes("forEach") && code.includes("user.role + 's'") && code.includes("push");
    }
  },
  {
    id: 't2_stage2',
    terminalId: 2,
    stageNumber: 2,
    goal: 'Filter and map an array of products',
    starterCode: `const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 75, inStock: true }
];

// Get names of in-stock products under $500
function getAffordableInStock(products) {
  // TODO: Filter and map the products
  return [];
}

console.log(getAffordableInStock(products)); // ["Keyboard"]`,
    solution: `const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 75, inStock: true }
];

// Get names of in-stock products under $500
function getAffordableInStock(products) {
  return products
    .filter(p => p.inStock && p.price < 500)
    .map(p => p.name);
}

console.log(getAffordableInStock(products)); // ["Keyboard"]`,
    hint: 'Use filter() to get inStock items under $500, then map() to get names.',
    checkFunction: (code: string) => {
      return code.includes("filter") && code.includes("p.inStock") && code.includes("map");
    }
  },
  {
    id: 't2_stage3',
    terminalId: 2,
    stageNumber: 3,
    goal: 'Reduce an array to calculate totals',
    starterCode: `const orders = [
  { id: 1, amount: 50 },
  { id: 2, amount: 100 },
  { id: 3, amount: 75 }
];

// Calculate total revenue
function calculateRevenue(orders) {
  // TODO: Use reduce to sum amounts
  return 0;
}

console.log(calculateRevenue(orders)); // Should return 225`,
    solution: `const orders = [
  { id: 1, amount: 50 },
  { id: 2, amount: 100 },
  { id: 3, amount: 75 }
];

// Calculate total revenue
function calculateRevenue(orders) {
  return orders.reduce((total, order) => total + order.amount, 0);
}

console.log(calculateRevenue(orders)); // Should return 225`,
    hint: 'Use reduce() with an accumulator starting at 0.',
    checkFunction: (code: string) => {
      return code.includes("reduce") && code.includes("total + order.amount");
    }
  }
];

// Terminal 3: Debug Deploy Tasks  
export const terminal3Tasks: Task[] = [
  {
    id: 't3_stage1',
    terminalId: 3,
    stageNumber: 1,
    goal: 'Fix the comparison operator bug',
    starterCode: `function checkAccess(user) {
  if (user.role = "admin") {
    return "Full access granted";
  } else if (user.active = true) {
    return "Limited access granted";
  }
  return "Access denied";
}

console.log(checkAccess({ role: "user", active: true }));`,
    solution: `function checkAccess(user) {
  if (user.role === "admin") {
    return "Full access granted";
  } else if (user.active === true) {
    return "Limited access granted";
  }
  return "Access denied";
}

console.log(checkAccess({ role: "user", active: true }));`,
    hint: 'Look for assignment operators (=) that should be comparison operators (===).',
    checkFunction: (code: string) => {
      return code.includes('user.role === "admin"') && code.includes('user.active === true');
    }
  },
  {
    id: 't3_stage2',
    terminalId: 3,
    stageNumber: 2,
    goal: 'Fix the scope and variable declaration bug',
    starterCode: `function processData(items) {
  for (let i = 0; i < items.length; i++) {
    let result = items[i] * 2;
  }
  return result; // result is not defined here!
}

console.log(processData([1, 2, 3, 4, 5]));`,
    solution: `function processData(items) {
  let result = [];
  for (let i = 0; i < items.length; i++) {
    result.push(items[i] * 2);
  }
  return result;
}

console.log(processData([1, 2, 3, 4, 5]));`,
    hint: 'Variables declared inside a loop are only accessible within that loop. Consider what you want to return.',
    checkFunction: (code: string) => {
      return code.includes('let result = []') && code.includes('result.push');
    }
  },
  {
    id: 't3_stage3',
    terminalId: 3,
    stageNumber: 3,
    goal: 'Fix the infinite loop bug',
    starterCode: `function countdown(start) {
  let current = start;
  while (current > 0) {
    console.log(current);
    // Missing decrement!
  }
  console.log("Done!");
}

countdown(3);`,
    solution: `function countdown(start) {
  let current = start;
  while (current > 0) {
    console.log(current);
    current--;
  }
  console.log("Done!");
}

countdown(3);`,
    hint: 'The loop condition never changes. What needs to happen to current in each iteration?',
    checkFunction: (code: string) => {
      return code.includes('current--') || code.includes('current -= 1') || code.includes('current = current - 1');
    }
  }
];

// Difficulty-based task selection
type Difficulty = 'easy' | 'medium' | 'hard';

export function getTasksForDifficulty(difficulty: Difficulty) {
  const allTasks = {
    1: terminal1Tasks,
    2: terminal2Tasks,
    3: terminal3Tasks
  };

  if (difficulty === 'easy') {
    // 1 task per terminal
    return {
      1: [terminal1Tasks[0]],
      2: [terminal2Tasks[0]],
      3: [terminal3Tasks[0]]
    };
  } else if (difficulty === 'medium') {
    // 2 tasks per terminal
    return {
      1: terminal1Tasks.slice(0, 2),
      2: terminal2Tasks.slice(0, 2),
      3: terminal3Tasks.slice(0, 2)
    };
  } else {
    // 3 tasks per terminal (all)
    return allTasks;
  }
}