import { Category, Course, CourseModule, LessonContent, MustSolveExercise } from '../../types';
import { buildLessonArchitectureSvg } from './visualAssets';

export interface GitChapterSpec {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sectionGroup: string;
  analogy: string;
  primaryCmd: string;
  secondaryCmd: string;
  verifyCmd: string;
  explanationMarkdown: string;
  terminalScript: string;
  exercises: [
    { title: string; scenario: string; codeBefore: string; answer: string; accepted?: string[]; codeAfter: string; hint: string; explanation: string },
    { title: string; scenario: string; codeBefore: string; answer: string; accepted?: string[]; codeAfter: string; hint: string; explanation: string },
    { title: string; scenario: string; codeBefore: string; answer: string; accepted?: string[]; codeAfter: string; hint: string; explanation: string }
  ];
  interviewQ: string;
  interviewA: string;
}

const GIT_CHAPTER_SPECS: GitChapterSpec[] = [
  {
    id: 'git-1',
    title: 'Git HOME: How Git Works (Working Tree, Staging Index & .git DAG)',
    description: 'Initialize repositories with git init, configure identity with git config, and understand Blobs, Trees & Commits',
    difficulty: 'Beginner',
    sectionGroup: 'Git Foundations',
    analogy: 'Think of the Working Tree as your workbench, the Staging Index (git add) as the packing box on a loading dock, and the Commit History (git commit) as sealed, cryptographically hashed shipping containers.',
    primaryCmd: 'git init',
    secondaryCmd: 'git config --global user.name "Alex"',
    verifyCmd: 'git status',
    explanationMarkdown: `Git is a **distributed, content-addressable version control system** created by Linus Torvalds for Linux kernel development. Unlike older systems that store file-based diffs, Git snapshots your entire project as a **Directed Acyclic Graph (DAG)** of cryptographic SHA hashes inside the hidden \`.git/\` directory.

### The Three States of Every File in Git
1. **Working Directory (Modified)**: Files you are actively editing on disk, not yet staged for the next snapshot.
2. **Staging Area / Index (\`.git/index\`)**: A binary manifest of exact file versions prepared via \`git add\` that will go into your very next commit.
3. **Local Repository (\`.git/objects\`)**: Immutable **Blob** (file bytes), **Tree** (directory listing), and **Commit** (author + parent SHA + root tree SHA) objects permanently recorded via \`git commit\`.`,
    terminalScript: `# Initialize a brand-new Git repository and configure developer identity
$ git init
$ git config user.name "Alex Mercer"
$ git config user.email "alex@codeitout.dev"
$ git status`,
    exercises: [
      {
        title: 'Command Exercise 1: Initialize a New Local Git Repository',
        scenario: 'You just created a new project folder `payment-service/` and want to initialize a fresh Git repository inside it. Write the exact Git command:',
        codeBefore: '$ ',
        answer: 'git init',
        accepted: ['git init', 'git init .'],
        codeAfter: '\n# Output: Initialized empty Git repository in ./payment-service/.git/',
        hint: 'Use git followed by the 4-letter subcommand for initialize.',
        explanation: '`git init` creates the `.git/` directory containing `objects/`, `refs/heads/`, `HEAD`, and `config`.'
      },
      {
        title: 'Command Exercise 2: Configure Global Git Author Email',
        scenario: 'Set your global Git commit email address across all repositories on your machine:',
        codeBefore: '$ ',
        answer: 'git config --global user.email',
        accepted: ['git config --global user.email', 'git config user.email'],
        codeAfter: ' "alex@engineering.io"',
        hint: 'Use `git config --global user.email` before the quoted email string.',
        explanation: '`git config --global user.email "..."` writes your identity into `~/.gitconfig` so every commit records proper authorship.'
      },
      {
        title: 'Command Exercise 3: Inspect Working Tree & Staging Area Status',
        scenario: 'Check which branch you are on and whether any files are untracked, modified, or staged:',
        codeBefore: '$ ',
        answer: 'git status',
        accepted: ['git status', 'git status -s'],
        codeAfter: '\n# Output: On branch main — nothing to commit, working tree clean',
        hint: 'Type `git status`.',
        explanation: '`git status` compares the Working Directory against the `.git/index` Staging Area and the `HEAD` commit.'
      }
    ],
    interviewQ: 'What are the four internal object types stored inside `.git/objects`, and how do they reference each other?',
    interviewA: '1. Blob (raw compressed file content, no filename), 2. Tree (directory mapping filenames and permissions to Blob/Tree SHAs), 3. Commit (points to a root Tree SHA, parent Commit SHA(s), author, timestamp, and message), and 4. Annotated Tag (points to a Commit SHA with PGP signature/metadata).'
  },
  {
    id: 'git-2',
    title: 'Cloning Repositories & Inspecting Remotes (git clone & git remote)',
    description: 'Clone remote GitHub repositories over HTTPS/SSH, shallow clones (--depth 1), and managing origin/upstream remotes',
    difficulty: 'Beginner',
    sectionGroup: 'Git Foundations',
    analogy: 'Cloning is like downloading not just the latest printed book from a library, but the entire printing press and every historical draft ever written.',
    primaryCmd: 'git clone <repo-url>',
    secondaryCmd: 'git remote -v',
    verifyCmd: 'git remote show origin',
    explanationMarkdown: `When you run \`git clone\`, Git creates a local directory, initializes \`.git/\`, registers the remote URL as **\`origin\`**, downloads all compressed packfiles (\`.pack\`), and checks out the default branch (\`main\`).

### Key Cloning & Remote Commands
- **Full Clone**: \`git clone https://github.com/org/repo.git\`
- **Shallow Clone for Fast CI/CD**: \`git clone --depth 1 https://github.com/org/repo.git\` (downloads only the latest commit snapshot, cutting CI clone time by 90% on monorepos).
- **Inspect Configured Remotes**: \`git remote -v\` lists fetch and push URLs for \`origin\` and \`upstream\`.`,
    terminalScript: `# Clone a GitHub repository and verify configured remote endpoints
$ git clone https://github.com/codeitout/distributed-engine.git
$ git remote -v
$ git status`,
    exercises: [
      {
        title: 'Command Exercise 1: Clone a Remote GitHub Repository',
        scenario: 'Write the command to clone `https://github.com/vercel/next.js.git` onto your machine:',
        codeBefore: '$ ',
        answer: 'git clone',
        accepted: ['git clone'],
        codeAfter: ' https://github.com/vercel/next.js.git',
        hint: 'Use `git clone` before the repository URL.',
        explanation: '`git clone <url>` downloads the entire object graph and checks out the default branch.'
      },
      {
        title: 'Command Exercise 2: List All Remote Names and URLs Verbosely',
        scenario: 'Display the exact fetch and push URLs of every remote connected to your local repository:',
        codeBefore: '$ ',
        answer: 'git remote -v',
        accepted: ['git remote -v', 'git remote --verbose'],
        codeAfter: '\n# origin  https://github.com/org/repo.git (fetch)\n# origin  https://github.com/org/repo.git (push)',
        hint: 'Combine `git remote` with the `-v` (verbose) flag.',
        explanation: '`git remote -v` prints each remote alias (`origin`, `upstream`) alongside its fetch and push URLs.'
      },
      {
        title: 'Command Exercise 3: Shallow Clone Only the Latest Commit for CI',
        scenario: 'In a GitHub Actions pipeline, clone only the single latest commit (depth 1) to save bandwidth:',
        codeBefore: '$ git clone ',
        answer: '--depth 1',
        accepted: ['--depth 1', '--depth=1'],
        codeAfter: ' https://github.com/org/monorepo.git',
        hint: 'Pass `--depth 1` to truncate history to 1 commit.',
        explanation: '`git clone --depth 1` fetches only the tip commit tree without downloading years of historical packfiles.'
      }
    ],
    interviewQ: 'Why do large monorepo CI pipelines use `git clone --filter=blob:none` (blobless clone) instead of a full clone?',
    interviewA: 'A blobless clone downloads all reachable Commit and Tree objects immediately so `git log` and `git merge` work locally, but fetches file Blobs on demand only for the checked-out working tree—reducing network transfer by 80–95%.'
  },
  {
    id: 'git-3',
    title: 'Staging & Committing Atomic Snapshots (git add, git status, git commit)',
    description: 'Stage specific files or interactive hunks (git add -p), craft conventional commit messages, and amend commits',
    difficulty: 'Beginner',
    sectionGroup: 'Git Foundations',
    analogy: 'Staging with `git add -p` is like curating photos into themed album pages before printing, instead of dumping your entire camera roll into one messy folder.',
    primaryCmd: 'git add -p',
    secondaryCmd: 'git commit -m "feat: ..."',
    verifyCmd: 'git status -s',
    explanationMarkdown: `Professional engineers never blindly run \`git commit -a\` on messy working trees. Using the **Staging Index (\`git add\`)**, you can craft **atomic commits**—where each commit represents one logical, self-contained change that passes all tests and can be reverted cleanly if needed.

### Essential Staging & Commit Commands
- \`git add <file>\`: Stage a specific file into \`.git/index\`.
- \`git add -p\` (**Patch Mode**): Interactively review each changed hunk (\`y\` to stage, \`n\` to skip, \`s\` to split) so debug \`console.log\` lines never sneak into production commits.
- \`git commit -m "feat(auth): verify JWT expiry"\`: Record a permanent commit snapshot.
- \`git commit --amend --no-edit\`: Fold newly staged fixes into the most recent commit before pushing.`,
    terminalScript: `# Stage modified files, verify short status, and create an atomic Conventional Commit
$ git status -s
$ git add src/auth.ts tests/auth.test.ts
$ git commit -m "feat(auth): enforce strict token expiration check"
$ git log -n 1 --oneline`,
    exercises: [
      {
        title: 'Command Exercise 1: Stage All Changes in Current Directory',
        scenario: 'Stage all new and modified files in the current directory into the Staging Index:',
        codeBefore: '$ ',
        answer: 'git add .',
        accepted: ['git add .', 'git add -A', 'git add --all'],
        codeAfter: '\n# All modified and untracked files staged in .git/index',
        hint: 'Use `git add .` or `git add -A`.',
        explanation: '`git add .` stages all modified, deleted, and untracked files under the current directory.'
      },
      {
        title: 'Command Exercise 2: Interactive Patch Staging by Hunk',
        scenario: 'You edited two unrelated features inside the same file. What command lets you interactively choose which code hunks to stage?',
        codeBefore: '$ ',
        answer: 'git add -p',
        accepted: ['git add -p', 'git add --patch'],
        codeAfter: ' src/server.ts',
        hint: 'Use the `-p` (patch) flag with `git add`.',
        explanation: '`git add -p` steps through each diff hunk interactively so you can craft clean, atomic commits.'
      },
      {
        title: 'Command Exercise 3: Commit Staged Changes with an Inline Message',
        scenario: 'Create a commit with an inline message using the `-m` flag:',
        codeBefore: '$ ',
        answer: 'git commit -m',
        accepted: ['git commit -m'],
        codeAfter: ' "fix(api): handle rate limit retry header"',
        hint: 'Type `git commit -m`.',
        explanation: '`git commit -m "<message>"` creates a new Commit object pointing to the staged Tree and updates `HEAD`.'
      }
    ],
    interviewQ: 'Why are "atomic commits" following Conventional Commits (`feat:`, `fix:`, `refactor:`) critical in production engineering teams?',
    interviewA: 'Atomic commits ensure every commit builds and passes tests independently (making `git bisect` and `git revert` painless) and allow automated semantic release tools to generate changelogs and bump SemVer versions automatically.'
  },
  {
    id: 'git-4',
    title: 'Inspecting Changes & Commit History (git diff, git log, git show, git blame)',
    description: 'Compare unstaged vs staged diffs (git diff --staged), graph commit history, and trace line-level authorship',
    difficulty: 'Beginner',
    sectionGroup: 'Git Foundations',
    analogy: '`git diff` is an X-ray of your current edits, `git log --graph` is the aerial map of your project timeline, and `git blame` is the forensic ledger showing who wrote every line and why.',
    primaryCmd: 'git diff --staged',
    secondaryCmd: 'git log --oneline --graph --all',
    verifyCmd: 'git show HEAD',
    explanationMarkdown: `Before committing or opening a Pull Request, you must know how to inspect both **uncommitted diffs** and **historical commit graphs**:

| Command | What It Compares | When to Use It |
| :--- | :--- | :--- |
| \`git diff\` | **Working Tree vs. Staging Index** | See unstaged edits you haven't \`git add\`ed yet. |
| \`git diff --staged\` | **Staging Index vs. HEAD Commit** | Review the exact diff that will go into your next \`git commit\`. |
| \`git log --oneline --graph --all\` | **Commit DAG Visualization** | View compact 7-char SHAs, branch labels, and merge topology. |
| \`git blame -L 10,25 file.ts\` | **Line-by-Line Commit Attribution** | Find the exact commit SHA and PR context that modified lines 10–25. |`,
    terminalScript: `# Compare staged changes and render the ASCII branch graph
$ git diff --staged
$ git log --oneline --graph --decorate -n 5
$ git show --stat HEAD`,
    exercises: [
      {
        title: 'Command Exercise 1: Inspect Staged Changes Before Committing',
        scenario: 'You already ran `git add` on several files. Which command shows the exact diff currently staged in the Index?',
        codeBefore: '$ ',
        answer: 'git diff --staged',
        accepted: ['git diff --staged', 'git diff --cached'],
        codeAfter: '\n# Displays diff between .git/index and HEAD',
        hint: 'Pass `--staged` (or `--cached`) to `git diff`.',
        explanation: 'Plain `git diff` only shows unstaged changes; `git diff --staged` (or `--cached`) shows what is staged for the next commit.'
      },
      {
        title: 'Command Exercise 2: Compact One-Line Commit Graph',
        scenario: 'Display the commit history with each commit on a single line and an ASCII branch graph:',
        codeBefore: '$ ',
        answer: 'git log --oneline --graph',
        accepted: ['git log --oneline --graph', 'git log --graph --oneline'],
        codeAfter: '\n# * a4f91bc (HEAD -> main) feat: add query cache\n# * 82c10de init repo',
        hint: 'Combine `git log` with `--oneline` and `--graph`.',
        explanation: '`git log --oneline --graph` condenses each commit to its short SHA + subject line and draws the DAG topology.'
      },
      {
        title: 'Command Exercise 3: Trace Line-by-Line Authorship of a File',
        scenario: 'Find out which commit and author last modified each line of `src/db.ts`:',
        codeBefore: '$ ',
        answer: 'git blame',
        accepted: ['git blame'],
        codeAfter: ' src/db.ts',
        hint: 'Use `git blame` before the file path.',
        explanation: '`git blame <file>` annotates every line with the commit SHA, author, and timestamp that last touched it.'
      }
    ],
    interviewQ: 'What is the difference between `git log -S "validateToken"` (pickaxe search) and `git grep "validateToken"`?',
    interviewA: '`git grep` searches for strings present in the current snapshot, whereas `git log -S "validateToken"` searches the entire historical commit graph for commits that added or removed occurrences of `"validateToken"` (even if the function was deleted months ago).'
  },
  {
    id: 'git-5',
    title: 'Ignoring Files & Repository Hygiene (.gitignore & git rm --cached)',
    description: 'Configure .gitignore glob rules, untrack accidentally committed .env secrets, and clean untracked build artifacts',
    difficulty: 'Beginner',
    sectionGroup: 'Git Foundations',
    analogy: '`.gitignore` is the security bouncer at the door of your repository: it blocks `node_modules/`, build artifacts, and `.env` secrets from ever entering version control.',
    primaryCmd: 'git rm --cached .env',
    secondaryCmd: 'git clean -fd',
    verifyCmd: 'git check-ignore -v .env',
    explanationMarkdown: `A common mistake is adding \`.env\` to \`.gitignore\` *after* \`.env\` was already tracked by a previous commit. Because \`.gitignore\` only applies to **untracked** files, Git will keep tracking changes to \`.env\` until you explicitly remove it from the Staging Index using **\`git rm --cached .env\`** (which deletes it from Git tracking while keeping your local file intact on disk!).`,
    terminalScript: `# Remove an accidentally tracked .env file from Git index without deleting it from disk
$ git rm --cached .env
$ git check-ignore -v .env
$ git commit -m "chore(security): stop tracking local .env file"`,
    exercises: [
      {
        title: 'Command Exercise 1: Untrack a File Without Deleting It from Disk',
        scenario: 'A teammate accidentally committed `.env`. You added `.env` to `.gitignore`, now remove `.env` from Git tracking while keeping the local file on your machine:',
        codeBefore: '$ ',
        answer: 'git rm --cached .env',
        accepted: ['git rm --cached .env'],
        codeAfter: '\n# rm \'.env\' (removed from index, kept in working tree)',
        hint: 'Use `git rm --cached .env`.',
        explanation: '`git rm --cached <file>` removes the file from `.git/index` so future commits ignore it, without deleting the physical file from your working directory.'
      },
      {
        title: 'Command Exercise 2: Debug Which .gitignore Rule Matches a File',
        scenario: 'Verify which exact line in `.gitignore` is causing `dist/bundle.js` to be ignored:',
        codeBefore: '$ ',
        answer: 'git check-ignore -v',
        accepted: ['git check-ignore -v'],
        codeAfter: ' dist/bundle.js',
        hint: 'Use `git check-ignore -v`.',
        explanation: '`git check-ignore -v <path>` prints the exact `.gitignore` file and line number matching the target path.'
      },
      {
        title: 'Command Exercise 3: Remove Untracked Files and Directories',
        scenario: 'Delete all untracked build files and untracked directories from your working tree:',
        codeBefore: '$ ',
        answer: 'git clean -fd',
        accepted: ['git clean -fd', 'git clean -df'],
        codeAfter: '\n# Removing build/ and coverage/',
        hint: 'Use `git clean` with `-f` (force) and `-d` (directories): `git clean -fd`.',
        explanation: '`git clean -fd` purges untracked files (`-f`) and untracked directories (`-d`). Always preview with `git clean -nd` first!'
      }
    ],
    interviewQ: 'If a developer commits an AWS secret key in `.env` and pushes it to GitHub, why is `git rm --cached .env` followed by a new commit NOT enough?',
    interviewA: 'Because the secret still exists inside the previous Commit Blob in `.git/objects` history! Anyone cloning the repo can run `git show <old-sha>`. You must immediately rotate/revoke the exposed credential AND rewrite history using `git filter-repo`.'
  },
  {
    id: 'git-6',
    title: 'Branching Internals: Pointers, HEAD & Switching (git branch, git switch)',
    description: 'How branches are lightweight 41-byte SHA pointers in .git/refs/heads/, creating and switching branches',
    difficulty: 'Beginner',
    sectionGroup: 'Branching & Merging',
    analogy: 'In Git, a branch is not a heavy copy of your project folder—it is just a tiny sticky note (41 bytes) holding a commit SHA that moves forward automatically whenever you commit.',
    primaryCmd: 'git switch -c feat/login',
    secondaryCmd: 'git branch -a',
    verifyCmd: 'git branch -d feat/login',
    explanationMarkdown: `Why can Git create a new branch in **0.001 seconds** even on a 50GB repository? Because a Git branch is simply a **41-byte text file** inside \`.git/refs/heads/<branch-name>\` containing the 40-character hexadecimal SHA-1 hash of its tip commit!

And what is **\`HEAD\`**? \`HEAD\` (\`.git/HEAD\`) is a symbolic pointer (` + '`ref: refs/heads/main`' + `) indicating which branch you currently have checked out.`,
    terminalScript: `# Create and switch to a new feature branch in one step
$ git switch -c feat/oauth-login
$ git branch -vv
$ git status`,
    exercises: [
      {
        title: 'Command Exercise 1: Create and Switch to a New Branch (Modern Syntax)',
        scenario: 'Use the modern `git switch` command to create and immediately switch to a new branch named `feat/search`:',
        codeBefore: '$ ',
        answer: 'git switch -c feat/search',
        accepted: ['git switch -c feat/search', 'git checkout -b feat/search'],
        codeAfter: '\n# Switched to a new branch \'feat/search\'',
        hint: 'Use `git switch -c feat/search` (or `git checkout -b feat/search`).',
        explanation: '`git switch -c <branch>` creates a new branch pointer at `HEAD` and switches the working tree to it.'
      },
      {
        title: 'Command Exercise 2: Rename the Current Branch to main',
        scenario: 'Rename your currently checked-out branch to `main`:',
        codeBefore: '$ ',
        answer: 'git branch -M main',
        accepted: ['git branch -M main', 'git branch -m main'],
        codeAfter: '\n# Current branch renamed to main',
        hint: 'Use `git branch -M main`.',
        explanation: '`git branch -M main` forcefully renames the current branch pointer to `main`.'
      },
      {
        title: 'Command Exercise 3: Safely Delete a Merged Feature Branch',
        scenario: 'Delete the local branch `feat/search` ONLY if its commits have already been safely merged:',
        codeBefore: '$ ',
        answer: 'git branch -d feat/search',
        accepted: ['git branch -d feat/search'],
        codeAfter: '\n# Deleted branch feat/search (was a4f91bc).',
        hint: 'Use lowercase `-d` with `git branch`.',
        explanation: 'Lowercase `-d` checks that the branch is fully merged into `HEAD` or its upstream before deleting; uppercase `-D` force-deletes unmerged work.'
      }
    ],
    interviewQ: 'Why did Git 2.23 introduce `git switch` and `git restore` alongside `git checkout`?',
    interviewA: '`git checkout` was overloaded with two completely different responsibilities: switching branches AND discarding file modifications. Splitting them into `git switch` (branch navigation) and `git restore` (file recovery) prevents accidental data loss.'
  },
  {
    id: 'git-7',
    title: 'Merging Branches: Fast-Forward vs. 3-Way Merge Commits (git merge)',
    description: 'How Git computes the Lowest Common Ancestor (merge-base), --ff-only vs --no-ff, and squash merges',
    difficulty: 'Intermediate',
    sectionGroup: 'Branching & Merging',
    analogy: 'Fast-Forward merge is sliding your bookmark forward along a single straight road; a 3-Way Merge is building a bridge that joins two diverged highways back together.',
    primaryCmd: 'git merge --no-ff feat/api',
    secondaryCmd: 'git merge --squash feat/api',
    verifyCmd: 'git merge-base main feat/api',
    explanationMarkdown: `When you run \`git merge feat/api\` while on \`main\`, Git looks at the commit DAG:
1. **Fast-Forward Merge (\`--ff\`)**: If \`main\` has not received any new commits since \`feat/api\` branched off, Git simply moves the \`main\` pointer forward to \`feat/api\` without creating a merge commit.
2. **3-Way Merge (\`--no-ff\`)**: If both \`main\` and \`feat/api\` have new commits, Git finds their **Lowest Common Ancestor (\`git merge-base\`)**, combines both diffs, and creates a **Merge Commit with two parents**.`,
    terminalScript: `# Switch to main and perform an explicit 3-way merge preserving feature branch topology
$ git switch main
$ git merge --no-ff feat/oauth-login -m "Merge branch 'feat/oauth-login' into main"
$ git log --oneline --graph -n 4`,
    exercises: [
      {
        title: 'Command Exercise 1: Merge Only If Fast-Forward Is Possible',
        scenario: 'Merge `origin/main` into your current branch, but abort if a merge commit would be required (forcing linear history):',
        codeBefore: '$ ',
        answer: 'git merge --ff-only',
        accepted: ['git merge --ff-only'],
        codeAfter: ' origin/main',
        hint: 'Pass `--ff-only` to `git merge`.',
        explanation: '`git merge --ff-only` refuses to create a 2-parent merge commit if the branches have diverged.'
      },
      {
        title: 'Command Exercise 2: Combine All Branch Commits into One Staged Change (Squash)',
        scenario: 'Bring all changes from `feat/ messy-wip` into `main` as a single staged commit without keeping the 15 WIP commits:',
        codeBefore: '$ ',
        answer: 'git merge --squash',
        accepted: ['git merge --squash'],
        codeAfter: ' feat/messy-wip',
        hint: 'Pass `--squash` to `git merge`.',
        explanation: '`git merge --squash <branch>` stages the combined diff of the entire feature branch so you can record one clean commit on `main`.'
      },
      {
        title: 'Command Exercise 3: Find the Common Ancestor Commit of Two Branches',
        scenario: 'Print the exact Lowest Common Ancestor (LCA) commit SHA between `main` and `feat/payments`:',
        codeBefore: '$ ',
        answer: 'git merge-base main feat/payments',
        accepted: ['git merge-base main feat/payments'],
        codeAfter: '\n# Output: 7b3e910c4a82...',
        hint: 'Use the `git merge-base` command followed by the two branch names.',
        explanation: '`git merge-base A B` computes the Lowest Common Ancestor in the commit DAG used as the base of a 3-way merge.'
      }
    ],
    interviewQ: 'In a 3-way merge, why does Git need 3 commits (Base, Ours, Theirs) instead of just comparing the 2 branch tips?',
    interviewA: 'Comparing only the 2 branch tips cannot tell whether a line present in Branch A and missing in Branch B was *added* by A or *deleted* by B! Comparing both against their common ancestor (Base) reveals which branch actually changed the line.'
  },
  {
    id: 'git-8',
    title: 'Resolving Merge Conflicts Like a Staff Engineer',
    description: 'Decode <<<<<<< HEAD, =======, and >>>>>>> markers, git checkout --ours/--theirs, and git merge --abort',
    difficulty: 'Intermediate',
    sectionGroup: 'Branching & Merging',
    analogy: 'A merge conflict is simply Git pausing to ask a human: "Two authors edited the exact same paragraph in different ways—which version (or combination) do you want to keep?"',
    primaryCmd: 'git merge --abort',
    secondaryCmd: 'git diff --check',
    verifyCmd: 'git add <resolved-file>',
    explanationMarkdown: `When two branches modify the **exact same lines** of the same file (or one deletes a file while the other edits it), Git pauses the merge and inserts standard conflict markers:
\`\`\`text
<<<<<<< HEAD (Current Branch / Ours)
const timeoutMs = 5000;
=======
const timeoutMs = 10000;
>>>>>>> feat/retry-policy (Incoming Branch / Theirs)
\`\`\`
### Step-by-Step Conflict Resolution Workflow
1. Run \`git status\` to see all \`both modified:\` unmerged files.
2. Edit the file to keep the desired code and **delete all \`<<<<<<<\`, \`=======\`, and \`>>>>>>>\` markers**.
3. Run \`git diff --check\` to verify zero leftover conflict markers remain.
4. Stage the resolved file with \`git add <file>\` and complete with \`git commit\` (or \`git merge --continue\`).`,
    terminalScript: `# Check conflicted files, verify no leftover conflict markers exist, and complete merge
$ git status
$ git diff --check
$ git add src/config.ts
$ git merge --continue`,
    exercises: [
      {
        title: 'Command Exercise 1: Safely Abort a Messy Merge and Restore Pre-Merge State',
        scenario: 'You started a merge that produced 20 unexpected conflicts and want to cancel the merge completely:',
        codeBefore: '$ ',
        answer: 'git merge --abort',
        accepted: ['git merge --abort'],
        codeAfter: '\n# Working tree restored to clean pre-merge HEAD state',
        hint: 'Use `git merge --abort`.',
        explanation: '`git merge --abort` stops the merge resolution process and resets the working tree and index back to `HEAD`.'
      },
      {
        title: 'Command Exercise 2: Verify Zero Leftover Conflict Markers Before Committing',
        scenario: 'Run the Git diff flag that fails if any `<<<<<<<` or `>>>>>>>` conflict markers or trailing whitespace remain in tracked files:',
        codeBefore: '$ ',
        answer: 'git diff --check',
        accepted: ['git diff --check'],
        codeAfter: '\n# Zero conflict markers detected',
        hint: 'Use `git diff --check`.',
        explanation: '`git diff --check` scans for unresolved conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and exits non-zero in CI.'
      },
      {
        title: 'Command Exercise 3: Mark a Conflicted File as Resolved',
        scenario: 'After manually removing the conflict markers in `src/router.ts`, what command tells Git the conflict in that file is resolved?',
        codeBefore: '$ ',
        answer: 'git add src/router.ts',
        accepted: ['git add src/router.ts'],
        codeAfter: '\n# Conflict marked resolved in .git/index',
        hint: 'Stage the file using `git add src/router.ts`.',
        explanation: 'Staging a conflicted file with `git add <file>` clears its higher-stage conflict entries (stages 1, 2, 3) in `.git/index`.'
      }
    ],
    interviewQ: 'What does `git rerere` (Reuse Recorded Resolution) do during long-lived feature branch development?',
    interviewA: 'When `rerere.enabled` is true, Git records how you resolved a specific conflict hunk signature (pre-image -> post-image). If the exact same conflict reoccurs during a future rebase or merge, Git resolves it automatically!'
  },
  {
    id: 'git-9',
    title: 'Rebasing & Interactive History Cleanup (git rebase & git rebase -i)',
    description: 'Replay commits onto main for linear history, squash/fixup/reword commits interactively, and the Golden Rule of Rebasing',
    difficulty: 'Advanced',
    sectionGroup: 'Branching & Merging',
    analogy: 'Merging records the messy diary of when you worked; Rebasing edits your draft chapters so your feature reads as if it was written cleanly on top of today’s latest `main` branch.',
    primaryCmd: 'git rebase main',
    secondaryCmd: 'git rebase -i HEAD~3',
    verifyCmd: 'git rebase --continue',
    explanationMarkdown: `\`git rebase main\` takes all commits unique to your feature branch, temporarily sets them aside, moves your branch base to the tip of \`main\`, and **replays your commits one by one** as brand-new commit SHAs.

### Interactive Rebase (\`git rebase -i HEAD~N\`)
Before opening a Pull Request, run \`git rebase -i HEAD~3\` to clean up your local commit history:
- **\`pick\`**: Keep the commit as-is.
- **\`reword\`**: Keep the code changes, but edit the commit message.
- **\`squash\`**: Combine this commit into the previous commit and merge their commit messages.
- **\`fixup\`**: Combine this commit into the previous commit and discard this commit's temporary message (\`"wip"\`, \`"fix typo"\`).

> **The Golden Rule of Rebasing**: **NEVER rebase commits that are already pushed to a shared public branch (\`main\`)** where teammates are basing their work, because rebasing rewrites commit SHAs!`,
    terminalScript: `# Rebase current feature branch onto latest main and squash last 3 WIP commits
$ git fetch origin
$ git rebase origin/main
$ git rebase -i HEAD~3`,
    exercises: [
      {
        title: 'Command Exercise 1: Interactive Rebase of the Last 4 Commits',
        scenario: 'Open the interactive rebase todo editor to squash and reword your last 4 local commits:',
        codeBefore: '$ ',
        answer: 'git rebase -i HEAD~4',
        accepted: ['git rebase -i HEAD~4', 'git rebase --interactive HEAD~4'],
        codeAfter: '\n# Opens interactive rebase todo list for last 4 commits',
        hint: 'Use `git rebase -i HEAD~4`.',
        explanation: '`git rebase -i HEAD~4` lets you reorder, reword, squash, fixup, or drop any of the last 4 commits.'
      },
      {
        title: 'Command Exercise 2: Continue a Rebase After Resolving a Conflict',
        scenario: 'During a rebase, you resolved a conflict and ran `git add`. What command resumes replaying the remaining commits?',
        codeBefore: '$ ',
        answer: 'git rebase --continue',
        accepted: ['git rebase --continue'],
        codeAfter: '\n# Successfully rebased and updated refs/heads/feat/api.',
        hint: 'Use `git rebase --continue`.',
        explanation: '`git rebase --continue` commits the resolved index and proceeds to the next commit in the rebase queue.'
      },
      {
        title: 'Command Exercise 3: Safe Force Push After Rebasing a Feature PR Branch',
        scenario: 'You rebased your personal PR branch `feat/auth` and need to force-push safely (failing if a teammate pushed new commits to `feat/auth` in the meantime):',
        codeBefore: '$ git push ',
        answer: '--force-with-lease',
        accepted: ['--force-with-lease'],
        codeAfter: ' origin feat/auth',
        hint: 'Never use raw `--force`; use `--force-with-lease`.',
        explanation: '`--force-with-lease` verifies that the remote branch SHA still matches your last fetched remote-tracking ref before overwriting.'
      }
    ],
    interviewQ: 'Why should engineers always use `git push --force-with-lease` instead of `git push --force` after rebasing a PR branch?',
    interviewA: '`git push --force` blindly overwrites the remote branch even if a colleague pushed a commit to your PR branch 2 minutes ago. `--force-with-lease` checks that the remote tip matches your local `origin/<branch>` ref and aborts if unseen upstream commits exist.'
  },
  {
    id: 'git-10',
    title: 'Stashing Work in Progress (git stash push, pop, apply & list)',
    description: 'Shelve uncommitted changes including untracked files (-u), named stashes (-m), and popping back to work',
    difficulty: 'Intermediate',
    sectionGroup: 'Branching & Merging',
    analogy: '`git stash` is like sweeping all the half-assembled parts on your desk into a labeled drawer (`stash@{0}`) so you can handle an urgent production hotfix on a clean desk.',
    primaryCmd: 'git stash push -u -m "wip"',
    secondaryCmd: 'git stash list',
    verifyCmd: 'git stash pop',
    explanationMarkdown: `When you are halfway through a feature and need to switch branches to fix a production bug, Git won't let you switch if uncommitted changes conflict. **\`git stash\`** saves your modified tracked files (and untracked files with \`-u\`) onto a LIFO stack (\`stash@{0}\`, \`stash@{1}\`) and resets your working tree to a clean \`HEAD\`.`,
    terminalScript: `# Stash tracked and untracked WIP changes with a descriptive label, then restore them
$ git stash push -u -m "wip: stripe webhook handler"
$ git stash list
$ git stash pop`,
    exercises: [
      {
        title: 'Command Exercise 1: Stash Both Tracked AND Untracked Files',
        scenario: 'Stash your current work including newly created untracked files using the `-u` flag:',
        codeBefore: '$ ',
        answer: 'git stash -u',
        accepted: ['git stash -u', 'git stash push -u', 'git stash --include-untracked'],
        codeAfter: '\n# Saved working directory and index state (including untracked files)',
        hint: 'Use `git stash -u` (or `git stash push -u`).',
        explanation: 'By default, `git stash` ignores untracked files; adding `-u` (`--include-untracked`) captures new files too.'
      },
      {
        title: 'Command Exercise 2: Apply the Latest Stash and Remove It from the Stash Stack',
        scenario: 'Restore the most recent stash back into your working tree and drop it from the stash list in one command:',
        codeBefore: '$ ',
        answer: 'git stash pop',
        accepted: ['git stash pop'],
        codeAfter: '\n# Applied stash@{0} and dropped refs/stash@{0}',
        hint: 'Use `git stash pop`.',
        explanation: '`git stash pop` applies `stash@{0}` and deletes it if no conflicts occur (`git stash apply` keeps it in the list).'
      },
      {
        title: 'Command Exercise 3: View All Saved Stashes on the Stack',
        scenario: 'List all stashes currently saved in your repository:',
        codeBefore: '$ ',
        answer: 'git stash list',
        accepted: ['git stash list'],
        codeAfter: '\n# stash@{0}: On feat/pay: wip: stripe webhook handler',
        hint: 'Use `git stash list`.',
        explanation: '`git stash list` displays every stash entry (`stash@{0}`, `stash@{1}`, ...) and its message.'
      }
    ],
    interviewQ: 'What is the difference between `git stash pop` and `git stash apply`?',
    interviewA: 'Both reapply the stashed changes to your working tree, but `git stash pop` immediately deletes the stash entry from the stash stack (unless a conflict happens), whereas `git stash apply` leaves the stash entry saved in `git stash list` for reuse.'
  },
  {
    id: 'git-11',
    title: 'Synchronizing with Remotes: git fetch vs. git pull vs. git push',
    description: 'Remote-tracking branches (origin/main), git fetch --prune, git pull --rebase, and git push -u origin',
    difficulty: 'Intermediate',
    sectionGroup: 'Remotes & GitHub Collaboration',
    analogy: '`git fetch` is checking your mailbox and looking at the envelopes without opening them; `git pull` is fetching the mail AND immediately merging it into your current notebook.',
    primaryCmd: 'git fetch --prune',
    secondaryCmd: 'git pull --rebase origin main',
    verifyCmd: 'git push -u origin feat/api',
    explanationMarkdown: `Understanding the difference between **\`git fetch\`** and **\`git pull\`** is one of the most tested Git concepts:
- **\`git fetch origin\`**: Downloads new commits from GitHub and updates your remote-tracking refs (\`origin/main\`), **without touching your local \`main\` branch or working files**.
- **\`git pull\`**: Equivalent to running **\`git fetch\` + \`git merge origin/<branch>\`** (or **\`git fetch\` + \`git rebase\`** when using \`git pull --rebase\`).
- **\`git push -u origin <branch>\`**: Uploads your local branch commits to GitHub and sets the upstream tracking reference (\`-u\`).`,
    terminalScript: `# Fetch pruned remote refs, rebase local work onto origin/main, and push upstream
$ git fetch --prune origin
$ git pull --rebase origin main
$ git push -u origin feat/oauth-login`,
    exercises: [
      {
        title: 'Command Exercise 1: Download Remote Commits Without Modifying Local Working Tree',
        scenario: 'Download all latest commits from `origin` and remove stale remote-tracking branches that were deleted on GitHub:',
        codeBefore: '$ ',
        answer: 'git fetch --prune',
        accepted: ['git fetch --prune', 'git fetch -p'],
        codeAfter: '\n# Updated origin/* refs and pruned deleted remote branches',
        hint: 'Use `git fetch --prune` (or `git fetch -p`).',
        explanation: '`git fetch --prune` safely updates `refs/remotes/origin/*` and cleans up references to deleted remote branches.'
      },
      {
        title: 'Command Exercise 2: Pull Remote Changes Using Rebase Instead of Merge Commit',
        scenario: 'Fetch from `origin` and rebase your local unpushed commits cleanly on top of `origin/main`:',
        codeBefore: '$ ',
        answer: 'git pull --rebase',
        accepted: ['git pull --rebase', 'git pull -r'],
        codeAfter: ' origin main',
        hint: 'Pass `--rebase` to `git pull`.',
        explanation: '`git pull --rebase` avoids noisy "Merge branch main of github.com..." commits by replaying your local commits atop `origin/main`.'
      },
      {
        title: 'Command Exercise 3: Push a New Local Branch and Set Upstream Tracking',
        scenario: 'Push your new local branch `feat/metrics` to `origin` and link it as the upstream tracking branch:',
        codeBefore: '$ ',
        answer: 'git push -u origin feat/metrics',
        accepted: ['git push -u origin feat/metrics', 'git push --set-upstream origin feat/metrics'],
        codeAfter: '\n# Branch \'feat/metrics\' set up to track \'origin/feat/metrics\'.',
        hint: 'Use `git push -u origin feat/metrics`.',
        explanation: 'The `-u` (`--set-upstream`) flag configures `branch.feat/metrics.merge` so future `git push` and `git pull` commands need no arguments.'
      }
    ],
    interviewQ: 'What is the difference between `main` and `origin/main` inside your local `.git/` repository?',
    interviewA: '`main` (`refs/heads/main`) is your local mutable branch pointer where your commits land. `origin/main` (`refs/remotes/origin/main`) is a read-only local bookmark recording where `main` on the remote GitHub server stood the last time you ran `git fetch`, `git pull`, or `git push`.'
  },
  {
    id: 'git-12',
    title: 'Undoing Mistakes Safely: git restore, git revert & git reset (--soft, --mixed, --hard)',
    description: 'Master the 3 trees of git reset, why git revert is safe for shared branches, and discarding local edits with git restore',
    difficulty: 'Advanced',
    sectionGroup: 'Undoing & History Recovery',
    analogy: '`git reset` is a time machine that erases past timeline events (dangerous on shared branches); `git revert` writes a new legal amendment that cancels out a bad commit while preserving history.',
    primaryCmd: 'git reset --soft HEAD~1',
    secondaryCmd: 'git revert <commit-sha>',
    verifyCmd: 'git restore --staged <file>',
    explanationMarkdown: `### The 3 Modes of \`git reset\` Explained Clearly

| Command | Moves \`HEAD\` & Branch? | Resets Staging Index? | Wipes Working Directory? | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **\`git reset --soft HEAD~1\`** | **YES** (back 1 commit) | **NO** (changes stay staged!) | **NO** (files untouched) | Undo last commit but keep all changes staged to re-commit cleanly. |
| **\`git reset --mixed HEAD~1\`** *(default)* | **YES** (back 1 commit) | **YES** (unstages changes) | **NO** (files kept on disk) | Undo last commit and unstage changes back to Working Tree. |
| **\`git reset --hard HEAD~1\`** | **YES** (back 1 commit) | **YES** | **YES (DESTRUCTIVE!)** | Completely discard the last commit and all uncommitted local changes. |

### Why Use \`git revert <sha>\` on \`main\`?
If a buggy commit is already pushed to \`main\`, **never** use \`git reset\`. Instead, run **\`git revert <sha>\`**, which creates a **brand-new inverse commit** that undoes the exact lines changed by \`<sha>\` without rewriting shared history!`,
    terminalScript: `# Undo the last local commit while keeping all its changes staged in the Index
$ git reset --soft HEAD~1
$ git status
# Safely revert a public commit on main by creating an inverse commit
$ git revert --no-edit a4f91bc`,
    exercises: [
      {
        title: 'Command Exercise 1: Undo Last Local Commit While Keeping Changes Staged',
        scenario: 'You committed too early and want to undo the commit object (`HEAD~1`) while keeping all its changes staged in `.git/index`:',
        codeBefore: '$ ',
        answer: 'git reset --soft HEAD~1',
        accepted: ['git reset --soft HEAD~1', 'git reset --soft HEAD^'],
        codeAfter: '\n# HEAD moved back 1 commit; all changes remain staged for commit',
        hint: 'Use `git reset --soft HEAD~1`.',
        explanation: '`git reset --soft HEAD~1` moves the branch pointer back one commit without touching `.git/index` or the Working Directory.'
      },
      {
        title: 'Command Exercise 2: Safely Undo a Commit Already Pushed to Shared main',
        scenario: 'Commit `9f82b1c` on `main` broke production. Create a new commit that inverses `9f82b1c` without rewriting history:',
        codeBefore: '$ ',
        answer: 'git revert 9f82b1c',
        accepted: ['git revert 9f82b1c'],
        codeAfter: '\n# [main e31c409] Revert "feat: broken query cache"',
        hint: 'Use `git revert 9f82b1c`.',
        explanation: '`git revert <sha>` computes the inverse patch and records a new commit, making it 100% safe for shared branches.'
      },
      {
        title: 'Command Exercise 3: Unstage a File Using Modern git restore',
        scenario: 'You accidentally ran `git add secret.json`. Unstage it from the Index without losing the file on disk:',
        codeBefore: '$ ',
        answer: 'git restore --staged secret.json',
        accepted: ['git restore --staged secret.json', 'git reset HEAD secret.json'],
        codeAfter: '\n# Unstaged secret.json from .git/index',
        hint: 'Use `git restore --staged secret.json`.',
        explanation: '`git restore --staged <file>` copies the file entry from `HEAD` back into `.git/index`, unstaging it safely.'
      }
    ],
    interviewQ: 'Compare `git reset --soft`, `git reset --mixed`, and `git reset --hard` in terms of HEAD, Index, and Working Tree.',
    interviewA: '`--soft` only moves `HEAD` (leaving Index and Working Tree untouched); `--mixed` (the default) moves `HEAD` and resets the Staging Index to match `HEAD` (leaving Working Tree untouched); `--hard` moves `HEAD` and overwrites both the Staging Index and Working Tree (destroying uncommitted modifications).'
  },
  {
    id: 'git-13',
    title: 'Emergency Recovery with git reflog & Dangling Commits (git reflog, git fsck)',
    description: 'Recover commits lost after an accidental git reset --hard or botched rebase using the local Reference Log',
    difficulty: 'Advanced',
    sectionGroup: 'Undoing & History Recovery',
    analogy: '`git reflog` is your repository’s black-box flight recorder: even if you accidentally `git reset --hard` and erase 10 commits from `git log`, the reflog remembers every SHA `HEAD` visited for 90 days.',
    primaryCmd: 'git reflog',
    secondaryCmd: 'git reset --hard HEAD@{2}',
    verifyCmd: 'git branch recover-work <sha>',
    explanationMarkdown: `Have you ever run \`git reset --hard\` or deleted a branch and thought your code was gone forever? **In Git, committed data is almost never truly lost!**

Every time \`HEAD\` changes (via commit, switch, reset, merge, or rebase), Git appends an entry to the **Reference Log (\`git reflog\`)**. Even if a commit is no longer reachable from any branch, its Blob and Commit objects remain in \`.git/objects\` until garbage collection expires (default 90 days).`,
    terminalScript: `# Inspect the reference log to find a lost commit SHA after an accidental reset
$ git reflog -n 5
$ git branch rescue-branch HEAD@{1}
$ git switch rescue-branch`,
    exercises: [
      {
        title: 'Command Exercise 1: Open the Local Reference Log to Find Lost Commit SHAs',
        scenario: 'You accidentally ran `git reset --hard HEAD~5` and lost 5 commits. Which command shows the chronological log of every commit `HEAD` pointed to?',
        codeBefore: '$ ',
        answer: 'git reflog',
        accepted: ['git reflog'],
        codeAfter: '\n# c19a8f2 HEAD@{0}: reset: moving to HEAD~5\n# 88b4e10 HEAD@{1}: commit: feat: complete payment flow',
        hint: 'Type `git reflog`.',
        explanation: '`git reflog` prints the local reference log (`HEAD@{0}`, `HEAD@{1}`, ...) so you can grab the exact SHA (`88b4e10`) before the accidental reset.'
      },
      {
        title: 'Command Exercise 2: Restore Branch to Pre-Reset State Using Reflog Entry',
        scenario: 'Reset your current branch back to `HEAD@{1}` (the state right before your accidental reset):',
        codeBefore: '$ ',
        answer: 'git reset --hard HEAD@{1}',
        accepted: ['git reset --hard HEAD@{1}', 'git reset --hard 88b4e10'],
        codeAfter: '\n# HEAD is now at 88b4e10 feat: complete payment flow',
        hint: 'Use `git reset --hard HEAD@{1}`.',
        explanation: 'Pointing `git reset --hard` at `HEAD@{1}` (or the commit SHA from `git reflog`) immediately resurrects all 5 "lost" commits.'
      },
      {
        title: 'Command Exercise 3: Scan Repository for Unreachable Dangling Commits',
        scenario: 'Verify object graph integrity and list any dangling commits or blobs in `.git/objects`:',
        codeBefore: '$ ',
        answer: 'git fsck --full',
        accepted: ['git fsck --full', 'git fsck'],
        codeAfter: '\n# Checking object directories: 100% (256/256), done.',
        hint: 'Use `git fsck --full`.',
        explanation: '`git fsck` (File System Check) verifies SHA cryptographic integrity and lists unreachable/dangling objects.'
      }
    ],
    interviewQ: 'Why does `git reflog` only exist on your local machine and never get pushed to GitHub?',
    interviewA: 'The reflog (`.git/logs/HEAD`) is a purely local audit trail of where your personal `HEAD` pointer moved inside your working clone. Remote servers only receive reachable DAG objects pushed to `refs/heads/*` or `refs/tags/*`.'
  },
  {
    id: 'git-14',
    title: 'Surgical Commit Porting with git cherry-pick',
    description: 'Backport critical hotfix commits to release branches (git cherry-pick -x) without merging entire feature branches',
    difficulty: 'Intermediate',
    sectionGroup: 'Undoing & History Recovery',
    analogy: '`git cherry-pick` is using surgical tweezers to pluck one specific bugfix commit from the `main` branch and transplant it onto the `release/v2.4` branch.',
    primaryCmd: 'git cherry-pick -x <sha>',
    secondaryCmd: 'git cherry-pick --no-commit <sha>',
    verifyCmd: 'git cherry-pick --abort',
    explanationMarkdown: `When a critical security bug is fixed on \`main\` (commit \`e4a19b2\`), you often need that exact fix on \`release/v1.8\` **without** pulling in 50 other unreleased features from \`main\`.

Running **\`git cherry-pick -x e4a19b2\`** computes the diff introduced by \`e4a19b2\` and applies it as a new commit on your current branch, appending \`(cherry picked from commit e4a19b2...)\` for audit traceability.`,
    terminalScript: `# Switch to release branch and backport a specific hotfix commit with audit trail (-x)
$ git switch release/v2.1
$ git cherry-pick -x e4a19b2
$ git log -n 1 --oneline`,
    exercises: [
      {
        title: 'Command Exercise 1: Apply a Specific Commit to Current Branch',
        scenario: 'Apply commit `e4a19b2` onto your currently checked-out release branch:',
        codeBefore: '$ ',
        answer: 'git cherry-pick e4a19b2',
        accepted: ['git cherry-pick e4a19b2', 'git cherry-pick -x e4a19b2'],
        codeAfter: '\n# [release/v2.1 9c02d11] fix(security): sanitize SQL parameter',
        hint: 'Use `git cherry-pick e4a19b2`.',
        explanation: '`git cherry-pick <sha>` replays the patch of that single commit onto your current `HEAD`.'
      },
      {
        title: 'Command Exercise 2: Cherry-Pick Changes Into Working Tree Without Auto-Committing',
        scenario: 'Cherry-pick commit `e4a19b2` and stage its changes, but do not create a commit yet (`-n` / `--no-commit`):',
        codeBefore: '$ ',
        answer: 'git cherry-pick -n e4a19b2',
        accepted: ['git cherry-pick -n e4a19b2', 'git cherry-pick --no-commit e4a19b2'],
        codeAfter: '\n# Changes staged in index; ready for inspection before commit',
        hint: 'Use `-n` or `--no-commit` with `git cherry-pick`.',
        explanation: '`git cherry-pick -n` applies the commit diff to your Working Tree and Index without immediately creating a commit.'
      },
      {
        title: 'Command Exercise 3: Abort a Conflicted Cherry-Pick',
        scenario: 'Cancel an in-progress cherry-pick that hit a conflict and return to a clean branch state:',
        codeBefore: '$ ',
        answer: 'git cherry-pick --abort',
        accepted: ['git cherry-pick --abort'],
        codeAfter: '\n# Cherry-pick cancelled cleanly',
        hint: 'Use `git cherry-pick --abort`.',
        explanation: '`git cherry-pick --abort` rolls back the cherry-pick attempt and restores `HEAD`.'
      }
    ],
    interviewQ: 'Why does cherry-picking use `-x` in enterprise release engineering?',
    interviewA: 'Because cherry-picking creates a brand-new commit SHA on the release branch. The `-x` flag appends `(cherry picked from commit <original-sha>)` to the commit message so engineers and release scripts can trace which upstream fix was backported.'
  },
  {
    id: 'git-15',
    title: 'Binary Search Bug Hunting with git bisect (O(log N) Regression Finder)',
    description: 'Pinpoint the exact commit that broke tests across 1,000 commits in 10 steps using git bisect start, good, bad & run',
    difficulty: 'Advanced',
    sectionGroup: 'Undoing & History Recovery',
    analogy: 'Instead of testing 1,024 commits one by one, `git bisect` jumps to commit #512, halves the suspect range on every step, and catches the culprit commit in just 10 steps!',
    primaryCmd: 'git bisect start',
    secondaryCmd: 'git bisect run npm test',
    verifyCmd: 'git bisect reset',
    explanationMarkdown: `Imagine production worked fine 500 commits ago (\`v1.0.0\`), but today on \`HEAD\` a test is failing and nobody knows which commit broke it.

**\`git bisect\`** runs **Binary Search ($O(\\log_2 N)$)** across your commit DAG:
1. \`git bisect start\`
2. \`git bisect bad HEAD\` (mark current commit as broken)
3. \`git bisect good v1.0.0\` (mark known working release tag)
4. \`git bisect run npm test\` — Git automatically checks out the midpoint commit, runs \`npm test\`, marks it \`good\` (exit code 0) or \`bad\` (exit code 1..127), and isolates the exact offending commit in $\\lceil \\log_2(500) \\rceil = 9$ steps!`,
    terminalScript: `# Run automated binary search across commit history to pinpoint a regression
$ git bisect start
$ git bisect bad HEAD
$ git bisect good v1.0.0
$ git bisect run npm test
$ git bisect reset`,
    exercises: [
      {
        title: 'Command Exercise 1: Start an Interactive Git Bisect Session',
        scenario: 'Begin a binary search debugging session across your commit history:',
        codeBefore: '$ ',
        answer: 'git bisect start',
        accepted: ['git bisect start'],
        codeAfter: '\n# Waiting for good and bad commit boundaries',
        hint: 'Use `git bisect start`.',
        explanation: '`git bisect start` enters bisect mode so you can specify the `bad` and `good` commit bounds.'
      },
      {
        title: 'Command Exercise 2: Automate Bisect Verification with a Test Command',
        scenario: 'Tell `git bisect` to automatically run `pytest` at each midpoint commit until the first bad commit is found:',
        codeBefore: '$ ',
        answer: 'git bisect run pytest',
        accepted: ['git bisect run pytest'],
        codeAfter: '\n# a4f91bc is the first bad commit!',
        hint: 'Use `git bisect run pytest`.',
        explanation: '`git bisect run <cmd>` executes `<cmd>` at each binary-search midpoint: exit code 0 marks `good`, non-zero marks `bad`.'
      },
      {
        title: 'Command Exercise 3: Exit Bisect Mode and Return to Original HEAD',
        scenario: 'After finding the culprit commit, finish the bisect session and return to your original branch:',
        codeBefore: '$ ',
        answer: 'git bisect reset',
        accepted: ['git bisect reset'],
        codeAfter: '\n# Previous HEAD position restored to main',
        hint: 'Use `git bisect reset`.',
        explanation: '`git bisect reset` cleans up the bisect state and checks out the branch you were on before starting.'
      }
    ],
    interviewQ: 'In automated `git bisect run <script>`, what exit code should your script return if a specific midpoint commit fails to compile for an unrelated reason and cannot be tested?',
    interviewA: 'Return exit code `125` (`git bisect skip`). Exit code `0` means `good`, `1–127` (except `125`) means `bad`, and `125` tells Git to skip that untestable commit and test an adjacent commit instead.'
  },
  {
    id: 'git-16',
    title: 'GitHub Pull Requests, Code Reviews & Forking Workflow',
    description: 'Forking open-source repos, syncing upstream (git remote add upstream), CODEOWNERS, and PR merge strategies',
    difficulty: 'Intermediate',
    sectionGroup: 'Remotes & GitHub Collaboration',
    analogy: 'A Pull Request is an architectural review blueprint where automated CI tests, security scanners, and senior engineers inspect your proposed changes before they enter the main building.',
    primaryCmd: 'git remote add upstream <url>',
    secondaryCmd: 'git fetch upstream',
    verifyCmd: 'git rebase upstream/main',
    explanationMarkdown: `### The Standard Open-Source & Enterprise Fork Workflow
1. **Fork** the upstream repository on GitHub into your personal namespace (\`origin\`).
2. **Clone** your fork locally: \`git clone https://github.com/you/repo.git\`.
3. **Register \`upstream\`**: \`git remote add upstream https://github.com/org/repo.git\`.
4. **Keep Your Fork Synced**: \`git fetch upstream && git rebase upstream/main && git push origin main\`.
5. **Push Feature Branch & Open PR**: Push \`feat/fix\` to \`origin\` and open a Pull Request against \`upstream/main\`.`,
    terminalScript: `# Register the original upstream repository and sync your local main branch with it
$ git remote add upstream https://github.com/facebook/react.git
$ git fetch upstream
$ git switch main
$ git rebase upstream/main`,
    exercises: [
      {
        title: 'Command Exercise 1: Add the Original Repository as the "upstream" Remote',
        scenario: 'You cloned your personal fork (`origin`). Now register the official parent repo as a remote named `upstream`:',
        codeBefore: '$ ',
        answer: 'git remote add upstream',
        accepted: ['git remote add upstream'],
        codeAfter: ' https://github.com/kubernetes/kubernetes.git',
        hint: 'Use `git remote add upstream` before the URL.',
        explanation: 'Adding `upstream` lets you fetch new commits from the canonical repository while pushing PR branches to your `origin` fork.'
      },
      {
        title: 'Command Exercise 2: Fetch All Latest Commits from upstream',
        scenario: 'Download the latest commits and branches from the `upstream` remote:',
        codeBefore: '$ ',
        answer: 'git fetch upstream',
        accepted: ['git fetch upstream'],
        codeAfter: '\n# From https://github.com/kubernetes/kubernetes\n# * [new branch] main -> upstream/main',
        hint: 'Use `git fetch upstream`.',
        explanation: '`git fetch upstream` updates `refs/remotes/upstream/main` so you can rebase your local work onto it.'
      },
      {
        title: 'Command Exercise 3: Rebase Local Branch onto upstream/main',
        scenario: 'Replay your current branch commits cleanly on top of `upstream/main`:',
        codeBefore: '$ ',
        answer: 'git rebase upstream/main',
        accepted: ['git rebase upstream/main'],
        codeAfter: '\n# Successfully rebased and updated refs/heads/main.',
        hint: 'Use `git rebase upstream/main`.',
        explanation: 'Rebasing onto `upstream/main` keeps your fork history 100% linear with the upstream repository.'
      }
    ],
    interviewQ: 'Compare GitHub’s three Pull Request merge buttons: "Create a merge commit", "Squash and merge", and "Rebase and merge".',
    interviewA: '1. Merge commit (`--no-ff`) preserves all branch commits plus a 2-parent merge node. 2. Squash and merge condenses all PR commits into a single atomic commit on `main` (most popular for clean `main` history). 3. Rebase and merge replays each individual PR commit linearly onto `main` without a merge node.'
  },
  {
    id: 'git-17',
    title: 'GitHub CLI (`gh`) Mastery: PRs, Issues & Workflow Runs from Terminal',
    description: 'Create, checkout, review, and merge Pull Requests and inspect GitHub Actions logs directly via gh CLI',
    difficulty: 'Intermediate',
    sectionGroup: 'Remotes & GitHub Collaboration',
    analogy: 'The GitHub CLI (`gh`) brings the entire GitHub web interface directly into your terminal—letting you open PRs, checkout colleague branches, and inspect failing CI logs in seconds.',
    primaryCmd: 'gh pr create --fill',
    secondaryCmd: 'gh pr checkout 142',
    verifyCmd: 'gh pr merge --squash --delete-branch',
    explanationMarkdown: `The official **GitHub CLI (\`gh\`)** eliminates context-switching between your terminal and browser:
- \`gh pr create --title "feat: add Redis cache" --body "Closes #42"\`: Opens a Pull Request directly from your current branch.
- \`gh pr checkout 142\`: Fetches and checks out Pull Request #142 locally so you can test a teammate's code.
- \`gh pr checks\`: Displays live pass/fail status of all GitHub Actions CI checks on your current PR.
- \`gh pr merge --squash --delete-branch\`: Squash-merges the PR and deletes both local and remote feature branches.`,
    terminalScript: `# Create a Pull Request from terminal, inspect CI check status, and squash-merge
$ gh pr create --title "feat(cache): add Redis L1 read-through" --body "Closes #88"
$ gh pr checks
$ gh pr merge --squash --delete-branch`,
    exercises: [
      {
        title: 'Command Exercise 1: Create a GitHub Pull Request from the Terminal',
        scenario: 'Use the GitHub CLI to create a new Pull Request auto-populated from your commit messages (`--fill`):',
        codeBefore: '$ ',
        answer: 'gh pr create --fill',
        accepted: ['gh pr create --fill', 'gh pr create'],
        codeAfter: '\n# https://github.com/codeitout/engine/pull/142',
        hint: 'Use `gh pr create --fill`.',
        explanation: '`gh pr create --fill` pushes the branch if needed and opens a PR using your commit subject and body.'
      },
      {
        title: 'Command Exercise 2: Checkout Pull Request #142 Locally for Testing',
        scenario: 'Fetch and switch to Pull Request #142 using a single `gh` command:',
        codeBefore: '$ ',
        answer: 'gh pr checkout 142',
        accepted: ['gh pr checkout 142'],
        codeAfter: '\n# Switched to branch \'feat/redis-cache\' (PR #142)',
        hint: 'Use `gh pr checkout 142`.',
        explanation: '`gh pr checkout <number>` configures the remote ref and switches your working tree to that PR branch.'
      },
      {
        title: 'Command Exercise 3: Squash-Merge Current PR via GitHub CLI',
        scenario: 'Merge the current Pull Request using the squash strategy from the command line:',
        codeBefore: '$ ',
        answer: 'gh pr merge --squash',
        accepted: ['gh pr merge --squash'],
        codeAfter: '\n# ✓ Squashed and merged pull request #142',
        hint: 'Use `gh pr merge --squash`.',
        explanation: '`gh pr merge --squash` squashes all PR commits into a single commit on the base branch via the GitHub API.'
      }
    ],
    interviewQ: 'How can an automated release script or coding agent inspect failed GitHub Actions logs from the terminal using `gh`?',
    interviewA: 'Run `gh run list --limit 5` to find the workflow run ID, then `gh run view <run-id> --log-failed` to stream only the stdout/stderr of the failed CI steps.'
  },
  {
    id: 'git-18',
    title: 'SSH Keys, GPG/SSH Commit Signing & GitHub Authentication Security',
    description: 'Generate Ed25519 SSH keys (ssh-keygen -t ed25519), configure ssh-agent, and sign commits for GitHub "Verified" badges',
    difficulty: 'Intermediate',
    sectionGroup: 'Remotes & GitHub Collaboration',
    analogy: 'An Ed25519 SSH key is your cryptographic passport: your private key never leaves your laptop, while GitHub uses your public key to verify both your push access and your "Verified" commit signature.',
    primaryCmd: 'ssh-keygen -t ed25519 -C "email"',
    secondaryCmd: 'ssh -T git@github.com',
    verifyCmd: 'git commit -S -m "feat: signed"',
    explanationMarkdown: `Why can anyone set \`git config user.email "linus@kernel.org"\`? Because plain Git commit metadata is not cryptographically verified by default!

To prove a commit genuinely came from you (earning the green **Verified** badge on GitHub), configure **SSH or GPG Commit Signing**:
1. Generate a modern **Ed25519** key: \`ssh-keygen -t ed25519 -C "you@domain.com"\`
2. Test GitHub SSH authentication: \`ssh -T git@github.com\`
3. Enable automatic commit signing: \`git config --global commit.gpgsign true\` (or pass \`-S\` to \`git commit\`).`,
    terminalScript: `# Generate an Ed25519 SSH key, verify GitHub handshake, and create a signed commit
$ ssh-keygen -t ed25519 -C "alex@codeitout.dev"
$ ssh -T git@github.com
$ git commit -S -m "feat(security): enforce cryptographic commit signing"`,
    exercises: [
      {
        title: 'Command Exercise 1: Generate a Modern Ed25519 SSH Key Pair',
        scenario: 'Generate a new SSH key using the modern `ed25519` elliptic-curve algorithm:',
        codeBefore: '$ ',
        answer: 'ssh-keygen -t ed25519',
        accepted: ['ssh-keygen -t ed25519'],
        codeAfter: ' -C "alex@codeitout.dev"',
        hint: 'Use `ssh-keygen -t ed25519`.',
        explanation: 'Ed25519 keys are shorter, faster, and more resistant to side-channel attacks than legacy RSA-2048 keys.'
      },
      {
        title: 'Command Exercise 2: Test SSH Connectivity to GitHub',
        scenario: 'Verify that your SSH key is properly authenticated with GitHub without opening a shell:',
        codeBefore: '$ ',
        answer: 'ssh -T git@github.com',
        accepted: ['ssh -T git@github.com'],
        codeAfter: '\n# Hi alex! You\'ve successfully authenticated, but GitHub does not provide shell access.',
        hint: 'Use `ssh -T git@github.com`.',
        explanation: '`ssh -T git@github.com` performs the SSH public-key handshake against GitHub and confirms which account matched.'
      },
      {
        title: 'Command Exercise 3: Create a Cryptographically Signed Commit',
        scenario: 'Pass the flag to `git commit` that signs the commit object with your configured GPG/SSH key:',
        codeBefore: '$ ',
        answer: 'git commit -S -m',
        accepted: ['git commit -S -m'],
        codeAfter: ' "sec: rotate API public keys"',
        hint: 'Use uppercase `-S` with `git commit`.',
        explanation: 'Uppercase `-S` (`--gpg-sign`) embeds a cryptographic signature header into the Commit object.'
      }
    ],
    interviewQ: 'What is the difference between lowercase `git commit -s` and uppercase `git commit -S`?',
    interviewA: 'Lowercase `-s` (`--signoff`) simply appends a plain-text `Signed-off-by: Name <email>` trailer line (DCO compliance for Linux/CNCF), whereas uppercase `-S` (`--gpg-sign`) cryptographically signs the commit payload with your GPG or SSH private key.'
  },
  {
    id: 'git-19',
    title: 'Semantic Versioning, Annotated Tags & GitHub Releases (git tag)',
    description: 'Lightweight vs Annotated tags (git tag -a v1.0.0 -m), pushing tags (--tags), and automated GitHub Releases',
    difficulty: 'Intermediate',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'If branches are moving construction cranes, a Git Tag (`v2.0.0`) is a permanent bronze plaque bolted onto a finished milestone commit that never moves.',
    primaryCmd: 'git tag -a v1.0.0 -m "Release 1.0"',
    secondaryCmd: 'git push origin v1.0.0',
    verifyCmd: 'git describe --tags',
    explanationMarkdown: `Git supports two types of tags for marking **Semantic Versioning (\`MAJOR.MINOR.PATCH\`)** releases:
1. **Lightweight Tag (\`git tag v1.0.0\`)**: Just a static pointer to a commit SHA (no author, date, or message).
2. **Annotated Tag (\`git tag -a v1.0.0 -m "Production Release 1.0.0"\`)**: Creates a full **Tag Object** in \`.git/objects\` storing the tagger's name, email, date, release notes, and optional cryptographic signature. **Always use Annotated Tags for production releases!**

> **Important**: Regular \`git push\` does **not** push tags to GitHub! You must run \`git push origin v1.0.0\` (or \`git push origin --follow-tags\`).`,
    terminalScript: `# Create an annotated SemVer release tag and push it to GitHub to trigger release CI
$ git tag -a v1.2.0 -m "Release v1.2.0: Multi-shard query router"
$ git push origin v1.2.0
$ git describe --tags`,
    exercises: [
      {
        title: 'Command Exercise 1: Create an Annotated Release Tag',
        scenario: 'Create an annotated tag named `v1.0.0` with a release message:',
        codeBefore: '$ ',
        answer: 'git tag -a v1.0.0 -m',
        accepted: ['git tag -a v1.0.0 -m'],
        codeAfter: ' "Production Release v1.0.0"',
        hint: 'Use `git tag -a v1.0.0 -m`.',
        explanation: 'The `-a` flag creates a full annotated Tag object in `.git/objects` rather than a bare ref pointer.'
      },
      {
        title: 'Command Exercise 2: Push a Specific Tag to GitHub',
        scenario: 'Push your local tag `v1.0.0` to the `origin` remote:',
        codeBefore: '$ ',
        answer: 'git push origin v1.0.0',
        accepted: ['git push origin v1.0.0', 'git push origin --tags'],
        codeAfter: '\n# * [new tag] v1.0.0 -> v1.0.0',
        hint: 'Use `git push origin v1.0.0`.',
        explanation: 'Pushing a single named tag (`git push origin v1.0.0`) avoids accidentally pushing old local experimental tags.'
      },
      {
        title: 'Command Exercise 3: Delete a Local Tag Created by Mistake',
        scenario: 'Delete the local tag `v0.0.1-test` from your repository:',
        codeBefore: '$ ',
        answer: 'git tag -d v0.0.1-test',
        accepted: ['git tag -d v0.0.1-test'],
        codeAfter: '\n# Deleted tag \'v0.0.1-test\'',
        hint: 'Use `git tag -d v0.0.1-test`.',
        explanation: '`git tag -d <tagname>` removes `.git/refs/tags/<tagname>` locally.'
      }
    ],
    interviewQ: 'In Semantic Versioning (`v2.4.1`), when do you increment MAJOR (`2`), MINOR (`4`), and PATCH (`1`)?',
    interviewA: 'Increment MAJOR (`2 -> 3`) when making incompatible breaking API changes; increment MINOR (`4 -> 5`) when adding backward-compatible new functionality; increment PATCH (`1 -> 2`) for backward-compatible bug fixes and security patches.'
  },
  {
    id: 'git-20',
    title: 'Parallel Development with git worktree (Zero-Stash Multi-Branch Workflow)',
    description: 'Check out multiple branches simultaneously in separate directories sharing a single .git object database',
    difficulty: 'Advanced',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'Instead of tearing down your movie set every time you need to shoot a quick scene on another branch (`git stash` + `git switch`), `git worktree` opens a second studio stage connected to the same prop warehouse (`.git/objects`).',
    primaryCmd: 'git worktree add ../hotfix main',
    secondaryCmd: 'git worktree list',
    verifyCmd: 'git worktree remove ../hotfix',
    explanationMarkdown: `Why stop a long compilation or stash 30 modified files just to review a PR or fix a production bug?

**\`git worktree\`** lets you check out **multiple branches at the exact same time in separate folders**, all backed by your single \`.git/\` repository:
- \`git worktree add ../repo-hotfix -b hotfix/auth origin/main\`: Creates \`../repo-hotfix\` checked out to a new branch \`hotfix/auth\` in 50ms without cloning again!
- This is also the exact mechanism modern **Autonomous Coding Harnesses (Claude Code, Cursor, SWE-bench)** use to run 5 parallel AI agents without working-tree collisions!`,
    terminalScript: `# Create an isolated parallel working tree for an urgent hotfix without touching current work
$ git worktree add ../hotfix-auth -b hotfix/token-bug main
$ git worktree list
$ git worktree remove ../hotfix-auth`,
    exercises: [
      {
        title: 'Command Exercise 1: Create a New Linked Working Tree for a Branch',
        scenario: 'Create a new directory `../pr-review` checked out to the existing branch `feat/search` using `git worktree`:',
        codeBefore: '$ ',
        answer: 'git worktree add ../pr-review feat/search',
        accepted: ['git worktree add ../pr-review feat/search'],
        codeAfter: '\n# Preparing worktree (checking out \'feat/search\')',
        hint: 'Use `git worktree add ../pr-review feat/search`.',
        explanation: '`git worktree add <path> <branch>` mounts a second working directory sharing `.git/objects` and refs.'
      },
      {
        title: 'Command Exercise 2: List All Active Git Worktrees',
        scenario: 'Display all active working trees and their checked-out branches/SHAs:',
        codeBefore: '$ ',
        answer: 'git worktree list',
        accepted: ['git worktree list'],
        codeAfter: '\n# /workspace/engine     a4f91bc [main]\n# /workspace/pr-review  91e20cf [feat/search]',
        hint: 'Use `git worktree list`.',
        explanation: '`git worktree list` shows the main worktree alongside all linked worktrees.'
      },
      {
        title: 'Command Exercise 3: Cleanly Remove a Linked Worktree Directory',
        scenario: 'Remove the linked worktree at `../pr-review` after finishing your review:',
        codeBefore: '$ ',
        answer: 'git worktree remove ../pr-review',
        accepted: ['git worktree remove ../pr-review'],
        codeAfter: '\n# Worktree ../pr-review removed cleanly',
        hint: 'Use `git worktree remove ../pr-review`.',
        explanation: '`git worktree remove <path>` deletes the linked directory and cleans up its administrative metadata inside `.git/worktrees/`.'
      }
    ],
    interviewQ: 'Why does Git forbid checking out the exact same branch name in two worktrees simultaneously?',
    interviewA: 'If two worktrees pointed `HEAD` to the same `refs/heads/feat` and one worktree committed, the second worktree’s index and working files would silently fall out of sync with its own branch tip!'
  },
  {
    id: 'git-21',
    title: 'Git Hooks, Pre-Commit Quality Gates & Husky Automation',
    description: 'Automate linting, typechecking, secret scanning, and commit-msg validation via .git/hooks/ and core.hooksPath',
    difficulty: 'Intermediate',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'Git Hooks are automated customs inspectors that check your code for syntax errors, failing unit tests, and leaked API keys *before* the commit is even allowed to happen.',
    primaryCmd: 'git config core.hooksPath .githooks',
    secondaryCmd: 'chmod +x .githooks/pre-commit',
    verifyCmd: 'git commit --no-verify',
    explanationMarkdown: `Inside \`.git/hooks/\`, Git triggers executable scripts at key lifecycle events:
- **\`pre-commit\`**: Runs before a commit is created (ideal for \`eslint\`, \`prettier\`, \`tsc --noEmit\`, and secret scanners like \`gitleaks\`). If it exits non-zero, the commit is aborted!
- **\`commit-msg\`**: Validates the commit message text (e.g., enforcing Conventional Commits \`^(feat|fix|docs|chore): \`).
- **\`pre-push\`**: Runs unit test suites right before \`git push\` sends commits to GitHub.

Because \`.git/hooks/\` is not tracked by Git, teams commit shared hooks inside a versioned **\`.githooks/\`** folder and run **\`git config core.hooksPath .githooks\`**.`,
    terminalScript: `# Point Git to the repository's version-controlled .githooks directory
$ git config core.hooksPath .githooks
$ chmod +x .githooks/pre-commit
$ git commit -m "feat(ui): pass pre-commit linter and typecheck gate"`,
    exercises: [
      {
        title: 'Command Exercise 1: Configure Git to Use a Tracked .githooks Folder',
        scenario: 'Set Git’s `core.hooksPath` configuration to the versioned `.githooks` directory:',
        codeBefore: '$ ',
        answer: 'git config core.hooksPath .githooks',
        accepted: ['git config core.hooksPath .githooks'],
        codeAfter: '\n# Shared team hooks in .githooks/ are now active',
        hint: 'Use `git config core.hooksPath .githooks`.',
        explanation: 'Setting `core.hooksPath` redirects Git from `.git/hooks` to a tracked directory so all engineers share the same quality gates.'
      },
      {
        title: 'Command Exercise 2: Make a Pre-Commit Hook Script Executable',
        scenario: 'Git silently ignores hook scripts that lack executable permissions. Make `.githooks/pre-commit` executable:',
        codeBefore: '$ ',
        answer: 'chmod +x .githooks/pre-commit',
        accepted: ['chmod +x .githooks/pre-commit'],
        codeAfter: '\n# Hook script marked executable (+x)',
        hint: 'Use `chmod +x .githooks/pre-commit`.',
        explanation: 'On Unix/Linux/macOS, Git only executes hook scripts that have the `+x` executable bit set.'
      },
      {
        title: 'Command Exercise 3: Emergency Bypass of Pre-Commit Hooks',
        scenario: 'During a production incident, what flag bypasses `pre-commit` and `commit-msg` hooks for a single commit?',
        codeBefore: '$ git commit ',
        answer: '--no-verify',
        accepted: ['--no-verify', '-n'],
        codeAfter: ' -m "hotfix: disable faulty feature flag"',
        hint: 'Pass `--no-verify` (or `-n`) to `git commit`.',
        explanation: '`--no-verify` skips client-side `pre-commit` and `commit-msg` hooks (which is why server-side GitHub Actions CI must still enforce all checks!).'
      }
    ],
    interviewQ: 'Why must you still enforce linting and tests in GitHub Actions CI even if every developer has `pre-commit` hooks installed?',
    interviewA: 'Because client-side hooks run on the developer’s machine and can be bypassed at any time with `git commit --no-verify`. Server-side CI checks on Pull Requests are the only tamper-proof enforcement gate before merging to `main`.'
  },
  {
    id: 'git-22',
    title: 'Submodules, Subtrees & Monorepo Sparse-Checkout (git sparse-checkout)',
    description: 'Manage external repositories with git submodule update --init --recursive and scale 100GB monorepos with sparse-checkout',
    difficulty: 'Advanced',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: '`git sparse-checkout` is like living in a 100-floor skyscraper (monorepo) but only materializing the furniture on Floor 14 (`services/payments`) where your team works.',
    primaryCmd: 'git sparse-checkout set services/api',
    secondaryCmd: 'git submodule update --init --recursive',
    verifyCmd: 'git sparse-checkout list',
    explanationMarkdown: `### Scaling Massive Monorepos with \`git sparse-checkout\`
At Google, Meta, and Microsoft, repositories contain millions of files. Checking out every folder onto disk would freeze your IDE. **\`git sparse-checkout\`** (in cone mode) populates **only the specific directory paths you need** in your working tree while keeping the rest virtualized in \`.git/objects\`:
\`\`\`bash
git clone --filter=blob:none --sparse https://github.com/org/monorepo.git
cd monorepo
git sparse-checkout set packages/frontend services/auth
\`\`\``,
    terminalScript: `# Materialize only two service directories inside a massive enterprise monorepo
$ git sparse-checkout init --cone
$ git sparse-checkout set services/payments packages/shared-types
$ git sparse-checkout list`,
    exercises: [
      {
        title: 'Command Exercise 1: Initialize and Update All Nested Git Submodules',
        scenario: 'You cloned a repository containing submodules that are currently empty folders. Initialize and fetch all nested submodules recursively:',
        codeBefore: '$ ',
        answer: 'git submodule update --init --recursive',
        accepted: ['git submodule update --init --recursive'],
        codeAfter: '\n# Submodule path \'vendor/crypto\': checked out \'8f21a90\'',
        hint: 'Use `git submodule update --init --recursive`.',
        explanation: '`--init` registers submodules from `.gitmodules` and `--recursive` populates nested submodules.'
      },
      {
        title: 'Command Exercise 2: Restrict Monorepo Working Tree to Specific Folders',
        scenario: 'Use `git sparse-checkout` to materialize only `services/billing` in your working directory:',
        codeBefore: '$ ',
        answer: 'git sparse-checkout set services/billing',
        accepted: ['git sparse-checkout set services/billing'],
        codeAfter: '\n# Working tree restricted to root files + services/billing/',
        hint: 'Use `git sparse-checkout set services/billing`.',
        explanation: '`git sparse-checkout set <dir>` updates the skip-worktree bits in `.git/index` so only `<dir>` is written to disk.'
      },
      {
        title: 'Command Exercise 3: Restore Full Working Tree by Disabling Sparse-Checkout',
        scenario: 'Turn off sparse-checkout and materialize all files in the repository again:',
        codeBefore: '$ ',
        answer: 'git sparse-checkout disable',
        accepted: ['git sparse-checkout disable'],
        codeAfter: '\n# Full repository working tree restored',
        hint: 'Use `git sparse-checkout disable`.',
        explanation: '`git sparse-checkout disable` clears sparse rules and checks out the complete tree.'
      }
    ],
    interviewQ: 'How does Git store a submodule inside the parent repository’s Tree object?',
    interviewA: 'The parent repository does NOT store the submodule’s files; instead, its Tree object records a special `160000` mode entry (a "gitlink") pointing to the exact Commit SHA of the submodule repository, paired with the URL in `.gitmodules`.'
  },
  {
    id: 'git-23',
    title: 'Git Internals Plumbing Commands: hash-object, cat-file, rev-parse & Packfiles',
    description: 'Inspect raw Blobs, Trees, and Commits beneath porcelain commands using git cat-file -p and git rev-parse',
    difficulty: 'Expert',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'Commands like `git add` and `git commit` are the steering wheel ("Porcelain"); commands like `git cat-file -p` and `git hash-object` are opening the hood to inspect the engine cylinders ("Plumbing").',
    primaryCmd: 'git cat-file -p HEAD',
    secondaryCmd: 'git rev-parse HEAD',
    verifyCmd: 'git gc --aggressive',
    explanationMarkdown: `Git commands are divided into **Porcelain** (user-facing commands like \`status\`, \`commit\`, \`switch\`) and low-level **Plumbing** commands that interact directly with the content-addressable object database:
- **\`git rev-parse HEAD\`**: Resolves any symbolic reference (\`HEAD\`, \`main\`, \`v1.0.0\`, \`HEAD~2\`) into its exact 40-char SHA hash.
- **\`git cat-file -t <sha>\`**: Prints the object type (\`blob\`, \`tree\`, \`commit\`, or \`tag\`).
- **\`git cat-file -p <sha>\`**: Pretty-prints the uncompressed contents of any Blob, Tree, or Commit object!`,
    terminalScript: `# Resolve HEAD to its exact 40-character SHA and inspect the raw Commit object
$ git rev-parse HEAD
$ git cat-file -t HEAD
$ git cat-file -p HEAD`,
    exercises: [
      {
        title: 'Command Exercise 1: Pretty-Print the Raw Contents of the HEAD Commit Object',
        scenario: 'Use the low-level plumbing command `git cat-file` with `-p` to inspect the raw tree SHA, parent SHA, and author inside `HEAD`:',
        codeBefore: '$ ',
        answer: 'git cat-file -p HEAD',
        accepted: ['git cat-file -p HEAD'],
        codeAfter: '\n# tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\n# author Alex Mercer <alex@codeitout.dev>',
        hint: 'Use `git cat-file -p HEAD`.',
        explanation: '`git cat-file -p <object>` decompresses the zlib object in `.git/objects` and prints its structured payload.'
      },
      {
        title: 'Command Exercise 2: Resolve Symbolic HEAD to a Full 40-Char Commit SHA',
        scenario: 'In a deployment script, print the exact 40-character commit SHA that `HEAD` currently points to:',
        codeBefore: '$ ',
        answer: 'git rev-parse HEAD',
        accepted: ['git rev-parse HEAD'],
        codeAfter: '\n# a4f91bc8e0123456789abcdef0123456789abcde',
        hint: 'Use `git rev-parse HEAD`.',
        explanation: '`git rev-parse HEAD` resolves `.git/HEAD` -> `refs/heads/main` -> the exact 40-hex commit SHA.'
      },
      {
        title: 'Command Exercise 3: Compress Loose Git Objects into Delta Packfiles',
        scenario: 'Run Git’s garbage collector to pack loose objects into delta-compressed `.pack` files and prune expired unreachable objects:',
        codeBefore: '$ ',
        answer: 'git gc',
        accepted: ['git gc', 'git gc --prune=now'],
        codeAfter: '\n# Enumerating objects: 1420, done. Writing objects: 100%, done.',
        hint: 'Use `git gc`.',
        explanation: '`git gc` consolidates thousands of loose `.git/objects/xx/...` files into delta-compressed packfiles (`.git/objects/pack/*.pack`).'
      }
    ],
    interviewQ: 'If Git creates a full snapshot of every modified file on every commit, why doesn’t a repository grow by megabytes whenever you change 1 line in a 10MB file?',
    interviewA: 'Two reasons: 1. Unchanged files across commits share the exact same Blob SHA pointer (zero duplication). 2. For modified files, `git gc` packs loose objects into Packfiles using delta compression—storing only the binary delta between versions of the 10MB file!'
  },
  {
    id: 'git-24',
    title: 'GitHub Actions CI/CD Pipelines, Matrix Builds & Branch Protection Rules',
    description: 'Author .github/workflows/ci.yml, actions/checkout@v4, dependency caching, OIDC cloud deploys, and required status checks',
    difficulty: 'Advanced',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'GitHub Actions is an automated robot factory triggered on every `push` or `pull_request` that spins up clean Linux/macOS/Windows runners, tests your code across Node/Python versions, and deploys to production.',
    primaryCmd: 'gh workflow list',
    secondaryCmd: 'gh run watch',
    verifyCmd: 'gh run view --log-failed',
    explanationMarkdown: `Every production GitHub repository pairs **Branch Protection Rules** on \`main\` (requiring PR reviews + passing status checks + linear history) with **GitHub Actions workflows** inside **\`.github/workflows/ci.yml\`**:
\`\`\`yaml
name: Production CI Gate
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci && npm test && npm run build
\`\`\``,
    terminalScript: `# Trigger and monitor GitHub Actions CI workflows directly from the CLI
$ gh workflow list
$ gh run list --limit 3
$ gh run watch`,
    exercises: [
      {
        title: 'Command Exercise 1: List All GitHub Actions Workflows in Repository',
        scenario: 'Use the GitHub CLI to list all configured `.github/workflows/*.yml` pipelines:',
        codeBefore: '$ ',
        answer: 'gh workflow list',
        accepted: ['gh workflow list'],
        codeAfter: '\n# Production CI Gate   active   84920112',
        hint: 'Use `gh workflow list`.',
        explanation: '`gh workflow list` displays all active and disabled GitHub Actions workflows in the repository.'
      },
      {
        title: 'Command Exercise 2: Manually Trigger a workflow_dispatch Pipeline from CLI',
        scenario: 'Trigger the `deploy.yml` workflow manually on `main` using `gh workflow run`:',
        codeBefore: '$ ',
        answer: 'gh workflow run deploy.yml',
        accepted: ['gh workflow run deploy.yml'],
        codeAfter: '\n# ✓ Created workflow_dispatch event for deploy.yml at main',
        hint: 'Use `gh workflow run deploy.yml`.',
        explanation: '`gh workflow run <file>` dispatches a `workflow_dispatch` event to start the pipeline on GitHub runners.'
      },
      {
        title: 'Command Exercise 3: View Only the Failed Step Logs of a CI Run',
        scenario: 'Inspect only the failed step output of workflow run `9182736` in your terminal:',
        codeBefore: '$ gh run view 9182736 ',
        answer: '--log-failed',
        accepted: ['--log-failed'],
        codeAfter: '\n# Displays exact assertion failure from CI runner',
        hint: 'Pass `--log-failed` to `gh run view`.',
        explanation: '`gh run view <id> --log-failed` filters out thousands of passing build lines and prints only the failing step logs.'
      }
    ],
    interviewQ: 'Why should GitHub Actions workflows use `npm ci` instead of `npm install` in CI pipelines?',
    interviewA: '`npm ci` installs exact versions strictly from `package-lock.json`, fails immediately if `package.json` and `package-lock.json` are out of sync, never mutates the lockfile, and runs significantly faster in clean CI containers.'
  },
  {
    id: 'git-25',
    title: 'Capstone: End-to-End Enterprise Git & GitHub Incident & Release Playbook',
    description: 'Complete staff-level workflow: branch -> atomic commits -> interactive rebase -> signed PR -> CI gate -> bisect -> hotfix backport',
    difficulty: 'Expert',
    sectionGroup: 'Advanced Git Internals & DevOps',
    analogy: 'Mastering the complete Git & GitHub lifecycle means you can navigate any repository crisis—from untangling a 30-file rebase to bisecting a production regression and backporting a signed hotfix in under 3 minutes.',
    primaryCmd: 'git switch -c hotfix/v2.1.1 v2.1.0',
    secondaryCmd: 'git cherry-pick -x <fix-sha>',
    verifyCmd: 'git tag -s v2.1.1 -m "Hotfix v2.1.1"',
    explanationMarkdown: `### The Complete Staff Engineer Git & GitHub Playbook

| Scenario | Exact Command Sequence | Why It Is Best Practice |
| :--- | :--- | :--- |
| **Start Feature Cleanly** | \`git fetch --prune && git switch -c feat/x origin/main\` | Always branches from the freshest remote \`main\` state. |
| **Clean Up WIP Before PR** | \`git rebase -i origin/main\` $\\rightarrow$ \`git push --force-with-lease\` | Squashes noisy commits into atomic, reviewable units safely. |
| **Pinpoint Production Bug** | \`git bisect start HEAD v2.0.0 && git bisect run npm test\` | Finds the exact breaking commit in $O(\\log_2 N)$ steps. |
| **Emergency Production Revert** | \`git revert <bad-sha> && git push origin main\` | Undoes the bug on \`main\` immediately without rewriting history. |
| **Backport Fix to Release** | \`git switch release/v2.0 && git cherry-pick -x <fix-sha>\` | Ports only the surgical fix with full commit SHA audit trail. |`,
    terminalScript: `# End-to-End Staff Playbook: Create hotfix branch from tag, cherry-pick fix, tag & push
$ git fetch --prune origin
$ git switch -c hotfix/v2.1.1 v2.1.0
$ git cherry-pick -x a4f91bc
$ git tag -a v2.1.1 -m "Security Hotfix Release v2.1.1"
$ git push origin hotfix/v2.1.1 v2.1.1`,
    exercises: [
      {
        title: 'Command Exercise 1: Create a Hotfix Branch Directly from Release Tag v2.1.0',
        scenario: 'Create and switch to a new branch `hotfix/v2.1.1` starting at the exact commit of tag `v2.1.0`:',
        codeBefore: '$ ',
        answer: 'git switch -c hotfix/v2.1.1 v2.1.0',
        accepted: ['git switch -c hotfix/v2.1.1 v2.1.0', 'git checkout -b hotfix/v2.1.1 v2.1.0'],
        codeAfter: '\n# Switched to a new branch \'hotfix/v2.1.1\' at tag v2.1.0',
        hint: 'Use `git switch -c hotfix/v2.1.1 v2.1.0`.',
        explanation: '`git switch -c <new-branch> <start-point>` creates the branch starting directly at `<start-point>` (`v2.1.0`).'
      },
      {
        title: 'Command Exercise 2: Cherry-Pick the Fix Commit with Origin SHA Reference (-x)',
        scenario: 'Backport commit `a4f91bc` onto `hotfix/v2.1.1` and record the original commit SHA in the message using `-x`:',
        codeBefore: '$ ',
        answer: 'git cherry-pick -x a4f91bc',
        accepted: ['git cherry-pick -x a4f91bc'],
        codeAfter: '\n# [hotfix/v2.1.1 7d01f44] fix: prevent token replay (cherry picked from commit a4f91bc)',
        hint: 'Use `git cherry-pick -x a4f91bc`.',
        explanation: '`git cherry-pick -x` transplants the fix and appends `(cherry picked from commit ...)` for release auditing.'
      },
      {
        title: 'Command Exercise 3: Search All Historical Commits that Added or Removed a Function Name',
        scenario: 'Use the Git log pickaxe flag (`-S`) to find every commit in history that added or removed `"verifySignature"`:',
        codeBefore: '$ ',
        answer: 'git log -S "verifySignature"',
        accepted: ['git log -S "verifySignature"', 'git log -S verifySignature'],
        codeAfter: '\n# commit a4f91bc — feat(auth): introduce verifySignature helper',
        hint: 'Use `git log -S "verifySignature"`.',
        explanation: 'The pickaxe search `git log -S <string>` finds commits where the count of occurrences of `<string>` changed.'
      }
    ],
    interviewQ: 'During a high-severity production outage caused by a bad deployment from `main`, should you fix-forward or `git revert` first?',
    interviewA: 'Always `git revert <bad-sha>` and redeploy immediately to restore service (minimizing Mean Time To Recovery / MTTR). Once production is stable, you can revert the revert locally, write regression tests, and open a properly reviewed fix PR.'
  }
];

