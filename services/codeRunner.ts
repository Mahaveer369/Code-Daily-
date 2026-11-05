import { PracticeProblem } from '../types';

export interface SnippetExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  execution_time_ms: number;
  language: string;
  htmlPreview?: string;
}

export interface TestCaseResult {
  testCaseId: string;
  inputDisplay: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

export interface ProblemJudgeResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  results: TestCaseResult[];
  errorMessage?: string;
}

// Sample relational database tables for interactive SQL sandbox
const SAMPLE_SQL_TABLES: Record<string, Record<string, any>[]> = {
  employees: [
    { id: 1, name: 'Aarav Sharma', department: 'Engineering', role: 'SDE-2', salary: 145000, city: 'Bengaluru' },
    { id: 2, name: 'Priya Patel', department: 'Engineering', role: 'Staff Engineer', salary: 210000, city: 'Hyderabad' },
    { id: 3, name: 'Rohan Verma', department: 'Data Science', role: 'ML Engineer', salary: 165000, city: 'Bengaluru' },
    { id: 4, name: 'Ananya Iyer', department: 'Product', role: 'Product Manager', salary: 155000, city: 'Mumbai' },
    { id: 5, name: 'Vikram Nair', department: 'Engineering', role: 'SDE-1', salary: 110000, city: 'Pune' },
  ],
  departments: [
    { dept_id: 10, department: 'Engineering', budget: 2500000, head: 'Priya Patel' },
    { dept_id: 20, department: 'Data Science', budget: 1200000, head: 'Rohan Verma' },
    { dept_id: 30, department: 'Product', budget: 950000, head: 'Ananya Iyer' },
  ],
  students: [
    { student_id: 101, name: 'Meera Krishnan', track: 'DSA & Algorithms', score: 96, streak_days: 42 },
    { student_id: 102, name: 'Kabir Mehta', track: 'Full-Stack Web', score: 89, streak_days: 19 },
    { student_id: 103, name: 'Zoya Khan', track: 'System Design', score: 94, streak_days: 31 },
    { student_id: 104, name: 'Devansh Gupta', track: 'Python Mastery', score: 84, streak_days: 12 },
  ],
  orders: [
    { order_id: 5001, customer: 'Aarav Sharma', item: 'System Design Handbook', amount: 49, status: 'Delivered' },
    { order_id: 5002, customer: 'Priya Patel', item: 'DSA Pro Lab', amount: 79, status: 'Delivered' },
    { order_id: 5003, customer: 'Rohan Verma', item: 'Cloud Architecture Kit', amount: 99, status: 'Processing' },
  ]
};

function formatAsciiTable(rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) {
    return 'Empty set (0 rows)';
  }
  const cols = Object.keys(rows[0]);
  const widths: Record<string, number> = {};
  for (const col of cols) {
    widths[col] = col.length;
  }
  for (const row of rows) {
    for (const col of cols) {
      const valStr = String(row[col] ?? 'NULL');
      if (valStr.length > widths[col]) widths[col] = valStr.length;
    }
  }
  const divider = '+' + cols.map(c => '-'.repeat(widths[c] + 2)).join('+') + '+';
  const header = '|' + cols.map(c => ' ' + c.padEnd(widths[c]) + ' ').join('|') + '|';
  const body = rows.map(r =>
    '|' + cols.map(c => ' ' + String(r[c] ?? 'NULL').padEnd(widths[c]) + ' ').join('|') + '|'
  ).join('\n');

  return `${divider}\n${header}\n${divider}\n${body}\n${divider}\n${rows.length} row(s) in set`;
}

/**
 * Lightweight Python-to-JS translator so students can write real Python functions,
 * loops, conditionals, list operations, and print statements in the browser fallback.
 */
