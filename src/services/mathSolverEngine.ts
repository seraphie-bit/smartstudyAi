import { MathSolution, MathStep } from '../types';

export function solveMathProblem(rawInput: string): MathSolution {
  const query = rawInput.trim();
  const cleaned = query.replace(/\s+/g, ' ');

  // 1. Quadratic Equation: ax^2 + bx + c = 0
  const quadMatch = cleaned.match(/([+-]?\s*\d*\.?\d*)\s*x\^?2\s*([+-]\s*\d*\.?\d*)?\s*x?\s*([+-]\s*\d+\.?\d*)?\s*=\s*0/i);
  if (quadMatch) {
    return solveQuadratic(cleaned);
  }

  // 2. Simple Linear Equation: ax + b = c or ax = b
  if (cleaned.includes('=') && !cleaned.includes('x^2')) {
    const linResult = solveLinear(cleaned);
    if (linResult) return linResult;
  }

  // 3. Calculus / Derivative: d/dx or derivative of ...
  if (/^(d\/dx|derivative of|diff)/i.test(cleaned) || cleaned.includes("d/dx")) {
    return solveDerivative(cleaned);
  }

  // 4. Statistics: list of comma-separated or space-separated numbers
  if (/^(\d+\.?\d*[\s,]+){2,}\d+\.?\d*$/.test(cleaned) || /^(mean|median|stats|average)/i.test(cleaned)) {
    return solveStatistics(cleaned);
  }

  // 5. Geometry / Pythagorean / Circle
  if (/pythagor|hypotenuse|triangle/i.test(cleaned)) {
    return solvePythagorean(cleaned);
  }
  if (/circle|radius|diameter/i.test(cleaned)) {
    return solveCircle(cleaned);
  }

  // 6. Arithmetic / Expression evaluation (PEMDAS)
  if (/^[0-9+\-*/().^\s%]+$/.test(cleaned) && /[+\-*/^%]/.test(cleaned)) {
    return solveArithmetic(cleaned);
  }

  // Fallback heuristic solver for general algebra or word queries
  return solveGeneralMath(cleaned);
}

function parseNumber(str?: string, defaultVal: number = 0): number {
  if (!str) return defaultVal;
  const s = str.replace(/\s+/g, '');
  if (s === '' || s === '+') return 1;
  if (s === '-') return -1;
  return parseFloat(s);
}

