import { SubmissionResult, TaskType, Difficulty } from '@prisma/client'
import { XP } from '@/lib/constants'

interface EvaluationInput {
  taskType: TaskType
  expectedAnswer: string
  userAnswer: string
  difficulty: Difficulty
}

interface EvaluationOutput {
  result: SubmissionResult
  score: number
  xpEarned: number
  feedback: string
}

export function evaluateSubmission(input: EvaluationInput): EvaluationOutput {
  switch (input.taskType) {
    case TaskType.MCQ:
    case TaskType.TRUE_FALSE:
      return evaluateExactMatch(input)
    
    case TaskType.FILL_IN_BLANK:
    case TaskType.SHORT_ANSWER:
      return evaluateKeywordMatch(input)
    
    case TaskType.CODE_COMPLETION:
      return evaluateCodeCompletion(input)
    
    case TaskType.ORDERING:
      return evaluateOrdering(input)
    
    case TaskType.OUTPUT_PREDICTION:
      return evaluateExactMatch(input)
    
    case TaskType.DEBUGGING:
    case TaskType.SCENARIO_BASED:
      return evaluateRubricBased(input)
    
    default:
      return evaluateExactMatch(input)
  }
}

function evaluateExactMatch(input: EvaluationInput): EvaluationOutput {
  const normalizedExpected = normalizeText(input.expectedAnswer)
  const normalizedUser = normalizeText(input.userAnswer)
  
  const isCorrect = normalizedExpected === normalizedUser
  
  return {
    result: isCorrect ? SubmissionResult.CORRECT : SubmissionResult.INCORRECT,
    score: isCorrect ? 100 : 0,
    xpEarned: isCorrect ? getXpForDifficulty(input.difficulty) : 0,
    feedback: isCorrect ? 'Correct! Well done.' : 'Incorrect. Review the correct answer and explanation.',
  }
}

function evaluateKeywordMatch(input: EvaluationInput): EvaluationOutput {
  const normalizedUser = normalizeText(input.userAnswer)
  
  // Split expected answer into keywords (comma-separated or pipe-separated)
  const keywords = input.expectedAnswer
    .split(/[,|]/)
    .map(k => normalizeText(k.trim()))
    .filter(k => k.length > 0)
  
  // Check which keywords are present
  const matchedKeywords = keywords.filter(k => normalizedUser.includes(k))
  const matchRatio = matchedKeywords.length / keywords.length
  
  let result: SubmissionResult
  let score: number
  let xpEarned: number
  let feedback: string
  
  if (matchRatio >= 0.8) {
    result = SubmissionResult.CORRECT
    score = 100
    xpEarned = getXpForDifficulty(input.difficulty)
    feedback = 'Correct! Your answer includes all the key points.'
  } else if (matchRatio >= 0.5) {
    result = SubmissionResult.PARTIAL
    score = Math.round(matchRatio * 100)
    xpEarned = Math.round(getXpForDifficulty(input.difficulty) * XP.TASK_PARTIAL_MULTIPLIER)
    feedback = `Partially correct. You included ${matchedKeywords.length} of ${keywords.length} key points.`
  } else {
    result = SubmissionResult.INCORRECT
    score = Math.round(matchRatio * 100)
    xpEarned = 0
    feedback = 'Incorrect. Your answer is missing key points. Review the explanation.'
  }
  
  return { result, score, xpEarned, feedback }
}

function evaluateCodeCompletion(input: EvaluationInput): EvaluationOutput {
  const normalizedExpected = normalizeCode(input.expectedAnswer)
  const normalizedUser = normalizeCode(input.userAnswer)
  
  // Check for exact match first
  if (normalizedExpected === normalizedUser) {
    return {
      result: SubmissionResult.CORRECT,
      score: 100,
      xpEarned: getXpForDifficulty(input.difficulty),
      feedback: 'Correct! Your solution matches the expected answer.',
    }
  }
  
  // Check for partial match (key elements present)
  const expectedTokens = tokenizeCode(normalizedExpected)
  const userTokens = tokenizeCode(normalizedUser)
  
  const matchCount = expectedTokens.filter(t => userTokens.includes(t)).length
  const matchRatio = matchCount / expectedTokens.length
  
  if (matchRatio >= 0.7) {
    return {
      result: SubmissionResult.PARTIAL,
      score: Math.round(matchRatio * 100),
      xpEarned: Math.round(getXpForDifficulty(input.difficulty) * XP.TASK_PARTIAL_MULTIPLIER),
      feedback: 'Close! Your solution has most of the correct elements but may have minor syntax differences.',
    }
  }
  
  return {
    result: SubmissionResult.INCORRECT,
    score: Math.round(matchRatio * 100),
    xpEarned: 0,
    feedback: 'Incorrect. Your solution is missing key elements. Review the explanation.',
  }
}

