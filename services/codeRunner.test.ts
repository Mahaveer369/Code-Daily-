import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  executeSnippet,
  evaluateProblemSubmission,
  calculateLevelFromXp,
} from './codeRunner';
import { PRACTICE_PROBLEMS } from './practiceProblems';
import { EXPANDED_COURSES } from './curriculum/deepCatalog25';
import { getCurriculumLesson } from './curriculum';
import { getTrackVisualDataUri, HERO_ACADEMY_VISUAL_URI } from './curriculum/visualAssets';
import { formatLatexMath, parseMarkdownTableBlock } from '../components/MarkdownRenderer';
import { getSuitedLanguagesForCourse } from '../components/CodePlayground';

test('executeSnippet runs JavaScript and captures console output', () => {
  const res = executeSnippet('const arr = [1, 2, 3]; console.log(arr.reduce((a, b) => a + b, 0));', 'javascript');
  assert.equal(res.success, true);
  assert.equal(res.output.trim(), '6');
});

test('executeSnippet runs Python functions, loops, and print statements', () => {
  const py = `
def add_vals(a, b):
    return a + b

print(add_vals(15, 27))
`;
  const res = executeSnippet(py, 'python');
  assert.equal(res.success, true);
  assert.equal(res.output.trim(), '42');
});

test('executeSnippet runs SQL queries against in-memory relational tables', () => {
  const res = executeSnippet("SELECT * FROM employees WHERE department = 'Engineering' ORDER BY salary DESC LIMIT 2;", 'sql');
  assert.equal(res.success, true);
  assert.equal(res.output.includes('Priya Patel'), true);
  assert.equal(res.output.includes('2 row(s) in set'), true);
});

test('executeSnippet returns live HTML preview payload for HTML/CSS snippets', () => {
  const html = '<div class="box">Hello Code It Out</div>';
  const res = executeSnippet(html, 'html');
  assert.equal(res.success, true);
  assert.equal(res.htmlPreview, html);
});

test('getSuitedLanguagesForCourse restricts Code Lab strictly to course-suited languages', () => {
  const htmlLangs = getSuitedLanguagesForCourse('c-html').map((l) => l.id);
  assert.deepEqual(htmlLangs, ['html']);

  const cssLangs = getSuitedLanguagesForCourse('c-css').map((l) => l.id);
  assert.deepEqual(cssLangs, ['html']);

  const jsLangs = getSuitedLanguagesForCourse('c-js').map((l) => l.id);
  assert.deepEqual(jsLangs, ['javascript']);

  const pyLangs = getSuitedLanguagesForCourse('c1').map((l) => l.id);
  assert.deepEqual(pyLangs, ['python']);

  const aiLangs = getSuitedLanguagesForCourse('c12').map((l) => l.id);
  assert.deepEqual(aiLangs, ['python']);

  const sqlLangs = getSuitedLanguagesForCourse('c5').map((l) => l.id);
  assert.deepEqual(sqlLangs, ['sql', 'python']);

  const dsaLangs = getSuitedLanguagesForCourse('c4').map((l) => l.id);
  assert.deepEqual(dsaLangs, ['python', 'cpp', 'javascript']);

  const harnessLangs = getSuitedLanguagesForCourse('c-harness').map((l) => l.id);
  assert.deepEqual(harnessLangs, ['python', 'javascript']);

  const gitLangs = getSuitedLanguagesForCourse('c-git').map((l) => l.id);
  assert.deepEqual(gitLangs, ['bash']);

  const dockerLangs = getSuitedLanguagesForCourse('c-docker').map((l) => l.id);
  assert.deepEqual(dockerLangs, ['bash']);

  const tfLangs = getSuitedLanguagesForCourse('c-terraform').map((l) => l.id);
  assert.deepEqual(tfLangs, ['bash']);
});

