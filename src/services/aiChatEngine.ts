import { ChatMessage, SubjectType, TutorPersona } from '../types';

export interface GenerateTutorResponseParams {
  prompt: string;
  history: ChatMessage[];
  persona: TutorPersona;
  subject?: SubjectType;
}

// Built-in intelligent tutor knowledge base
export async function generateTutorResponse({
  prompt,
  history,
  persona,
  subject,
}: GenerateTutorResponseParams): Promise<{
  text: string;
  suggestedFollowUps: string[];
}> {
  const query = prompt.trim().toLowerCase();

  // Artificial short delay to feel like a real conversational tutor thinking
  await new Promise((resolve) => setTimeout(resolve, 350));

  // 1. Study Methodologies
  if (query.includes('feynman') || query.includes('how to study') || query.includes('study technique')) {
    return {
      text: `### The Feynman Technique for Deep Learning 🧠

The Feynman Technique consists of 4 foundational steps:

1. **Choose a Concept**: Select a topic you want to master (e.g., Photosynthesis or Newton's Third Law).
2. **Teach It to a 6th Grader**: Write out an explanation in plain, everyday language. Avoid jargon—if you use technical words, define them simply.
3. **Identify Gaps & Bottlenecks**: Notice where you hesitate, fumble, or default to textbook definitions. Go back to your notes to fill those exact gaps.
4. **Simplify and Create Analogies**: Turn abstract principles into vivid mental metaphors (e.g., *“voltage is like water pressure in a garden hose”*).

> **Pro Tip**: Pair this with **Active Recall** (testing yourself without notes) and **Spaced Repetition** (reviewing at 1-day, 3-day, and 7-day intervals).`,
      suggestedFollowUps: [
        'How do I create a Spaced Repetition schedule?',
        'Give me an analogy for Photosynthesis',
        'Can you quiz me on a topic?',
      ],
    };
  }

  // 2. Physics: Newton's Laws
  if (query.includes('newton') || query.includes('laws of motion') || query.includes('inertia')) {
    if (persona === 'socratic') {
      return {
        text: `### Exploring Newton's Laws of Motion

Imagine you are standing on a bus moving forward at 50 km/h. The driver suddenly hits the brakes hard. 

**What happens to your body, and why?**

Consider these clues:
- Did an invisible hand push you forward?
- Or was your body already traveling at 50 km/h and simply trying to maintain that state of motion?

Take a moment to formulate your answer, and think about how this illustrates **Inertia** (Newton's 1st Law)!`,
        suggestedFollowUps: [
          'My body keeps moving forward because of inertia!',
          'What is Newton\'s Second Law formula?',
          'Why does a rocket move in the vacuum of space?',
        ],
      };
    }

    return {
      text: `### Newton's Three Laws of Motion 🚀

1. **First Law (Inertia)**: An object at rest stays at rest, and an object in uniform motion stays in motion at constant velocity unless acted upon by a net external force.
   - *Formula*: If $\\Sigma F = 0 \\implies v = \\text{constant}$.

2. **Second Law (Force & Acceleration)**: The acceleration of an object is directly proportional to net force and inversely proportional to its mass.
   - *Formula*: $F_{\\text{net}} = m \\cdot a$ (Units: Newtons, $N = \\text{kg}\\cdot\\text{m/s}^2$).

3. **Third Law (Action & Reaction)**: When object A exerts a force on object B, object B exerts an equal and opposite force on object A.
   - *Example*: When you push water backward while swimming, the water pushes you forward.`,
      suggestedFollowUps: [
        'How do I calculate acceleration if mass is 5kg and force is 20N?',
        'Give me an exam practice problem on Newton\'s 2nd Law',
        'What is terminal velocity?',
      ],
    };
  }

  // 3. Chemistry: Periodic Table & Chemical Bonding
  if (query.includes('chemical bond') || query.includes('covalent') || query.includes('ionic') || query.includes('periodic table')) {
    return {
      text: `### Chemical Bonding: Ionic vs Covalent 🧪

Atoms bond to achieve a stable **octet configuration** (8 valence electrons in their outermost shell).

| Feature | Ionic Bonding | Covalent Bonding |
| :--- | :--- | :--- |
| **Electron Action** | Transfer of electrons (loss/gain) | Mutual sharing of electron pairs |
| **Partners** | Metal + Non-metal (e.g. NaCl) | Non-metal + Non-metal (e.g. H₂O, CO₂) |
| **Electronegativity Difference** | Large ($\\Delta EN > 1.7$) | Small to Moderate ($\\Delta EN < 1.7$) |
| **Melting Point** | High (strong crystal lattice) | Generally Lower |
| **Conductivity** | Conducts electricity when molten or dissolved | Poor electrical conductors |

> **Analogy**: Ionic bonding is like one person handing over a book completely; Covalent bonding is two friends reading the same book together held in between.`,
      suggestedFollowUps: [
        'What is a polar covalent bond?',
        'Why does water have hydrogen bonding?',
        'How does electronegativity change across the periodic table?',
      ],
    };
  }

  // 4. Biology: Photosynthesis & Respiration
  if (query.includes('photosynthesis') || query.includes('cellular respiration') || query.includes('mitochondria') || query.includes('atp')) {
    return {
      text: `### Photosynthesis vs Cellular Respiration 🌿

These two life processes form a harmonious biochemical cycle on Earth!

#### 1. Photosynthesis (Solar Energy Storage)
Occurs in the **chloroplasts** of plant cells:
$$\\text{6 CO}_2 + \\text{6 H}_2\\text{O} + \\text{Light Energy} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 \\text{ (Glucose)} + \\text{6 O}_2$$
- **Light Reactions**: Split water ($H_2O$), release $O_2$, and produce ATP and NADPH.
- **Calvin Cycle**: Fixes carbon dioxide ($CO_2$) into sugar (glucose).

#### 2. Cellular Respiration (Energy Release)
Occurs in the **mitochondria** of eukaryotic cells:
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6 O}_2 \\longrightarrow \\text{6 CO}_2 + \\text{6 H}_2\\text{O} + \\sim 32\\text{ ATP}$$
- **Stages**: Glycolysis (cytoplasm) $\\rightarrow$ Krebs Cycle (matrix) $\\rightarrow$ Electron Transport Chain (inner membrane).`,
      suggestedFollowUps: [
        'What is the role of ATP synthase?',
        'Why do leaves turn orange in autumn?',
        'Explain anaerobic respiration / fermentation',
      ],
    };
  }

  // 5. Calculus & Math
  if (query.includes('derivative') || query.includes('integral') || query.includes('calculus') || query.includes('chain rule')) {
    return {
      text: `### The Essence of Calculus: Derivatives & Integrals 📐

Calculus is the mathematics of **change** and **accumulation**.

1. **The Derivative ($f'(x)$)**: Measures instantaneous rate of change (the slope of the tangent line at any point).
   - *Formal Definition*: $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$
   - *Key Rules*:
     - **Power Rule**: $\\frac{d}{dx}[x^n] = n x^{n-1}$
     - **Product Rule**: $(uv)' = u'v + uv'$
     - **Chain Rule**: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

2. **The Integral ($\\int f(x) dx$)**: Measures continuous accumulation (the exact area underneath a curve).
   - **Fundamental Theorem of Calculus**: Differentiation and integration are inverse operations:
   $$\\int_a^b f'(x) dx = f(b) - f(a)$$`,
      suggestedFollowUps: [
        'How do I solve d/dx(sin(3x^2)) using the Chain Rule?',
        'Can the Math Solver show me step-by-step calculus?',
        'What is the practical use of integrals in physics?',
      ],
    };
  }

  // 6. Literature & Essay Writing
  if (query.includes('essay') || query.includes('thesis') || query.includes('write an introduction') || query.includes('paragraph')) {
    return {
      text: `### Crafting a Bulletproof Thesis Statement & Essay ✍️

A strong thesis is **arguable**, **specific**, and provides a **roadmap** for your entire paper.

#### The 3-Part Formula:
$$\\text{[Specific Topic]} + \\text{[Clear Stance / Claim]} + \\text{[Because / Reasons A, B, and C]}$$

#### Weak vs Strong Example:
- ❌ *Weak*: "Climate change is bad and affects the world." (Vague, obvious fact, no unique claim).
- ✅ *Strong*: "Because coastal urban centers face accelerating storm surges, municipal governments must redirect infrastructure funds toward natural mangrove restoration rather than concrete seawalls to ensure long-term climate resilience."

#### Body Paragraph Structure (PEEL Method):
1. **P**oint: Clear topic sentence linking to your thesis.
2. **E**vidence: Direct quote, statistic, or textual reference.
3. **E**xplanation: Unpack how the evidence supports your point.
4. **L**ink: Connect back to your overarching argument or transition to the next point.`,
      suggestedFollowUps: [
        'Help me refine my thesis for a literature essay',
        'How do I write a compelling essay hook?',
        'What are effective transition words between paragraphs?',
      ],
    };
  }

  // 7. Computer Science: Algorithms & Big-O
  if (query.includes('big o') || query.includes('algorithm') || query.includes('data structure') || query.includes('binary search')) {
    return {
      text: `### Understanding Big-O Notation & Time Complexity 💻

Big-O measures the **worst-case asymptotic growth rate** of an algorithm as the input size $N$ approaches infinity.

| Complexity | Name | Example Algorithm | Operations for $N = 1,000$ |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Hash map lookup, array index access | $1$ |
| **$O(\\log N)$** | Logarithmic | Binary search in sorted array | $\\approx 10$ |
| **$O(N)$** | Linear | Iterating through an unsorted list | $1,000$ |
| **$O(N \\log N)$** | Linearithmic | Merge Sort, Quick Sort (average) | $\\approx 10,000$ |
| **$O(N^2)$** | Quadratic | Nested loops, Bubble sort | $1,000,000$ |
| **$O(2^N)$** | Exponential | Recursive Fibonacci, Subset generation | $10^{300}$ (Infeasible) |

> **Key Rule of Thumb**: When you divide the search space in half with each iteration (like halving a phonebook), think **$O(\\log N)$**.`,
      suggestedFollowUps: [
        'How does Binary Search work step-by-step?',
        'What is the difference between an Array and a Linked List?',
        'Why is Hash Map lookup O(1)?',
      ],
    };
  }

  // Default dynamic educational response generator based on persona
  const topicTitle = prompt.length > 35 ? prompt.slice(0, 35) + '...' : prompt;

  if (persona === 'socratic') {
    return {
      text: `### Guiding Questions: ${topicTitle} 💡

Let's unpack this together to build deep understanding.

To begin with **"${prompt}"**:
1. What is the fundamental principle or definition you already associate with this topic?
2. If you had to explain the main cause or mechanism to someone unfamiliar with the subject, where would you start?
3. What specific part of this question feels most puzzling right now?

Tell me your initial thought, and we will build the complete concept from first principles!`,
      suggestedFollowUps: [
        'Here is my initial understanding...',
        'Can you give me a basic hint first?',
        'Summarize the core concept simply',
      ],
    };
  }

  if (persona === 'coach') {
    return {
      text: `### Exam Prep Strategy: ${topicTitle} 🎯

Here are the high-yield facts and test traps to watch out for regarding: **${prompt}**

#### High-Yield Knowledge Points:
- **Core Principle**: Make sure you can articulate the definition in 1-2 concise sentences without referencing notes.
- **Common Exam Trap**: Questions on this topic frequently test edge cases or subtle distinctions. Always re-read the units and question stem carefully.
- **Quick Verification Check**: Does your answer pass dimensional analysis and physical intuition?

#### Suggested Action Plan:
1. Review the formula or primary concept in your Notes.
2. Try a 5-question targeted quiz in the **Quiz Generator**.
3. Create a quick flashcard for any terms you hesitated on.`,
      suggestedFollowUps: [
        'Generate a quiz on this topic',
        'What are the most common exam questions for this?',
        'Add a note about this to my notebook',
      ],
    };
  }

  if (persona === 'summary') {
    return {
      text: `### Quick Summary: ${topicTitle} ⚡

- **Key Takeaway**: ${prompt} is central to understanding foundational principles in this subject area.
- **Mechanism / Why It Matters**: It governs how components interact, balance, or evolve under changing conditions.
- **Next Step**: Apply this knowledge to solve practical problems or test your recall with active quizzes.`,
      suggestedFollowUps: [
        'Give me the detailed explanation',
        'Show me a practical example',
        'Test my knowledge with a practice question',
      ],
    };
  }

  // Default Explainer persona
  return {
    text: `### Understanding: ${topicTitle} 📖

Great question! Let's break down **"${prompt}"** into clear, digestible concepts:

#### 1. Core Principle
At its heart, this topic concerns how fundamental rules dictate outcomes in this field. Whether analyzing mathematical relationships, physical dynamics, or conceptual frameworks, the key is observing what remains constant versus what changes.

#### 2. Practical Breakdown
- **Observation**: When you encounter problems in this domain, first identify what variables or evidence are directly given.
- **Application**: Map those inputs to the governing theorem, rule, or model.
- **Resolution**: Test the final output against realistic constraints.

#### 3. Pro Study Tip
Try teaching this specific concept back to me in your own words, or open our **Math Solver** if numerical calculations are involved!`,
    suggestedFollowUps: [
      'Can you provide a step-by-step example?',
      'How does this connect to real-world applications?',
      'Give me a mnemonic to remember this easily',
    ],
  };
}

export const QUICK_PROMPTS = [
  'Explain the Feynman study technique',
  'What are Newton\'s 3 Laws of Motion?',
  'How do Ionic and Covalent bonds differ?',
  'Explain Photosynthesis vs Cellular Respiration',
  'How does Big-O notation work in algorithms?',
  'How do I write a strong thesis statement?',
];
