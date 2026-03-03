import { PrismaClient, TaskType, Difficulty, Level } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.submission.deleteMany()
  await prisma.dailyTask.deleteMany()
  await prisma.dailyMission.deleteMany()
  await prisma.taskOption.deleteMany()
  await prisma.task.deleteMany()
  await prisma.module.deleteMany()
  await prisma.track.deleteMany()
  await prisma.badge.deleteMany()

  console.log('✅ Cleared existing data')

  // Create badges
  const badges = await createBadges()
  console.log(`✅ Created ${badges.length} badges`)

  // Create tracks with modules and tasks
  const pythonTrack = await createPythonTrack()
  console.log(`✅ Created Python track with ${pythonTrack.moduleCount} modules and ${pythonTrack.taskCount} tasks`)

  const jsTrack = await createJavaScriptTrack()
  console.log(`✅ Created JavaScript track with ${jsTrack.moduleCount} modules and ${jsTrack.taskCount} tasks`)

  const tsTrack = await createTypeScriptTrack()
  console.log(`✅ Created TypeScript track with ${tsTrack.moduleCount} modules and ${tsTrack.taskCount} tasks`)

  const playwrightTrack = await createPlaywrightTrack()
  console.log(`✅ Created Playwright track with ${playwrightTrack.moduleCount} modules and ${playwrightTrack.taskCount} tasks`)

  const gitTrack = await createGitTrack()
  console.log(`✅ Created Git track with ${gitTrack.moduleCount} modules and ${gitTrack.taskCount} tasks`)

  const jenkinsTrack = await createJenkinsTrack()
  console.log(`✅ Created Jenkins track with ${jenkinsTrack.moduleCount} modules and ${jenkinsTrack.taskCount} tasks`)

  const cicdTrack = await createCICDTrack()
  console.log(`✅ Created CI/CD track with ${cicdTrack.moduleCount} modules and ${cicdTrack.taskCount} tasks`)

  console.log('🎉 Seed completed successfully!')
}

async function createBadges() {
  const badgeData = [
    {
      slug: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: 'Flame',
      color: 'from-orange-400 to-red-500',
      requirementType: 'STREAK_DAYS' as const,
      requirementValue: 7,
    },
    {
      slug: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day learning streak',
      icon: 'Crown',
      color: 'from-yellow-400 to-amber-500',
      requirementType: 'STREAK_DAYS' as const,
      requirementValue: 30,
    },
    {
      slug: 'tasks-100',
      name: 'Centurion',
      description: 'Complete 100 tasks',
      icon: 'Target',
      color: 'from-blue-400 to-indigo-500',
      requirementType: 'TASKS_COMPLETED' as const,
      requirementValue: 100,
    },
    {
      slug: 'tasks-500',
      name: 'Task Master',
      description: 'Complete 500 tasks',
      icon: 'Trophy',
      color: 'from-violet-400 to-purple-500',
      requirementType: 'TASKS_COMPLETED' as const,
      requirementValue: 500,
    },
    {
      slug: 'first-track',
      name: 'Track Starter',
      description: 'Complete your first learning track',
      icon: 'Flag',
      color: 'from-green-400 to-emerald-500',
      requirementType: 'TRACK_COMPLETED' as const,
      requirementValue: 1,
    },
    {
      slug: 'xp-1000',
      name: 'Rising Star',
      description: 'Earn 1,000 XP',
      icon: 'Star',
      color: 'from-pink-400 to-rose-500',
      requirementType: 'TOTAL_XP' as const,
      requirementValue: 1000,
    },
  ]

  return await prisma.badge.createMany({ data: badgeData })
}