test('executeSnippet runs Git, Docker, Kubernetes & Terraform CLI commands in bash terminal simulator', () => {
  const res = executeSnippet(
    'git init\ngit switch -c feat/auth\ngh pr create --fill\ndocker build -t acme/api:1.0 .\nkubectl get pods\nterraform init\nterraform plan -out=tfplan',
    'bash'
  );
  assert.equal(res.success, true);
  assert.equal(res.output.includes('Initialized empty Git repository'), true);
  assert.equal(res.output.includes("Switched to a new branch 'feat/auth'"), true);
  assert.equal(res.output.includes('PR #142'), true);
  assert.equal(res.output.includes('exporting to image sha256:'), true);
  assert.equal(res.output.includes('payment-api-'), true);
  assert.equal(res.output.includes('Terraform has been successfully initialized!'), true);
  assert.equal(res.output.includes('Saved deterministic execution plan to: tfplan'), true);
});

test('evaluateProblemSubmission passes all starter/solution test cases for Two Sum and Binary Search', () => {
  const twoSumProb = PRACTICE_PROBLEMS.find((p) => p.id === 'prob-two-sum')!;
  const judgeJs = evaluateProblemSubmission(twoSumProb, twoSumProb.solutionCode.javascript, 'javascript');
  assert.equal(judgeJs.verdict, 'Accepted');
  assert.equal(judgeJs.passedCount, twoSumProb.testCases.length);

  const judgePy = evaluateProblemSubmission(twoSumProb, twoSumProb.solutionCode.python, 'python');
  assert.equal(judgePy.verdict, 'Accepted');
  assert.equal(judgePy.passedCount, twoSumProb.testCases.length);
});

test('evaluateProblemSubmission detects Wrong Answer when function returns incorrect value', () => {
  const bsProb = PRACTICE_PROBLEMS.find((p) => p.id === 'prob-binary-search')!;
  const wrongCode = 'function binarySearch(nums, target) { return 999; }';
  const judge = evaluateProblemSubmission(bsProb, wrongCode, 'javascript');
  assert.equal(judge.verdict, 'Wrong Answer');
  assert.equal(judge.passedCount, 0);
});

test('calculateLevelFromXp computes accurate student levels and progress percentage', () => {
  const lvl1 = calculateLevelFromXp(250);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.progressPercent, 50);
  assert.equal(lvl1.nextLevelXp, 250);

  const lvl2 = calculateLevelFromXp(500);
  assert.equal(lvl2.level, 2);
  assert.equal(lvl2.progressPercent, 0);
});

test('Time & Space Complexity table and curves exist ONLY on DSA module ds-1 and are removed from non-complexity modules', () => {
  const ds1 = getCurriculumLesson('ds-1');
  assert.ok(ds1, 'ds-1 must exist');
  assert.ok(ds1.complexityTable && ds1.complexityTable.length === 9, 'ds-1 must have 9-row complete complexityTable');
  assert.ok(ds1.diagramSvg?.includes('TIME &amp; SPACE COMPLEXITY CURVES'), 'ds-1 diagramSvg must show complexity curves');
  assert.ok(ds1.contentMarkdown.includes('Why is it $O(\\log N)$?'), 'ds-1 must explain WHY O(log N)');
  assert.ok(ds1.contentMarkdown.includes('Why is it $O(N \\log N)$?'), 'ds-1 must explain WHY O(N log N)');
  assert.ok(ds1.contentMarkdown.includes('Why is it $O(N)$?'), 'ds-1 must explain WHY O(N)');
  assert.ok(ds1.contentMarkdown.includes('Space Complexity $S(N)$'), 'ds-1 must explain Space Complexity S(N)');

  for (const nonComplexityId of ['html-1', 'css-1', 'js-1', 'git-1', 'dk-1', 'tf-1', 'os-1', 'py-1', 'sd-1', 'react-1', 'ds-2']) {
    const lesson = getCurriculumLesson(nonComplexityId);
    assert.ok(lesson, `${nonComplexityId} must exist`);
    assert.equal(lesson.complexityTable, undefined, `${nonComplexityId} must NOT have complexityTable`);
    assert.equal(
      lesson.diagramSvg?.includes('TIME &amp; SPACE COMPLEXITY CURVES'),
      false,
      `${nonComplexityId} diagramSvg must NOT show complexity curves`
    );
  }
});