const gitModules: CourseModule[] = [];
export const GIT_GITHUB_LESSONS: Record<string, LessonContent> = {};

for (let i = 0; i < GIT_CHAPTER_SPECS.length; i++) {
  const spec = GIT_CHAPTER_SPECS[i];
  const chNum = i + 1;

  gitModules.push({
    id: spec.id,
    title: spec.title,
    description: spec.description,
    difficulty: spec.difficulty,
    sectionGroup: spec.sectionGroup,
    isLocked: false
  });

  const mustSolveExercises: MustSolveExercise[] = spec.exercises.map((ex, idx) => ({
    id: `${spec.id}-ex-${idx + 1}`,
    title: ex.title,
    difficulty: idx === 0 ? 'Essential' : idx === 1 ? 'Core Practice' : 'Mastery Challenge',
    scenario: ex.scenario,
    codeBefore: ex.codeBefore,
    answer: ex.answer,
    acceptedAnswers: ex.accepted || [ex.answer],
    codeAfter: ex.codeAfter,
    hint: ex.hint,
    explanation: ex.explanation,
    xp: idx === 0 ? 50 : idx === 1 ? 65 : 80
  }));

  GIT_GITHUB_LESSONS[spec.id] = {
    id: spec.id,
    title: spec.title,
    estimatedReadingTime: '12 mins',
    beginnerSummary: `${spec.title} — ${spec.description}. Practice writing the exact Git & GitHub CLI commands in the Must-Solve Command Lab below or test them live in the Popup Terminal.`,
    realWorldAnalogy: spec.analogy,
    keyTakeaways: [
      `Core Command: \`${spec.primaryCmd}\` — ${spec.description}.`,
      `Companion Workflow: Pair \`${spec.primaryCmd}\` with \`${spec.secondaryCmd}\` and verify state using \`${spec.verifyCmd}\`.`,
      `Complete all 3 Must-Solve Git Command Exercises below to master this workflow for daily engineering and interviews.`
    ],
    syntaxCheatTable: [
      {
        syntax: spec.primaryCmd,
        description: `Primary command for ${spec.title.split(':')[0]}`,
        example: spec.primaryCmd
      },
      {
        syntax: spec.secondaryCmd,
        description: 'Companion workflow & configuration command',
        example: spec.secondaryCmd
      },
      {
        syntax: spec.verifyCmd,
        description: 'Verification & state inspection command',
        example: spec.verifyCmd
      },
      {
        syntax: 'git status / git reflog',
        description: 'Inspect current working tree state or recover previous HEAD positions',
        example: 'git status -s && git reflog -n 3'
      }
    ],
    diagramSvg: buildLessonArchitectureSvg(
      'c-git',
      chNum,
      spec.title,
      spec.sectionGroup,
      [spec.primaryCmd, spec.secondaryCmd, spec.verifyCmd]
    ),
    contentMarkdown: `# ${spec.title}

${spec.explanationMarkdown}

---

## Interactive Git & GitHub Terminal Lab (Try it Yourself)

Click **Try it Yourself →** on the command block below to pop open the Interactive Git Terminal Sandbox (with Fullscreen & Close controls) and execute these commands live:

\`\`\`bash
${spec.terminalScript}
\`\`\`

---

## Essential Command Playbook & Flags

| Git / GitHub Command | What Happens Under the Hood (\`.git/\`) | Production Best Practice |
| :--- | :--- | :--- |
| \`${spec.primaryCmd}\` | Updates object graph / refs inside \`.git/\` | Run \`git status\` before and after to verify branch state |
| \`${spec.secondaryCmd}\` | Coordinates staging index, remote refs, or history | Prefer atomic, descriptive commits and explicit flags |
| \`${spec.verifyCmd}\` | Verifies repository invariants and output state | Integrate into pre-push checks and GitHub Actions CI |`,
    fillBlankExercise: {
      prompt: spec.exercises[0].scenario,
      codeBefore: spec.exercises[0].codeBefore,
      answer: spec.exercises[0].answer,
      codeAfter: spec.exercises[0].codeAfter,
      hint: spec.exercises[0].hint
    },
    mustSolveExercises,
    codingChallenge: {
      title: `Git CLI Lab: ${spec.title}`,
      description: `Run and customize the Git & GitHub command sequence for ${spec.title} in the interactive terminal.`,
      language: 'bash',
      starterCode: spec.terminalScript,
      solutionCode: spec.terminalScript,
      hint: `Try running ${spec.primaryCmd} and ${spec.verifyCmd} in the terminal sandbox.`
    },
    quizzes: [
      {
        id: `q-${spec.id}-1`,
        question: `In Git & GitHub engineering (${spec.title}), which command is used for: ${spec.exercises[0].scenario}`,
        options: [
          spec.exercises[0].answer,
          'git format-disk --force',
          'git delete-history --all',
          'git bypass-index --raw'
        ],
        correctAnswerIndex: 0,
        explanation: spec.exercises[0].explanation
      },
      {
        id: `q-${spec.id}-2`,
        question: spec.interviewQ,
        options: [
          spec.interviewA,
          'Git deletes the entire `.git` directory on every branch switch.',
          'Git requires a central database lock before you can save a file locally.',
          'Git stores only file names without hashing file contents.'
        ],
        correctAnswerIndex: 0,
        explanation: spec.interviewA
      }
    ],
    interviewQuestions: [
      {
        companyTag: 'GitHub / Google / Stripe',
        question: spec.interviewQ,
        answer: spec.interviewA
      }
    ],
    resources: [
      {
        title: 'Pro Git Book (2nd Edition) — Official Git Reference',
        type: 'Book',
        authorOrSource: 'Scott Chacon & Ben Straub (git-scm.com)'
      },
      {
        title: 'GitHub Docs — Pull Requests, GitHub CLI (gh) & Actions CI/CD',
        type: 'Documentation',
        authorOrSource: 'GitHub Engineering'
      }
    ]
  };
}

export const GIT_GITHUB_COURSE: Course = {
  id: 'c-git',
  title: 'Git & GitHub Complete Mastery (Commands, Internals & CI/CD)',
  shortTag: 'Git & GitHub',
  levelTag: '25 Chapters · Interactive Command Exercises',
  category: Category.GIT_LINUX,
  icon: 'git',
  modules: gitModules
};