async function createTrackWithModules(
  slug: string,
  name: string,
  description: string,
  color: string,
  modules: { name: string; description: string; tasks: any[] }[]
) {
  const track = await prisma.track.create({
    data: {
      slug,
      name,
      description,
      color,
      icon: 'BookOpen',
      isPublished: true,
    },
  })

  let totalTasks = 0

  for (let i = 0; i < modules.length; i++) {
    const moduleData = modules[i]
    const module = await prisma.module.create({
      data: {
        trackId: track.id,
        slug: `${slug}-module-${i + 1}`,
        name: moduleData.name,
        description: moduleData.description,
        order: i,
        isPublished: true,
      },
    })

    for (const taskData of moduleData.tasks) {
      const task = await prisma.task.create({
        data: {
          trackId: track.id,
          moduleId: module.id,
          type: taskData.type,
          difficulty: taskData.difficulty,
          title: taskData.title,
          prompt: taskData.prompt,
          codeSnippet: taskData.codeSnippet,
          estimatedMinutes: taskData.estimatedMinutes,
          tags: taskData.tags,
          expectedAnswer: taskData.expectedAnswer,
          explanation: taskData.explanation,
          hint: taskData.hint,
          commonMistakes: taskData.commonMistakes,
          isPublished: true,
        },
      })

      if (taskData.options) {
        await prisma.taskOption.createMany({
          data: taskData.options.map((opt: any) => ({
            taskId: task.id,
            optionId: opt.optionId,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })
      }

      totalTasks++
    }
  }

  return { moduleCount: modules.length, taskCount: totalTasks }
}

async function createPythonTrack() {
  return createTrackWithModules(
    'python-for-testers',
    'Python for Testers',
    'Learn Python programming specifically for test automation and scripting',
    '#3b82f6',
    [
      {
        name: 'Python Basics',
        description: 'Variables, data types, and basic operations',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Python Variable Naming',
            prompt: 'Which of the following is a valid Python variable name?',
            estimatedMinutes: 2,
            tags: ['python', 'variables', 'basics'],
            expectedAnswer: 'B',
            explanation: 'In Python, variable names can contain letters, numbers, and underscores, but cannot start with a number. `test_count` follows all Python naming conventions.',
            hint: 'Variable names cannot start with a number or contain special characters except underscore.',
            commonMistakes: '2nd_test starts with a number (invalid), test-count contains hyphen (invalid), test name contains space (invalid)',
            options: [
              { optionId: 'A', text: '2nd_test', isCorrect: false },
              { optionId: 'B', text: 'test_count', isCorrect: true },
              { optionId: 'C', text: 'test-count', isCorrect: false },
              { optionId: 'D', text: 'test name', isCorrect: false },
            ],
          },
          {
            type: TaskType.FILL_IN_BLANK,
            difficulty: Difficulty.EASY,
            title: 'Print Statement',
            prompt: 'Fill in the blank to print "Hello World" in Python 3:\n\n_____("Hello World")',
            estimatedMinutes: 1,
            tags: ['python', 'print', 'output'],
            expectedAnswer: 'print',
            explanation: 'The print() function is used to output text to the console in Python 3.',
            hint: 'This built-in function outputs text to the screen.',
          },
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.MEDIUM,
            title: 'Variable Assignment',
            prompt: 'Complete the code to calculate the area of a rectangle:',
            codeSnippet: `width = 10
height = 5
area = ________
print(f"Area: {area}")`,
            estimatedMinutes: 3,
            tags: ['python', 'variables', 'math'],
            expectedAnswer: 'width * height',
            explanation: 'To calculate the area of a rectangle, multiply width by height.',
            hint: 'Use the variables width and height with the multiplication operator.',
          },
        ],
      },
      {
        name: 'Control Flow',
        description: 'If statements, loops, and conditional logic',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.MEDIUM,
            title: 'For Loop Range',
            prompt: 'What will `list(range(3))` produce?',
            estimatedMinutes: 2,
            tags: ['python', 'loops', 'range'],
            expectedAnswer: 'B',
            explanation: 'range(3) generates numbers from 0 to 2 (3 is exclusive). So the result is [0, 1, 2].',
            options: [
              { optionId: 'A', text: '[1, 2, 3]', isCorrect: false },
              { optionId: 'B', text: '[0, 1, 2]', isCorrect: true },
              { optionId: 'C', text: '[0, 1, 2, 3]', isCorrect: false },
              { optionId: 'D', text: '[3]', isCorrect: false },
            ],
          },
          {
            type: TaskType.TRUE_FALSE,
            difficulty: Difficulty.EASY,
            title: 'Indentation Matters',
            prompt: 'True or False: In Python, indentation is required and affects code execution.',
            estimatedMinutes: 1,
            tags: ['python', 'syntax', 'indentation'],
            expectedAnswer: 'True',
            explanation: 'Python uses indentation to define code blocks. Unlike other languages that use braces, Python relies on consistent indentation.',
          },
        ],
      },
      {
        name: 'Functions & File Handling',
        description: 'Creating functions and working with files',
        tasks: [
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.MEDIUM,
            title: 'Function Definition',
            prompt: 'Complete the function to check if a test passed:',
            codeSnippet: `def check_test_status(actual, expected):
    if actual == expected:
        return ________
    else:
        return "FAILED"`,
            estimatedMinutes: 3,
            tags: ['python', 'functions', 'testing'],
            expectedAnswer: '"PASSED"',
            explanation: 'When actual equals expected, the test should return "PASSED".',
            hint: 'Return the string that indicates test success.',
          },
          {
            type: TaskType.SCENARIO_BASED,
            difficulty: Difficulty.HARD,
            title: 'Read Test Results File',
            prompt: 'You have a file "results.txt" with one test result per line (PASS or FAIL). Write code to count how many tests passed.',
            estimatedMinutes: 5,
            tags: ['python', 'file-handling', 'testing'],
            expectedAnswer: 'with open|pass_count|count+=1',
            explanation: 'Use `with open("results.txt", "r") as f:` to open the file, then iterate through lines counting "PASS" occurrences.',
            hint: 'Use a with statement to open the file, and count lines containing "PASS".',
          },
        ],
      },
    ]
  )
}