function solveQuadratic(query: string): MathSolution {
  // Normalize equation ax^2 + bx + c = 0
  let a = 1, b = 0, c = 0;
  
  // Standard format extraction
  const norm = query.replace(/\s+/g, '');
  const aMatch = norm.match(/([+-]?\d*\.?\d*)x\^?2/i);
  if (aMatch) {
    const aStr = aMatch[1];
    a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
  }

  const bMatch = norm.match(/([+-]\d*\.?\d*)x(?!\^)/i);
  if (bMatch) {
    const bStr = bMatch[1];
    b = bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
  } else if (/([+-]?\d*\.?\d*)x(?!\^)/i.test(norm) && !norm.startsWith('x^2') && !norm.startsWith('+x^2') && !norm.startsWith('-x^2')) {
    // maybe first term was x without power, but quad matcher matched
  }

  const cMatch = norm.match(/([+-]\d+\.?\d*)(?==)/);
  if (cMatch) {
    c = parseFloat(cMatch[1]);
  }

  if (isNaN(a) || a === 0) a = 1;

  const discriminant = b * b - 4 * a * c;
  const steps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Identify Quadratic Coefficients',
      expression: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      description: `Comparing the given equation to the standard form: ax² + bx + c = 0.`,
    },
    {
      stepNumber: 2,
      title: 'Calculate Discriminant (Δ)',
      expression: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${discriminant}`,
      description: discriminant > 0
        ? 'Since Δ > 0, the equation has two distinct real roots.'
        : discriminant === 0
        ? 'Since Δ = 0, the equation has exactly one real repeated root.'
        : 'Since Δ < 0, the equation has two complex conjugate roots.',
    },
  ];

  let result = '';
  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    const x1 = (-b + sqrtDisc) / (2 * a);
    const x2 = (-b - sqrtDisc) / (2 * a);
    const x1Str = Number.isInteger(x1) ? x1.toString() : x1.toFixed(3);
    const x2Str = Number.isInteger(x2) ? x2.toString() : x2.toFixed(3);

    steps.push({
      stepNumber: 3,
      title: 'Apply Quadratic Formula',
      expression: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm ${sqrtDisc.toFixed(2)}}{2(${a})}`,
      description: 'Substitute the coefficients into the quadratic formula to solve for x.',
    });

    if (x1 === x2) {
      result = `x = ${x1Str}`;
      steps.push({
        stepNumber: 4,
        title: 'Single Root Result',
        expression: `x = ${x1Str}`,
        description: `The parabola touches the x-axis at a single vertex: (${x1Str}, 0).`,
      });
    } else {
      result = `x₁ = ${x1Str}, \\quad x₂ = ${x2Str}`;
      steps.push({
        stepNumber: 4,
        title: 'Calculate Both Roots',
        expression: `x_1 = ${x1Str}, \\quad x_2 = ${x2Str}`,
        description: `The two solutions where the curve intercepts y = 0 are x = ${x1Str} and x = ${x2Str}.`,
      });
    }
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    result = `x = ${realPart} ± ${imagPart}i`;
    steps.push({
      stepNumber: 3,
      title: 'Complex Number Form',
      expression: `x = \\frac{${-b} \\pm \\sqrt{${discriminant}}}{${2 * a}} = ${realPart} \\pm ${imagPart}i`,
      description: 'Because the discriminant is negative, we express the roots using imaginary unit i (√-1).',
    });
  }

  // Vertex coordinates: h = -b / (2a), k = f(h)
  const h = -b / (2 * a);
  const k = a * h * h + b * h + c;

  steps.push({
    stepNumber: steps.length + 1,
    title: 'Parabola Vertex & Axis of Symmetry',
    expression: `\\text{Vertex } (h, k) = (${h.toFixed(2)}, ${k.toFixed(2)}), \\quad \\text{Axis: } x = ${h.toFixed(2)}`,
    description: a > 0 ? 'The parabola opens upward (minimum point at vertex).' : 'The parabola opens downward (maximum point at vertex).',
  });

  // Generate SVG curve points around vertex
  const points: { x: number; y: number }[] = [];
  const range = 5;
  for (let step = -range; step <= range; step += 0.5) {
    const px = h + step;
    const py = a * px * px + b * px + c;
    points.push({ x: parseFloat(px.toFixed(2)), y: parseFloat(py.toFixed(2)) });
  }

  return {
    query,
    category: 'algebra',
    result,
    steps,
    graphData: {
      type: 'function',
      points,
      equation: `y = ${a !== 1 ? a : ''}x² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`,
      description: `Parabolic curve showing roots and vertex at (${h.toFixed(2)}, ${k.toFixed(2)})`,
    },
    tips: [
      'Remember the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a).',
      'The discriminant Δ = b² - 4ac tells you how many real solutions exist.',
      'Factoring check: (x - x₁)(x - x₂) = 0.',
    ],
  };
}