function evaluateOrdering(input: EvaluationInput): EvaluationOutput {
  const expectedOrder = input.expectedAnswer.split(/[,|]/).map(s => normalizeText(s.trim()))
  const userOrder = input.userAnswer.split(/[,|]/).map(s => normalizeText(s.trim()))
  
  // Check if sequences match exactly
  const isExactMatch = expectedOrder.every((item, index) => item === userOrder[index])
  
  if (isExactMatch) {
    return {
      result: SubmissionResult.CORRECT,
      score: 100,
      xpEarned: getXpForDifficulty(input.difficulty),
      feedback: 'Correct! You have the items in the right order.',
    }
  }
  
  // Check for partial correctness (right items, wrong order)
  const correctItems = expectedOrder.filter(item => userOrder.includes(item)).length
  const itemRatio = correctItems / expectedOrder.length
  
  return {
    result: SubmissionResult.PARTIAL,
    score: Math.round(itemRatio * 50), // Max 50% for right items, wrong order
    xpEarned: Math.round(getXpForDifficulty(input.difficulty) * 0.25),
    feedback: 'You have the right items but not in the correct order.',
  }
}

function evaluateRubricBased(input: EvaluationInput): EvaluationOutput {
  // For scenario-based questions, we use keyword matching with more lenient scoring
  const normalizedUser = normalizeText(input.userAnswer)
  
  // Expected answer format: "keyword1|keyword2|keyword3"
  const rubricItems = input.expectedAnswer
    .split(/[,|]/)
    .map(s => normalizeText(s.trim()))
    .filter(s => s.length > 0)
  
  const matchedItems = rubricItems.filter(item => normalizedUser.includes(item))
  const matchRatio = matchedItems.length / rubricItems.length
  
  if (matchRatio >= 0.7) {
    return {
      result: SubmissionResult.CORRECT,
      score: 100,
      xpEarned: getXpForDifficulty(input.difficulty),
      feedback: 'Excellent! Your answer demonstrates good understanding.',
    }
  } else if (matchRatio >= 0.4) {
    return {
      result: SubmissionResult.PARTIAL,
      score: Math.round(matchRatio * 100),
      xpEarned: Math.round(getXpForDifficulty(input.difficulty) * XP.TASK_PARTIAL_MULTIPLIER),
      feedback: 'Good attempt. Your answer covers some key points but could be more complete.',
    }
  }
  
  return {
    result: SubmissionResult.INCORRECT,
    score: Math.round(matchRatio * 100),
    xpEarned: 0,
    feedback: 'Your answer needs more detail. Check the explanation for key points.',
  }
}

// Helper functions
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim()
}

function normalizeCode(code: string): string {
  return code
    .toLowerCase()
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .replace(/;\s*/g, '; ')  // Normalize semicolons
    .replace(/,\s*/g, ', ')  // Normalize commas
    .trim()
}

function tokenizeCode(code: string): string[] {
  return code
    .split(/[\s;(),{}\[\]]+/)
    .filter(t => t.length > 0 && !isCommonKeyword(t))
}

function isCommonKeyword(token: string): boolean {
  const common = ['the', 'a', 'an', 'is', 'are', 'to', 'of', 'in', 'for', 'with', 'and']
  return common.includes(token)
}

function getXpForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case Difficulty.EASY:
      return XP.TASK_CORRECT_EASY
    case Difficulty.MEDIUM:
      return XP.TASK_CORRECT_MEDIUM
    case Difficulty.HARD:
      return XP.TASK_CORRECT_HARD
    default:
      return XP.TASK_CORRECT_EASY
  }
}