async function createJavaScriptTrack() {
  return createTrackWithModules(
    'javascript-fundamentals',
    'JavaScript Fundamentals',
    'Master JavaScript basics for web testing and automation',
    '#eab308',
    [
      {
        name: 'JS Basics',
        description: 'Variables, types, and operators',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Variable Declaration',
            prompt: 'Which keyword declares a variable that cannot be reassigned?',
            estimatedMinutes: 2,
            tags: ['javascript', 'variables', 'const'],
            expectedAnswer: 'C',
            explanation: 'The `const` keyword declares a constant variable that cannot be reassigned. `let` allows reassignment, and `var` is the older way.',
            options: [
              { optionId: 'A', text: 'var', isCorrect: false },
              { optionId: 'B', text: 'let', isCorrect: false },
              { optionId: 'C', text: 'const', isCorrect: true },
              { optionId: 'D', text: 'static', isCorrect: false },
            ],
          },
          {
            type: TaskType.OUTPUT_PREDICTION,
            difficulty: Difficulty.MEDIUM,
            title: 'Type Coercion',
            prompt: 'What is the output of: console.log("5" + 3)',
            estimatedMinutes: 2,
            tags: ['javascript', 'types', 'coercion'],
            expectedAnswer: '53',
            explanation: 'The + operator with a string causes concatenation. "5" + 3 becomes "5" + "3" = "53".',
            hint: 'When adding a string and a number, JavaScript converts the number to a string.',
          },
        ],
      },
      {
        name: 'Arrays & Objects',
        description: 'Working with complex data structures',
        tasks: [
          {
            type: TaskType.FILL_IN_BLANK,
            difficulty: Difficulty.EASY,
            title: 'Array Length',
            prompt: 'Fill in to get the number of elements in the array:\n\nconst tests = ["login", "signup", "checkout"];\nconst count = tests.________;',
            estimatedMinutes: 1,
            tags: ['javascript', 'arrays', 'properties'],
            expectedAnswer: 'length',
            explanation: 'The length property returns the number of elements in an array.',
            hint: 'It is a property, not a method (no parentheses needed).',
          },
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.MEDIUM,
            title: 'Array Method',
            prompt: 'Complete the code to check if all tests passed:',
            codeSnippet: `const results = [true, true, false, true];
const allPassed = results.________(result => result === true);`,
            estimatedMinutes: 3,
            tags: ['javascript', 'arrays', 'methods'],
            expectedAnswer: 'every',
            explanation: 'The every() method tests whether all elements pass the test. Returns true only if all elements satisfy the condition.',
            hint: 'This method returns true if ALL elements match the condition.',
          },
        ],
      },
    ]
  )
}