function solveLinear(query: string): MathSolution | null {
  // Solve expressions like 2x + 5 = 15 or 3x - 4 = 2x + 8
  const parts = query.split('=');
  if (parts.length !== 2) return null;

  const left = parts[0].trim();
  const right = parts[1].trim();

  // Simple parser: Left ax + b, Right cx + d
  let leftX = 0, leftConst = 0;
  let rightX = 0, rightConst = 0;

  function parseSide(expr: string) {
    let coeffX = 0;
    let constant = 0;
    // Replace subtractions with + -
    const tokens = expr.replace(/-/g, '+-').split('+').map((s) => s.trim()).filter(Boolean);
    for (const t of tokens) {
      if (t.includes('x') || t.includes('X')) {
        const cleanT = t.replace(/[xX]/g, '');
        if (cleanT === '' || cleanT === '+') coeffX += 1;
        else if (cleanT === '-') coeffX -= 1;
        else coeffX += parseFloat(cleanT) || 0;
      } else {
        constant += parseFloat(t) || 0;
      }
    }
    return { coeffX, constant };
  }

  const leftParsed = parseSide(left);
  const rightParsed = parseSide(right);

  leftX = leftParsed.coeffX;
  leftConst = leftParsed.constant;
  rightX = rightParsed.coeffX;
  rightConst = rightParsed.constant;

  const finalCoeff = leftX - rightX;
  const finalConst = rightConst - leftConst;

  if (finalCoeff === 0) {
    if (finalConst === 0) {
      return {
        query,
        category: 'algebra',
        result: 'Infinite solutions (Identity equation: 0 = 0)',
        steps: [
          {
            stepNumber: 1,
            title: 'Analyze Both Sides',
            expression: `${left} = ${right}`,
            description: 'Both sides are identical for all real values of x.',
          },
        ],
      };
    } else {
      return {
        query,
        category: 'algebra',
        result: 'No solution (Inconsistent equation)',
        steps: [
          {
            stepNumber: 1,
            title: 'Equation Breakdown',
            expression: `0 = ${finalConst}`,
            description: 'The coefficients cancel out leaving an impossible statement, so no value of x satisfies the equation.',
          },
        ],
      };
    }
  }

  const solution = finalConst / finalCoeff;
  const solFormatted = Number.isInteger(solution) ? solution.toString() : solution.toFixed(3);

  const steps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Original Equation',
      expression: `${left} = ${right}`,
      description: 'Start by grouping terms containing variable x on one side and constants on the other.',
    },
    {
      stepNumber: 2,
      title: 'Group Variable Terms',
      expression: `(${leftX}x - ${rightX}x) + ${leftConst} = ${rightConst}`,
      description: `Subtract ${rightX}x from both sides: ${finalCoeff}x + ${leftConst} = ${rightConst}.`,
    },
    {
      stepNumber: 3,
      title: 'Isolate Variable Term',
      expression: `${finalCoeff}x = ${rightConst} - (${leftConst}) = ${finalConst}`,
      description: `Subtract constant ${leftConst} from both sides to isolate the x term.`,
    },
    {
      stepNumber: 4,
      title: 'Divide by Coefficient',
      expression: `x = \\frac{${finalConst}}{${finalCoeff}} = ${solFormatted}`,
      description: `Divide both sides by ${finalCoeff} to find the final value of x.`,
    },
    {
      stepNumber: 5,
      title: 'Verification Check',
      expression: `LHS = ${leftX}(${solFormatted}) + ${leftConst} = ${(leftX * solution + leftConst).toFixed(2)}, \\quad RHS = ${(rightX * solution + rightConst).toFixed(2)}`,
      description: 'Substituting the value back confirms LHS = RHS.',
    },
  ];

  // Generate linear graph data
  const points: { x: number; y: number }[] = [];
  for (let px = solution - 5; px <= solution + 5; px += 1) {
    points.push({ x: px, y: finalCoeff * px - finalConst });
  }

  return {
    query,
    category: 'algebra',
    result: `x = ${solFormatted}`,
    steps,
    graphData: {
      type: 'function',
      points,
      equation: `f(x) = ${finalCoeff}x - ${finalConst}`,
      description: `Linear intersection at root x = ${solFormatted}`,
    },
    tips: [
      'Golden Rule: Whatever operation you apply to the left side, apply equally to the right side.',
      'Always substitute your answer back into the original equation to verify.',
    ],
  };
}

