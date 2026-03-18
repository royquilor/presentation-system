# Quiz Creation Guide: Step-by-Step Manual

A hands-on checklist for creating quizzes from any Agent Library presentation `.md` file. Follow each step in order. Check off as you go.

---

## Phase 1: Source Selection and Reading (30 min)

- [ ] **1.1** Identify the learning focus area (e.g., "API design", "Observability", "Prompt engineering")
- [ ] **1.2** Select 2-4 source `.md` files that cover the topic. Pick one primary (deepest coverage) and 1-3 supporting files.
- [ ] **1.3** Read the **primary source** completely. Do not skim. Note:
  - Document title and author
  - Last updated date
  - Confluence URL (for the `sourceMaterial` field)
- [ ] **1.4** Read each **supporting source**, focusing on sections that overlap with the primary topic.
- [ ] **1.5** Create a scratch note listing:
  - 5-8 key terms (bolded words, inline code, acronyms)
  - 3-5 key processes (sequential workflows, decision trees)
  - 3-5 key numbers (response times, thresholds, counts)
  - 2-3 common mistakes or failure modes

---

## Phase 2: Learning Objective Definition (15 min)

- [ ] **2.1** Write 2-3 **recall** objectives: "Define X", "State the value of Y", "List the steps of Z"
- [ ] **2.2** Write 2-3 **understanding** objectives: "Explain why X matters", "Distinguish between A and B", "Describe how X affects Y"
- [ ] **2.3** Write 1-2 **application** objectives: "Given scenario X, determine the correct action", "Diagnose problem Y using the available tools"
- [ ] **2.4** Write 1-2 **common misconceptions**: "People often think X, but actually Y"

---

## Phase 3: Question Drafting (45 min)

### Multiple Choice (write 3)

- [ ] **3.1** Write one **easy** MC question testing a key term or number:
  - Question should be answerable without seeing the options
  - Write 4 options of similar length
  - Correct answer should be unambiguous
  - Distractors should be plausible (real terms from the domain, not nonsense)
- [ ] **3.2** Write one **medium** MC question testing understanding:
  - Test "why" or "which is the best approach"
  - Distractors should represent partial truths or common confusions
- [ ] **3.3** Write one **hard** MC question or scenario:
  - Provide a 2-3 sentence situation
  - Ask what to do or what is happening
  - Best answer requires understanding, not just recall

### True/False (write 1)

- [ ] **3.4** Write one T/F statement that challenges a common assumption:
  - Statement must be 100% true or 100% false
  - Avoid double negatives
  - Write an explanation that teaches the nuance

### Text Input (write 1)

- [ ] **3.5** Write one open-ended question:
  - Ask for a specific, bounded response (not an essay)
  - Write a clear placeholder hint
  - Write a sample answer showing what "good" looks like
  - List 3-5 keywords for automated scoring

### Ordering (write 1)

- [ ] **3.6** Write one ordering question:
  - Pick a process with 4-6 steps where order genuinely matters
  - Each step should be distinct and non-overlapping
  - Write an explanation covering why the order matters and what breaks if wrong

---

## Phase 4: Quality Review (15 min)

- [ ] **4.1** For each question, verify:
  - [ ] Tests ONE specific concept (not two things at once)
  - [ ] Wording is clear and unambiguous
  - [ ] Difficulty level is appropriate
  - [ ] Explanation teaches something useful
  - [ ] Maps to a learning objective from Phase 2
- [ ] **4.2** Check the overall quiz:
  - [ ] Mix of question types (not all MC)
  - [ ] Progressive difficulty (easy first, hard last)
  - [ ] 5-10 minute estimated completion time
  - [ ] No trick questions
  - [ ] All answers are verifiable from the source material
- [ ] **4.3** Read each explanation as if you got it wrong. Does it help you learn?

---

## Phase 5: JSON Assembly (15 min)

- [ ] **5.1** Create the quiz JSON file: `{slug}.quiz.json` in the same directory as the presentation
- [ ] **5.2** Fill in the metadata:
  ```json
  {
    "quizId": "slug-name-quiz",
    "title": "Quiz: [Topic Name]",
    "description": "[1-2 sentence description of what the quiz covers]",
    "sourceMaterial": "[presentation-slug].md",
    "estimatedTime": "5-10 minutes",
    "passingScore": 70,
    "metadata": {
      "author": "[Your Name]",
      "created": "[YYYY-MM-DD]",
      "version": "1.0",
      "tags": ["tag1", "tag2"]
    }
  }
  ```
- [ ] **5.3** Add each question using the correct type schema:
  - MC/Scenario: `type`, `question`, `situation?`, `options[]`, `correct` (index), `explanation`, `difficulty`, `objective`
  - True/False: `type`, `question`, `correct` (boolean), `explanation`, `difficulty`, `objective`
  - Text Input: `type`, `question`, `placeholder`, `sampleAnswer`, `keywords[]`, `difficulty`, `objective`
  - Ordering: `type`, `question`, `items[]`, `correctOrder[]`, `explanation`, `difficulty`, `objective`
- [ ] **5.4** Assign sequential IDs: `q1`, `q2`, `q3`, ...
- [ ] **5.5** Order questions: easy first, medium middle, hard last

---

## Phase 6: Validation (10 min)

- [ ] **6.1** Validate JSON syntax (paste into a JSON validator or run `node -e "JSON.parse(require('fs').readFileSync('file.quiz.json','utf8'))"`)
- [ ] **6.2** Run `npm run build` in the presentation system to verify the quiz loads
- [ ] **6.3** Navigate to `/p/[slug]/quiz` in the dev server and test each question
- [ ] **6.4** Verify correct/incorrect feedback appears for each question type
- [ ] **6.5** Check the results slide calculates the score correctly

---

## Quick Reference: Question Type Cheat Sheet

| Type | Best for testing | Key fields |
|------|-----------------|------------|
| Multiple Choice | Terminology, "which is correct" | `options[]`, `correct` (index) |
| Scenario | Decision-making, judgment | `situation`, `options[]`, `correct` |
| True/False | Challenging assumptions | `correct` (boolean) |
| Text Input | Recall, explanation | `placeholder`, `sampleAnswer`, `keywords[]` |
| Ordering | Process knowledge, sequences | `items[]`, `correctOrder[]` |

---

## Difficulty Calibration

| Level | What it tests | Example stem |
|-------|--------------|-------------|
| Easy | Direct recall | "What is the default rate limit?" |
| Medium | Understanding | "Why does the system use dual databases?" |
| Hard | Application/synthesis | "Given a 429 error spike, which diagnostic steps should you take first?" |