async function createTypeScriptTrack() {
  return createTrackWithModules(
    'typescript-fundamentals',
    'TypeScript Fundamentals',
    'Add type safety to your JavaScript code',
    '#2563eb',
    [
      {
        name: 'Type Basics',
        description: 'Types, interfaces, and type annotations',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Type Annotation',
            prompt: 'What is the correct way to type a string variable in TypeScript?',
            estimatedMinutes: 1,
            tags: ['typescript', 'types', 'syntax'],
            expectedAnswer: 'A',
            explanation: 'TypeScript uses colon (:) followed by the type for type annotations.',
            options: [
              { optionId: 'A', text: 'let name: string', isCorrect: true },
              { optionId: 'B', text: 'let string name', isCorrect: false },
              { optionId: 'C', text: 'let name = string', isCorrect: false },
              { optionId: 'D', text: 'string name', isCorrect: false },
            ],
          },
          {
            type: TaskType.FILL_IN_BLANK,
            difficulty: Difficulty.MEDIUM,
            title: 'Interface Definition',
            prompt: 'Complete the interface for a TestCase:\n\ninterface TestCase {\n  id: ________;\n  name: string;\n  status: "pass" | "fail";\n}',
            estimatedMinutes: 2,
            tags: ['typescript', 'interfaces', 'types'],
            expectedAnswer: 'string',
            explanation: 'The id property should be typed as string for a typical test case identifier.',
            hint: 'What type would you use for an identifier field?',
          },
        ],
      },
    ]
  )
}