function solveDerivative(query: string): MathSolution {
  // Clean string e.g. "d/dx(3x^3 - 5x^2 + 2x - 7)" or "derivative of x^3 + 4x"
  const expr = query.replace(/^(d\/dx|derivative of|diff)\s*\(?/i, '').replace(/\)$/, '').trim();

  // Basic polynomial derivative rule: a*x^n -> (a*n)*x^(n-1)
  const tokens = expr.replace(/-/g, '+-').split('+').map((s) => s.trim()).filter(Boolean);
  const derivedTerms: string[] = [];
  const detailedSteps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Recall Power Rule',
      expression: `\\frac{d}{dx}[a x^n] = a \\cdot n \\cdot x^{n-1}`,
      description: 'The derivative of a constant times x^n is obtained by multiplying by the exponent and subtracting 1 from the power. The derivative of a constant alone is 0.',
    },
  ];

  let stepCounter = 2;

  for (const term of tokens) {
    if (term.includes('x^') || term.includes('x')) {
      const match = term.match(/([+-]?\d*\.?\d*)x(?:\^([+-]?\d+))?/);
      if (match) {
        let coeff = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
        let power = match[2] ? parseInt(match[2]) : 1;
        
        const newCoeff = coeff * power;
        const newPower = power - 1;

        let resultTerm = '';
        if (newPower === 0) {
          resultTerm = `${newCoeff}`;
        } else if (newPower === 1) {
          resultTerm = `${newCoeff}x`;
        } else {
          resultTerm = `${newCoeff}x^${newPower}`;
        }

        derivedTerms.push(resultTerm);

        detailedSteps.push({
          stepNumber: stepCounter++,
          title: `Differentiate Term: ${term}`,
          expression: `\\frac{d}{dx}[${term}] = (${coeff})(${power})x^{${power}-1} = ${resultTerm}`,
          description: `Power rule applied to term ${term}.`,
        });
      }
    } else if (!isNaN(parseFloat(term))) {
      detailedSteps.push({
        stepNumber: stepCounter++,
        title: `Constant Rule: ${term}`,
        expression: `\\frac{d}{dx}[${term}] = 0`,
        description: 'The derivative of any constant value is always 0.',
      });
    }
  }

  const finalDerivative = derivedTerms.join(' + ').replace(/\+\s*-/g, '- ') || '0';

  detailedSteps.push({
    stepNumber: stepCounter,
    title: 'Combine Differentiated Terms',
    expression: `f'(x) = ${finalDerivative}`,
    description: 'Sum up all individual term derivatives using the linearity of differentiation.',
  });

  return {
    query,
    category: 'calculus',
    result: `f'(x) = ${finalDerivative}`,
    steps: detailedSteps,
    tips: [
      'Power Rule: d/dx(x^n) = n * x^(n-1).',
      'Constant Multiple Rule: d/dx(c * f(x)) = c * f\'(x).',
      'Derivative gives the instantaneous slope / rate of change of the function at any point x.',
    ],
  };
}

function solveStatistics(query: string): MathSolution {
  const numbers = query
    .replace(/[^\d., -]/g, ' ')
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !isNaN(n));

  if (numbers.length === 0) {
    return solveArithmetic(query);
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const n = numbers.length;
  const sum = numbers.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const counts: Record<number, number> = {};
  numbers.forEach((val) => (counts[val] = (counts[val] || 0) + 1));
  let maxCount = 0;
  let mode: number[] = [];
  for (const [key, cnt] of Object.entries(counts)) {
    if (cnt > maxCount) {
      maxCount = cnt;
      mode = [parseFloat(key)];
    } else if (cnt === maxCount && maxCount > 1) {
      mode.push(parseFloat(key));
    }
  }

  // Variance & Standard Deviation
  const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const range = sorted[sorted.length - 1] - sorted[0];

  const steps: MathStep[] = [
    {
      stepNumber: 1,
      title: 'Order Data Set',
      expression: `\\text{Sorted: } [${sorted.join(', ')}] \\quad (N = ${n})`,
      description: 'Arrange numbers in ascending order to easily calculate median and spread.',
    },
    {
      stepNumber: 2,
      title: 'Calculate Arithmetic Mean (μ)',
      expression: `\\mu = \\frac{\\sum x}{N} = \\frac{${sum}}{${n}} = ${mean.toFixed(2)}`,
      description: 'Sum all values in the dataset and divide by total count N.',
    },
    {
      stepNumber: 3,
      title: 'Determine Median (Middle Value)',
      expression: `\\text{Median} = ${median}`,
      description: n % 2 !== 0
        ? `Since N = ${n} is odd, the median is the center value at index ${mid + 1}.`
        : `Since N = ${n} is even, the median is the average of the two middle values: (${sorted[mid - 1]} + ${sorted[mid]}) / 2.`,
    },
    {
      stepNumber: 4,
      title: 'Calculate Variance & Standard Deviation (σ)',
      expression: `\\sigma^2 = \\frac{\\sum (x - \\mu)^2}{N} = ${variance.toFixed(2)}, \\quad \\sigma = \\sqrt{${variance.toFixed(2)}} = ${stdDev.toFixed(2)}`,
      description: 'Standard deviation measures the average dispersion or spread of values around the mean.',
    },
  ];

  return {
    query,
    category: 'statistics',
    result: `Mean = ${mean.toFixed(2)}, \\quad Median = ${median}, \\quad \\sigma = ${stdDev.toFixed(2)}`,
    steps,
    tips: [
      `Range: Max (${sorted[sorted.length - 1]}) - Min (${sorted[0]}) = ${range}.`,
      maxCount > 1 ? `Mode: ${mode.join(', ')} (appeared ${maxCount} times).` : 'No distinct mode (all values appear with equal frequency).',
      'For normal distributions, ~68% of data lies within 1 standard deviation of the mean.',
    ],
  };
}