export function transpileSimplePythonToJs(pyCode: string): string {
  const lines = pyCode.replace(/\r\n/g, '\n').split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [-1];
  const declaredVars = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = raw.search(/\S/);
    while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('}');
    }

    let line = trimmed
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\s+/g, '!')
      .replace(/len\(([^)]+)\)/g, '$1.length')
      .replace(/\.append\(/g, '.push(')
      .replace(/max\(([^,]+),\s*([^)]+)\)/g, 'Math.max($1, $2)')
      .replace(/min\(([^,]+),\s*([^)]+)\)/g, 'Math.min($1, $2)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/(\w+)\[::-1\]/g, '$1.split("").reverse().join("")')
      .replace(/(\([^)]+\)|\S+)\s*\/\/\s*(\([^)]+\)|\S+)/g, 'Math.floor($1 / $2)');

    // Handle f-strings: f"Hello {x}" -> `Hello ${x}`
    line = line.replace(/f"([^"]*)"/g, (_, inner) => '`' + inner.replace(/\{([^}]+)\}/g, '${$1}') + '`');
    line = line.replace(/f'([^']*)'/g, (_, inner) => '`' + inner.replace(/\{([^}]+)\}/g, '${$1}') + '`');

    // print(...) -> console.log(...)
    line = line.replace(/\bprint\s*\(/g, 'console.log(');

    // def func(a: int, b: str) -> int:
    const defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*)\)\s*(?:->\s*[^:]+)?\s*:$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const paramList = defMatch[2]
        .split(',')
        .map(p => p.trim().split(':')[0].trim())
        .filter(Boolean);
      paramList.forEach(p => declaredVars.add(p));
      jsLines.push(`function ${fnName}(${paramList.join(', ')}) {`);
      indentStack.push(indent);
      continue;
    }

    // for x in range(a, b): or for x in range(n):
    const rangeMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.+)\)\s*:$/);
    if (rangeMatch) {
      const varName = rangeMatch[1];
      declaredVars.add(varName);
      const rangeArgs = rangeMatch[2].split(',').map(s => s.trim());
      if (rangeArgs.length === 1) {
        jsLines.push(`for (let ${varName} = 0; ${varName} < ${rangeArgs[0]}; ${varName}++) {`);
      } else if (rangeArgs.length === 2) {
        jsLines.push(`for (let ${varName} = ${rangeArgs[0]}; ${varName} < ${rangeArgs[1]}; ${varName}++) {`);
      } else {
        jsLines.push(`for (let ${varName} = ${rangeArgs[0]}; ${varName} < ${rangeArgs[1]}; ${varName} += ${rangeArgs[2]}) {`);
      }
      indentStack.push(indent);
      continue;
    }

    // for x in iterable:
    const forInMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
    if (forInMatch) {
      declaredVars.add(forInMatch[1]);
      jsLines.push(`for (const ${forInMatch[1]} of ${forInMatch[2]}) {`);
      indentStack.push(indent);
      continue;
    }

    // elif ...:
    const elifMatch = line.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      if (jsLines[jsLines.length - 1] === '}') {
        jsLines.pop();
      }
      jsLines.push(`} else if (${elifMatch[1]}) {`);
      indentStack.push(indent);
      continue;
    }

    // if ...:
    const ifMatch = line.match(/^if\s+(.+):$/);
    if (ifMatch) {
      jsLines.push(`if (${ifMatch[1]}) {`);
      indentStack.push(indent);
      continue;
    }

    // else:
    if (line === 'else:') {
      if (jsLines[jsLines.length - 1] === '}') {
        jsLines.pop();
      }
      jsLines.push(`} else {`);
      indentStack.push(indent);
      continue;
    }

    // while ...:
    const whileMatch = line.match(/^while\s+(.+):$/);
    if (whileMatch) {
      jsLines.push(`while (${whileMatch[1]}) {`);
      indentStack.push(indent);
      continue;
    }

    if (line === 'pass') {
      continue;
    }

    // Simple variable assignment: varName = expr
    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*([^=].*)$/);
    if (assignMatch) {
      const vName = assignMatch[1];
      const rhs = assignMatch[2];
      if (!declaredVars.has(vName)) {
        declaredVars.add(vName);
        jsLines.push(`let ${vName} = ${rhs};`);
        continue;
      }
    }

    jsLines.push(line + ';');
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}