test('all 18 subject tracks have >= 25 modules each (452 modules total including Docker & K8s and Terraform & CI/CD), HOME Research Highlights, Real-World Use Cases with runnable codeSnippets, and XML-safe SVGs', () => {
  assert.equal(EXPANDED_COURSES.length, 18);
  assert.ok(HERO_ACADEMY_VISUAL_URI.startsWith('data:image/svg+xml;utf8,'));

  const heroDecoded = decodeURIComponent(HERO_ACADEMY_VISUAL_URI.replace('data:image/svg+xml;utf8,', ''));
  assert.equal(/&(?!amp;|lt;|gt;|quot;|apos;)/.test(heroDecoded), false, 'Hero SVG has unescaped &');

  const totalModules = EXPANDED_COURSES.reduce((sum, c) => sum + c.modules.length, 0);
  assert.equal(totalModules, 452, `Expected 452 modules across 18 courses, got ${totalModules}`);

  for (const trackId of ['c-git', 'c-docker', 'c-terraform']) {
    const track = EXPANDED_COURSES.find((c) => c.id === trackId);
    assert.ok(track, `Course ${trackId} must exist`);
    assert.equal(track.modules.length, 25, `${trackId} must have 25 modules`);
    for (const mod of track.modules) {
      const lesson = getCurriculumLesson(mod.id);
      assert.ok(lesson, `Missing lesson ${mod.id}`);
      assert.equal(lesson.mustSolveExercises?.length, 3, `Module ${mod.id} must have 3 command-writing exercises`);
    }
  }

  for (const course of EXPANDED_COURSES) {
    assert.ok(
      course.modules.length >= 25,
      `Course ${course.id} (${course.title}) must have at least 25 modules, got ${course.modules.length}`
    );
    const trackUri = getTrackVisualDataUri(course.id);
    assert.ok(trackUri.startsWith('data:image/svg+xml;utf8,'), `Missing track visual URI for ${course.id}`);

    const decodedSvg = decodeURIComponent(trackUri.replace('data:image/svg+xml;utf8,', ''));
    assert.equal(
      /&(?!amp;|lt;|gt;|quot;|apos;)/.test(decodedSvg),
      false,
      `Track SVG for ${course.id} contains unescaped ampersand`
    );
    const textMatches = decodedSvg.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || [];
    for (const tm of textMatches) {
      const inner = tm.replace(/^<text[^>]*>/, '').replace(/<\/text>$/, '');
      assert.equal(inner.includes('<'), false, `Track SVG for ${course.id} has unescaped < inside <text>: ${inner}`);
    }

    // Chapter 1 (HOME) of every single track must have homeResearchHighlights
    const firstModLesson = getCurriculumLesson(course.modules[0].id);
    assert.ok(
      firstModLesson?.homeResearchHighlights && firstModLesson.homeResearchHighlights.length >= 2,
      `HOME module ${course.modules[0].id} of course ${course.id} must have >= 2 homeResearchHighlights`
    );

    for (const mod of course.modules) {
      const lesson = getCurriculumLesson(mod.id);
      assert.ok(lesson, `Missing lesson content for module ${mod.id} (${mod.title})`);
      assert.ok(lesson.beginnerSummary && lesson.beginnerSummary.length > 10, `Missing beginnerSummary on ${mod.id}`);
      assert.ok(lesson.diagramSvg && lesson.diagramSvg.includes('<svg'), `Missing diagramSvg on ${mod.id}`);
      assert.equal(
        /&(?!amp;|lt;|gt;|quot;|apos;)/.test(lesson.diagramSvg),
        false,
        `Lesson diagramSvg for ${mod.id} contains unescaped ampersand`
      );
      assert.ok(
        lesson.mustSolveExercises && lesson.mustSolveExercises.length >= 2,
        `Module ${mod.id} must have >= 2 mustSolveExercises`
      );
      assert.ok(
        lesson.realWorldUseCases && lesson.realWorldUseCases.length >= 3,
        `Module ${mod.id} must have >= 3 realWorldUseCases`
      );
      for (const uc of lesson.realWorldUseCases!) {
        assert.ok(uc.codeSnippet && uc.codeSnippet.length > 5, `Use case in ${mod.id} must have runnable codeSnippet`);
      }
      assert.ok(lesson.quizzes && lesson.quizzes.length >= 2, `Module ${mod.id} must have >= 2 quiz questions`);
      assert.ok(
        lesson.interviewQuestions && lesson.interviewQuestions.length >= 2,
        `Module ${mod.id} must have >= 2 interview questions`
      );
      assert.ok(
        /```(?:python|py|javascript|js|typescript|ts|sql|html|css|cpp|c\+\+|java|bash|sh|git)\b/i.test(lesson.contentMarkdown),
        `Module ${mod.id} must contain a runnable code block for Try it Yourself`
      );
      assert.ok(
        lesson.contentMarkdown.length >= 1200,
        `Module ${mod.id} contentMarkdown is too brief (${lesson.contentMarkdown.length} chars)`
      );
    }
  }
});

test('AGENT.md exists at repository root and documents scalable system design', () => {
  const agentMdPath = path.resolve(process.cwd(), 'AGENT.md');
  assert.equal(fs.existsSync(agentMdPath), true, 'AGENT.md must exist at repository root');
  const content = fs.readFileSync(agentMdPath, 'utf8');
  assert.ok(content.includes('getSuitedLanguagesForCourse'), 'AGENT.md should document course-suited Code Lab rules');
  assert.ok(content.includes('CURRICULUM_DATA'), 'AGENT.md should document O(1) curriculum lookup');
});

test('formatLatexMath and parseMarkdownTableBlock cleanly format LaTeX math and markdown tables', () => {
  assert.equal(formatLatexMath('$0.2\\text{--}0.5\\,\\mu\\text{s}$'), '0.2–0.5 μs');
  assert.equal(formatLatexMath('$1.5\\text{--}3.0\\,\\mu\\text{s}$'), '1.5–3.0 μs');
  assert.equal(formatLatexMath('$O(N \\log N)$'), 'O(N log N)');

  const tableLines = [
    '| Operation | Microseconds | What Happens Under the Hood |',
    '| :--- | :--- | :--- |',
    '| **User Thread Switch** | $0.2\\text{--}0.5\\,\\mu\\text{s}$ | Saves registers, switches stack pointer. |',
    '| **Process Context Switch** | $1.5\\text{--}3.0\\,\\mu\\text{s}$ | Flushes TLB and reloads CR3. |',
  ];
  const parsed = parseMarkdownTableBlock(tableLines);
  assert.ok(parsed);
  assert.deepEqual(parsed.headers, ['Operation', 'Microseconds', 'What Happens Under the Hood']);
  assert.equal(parsed.rows.length, 2);
  assert.equal(formatLatexMath(parsed.rows[0][1]), '0.2–0.5 μs');
});

test('all 12 practice problems pass automated test-case judge in both JavaScript and Python', () => {
  assert.equal(PRACTICE_PROBLEMS.length, 12);
  for (const prob of PRACTICE_PROBLEMS) {
    const jsRes = evaluateProblemSubmission(prob, prob.solutionCode.javascript, 'javascript');
    assert.equal(jsRes.verdict, 'Accepted', `JS solution failed for ${prob.id}`);
    const pyRes = evaluateProblemSubmission(prob, prob.solutionCode.python, 'python');
    assert.equal(pyRes.verdict, 'Accepted', `Python solution failed for ${prob.id}`);
  }
});