function solvePythagorean(query: string): MathSolution {
  // Extract two sides or a=..., b=...
  const aMatch = query.match(/a\s*=\s*(\d+\.?\d*)/i);
  const bMatch = query.match(/b\s*=\s*(\d+\.?\d*)/i);
  const cMatch = query.match(/c\s*=\s*(\d+\.?\d*)/i);

  let a = aMatch ? parseFloat(aMatch[1]) : 3;
  let b = bMatch ? parseFloat(bMatch[1]) : 4;
  let c = cMatch ? parseFloat(cMatch[1]) : 0;

  if (c === 0) {
    c = Math.sqrt(a * a + b * b);
    return {
      query,
      category: 'geometry',
      result: `c = ${c.toFixed(2)} (Hypotenuse)`,
      steps: [
        {
          stepNumber: 1,
          title: 'Pythagorean Theorem Formula',
          expression: `a^2 + b^2 = c^2`,
          description: 'In any right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.',
        },
        {
          stepNumber: 2,
          title: 'Substitute Known Sides',
          expression: `(${a})^2 + (${b})^2 = c^2 \\implies ${a * a} + ${b * b} = ${a * a + b * b}`,
          description: 'Compute squares of legs a and b.',
        },
        {
          stepNumber: 3,
          title: 'Take the Square Root',
          expression: `c = \\sqrt{${a * a + b * b}} = ${c.toFixed(2)}`,
          description: 'Take the positive square root to determine side length c.',
        },
      ],
      tips: [
        `Area of this right triangle: A = (1/2) * a * b = ${(0.5 * a * b).toFixed(2)}.`,
        `Perimeter: P = a + b + c = ${(a + b + c).toFixed(2)}.`,
      ],
    };
  } else {
    // Solve for missing leg
    const missingLeg = Math.sqrt(c * c - a * a);
    return {
      query,
      category: 'geometry',
      result: `b = ${missingLeg.toFixed(2)}`,
      steps: [
        {
          stepNumber: 1,
          title: 'Rearrange Pythagorean Theorem',
          expression: `b = \\sqrt{c^2 - a^2}`,
          description: 'Isolate leg b by subtracting a² from c².',
        },
        {
          stepNumber: 2,
          title: 'Calculate Leg',
          expression: `b = \\sqrt{(${c})^2 - (${a})^2} = \\sqrt{${c * c - a * a}} = ${missingLeg.toFixed(2)}`,
          description: 'Substitute hypotenuse and given leg values.',
        },
      ],
    };
  }
}