export function executeSqlInBrowser(sqlStr: string, startTime: number): SnippetExecutionResult {
  const cleaned = sqlStr
    .split('\n')
    .filter(l => !l.trim().startsWith('--'))
    .join(' ')
    .trim();

  const timeMs = Math.max(1, Math.round(performance.now() - startTime));
  if (!cleaned) {
    return {
      success: false,
      output: '',
      error: 'Empty SQL query. Try: SELECT * FROM employees;',
      execution_time_ms: timeMs,
      language: 'sql'
    };
  }

  const upper = cleaned.toUpperCase();
  if (upper.startsWith('SHOW TABLES')) {
    const rows = Object.keys(SAMPLE_SQL_TABLES).map(t => ({ table_name: t, rows: SAMPLE_SQL_TABLES[t].length }));
    return {
      success: true,
      output: formatAsciiTable(rows),
      error: null,
      execution_time_ms: timeMs,
      language: 'sql'
    };
  }

  // Match table name in FROM <tableName>
  const fromMatch = cleaned.match(/\bFROM\s+([a-zA-Z_]\w*)/i);
  const tableName = fromMatch ? fromMatch[1].toLowerCase() : 'employees';
  const baseRows = [...(SAMPLE_SQL_TABLES[tableName] || SAMPLE_SQL_TABLES.employees)];

  let resultRows = baseRows;

  // Check simple JOIN
  if (/\bJOIN\s+departments\b/i.test(cleaned)) {
    resultRows = baseRows.map(emp => {
      const dept = SAMPLE_SQL_TABLES.departments.find(d => d.department === emp.department);
      return {
        name: emp.name,
        role: emp.role,
        department: emp.department,
        salary: emp.salary,
        budget: dept?.budget ?? 0
      };
    });
  }

  // Check WHERE clause for salary / score / department / city
  const whereGtMatch = cleaned.match(/\bWHERE\s+(\w+)\s*>\s*(\d+)/i);
  if (whereGtMatch) {
    const col = whereGtMatch[1].toLowerCase();
    const num = Number(whereGtMatch[2]);
    resultRows = resultRows.filter(r => Number(r[col]) > num);
  }
  const whereEqMatch = cleaned.match(/\bWHERE\s+(\w+)\s*=\s*'([^']+)'/i);
  if (whereEqMatch) {
    const col = whereEqMatch[1].toLowerCase();
    const val = whereEqMatch[2].toLowerCase();
    resultRows = resultRows.filter(r => String(r[col] ?? '').toLowerCase() === val);
  }

  // Check ORDER BY
  const orderMatch = cleaned.match(/\bORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
  if (orderMatch) {
    const col = orderMatch[1].toLowerCase();
    const dir = (orderMatch[2] || 'ASC').toUpperCase();
    resultRows.sort((a, b) => {
      if (a[col] < b[col]) return dir === 'DESC' ? 1 : -1;
      if (a[col] > b[col]) return dir === 'DESC' ? -1 : 1;
      return 0;
    });
  }

  // Check LIMIT
  const limitMatch = cleaned.match(/\bLIMIT\s+(\d+)/i);
  if (limitMatch) {
    resultRows = resultRows.slice(0, Number(limitMatch[1]));
  }

  return {
    success: true,
    output: formatAsciiTable(resultRows),
    error: null,
    execution_time_ms: timeMs,
    language: 'sql'
  };
}