async function createPlaywrightTrack() {
  return createTrackWithModules(
    'playwright-automation',
    'Playwright Automation',
    'Modern browser automation with Playwright',
    '#22c55e',
    [
      {
        name: 'Getting Started',
        description: 'Installation, setup, and basic locators',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Best Locator Strategy',
            prompt: 'Which locator strategy is recommended by Playwright for stability?',
            estimatedMinutes: 2,
            tags: ['playwright', 'locators', 'best-practices'],
            expectedAnswer: 'C',
            explanation: 'User-facing locators like getByRole, getByText, or getByLabel are most stable as they reflect how users interact with the page.',
            options: [
              { optionId: 'A', text: 'CSS selectors', isCorrect: false },
              { optionId: 'B', text: 'XPath expressions', isCorrect: false },
              { optionId: 'C', text: 'User-facing locators (getByRole, getByText)', isCorrect: true },
              { optionId: 'D', text: 'Element IDs', isCorrect: false },
            ],
          },
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.EASY,
            title: 'Basic Navigation',
            prompt: 'Complete the code to navigate to a URL:',
            codeSnippet: `import { test } from '@playwright/test';

test('navigate to app', async ({ page }) => {
  await page.________('https://example.com');
});`,
            estimatedMinutes: 2,
            tags: ['playwright', 'navigation', 'page'],
            expectedAnswer: 'goto',
            explanation: 'The page.goto() method navigates to a URL and waits for the page to load.',
            hint: 'Think of the method name as "go to this URL".',
          },
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.MEDIUM,
            title: 'Click Action',
            prompt: 'Complete the code to click a button by its text:',
            codeSnippet: `import { test } from '@playwright/test';

test('click submit', async ({ page }) => {
  await page.________('Submit').click();
});`,
            estimatedMinutes: 2,
            tags: ['playwright', 'actions', 'click'],
            expectedAnswer: 'getByText',
            explanation: 'getByText() finds an element by its visible text content, which is a user-facing locator.',
            hint: 'Use the method that finds elements by their visible text.',
          },
        ],
      },
      {
        name: 'Assertions & Waits',
        description: 'Validating page state and handling async operations',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.MEDIUM,
            title: 'Auto-waiting',
            prompt: 'What happens when Playwright performs an action like click()?',
            estimatedMinutes: 2,
            tags: ['playwright', 'waits', 'actions'],
            expectedAnswer: 'B',
            explanation: 'Playwright automatically waits for elements to be actionable (visible, enabled, not moving) before performing actions.',
            options: [
              { optionId: 'A', text: 'It fails immediately if element is not ready', isCorrect: false },
              { optionId: 'B', text: 'It auto-waits for the element to be actionable', isCorrect: true },
              { optionId: 'C', text: 'It skips the action if element is not ready', isCorrect: false },
              { optionId: 'D', text: 'You must manually add sleep before each action', isCorrect: false },
            ],
          },
          {
            type: TaskType.CODE_COMPLETION,
            difficulty: Difficulty.MEDIUM,
            title: 'Assertion',
            prompt: 'Complete the assertion to verify a heading exists:',
            codeSnippet: `import { test, expect } from '@playwright/test';

test('page has heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Dashboard' })).________();
});`,
            estimatedMinutes: 2,
            tags: ['playwright', 'assertions', 'expect'],
            expectedAnswer: 'toBeVisible',
            explanation: 'toBeVisible() is the assertion to verify that an element is visible on the page.',
            hint: 'What assertion checks if something can be seen on the page?',
          },
        ],
      },
      {
        name: 'Advanced Topics',
        description: 'Fixtures, parallel execution, and best practices',
        tasks: [
          {
            type: TaskType.TRUE_FALSE,
            difficulty: Difficulty.EASY,
            title: 'Test Isolation',
            prompt: 'True or False: Playwright tests run in isolation with a fresh browser context for each test.',
            estimatedMinutes: 1,
            tags: ['playwright', 'isolation', 'best-practices'],
            expectedAnswer: 'True',
            explanation: 'By default, Playwright creates a new browser context for each test, ensuring complete isolation.',
          },
          {
            type: TaskType.SCENARIO_BASED,
            difficulty: Difficulty.HARD,
            title: 'Handle Dynamic Loading',
            prompt: 'A page shows a loading spinner for 1-3 seconds before displaying results. How do you handle this in Playwright?',
            estimatedMinutes: 5,
            tags: ['playwright', 'waits', 'dynamic-content'],
            expectedAnswer: 'waitForSelector|toBeHidden|waitFor',
            explanation: 'Use page.waitForSelector() with state: hidden for the spinner, or assert the spinner is hidden, or wait for the results to appear.',
            hint: 'Playwright can wait for elements to disappear or appear.',
          },
        ],
      },
    ]
  )
}

async function createGitTrack() {
  return createTrackWithModules(
    'git-github-basics',
    'Git & GitHub Basics',
    'Version control for testers and developers',
    '#f97316',
    [
      {
        name: 'Git Fundamentals',
        description: 'Basic commands and workflow',
        tasks: [
          {
            type: TaskType.FILL_IN_BLANK,
            difficulty: Difficulty.EASY,
            title: 'Check Status',
            prompt: 'What command shows the current state of your working directory?',
            estimatedMinutes: 1,
            tags: ['git', 'status', 'commands'],
            expectedAnswer: 'git status',
            explanation: 'git status shows which files are modified, staged, or untracked in your working directory.',
            hint: 'This command tells you the current state of your repository.',
          },
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Create Branch',
            prompt: 'Which command creates and switches to a new branch called "feature-tests"?',
            estimatedMinutes: 2,
            tags: ['git', 'branching', 'commands'],
            expectedAnswer: 'C',
            explanation: 'git checkout -b branch-name creates and switches to a new branch in one command.',
            options: [
              { optionId: 'A', text: 'git branch feature-tests', isCorrect: false },
              { optionId: 'B', text: 'git switch feature-tests', isCorrect: false },
              { optionId: 'C', text: 'git checkout -b feature-tests', isCorrect: true },
              { optionId: 'D', text: 'git new-branch feature-tests', isCorrect: false },
            ],
          },
          {
            type: TaskType.ORDERING,
            difficulty: Difficulty.MEDIUM,
            title: 'Basic Git Workflow',
            prompt: 'Order these commands for the basic Git workflow (add → commit → push):',
            estimatedMinutes: 3,
            tags: ['git', 'workflow', 'basics'],
            expectedAnswer: 'git add|git commit|git push',
            explanation: 'First stage changes with git add, then commit with a message, finally push to remote.',
          },
        ],
      },
    ]
  )
}