function solveCircle(query: string): MathSolution {
  const rMatch = query.match(/(?:radius|r)\s*=\s*(\d+\.?\d*)/i) || query.match(/(\d+\.?\d*)/);
  const r = rMatch ? parseFloat(rMatch[1]) : 5;
  const area = Math.PI * r * r;
  const circumference = 2 * Math.PI * r;

  return {
    query,
    category: 'geometry',
    result: `\\text{Area} = ${area.toFixed(2)}, \\quad \\text{Circumference} = ${circumference.toFixed(2)}`,
    steps: [
      {
        stepNumber: 1,
        title: 'Area of a Circle Formula',
        expression: `A = \\pi r^2 = \\pi (${r})^2 = ${area.toFixed(2)}`,
        description: 'Multiply π (approx 3.14159) by the square of radius r.',
      },
      {
        stepNumber: 2,
        title: 'Circumference Formula',
        expression: `C = 2\\pi r = 2 \\cdot \\pi \\cdot ${r} = ${circumference.toFixed(2)}`,
        description: 'The perimeter of the circle boundary.',
      },
    ],
    tips: [`Diameter d = 2r = ${2 * r}.`, 'Ratio of circumference to diameter is always π constant.'],
  };
}

function solveArithmetic(query: string): MathSolution {
  try {
    // Safely evaluate simple arithmetic using basic JS Function
    const sanitized = query.replace(/[^0-9+\-*/().%^]/g, '').replace(/\^/g, '**');
    const resultVal = Function(`'use strict'; return (${sanitized})`)();
    const formatted = typeof resultVal === 'number' ? (Number.isInteger(resultVal) ? resultVal.toString() : resultVal.toFixed(3)) : String(resultVal);

    return {
      query,
      category: 'arithmetic',
      result: formatted,
      steps: [
        {
          stepNumber: 1,
          title: 'Order of Operations (PEMDAS/BODMAS)',
          expression: `\\text{Evaluate: } ${query}`,
          description: 'Evaluate Parentheses/Brackets first, then Exponents/Powers, then Multiplication & Division from left to right, finally Addition & Subtraction.',
        },
        {
          stepNumber: 2,
          title: 'Compute Step-by-Step',
          expression: `${query} = ${formatted}`,
          description: `Final evaluated value is ${formatted}.`,
        },
      ],
      tips: ['Remember PEMDAS: Parentheses, Exponents, Multiplication & Division, Addition & Subtraction.'],
    };
  } catch {
    return solveGeneralMath(query);
  }
}

function solveGeneralMath(query: string): MathSolution {
  return {
    query,
    category: 'algebra',
    result: 'Processed Explanation Available',
    steps: [
      {
        stepNumber: 1,
        title: 'Problem Formulation',
        expression: query,
        description: 'Examine equation variables, identify given constants and target unknowns.',
      },
      {
        stepNumber: 2,
        title: 'Apply Mathematical Invariants',
        expression: '\\text{Balance: LHS} \\leftrightarrow \\text{RHS}',
        description: 'Apply inverse operations symmetrically across both sides to isolate the primary variable.',
      },
      {
        stepNumber: 3,
        title: 'Simplification & Solution',
        expression: '\\text{Check constraints and domain}',
        description: 'Verify if solutions satisfy non-zero denominators and radical positivity restrictions.',
      },
    ],
    tips: [
      'Try clicking one of the sample problems below to see detailed algebraic breakdowns and live function graphs!',
      'Supports quadratic equations, linear equations, polynomials, derivatives, geometry, and statistics.',
    ],
  };
}

export const SAMPLE_MATH_PROBLEMS = [
  { label: 'Quadratic Equation', query: 'x^2 - 5x + 6 = 0', desc: 'Find real roots and vertex' },
  { label: 'Linear Equation', query: '3x - 7 = 2x + 8', desc: 'Isolate x with step-by-step balancing' },
  { label: 'Calculus Derivative', query: 'd/dx(4x^3 - 6x^2 + 7x - 5)', desc: 'Power rule differentiation' },
  { label: 'Statistics & Spread', query: '12, 15, 18, 20, 22, 25, 28, 30', desc: 'Mean, median, variance, std dev' },
  { label: 'Pythagorean Geometry', query: 'a = 6, b = 8', desc: 'Calculate hypotenuse and triangle area' },
  { label: 'Circle Geometry', query: 'radius = 7', desc: 'Area and circumference calculation' },
  { label: 'Order of Operations', query: '18 + (6 * 4) - (15 / 3)', desc: 'PEMDAS arithmetic evaluation' },
];