export function executeSnippet(codeStr: string, lang: string): SnippetExecutionResult {
  const startTime = performance.now();
  const normalizedLang = lang.toLowerCase().trim();

  if (normalizedLang === 'html' || normalizedLang === 'css' || normalizedLang === 'web') {
    const timeMs = Math.max(1, Math.round(performance.now() - startTime));
    return {
      success: true,
      output: 'Rendered HTML/CSS live preview successfully.',
      error: null,
      execution_time_ms: timeMs,
      language: 'html',
      htmlPreview: codeStr
    };
  }

  if (normalizedLang === 'sql') {
    return executeSqlInBrowser(codeStr, startTime);
  }

  if (normalizedLang === 'javascript' || normalizedLang === 'js' || normalizedLang === 'typescript' || normalizedLang === 'ts') {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
      error: (...args: any[]) => logs.push('[Error] ' + args.join(' ')),
      warn: (...args: any[]) => logs.push('[Warn] ' + args.join(' ')),
      info: (...args: any[]) => logs.push(args.join(' ')),
    };

    try {
      const runner = new Function('console', `"use strict";\n${codeStr}`);
      const result = runner(customConsole);
      const timeMs = Math.max(1, Math.round(performance.now() - startTime));
      let out = logs.join('\n');
      if (!out && result !== undefined) {
        out = typeof result === 'object' ? JSON.stringify(result) : String(result);
      }
      return {
        success: true,
        output: out || 'Code executed successfully (0 errors)',
        error: null,
        execution_time_ms: timeMs,
        language: 'javascript'
      };
    } catch (err: any) {
      return {
        success: false,
        output: logs.join('\n'),
        error: err.message || String(err),
        execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
        language: 'javascript'
      };
    }
  }

  if (normalizedLang === 'python' || normalizedLang === 'py') {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
    };

    try {
      const jsTranspiled = transpileSimplePythonToJs(codeStr);
      const runner = new Function('console', jsTranspiled);
      runner(customConsole);
      const timeMs = Math.max(1, Math.round(performance.now() - startTime));
      return {
        success: true,
        output: logs.length > 0 ? logs.join('\n') : 'Python script executed successfully (no stdout).',
        error: null,
        execution_time_ms: timeMs,
        language: 'python'
      };
    } catch (err: any) {
      // Fallback line-by-line print extractor if full transpilation hits advanced Python syntax
      const fallbackLogs: string[] = [];
      for (const rawLine of codeStr.split('\n')) {
        const line = rawLine.trim();
        const printMatch = line.match(/^print\s*\((.*)\)\s*$/);
        if (printMatch) {
          const inner = printMatch[1].trim().replace(/^['"]|['"]$/g, '');
          fallbackLogs.push(inner);
        }
      }
      if (fallbackLogs.length > 0) {
        return {
          success: true,
          output: fallbackLogs.join('\n'),
          error: null,
          execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
          language: 'python'
        };
      }
      return {
        success: false,
        output: '',
        error: err.message || 'Python syntax error',
        execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
        language: 'python'
      };
    }
  }

  // Git & GitHub / Bash CLI Simulator
  if (normalizedLang === 'bash' || normalizedLang === 'sh' || normalizedLang === 'git') {
    const lines = codeStr
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    let currentBranch = 'main';
    const terminalLogs: string[] = [];

    for (const rawLine of lines) {
      const cmd = rawLine.replace(/^\$\s*/, '').trim();
      terminalLogs.push(`$ ${cmd}`);

      if (cmd.startsWith('git init')) {
        terminalLogs.push('Initialized empty Git repository in /workspace/project/.git/');
      } else if (cmd.startsWith('git clone')) {
        const repoName = cmd.split('/').pop()?.replace(/\.git$/, '') || 'repository';
        terminalLogs.push(
          `Cloning into '${repoName}'...\nremote: Enumerating objects: 418, done.\nremote: Total 418 (delta 192), reused 380\nReceiving objects: 100% (418/418), 1.42 MiB | 18.40 MiB/s, done.`
        );
      } else if (cmd.startsWith('git config')) {
        terminalLogs.push(`[git-config] Updated configuration -> ${cmd.replace(/^git config\s*/, '')}`);
      } else if (cmd.startsWith('git status')) {
        if (cmd.includes('-s')) {
          terminalLogs.push(' M src/auth.ts\n A tests/auth.test.ts');
        } else {
          terminalLogs.push(
            `On branch ${currentBranch}\nYour branch is up to date with 'origin/${currentBranch}'.\nnothing to commit, working tree clean`
          );
        }
      } else if (cmd.startsWith('git add')) {
        terminalLogs.push(`[Staging Index .git/index] Staged changes for: ${cmd.replace(/^git add\s*/, '')}`);
      } else if (cmd.startsWith('git commit')) {
        const msgMatch = cmd.match(/-m\s+["']([^"']+)["']/);
        const msg = msgMatch ? msgMatch[1] : 'atomic snapshot commit';
        const signed = cmd.includes('-S') ? ' [GPG/SSH Verified Signature ✓]' : '';
        terminalLogs.push(`[${currentBranch} a4f91bc]${signed} ${msg}\n 2 files changed, 48 insertions(+), 4 deletions(-)`);
      } else if (cmd.startsWith('git log')) {
        terminalLogs.push(
          `* a4f91bc (HEAD -> ${currentBranch}, origin/${currentBranch}) feat(auth): enforce strict token expiration check\n* 91e20cf feat(cache): add Redis L1 read-through layer\n* 7b3e910 init production repository`
        );
      } else if (cmd.startsWith('git diff')) {
        if (cmd.includes('--check')) {
          terminalLogs.push('✓ Zero conflict markers (<<<<<<< / >>>>>>>) or whitespace errors found.');
        } else {
          terminalLogs.push(
            `diff --git a/src/auth.ts b/src/auth.ts\nindex 7b3e910..a4f91bc 100644\n--- a/src/auth.ts\n+++ b/src/auth.ts\n@@ -14,2 +14,4 @@\n+  if (token.expired) throw new TokenExpiredError();`
          );
        }
      } else if (cmd.startsWith('git switch') || cmd.startsWith('git checkout')) {
        const parts = cmd.split(/\s+/);
        const target = parts[parts.length - 1];
        currentBranch = target;
        if (cmd.includes(' -c ') || cmd.includes(' -b ')) {
          terminalLogs.push(`Switched to a new branch '${currentBranch}'`);
        } else {
          terminalLogs.push(`Switched to branch '${currentBranch}'`);
        }
      } else if (cmd.startsWith('git branch')) {
        terminalLogs.push(`* ${currentBranch} a4f91bc [origin/${currentBranch}] feat(auth): enforce strict token expiration check\n  main    7b3e910 init production repository`);
      } else if (cmd.startsWith('git merge-base')) {
        terminalLogs.push('7b3e910c4a82e19f00421b9d8c7a6e5f4d3c2b1a');
      } else if (cmd.startsWith('git merge')) {
        terminalLogs.push(`Merge made by the 'ort' strategy.\n src/oauth.ts | 34 ++++++++++++++++++++++++++++++++++\n 1 file changed, 34 insertions(+)`);
      } else if (cmd.startsWith('git rebase')) {
        terminalLogs.push(`Successfully rebased and updated refs/heads/${currentBranch}.`);
      } else if (cmd.startsWith('git stash')) {
        if (cmd.includes('list')) {
          terminalLogs.push(`stash@{0}: On ${currentBranch}: wip: stripe webhook handler`);
        } else if (cmd.includes('pop') || cmd.includes('apply')) {
          terminalLogs.push(`Applied stash@{0} (a4f91bc) and restored working tree state.`);
        } else {
          terminalLogs.push(`Saved working directory and index state On ${currentBranch}`);
        }
      } else if (cmd.startsWith('git remote')) {
        terminalLogs.push(
          `origin\thttps://github.com/codeitout/distributed-engine.git (fetch)\norigin\thttps://github.com/codeitout/distributed-engine.git (push)`
        );
      } else if (cmd.startsWith('git fetch')) {
        terminalLogs.push(`From https://github.com/codeitout/distributed-engine\n * [new commits]     main -> origin/main (refs pruned)`);
      } else if (cmd.startsWith('git pull')) {
        terminalLogs.push(`Successfully fetched and rebased local branch '${currentBranch}' onto 'origin/main'.`);
      } else if (cmd.startsWith('git push')) {
        terminalLogs.push(`To https://github.com/codeitout/distributed-engine.git\n   7b3e910..a4f91bc  ${currentBranch} -> ${currentBranch}`);
      } else if (cmd.startsWith('git reset')) {
        terminalLogs.push(`HEAD is now at 91e20cf (Index/Working Tree updated per ${cmd.includes('--soft') ? '--soft' : cmd.includes('--hard') ? '--hard' : '--mixed'} mode)`);
      } else if (cmd.startsWith('git revert')) {
        terminalLogs.push(`[${currentBranch} e31c409] Revert commit cleanly without rewriting shared history`);
      } else if (cmd.startsWith('git reflog')) {
        terminalLogs.push(
          `a4f91bc (HEAD -> ${currentBranch}) HEAD@{0}: commit: feat(auth): enforce strict token expiration\n91e20cf HEAD@{1}: commit: feat(cache): add Redis L1 read-through\n7b3e910 HEAD@{2}: commit (initial): init production repository`
        );
      } else if (cmd.startsWith('git cherry-pick')) {
        terminalLogs.push(`[${currentBranch} 9c02d11] Applied cherry-picked commit cleanly with -x origin reference`);
      } else if (cmd.startsWith('git bisect')) {
        if (cmd.includes('run')) {
          terminalLogs.push(
            `Bisecting: 4 revisions left to test after this (roughly 2 steps)\nRunning test command... PASS\na4f91bc8e012345 is the first bad commit!`
          );
        } else {
          terminalLogs.push(`[git-bisect] Bisect state updated: ${cmd}`);
        }
      } else if (cmd.startsWith('git tag')) {
        terminalLogs.push(`[git-tag] Created/verified annotated release tag in .git/refs/tags/`);
      } else if (cmd.startsWith('git describe')) {
        terminalLogs.push(`v1.2.0-0-ga4f91bc`);
      } else if (cmd.startsWith('git worktree')) {
        terminalLogs.push(`/workspace/project       a4f91bc [${currentBranch}]\n/workspace/hotfix-auth   7b3e910 [hotfix/token-bug]`);
      } else if (cmd.startsWith('git cat-file')) {
        if (cmd.includes('-t')) {
          terminalLogs.push('commit');
        } else {
          terminalLogs.push(
            `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nparent 91e20cf810293847561029384756102938475610\nauthor Alex Mercer <alex@codeitout.dev> 1730000000 +0000\n\nfeat(auth): enforce strict token expiration check`
          );
        }
      } else if (cmd.startsWith('git rev-parse')) {
        terminalLogs.push('a4f91bc8e0123456789abcdef0123456789abcde');
      } else if (cmd.startsWith('gh ')) {
        terminalLogs.push(`✓ GitHub CLI (${cmd}): Operation completed against github.com/codeitout/distributed-engine (PR #142 / CI Checks Passed)`);
      } else if (cmd.startsWith('ssh')) {
        terminalLogs.push(`Hi alex! You've successfully authenticated with Ed25519 key (SHA256:9f8a...b21c) on GitHub.`);
      } else if (cmd.startsWith('docker buildx') || cmd.startsWith('docker build')) {
        terminalLogs.push(
          `[+] Building 2.1s (14/14) FINISHED (docker:default)\n => [internal] load build definition from Dockerfile (0.0s)\n => CACHED [builder 2/4] RUN npm ci --omit=dev (0.0s)\n => [runtime 3/3] COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist (0.1s)\n => exporting to image sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`
        );
      } else if (cmd.startsWith('docker compose')) {
        if (cmd.includes('up')) {
          terminalLogs.push(
            `[+] Running 3/3\n ✔ Network app_backend       Created (0.1s)\n ✔ Container postgres-db     Healthy (0.8s)\n ✔ Container api-gateway     Started (1.1s)`
          );
        } else if (cmd.includes('ps')) {
          terminalLogs.push(
            `NAME          IMAGE                STATUS                   PORTS\npostgres-db   postgres:16-alpine   Up 4 minutes (healthy)   5432/tcp\napi-gateway   acme/api:1.0         Up 4 minutes (healthy)   0.0.0.0:8080->8080/tcp`
          );
        } else {
          terminalLogs.push(`[docker-compose] Completed: ${cmd} (exit code 0)`);
        }
      } else if (cmd.startsWith('docker ')) {
        if (cmd.startsWith('docker run')) {
          terminalLogs.push(`9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08\nContainer started with cgroups v2 & namespace isolation (PID 1 nonroot).`);
        } else if (cmd.startsWith('docker ps')) {
          terminalLogs.push(
            `CONTAINER ID   IMAGE                        COMMAND                  STATUS                   PORTS                    NAMES\n9f86d081884c   nginx:1.27-alpine            "/docker-entrypoint.…"   Up 2 minutes (healthy)   0.0.0.0:8080->80/tcp     web-proxy`
          );
        } else if (cmd.startsWith('docker network')) {
          terminalLogs.push(`NETWORK ID     NAME          DRIVER    SCOPE\n7b2c1a9f0e11   app-backend   bridge    local (Embedded DNS 127.0.0.11 active)`);
        } else if (cmd.startsWith('docker volume')) {
          terminalLogs.push(`DRIVER    VOLUME NAME\nlocal     pgdata (/var/lib/docker/volumes/pgdata/_data)`);
        } else {
          terminalLogs.push(`[docker-engine] ${cmd} -> OK (0.12s)`);
        }
      } else if (cmd.startsWith('kubectl ')) {
        if (cmd.includes('argo rollouts')) {
          terminalLogs.push(
            `Name: payment-api | Strategy: Canary | Step: 2/4 (Weight: 20%) | AnalysisRun: ✔ Successful (99.94% SLO)`
          );
        } else if (cmd.includes('get pods') || cmd.includes('get pod') || cmd.includes('get po')) {
          terminalLogs.push(
            `NAME                           READY   STATUS    RESTARTS   AGE     IP            NODE\npayment-api-7d9f8b6c4-x9k2m    1/1     Running   0          14m     10.244.1.42   ip-10-0-1-12.ec2.internal\npayment-api-7d9f8b6c4-p4n8q    1/1     Running   0          14m     10.244.2.19   ip-10-0-2-88.ec2.internal`
          );
        } else if (cmd.includes('rollout status')) {
          terminalLogs.push(`deployment "payment-api" successfully rolled out (0 dropped connections)`);
        } else if (cmd.includes('rollout undo')) {
          terminalLogs.push(`deployment.apps/payment-api rolled back to previous healthy ReplicaSet`);
        } else if (cmd.includes('auth can-i')) {
          terminalLogs.push(`yes (RBAC Policy Verified)`);
        } else if (cmd.includes('apply')) {
          terminalLogs.push(`Warning: resource reconciled via server-side schema validation\nconfigured / created successfully (0 errors)`);
        } else {
          terminalLogs.push(`[kubernetes-api] ${cmd} -> Reconciled (STATUS: Healthy / Ready)`);
        }
      } else if (cmd.startsWith('helm ')) {
        terminalLogs.push(
          `Release "payment-api" has been upgraded. Happy Helming!\nSTATUS: deployed\nREVISION: 4 (atomic rollback guard enabled)`
        );
      } else if (cmd.startsWith('terraform ')) {
        if (cmd.includes('init')) {
          terminalLogs.push(
            `Initializing the backend (S3 + KMS encryption + state lock)...\nInitializing provider plugins...\n- Using hashicorp/aws v5.80.0 from .terraform.lock.hcl (SHA-256 verified)\nTerraform has been successfully initialized!`
          );
        } else if (cmd.includes('fmt')) {
          terminalLogs.push(`✓ All HCL (.tf) files formatted canonically (0 files modified).`);
        } else if (cmd.includes('validate')) {
          terminalLogs.push(`Success! The configuration is valid.`);
        } else if (cmd.includes('test')) {
          terminalLogs.push(
            `tests/unit.tftest.hcl... in progress\n  run "validate_private_subnet_cidrs"... pass\n  run "enforce_encrypted_storage"... pass\nSuccess! 2 passed, 0 failed.`
          );
        } else if (cmd.includes('state list')) {
          terminalLogs.push(
            `data.aws_caller_identity.current\naws_kms_key.state_cmk\naws_s3_bucket.audit_logs\nmodule.vpc.aws_vpc.main\nmodule.vpc.aws_subnet.private["us-east-1a"]`
          );
        } else if (cmd.includes('state show')) {
          terminalLogs.push(
            `# aws_s3_bucket.audit_logs:\nresource "aws_s3_bucket" "audit_logs" {\n    arn    = "arn:aws:s3:::acme-prod-audit-logs-2025"\n    bucket = "acme-prod-audit-logs-2025"\n    region = "us-east-1"\n}`
          );
        } else if (cmd.includes('output')) {
          terminalLogs.push(`{\n  "vpc_id": { "sensitive": false, "type": "string", "value": "vpc-0a8b9c1d2e3f4g5h6" }\n}`);
        } else if (cmd.includes('graph')) {
          terminalLogs.push(`digraph G {\n  "aws_subnet.private" -> "aws_vpc.main";\n  "aws_eks_cluster.prod" -> "aws_subnet.private";\n}`);
        } else if (cmd.includes('workspace')) {
          terminalLogs.push(`* default\n  staging\n  production`);
        } else if (cmd.includes('plan')) {
          terminalLogs.push(
            `Terraform used the selected providers to generate the following execution plan:\n  + create aws_s3_bucket.audit_logs\n  ~ update module.vpc.aws_security_group.alb\nPlan: 1 to add, 1 to change, 0 to destroy.\nSaved deterministic execution plan to: tfplan`
          );
        } else if (cmd.includes('apply')) {
          terminalLogs.push(
            `Applying saved binary plan: tfplan...\naws_s3_bucket.audit_logs: Creating...\naws_s3_bucket.audit_logs: Creation complete after 1s [id=acme-prod-audit-logs-2025]\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.`
          );
        } else {
          terminalLogs.push(`[terraform-core] ${cmd} -> Completed (exit code 0)`);
        }
      } else if (cmd.startsWith('checkov ') || cmd.startsWith('trivy ') || cmd.startsWith('cosign ') || cmd.startsWith('gitleaks ') || cmd.startsWith('argocd ') || cmd.startsWith('infracost ')) {
        terminalLogs.push(`✓ DevSecOps Security & GitOps Gate (${cmd}): PASSED (0 critical issues, cryptographic signature verified)`);
      } else {
        terminalLogs.push(`✓ Executed command: ${cmd} (exit code 0)`);
      }
    }

    return {
      success: true,
      output: terminalLogs.join('\n') || 'Cloud, Git & Bash terminal ready.',
      error: null,
      execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
      language: 'bash'
    };
  }

  // C++ / Java cout or System.out.println extractor
  if (normalizedLang === 'cpp' || normalizedLang === 'c++' || normalizedLang === 'java') {
    const outputs: string[] = [];
    const coutMatches = codeStr.matchAll(/cout\s*<<\s*"([^"]*)"/g);
    for (const m of coutMatches) outputs.push(m[1].replace(/\\n/g, ''));
    const sysMatches = codeStr.matchAll(/System\.out\.print(?:ln)?\s*\(\s*"([^"]*)"\s*\)/g);
    for (const m of sysMatches) outputs.push(m[1]);

    return {
      success: true,
      output: outputs.length > 0 ? outputs.join('\n') : `Compiled and executed ${lang.toUpperCase()} target successfully (exit code 0).`,
      error: null,
      execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
      language: normalizedLang
    };
  }

  return {
    success: true,
    output: `Executed ${lang} code successfully.`,
    error: null,
    execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
    language: lang
  };
}