async function createJenkinsTrack() {
  return createTrackWithModules(
    'jenkins-basics',
    'Jenkins Basics',
    'CI/CD automation with Jenkins',
    '#ef4444',
    [
      {
        name: 'Jenkins Fundamentals',
        description: 'Jobs, pipelines, and basic configuration',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'Jenkinsfile',
            prompt: 'What is a Jenkinsfile?',
            estimatedMinutes: 2,
            tags: ['jenkins', 'pipeline', 'configuration'],
            expectedAnswer: 'B',
            explanation: 'A Jenkinsfile is a text file that defines a Jenkins Pipeline as code, stored in version control.',
            options: [
              { optionId: 'A', text: 'A binary executable for Jenkins', isCorrect: false },
              { optionId: 'B', text: 'A text file defining a pipeline as code', isCorrect: true },
              { optionId: 'C', text: 'A database configuration file', isCorrect: false },
              { optionId: 'D', text: 'A plugin manifest file', isCorrect: false },
            ],
          },
          {
            type: TaskType.FILL_IN_BLANK,
            difficulty: Difficulty.MEDIUM,
            title: 'Pipeline Stage',
            prompt: 'Complete the Jenkinsfile stage syntax:\n\npipeline {\n  stages {\n    ________ (\'Test\') {\n      steps {\n        sh \'npm test\'\n      }\n    }\n  }\n}',
            estimatedMinutes: 2,
            tags: ['jenkins', 'pipeline', 'syntax'],
            expectedAnswer: 'stage',
            explanation: 'The stage() directive defines a distinct phase in the pipeline with a name and steps.',
            hint: 'What keyword defines a named phase in a Jenkins pipeline?',
          },
        ],
      },
    ]
  )
}

async function createCICDTrack() {
  return createTrackWithModules(
    'cicd-fundamentals',
    'CI/CD Fundamentals',
    'Continuous Integration and Deployment concepts',
    '#a855f7',
    [
      {
        name: 'CI/CD Concepts',
        description: 'Understanding continuous integration and deployment',
        tasks: [
          {
            type: TaskType.MCQ,
            difficulty: Difficulty.EASY,
            title: 'CI vs CD',
            prompt: 'What does CI stand for in CI/CD?',
            estimatedMinutes: 1,
            tags: ['cicd', 'concepts', 'basics'],
            expectedAnswer: 'A',
            explanation: 'CI stands for Continuous Integration - the practice of merging code changes frequently.',
            options: [
              { optionId: 'A', text: 'Continuous Integration', isCorrect: true },
              { optionId: 'B', text: 'Continuous Installation', isCorrect: false },
              { optionId: 'C', text: 'Code Integration', isCorrect: false },
              { optionId: 'D', text: 'Computer Infrastructure', isCorrect: false },
            ],
          },
          {
            type: TaskType.TRUE_FALSE,
            difficulty: Difficulty.EASY,
            title: 'Automated Testing in CI',
            prompt: 'True or False: Automated tests should run as part of the CI pipeline.',
            estimatedMinutes: 1,
            tags: ['cicd', 'testing', 'automation'],
            expectedAnswer: 'True',
            explanation: 'Running automated tests in CI ensures code quality and catches issues early in the development process.',
          },
          {
            type: TaskType.SCENARIO_BASED,
            difficulty: Difficulty.MEDIUM,
            title: 'Pipeline Design',
            prompt: 'You need to design a CI pipeline for a test automation project. What stages would you include?',
            estimatedMinutes: 4,
            tags: ['cicd', 'pipeline', 'design'],
            expectedAnswer: 'checkout|install|lint|test|report',
            explanation: 'A typical CI pipeline includes: code checkout, dependency installation, linting/code quality checks, test execution, and reporting.',
            hint: 'Think about the steps needed from getting the code to running tests and reporting results.',
          },
        ],
      },
    ]
  )
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