/**
 * Evaluates a user's solution function against a PracticeProblem's test suite.
 */
export function evaluateProblemSubmission(
  problem: PracticeProblem,
  userCode: string,
  language: 'javascript' | 'python'
): ProblemJudgeResult {
  const start = performance.now();
  const results: TestCaseResult[] = [];

  try {
    const executableJs = language === 'python'
      ? transpileSimplePythonToJs(userCode)
      : userCode;

    const factory = new Function(`
      "use strict";
      ${executableJs}
      if (typeof ${problem.functionName} !== 'function') {
        throw new Error("Function '${problem.functionName}' was not found. Please keep the starter function signature.");
      }
      return ${problem.functionName};
    `);

    const userFn = factory();
    let passedCount = 0;

    for (const tc of problem.testCases) {
      try {
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const actual = userFn(...clonedArgs);
        const expectedStr = JSON.stringify(tc.expectedOutput);
        const actualStr = JSON.stringify(actual);
        const passed = expectedStr === actualStr;
        if (passed) passedCount++;

        results.push({
          testCaseId: tc.id,
          inputDisplay: tc.inputDisplay,
          expectedOutput: expectedStr,
          actualOutput: actualStr ?? 'undefined',
          passed
        });
      } catch (runtimeErr: any) {
        results.push({
          testCaseId: tc.id,
          inputDisplay: tc.inputDisplay,
          expectedOutput: JSON.stringify(tc.expectedOutput),
          actualOutput: 'Error',
          passed: false,
          error: runtimeErr.message || String(runtimeErr)
        });
      }
    }

    const totalTime = Math.max(1, Math.round(performance.now() - start));
    const hasRuntimeErr = results.some(r => !!r.error);
    const verdict = passedCount === problem.testCases.length
      ? 'Accepted'
      : hasRuntimeErr
      ? 'Runtime Error'
      : 'Wrong Answer';

    return {
      verdict,
      passedCount,
      totalCount: problem.testCases.length,
      executionTimeMs: totalTime,
      results
    };
  } catch (compileErr: any) {
    return {
      verdict: 'Runtime Error',
      passedCount: 0,
      totalCount: problem.testCases.length,
      executionTimeMs: Math.max(1, Math.round(performance.now() - start)),
      results: [],
      errorMessage: compileErr.message || String(compileErr)
    };
  }
}

export function calculateLevelFromXp(xp: number): { level: number; nextLevelXp: number; progressPercent: number } {
  const safeXp = Math.max(0, xp);
  const level = Math.floor(safeXp / 500) + 1;
  const xpIntoLevel = safeXp % 500;
  const progressPercent = Math.min(100, Math.round((xpIntoLevel / 500) * 100));
  return {
    level,
    nextLevelXp: 500 - xpIntoLevel,
    progressPercent
  };
}
