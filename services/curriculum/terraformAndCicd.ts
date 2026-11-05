import { Course, CourseModule, LessonContent, Category, MustSolveExercise } from '../../types';
import { buildLessonArchitectureSvg } from './visualAssets';

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
const Difficulty = {
  BEGINNER: 'Beginner' as DifficultyLevel,
  INTERMEDIATE: 'Intermediate' as DifficultyLevel,
  ADVANCED: 'Advanced' as DifficultyLevel,
  EXPERT: 'Expert' as DifficultyLevel
};

interface TerraformChapterBlueprint {
  ch: number;
  id: string;
  title: string;
  section: string;
  duration: number;
  difficulty: DifficultyLevel;
  summary: string;
  analogy: string;
  keyPoints: string[];
  syntaxRows: [string, string, string][];
  tryItTitle: string;
  tryItCode: string;
  tryItOutput: string;
  exerciseQuestion: string;
  exerciseTemplate: string;
  exerciseAnswer: string;
  exerciseHint: string;
  quizQ: string;
  quizOpts: string[];
  quizAns: number;
  quizExp: string;
  interviewQ: string;
  interviewA: string;
  interviewCo: string;
  realWorldCases: {
    company: string;
    title: string;
    scenario: string;
    impact: string;
    codeSnippet: string;
  }[];
  mustSolveExercises: {
    id: string;
    title: string;
    prompt: string;
    starterCommand: string;
    expectedPattern: string;
    acceptedAnswers: string[];
    explanation: string;
    hint: string;
  }[];
}

const TERRAFORM_CHAPTER_BLUEPRINTS: TerraformChapterBlueprint[] = [
  {
    ch: 1,
    id: 'tf-1',
    title: '1. Terraform HOME: Declarative Infrastructure as Code & HCL Architecture',
    section: 'Terraform Fundamentals',
    duration: 24,
    difficulty: Difficulty.BEGINNER,
    summary: 'Terraform is an open-source Infrastructure as Code (IaC) engine that compiles declarative HCL (HashiCorp Configuration Language) into a Directed Acyclic Graph (DAG) of cloud API calls across AWS, GCP, Azure, and Kubernetes.',
    analogy: 'Imperative bash scripts are turn-by-turn driving directions that break if a road is already built; Terraform HCL is an architectural blueprint where Terraform inspects the current building site and only constructs what is missing.',
    keyPoints: [
      'Declarative IaC specifies the desired end state (`resource "aws_s3_bucket" "logs" {}`), not the procedural steps to get there.',
      'Terraform Core compares your `.tf` configuration against the `.tfstate` ledger and live cloud APIs to compute an execution plan (`+ create`, `~ update in-place`, `- destroy`).',
      'Core workflow loop: `terraform init` -> `terraform fmt` -> `terraform validate` -> `terraform plan` -> `terraform apply`.'
    ],
    syntaxRows: [
      ['terraform init', 'Initializes working directory and downloads provider plugins', 'terraform init -upgrade'],
      ['terraform fmt -check', 'Verifies canonical HCL formatting across all .tf files', 'terraform fmt -recursive'],
      ['terraform validate', 'Checks HCL syntax and internal attribute references offline', 'terraform validate'],
      ['terraform plan -out=tfplan', 'Computes deterministic execution diff and saves binary plan', 'terraform plan -out=prod.tfplan']
    ],
    tryItTitle: 'Lab: Terraform Init, Validate & Deterministic Plan Inspection',
    tryItCode: `# Inspect HCL configuration and run standard Terraform lifecycle
$ terraform init
$ terraform validate
$ terraform plan -out=tfplan`,
    tryItOutput: `Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.80.0"...
- Installing hashicorp/aws v5.80.0...
Terraform has been successfully initialized!

Success! The configuration is valid.

Terraform used the selected providers to generate the following execution plan:
  + create
  # aws_s3_bucket.audit_logs will be created
  + resource "aws_s3_bucket" "audit_logs" {
      + bucket = "acme-prod-audit-logs-2025"
      + id     = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.
Saved the plan to: tfplan`,
    exerciseQuestion: 'Complete the command to generate an execution plan and save it deterministically to a file named `tfplan`:',
    exerciseTemplate: 'terraform ___ -out=tfplan',
    exerciseAnswer: 'plan',
    exerciseHint: 'Use the plan subcommand with -out=tfplan.',
    quizQ: 'Why do production CI/CD pipelines run `terraform plan -out=tfplan` followed by `terraform apply tfplan` instead of running `terraform apply -auto-approve` directly?',
    quizOpts: [
      'Because `terraform apply` does not work without a plan file',
      'Saving `tfplan` cryptographically binds the approved PR plan to the exact changes applied, preventing time-of-check to time-of-use (TOCTOU) cloud drift between review and apply',
      'It skips downloading provider binaries',
      'It disables remote state locking'
    ],
    quizAns: 1,
    quizExp: 'Without `-out=tfplan`, `terraform apply -auto-approve` recomputes a brand-new plan at apply time, which could include unreviewed changes if the branch or remote state drifted after PR review.',
    interviewQ: 'How does Terraform Core communicate with cloud APIs like AWS or GCP?',
    interviewA: 'Terraform Core never talks to AWS or GCP directly. Instead, Core spawns separate Provider plugins as child OS processes and communicates with them over local gRPC (`go-plugin`), delegating CRUD operations (`ReadResource`, `PlanResourceChange`, `ApplyResourceChange`) to the provider.',
    interviewCo: 'HashiCorp / Stripe',
    realWorldCases: [
      {
        company: 'Stripe Global Payments Infra',
        title: 'Declarative Multi-Region VPC & KMS Provisioning via Saved Plans',
        scenario: 'Enforces immutable `terraform plan -out=prod.tfplan` artifacts across 40+ AWS accounts so engineers review the exact resource diff before cryptographic approval.',
        impact: 'Zero unreviewed infrastructure mutations across 120,000+ managed cloud resources.',
        codeSnippet: `# Stripe-style deterministic plan + verification workflow
$ terraform init
$ terraform fmt -check
$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'Cloudflare Edge Network',
        title: 'Self-Service DNS, WAF & Anycast Routing via Terraform Provider',
        scenario: 'Enterprise customers manage 10,000+ WAF rules and DNS records declaratively in Git using the official Cloudflare Terraform provider.',
        impact: 'Eliminated console click-ops errors and reduced global WAF rollout latency from hours to 45 seconds.',
        codeSnippet: `# Declarative HCL Syntax Validation
$ terraform validate
$ terraform plan`
      },
      {
        company: 'Datadog Cloud Platform',
        title: 'Automated Monitoring-as-Code Alongside Microservice Infrastructure',
        scenario: 'Provisions Datadog SLOs, PagerDuty monitors, and Kubernetes namespaces in the same atomic Terraform run.',
        impact: '100% of new production services launch with pre-verified latency and error-budget alerts.',
        codeSnippet: `# Inspect planned additions before applying
$ terraform plan -out=tfplan
$ terraform apply tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-1-ex-1',
        title: 'Exercise 1: Initialize Terraform Working Directory',
        prompt: 'Write the Terraform command to initialize the current working directory, configure the backend, and download required provider plugins.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+init(\\s+-upgrade)?$',
        acceptedAnswers: ['terraform init', 'terraform init -upgrade'],
        explanation: '`terraform init` initializes the backend state storage and downloads provider binaries locked in `.terraform.lock.hcl`.',
        hint: 'Use the `init` subcommand.'
      },
      {
        id: 'tf-1-ex-2',
        title: 'Exercise 2: Save Deterministic Execution Plan',
        prompt: 'Write the Terraform command to compute the execution plan and save the binary plan artifact to `tfplan`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-out=?tfplan$',
        acceptedAnswers: ['terraform plan -out=tfplan', 'terraform plan -out tfplan'],
        explanation: '`terraform plan -out=tfplan` serializes the exact resource diff so `terraform apply tfplan` cannot deviate from what was reviewed.',
        hint: 'Pass `-out=tfplan` to `terraform plan`.'
      },
      {
        id: 'tf-1-ex-3',
        title: 'Exercise 3: Validate HCL Configuration Offline',
        prompt: 'Write the Terraform command that validates HCL syntax and attribute types without accessing remote state or cloud APIs.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+validate$',
        acceptedAnswers: ['terraform validate'],
        explanation: '`terraform validate` performs fast static analysis of your `.tf` files before running expensive API plan calls.',
        hint: 'Use the `validate` subcommand.'
      }
    ]
  },
  {
    ch: 2,
    id: 'tf-2',
    title: '2. Providers, Version Constraints, Aliases & Dependency Lock Files',
    section: 'Terraform Fundamentals',
    duration: 24,
    difficulty: Difficulty.BEGINNER,
    summary: 'Master `required_providers`, pessimistic version constraints (`~>`), multi-region provider `alias` blocks, and cryptographic provider verification with `.terraform.lock.hcl`.',
    analogy: 'Think of `.terraform.lock.hcl` like `package-lock.json` combined with SHA-256 GPG signature verification for infrastructure plugins.',
    keyPoints: [
      'The pessimistic constraint `~> 5.80.0` allows patch updates (`5.80.1`, `5.80.9`) while blocking minor or major breaking upgrades (`5.81.0`).',
      'Use `alias = "us_west_2"` on a second `provider "aws"` block to deploy multi-region resources (like DR replicas or CloudFront ACM certificates in `us-east-1`) within a single module.',
      'Commit `.terraform.lock.hcl` to Git and generate multi-platform checksums (`linux_amd64`, `darwin_arm64`) using `terraform providers lock`.'
    ],
    syntaxRows: [
      ['version = "~> 5.80.0"', 'Pessimistic constraint allowing only patch upgrades (5.80.x)', 'required_providers { aws = { version = "~> 5.80.0" } }'],
      ['alias = "dr_west"', 'Defines a secondary provider configuration for another region/account', 'provider "aws" { alias = "dr_west" region = "us-west-2" }'],
      ['provider = aws.dr_west', 'Binds a resource or module to a specific aliased provider', 'resource "aws_s3_bucket" "dr" { provider = aws.dr_west }'],
      ['terraform providers lock', 'Writes cryptographic SHA-256 hashes for OS/CPU architectures', 'terraform providers lock -platform=linux_amd64 -platform=darwin_arm64']
    ],
    tryItTitle: 'Lab: Multi-Platform Provider Lockfile & Version Pinning',
    tryItCode: `# Lock provider checksums for both Mac M-series laptops and Linux CI runners
$ terraform providers lock -platform=linux_amd64 -platform=darwin_arm64
$ terraform version`,
    tryItOutput: `- Fetching hashicorp/aws 5.80.0 for linux_amd64...
- Obtained hashicorp/aws checksums for linux_amd64 (signed by HashiCorp)
- Fetching hashicorp/aws 5.80.0 for darwin_arm64...
- Obtained hashicorp/aws checksums for darwin_arm64 (signed by HashiCorp)

Success! Terraform has updated the lock file (.terraform.lock.hcl).
Terraform v1.10.5 on linux_amd64
+ provider registry.terraform.io/hashicorp/aws v5.80.0`,
    exerciseQuestion: 'Complete the command to lock provider checksums for `linux_amd64` CI runners:',
    exerciseTemplate: 'terraform providers ___ -platform=linux_amd64',
    exerciseAnswer: 'lock',
    exerciseHint: 'Use the lock subcommand under terraform providers.',
    quizQ: 'Why does `terraform init` sometimes fail on a Linux CI runner after an engineer runs `terraform init` on an Apple Silicon (`darwin_arm64`) laptop and commits `.terraform.lock.hcl`?',
    quizOpts: [
      'Terraform does not support Linux',
      'By default `terraform init` only records `h1:` directory hashes for the host OS architecture unless `terraform providers lock -platform=linux_amd64 -platform=darwin_arm64` is used',
      '`.terraform.lock.hcl` should be added to `.gitignore`',
      'AWS provider only runs on Windows'
    ],
    quizAns: 1,
    quizExp: 'Running `terraform providers lock -platform=linux_amd64 -platform=darwin_arm64` populates SHA-256 package hashes for both developer laptops and CI runners.',
    interviewQ: 'What does the version constraint `~> 5.4` allow vs `~> 5.4.0`?',
    interviewA: '`~> 5.4` allows any `5.x` version `>= 5.4.0` and `< 6.0.0`, whereas `~> 5.4.0` only allows patch versions `>= 5.4.0` and `< 5.5.0`.',
    interviewCo: 'Coinbase / HashiCorp',
    realWorldCases: [
      {
        company: 'Coinbase Cloud Security',
        title: 'Supply-Chain Verification via Signed .terraform.lock.hcl',
        scenario: 'Enforces `terraform init -lockfile=readonly` in CI so any unverified or tampered provider binary fails the build before cloud credentials are touched.',
        impact: 'Mitigates third-party Terraform Registry supply-chain attacks.',
        codeSnippet: `$ terraform providers lock -platform=linux_amd64 -platform=darwin_arm64
$ terraform init -lockfile=readonly`
      },
      {
        company: 'Netflix Global CDN',
        title: 'Multi-Region Provider Aliases for Cross-Region Replication',
        scenario: 'Uses aliased AWS providers (`aws.us_east_1`, `aws.eu_west_1`) to provision active-active DynamoDB Global Tables and KMS keys in one atomic stack.',
        impact: 'Zero manual cross-region state stitching.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'GitLab Dedicated',
        title: 'Automated RenovateBot Provider Upgrades with Pessimistic Locking',
        scenario: 'Pins providers with `~> 5.80.0` and runs automated `terraform providers lock` PRs tested against ephemeral sandboxes.',
        impact: 'Eliminated Friday afternoon breakages caused by unpinned `>= 5.0.0` provider releases.',
        codeSnippet: `$ terraform init -upgrade
$ terraform providers lock -platform=linux_amd64`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-2-ex-1',
        title: 'Exercise 1: Multi-Platform Provider Checksum Lock',
        prompt: 'Write the command to lock provider checksums for `linux_amd64` in `.terraform.lock.hcl`.',
        starterCommand: 'terraform providers ',
        expectedPattern: '^terraform\\s+providers\\s+lock\\s+-platform=linux_amd64',
        acceptedAnswers: ['terraform providers lock -platform=linux_amd64'],
        explanation: '`terraform providers lock -platform=linux_amd64` fetches and verifies provider hashes for Linux CI runners.',
        hint: 'Use `lock -platform=linux_amd64`.'
      },
      {
        id: 'tf-2-ex-2',
        title: 'Exercise 2: Strict Lockfile CI Initialization',
        prompt: 'Write the `terraform init` command that enforces `-lockfile=readonly` so CI fails if `.terraform.lock.hcl` is out of sync.',
        starterCommand: 'terraform init ',
        expectedPattern: '^terraform\\s+init\\s+-lockfile=readonly$',
        acceptedAnswers: ['terraform init -lockfile=readonly'],
        explanation: '`terraform init -lockfile=readonly` guarantees CI never modifies `.terraform.lock.hcl` or downloads unverified provider versions.',
        hint: 'Pass `-lockfile=readonly` to `terraform init`.'
      },
      {
        id: 'tf-2-ex-3',
        title: 'Exercise 3: Upgrade Providers Within Constraints',
        prompt: 'Write the `terraform init` command flag that upgrades providers to the newest version allowed by your `version` constraints.',
        starterCommand: 'terraform init ',
        expectedPattern: '^terraform\\s+init\\s+-upgrade$',
        acceptedAnswers: ['terraform init -upgrade'],
        explanation: '`terraform init -upgrade` re-evaluates version constraints and updates `.terraform.lock.hcl` to the latest matching release.',
        hint: 'Pass `-upgrade` to `terraform init`.'
      }
    ]
  },
  {
    ch: 3,
    id: 'tf-3',
    title: '3. Input Variables, Validation Rules, Locals & Sensitive Outputs',
    section: 'Terraform Fundamentals',
    duration: 25,
    difficulty: Difficulty.BEGINNER,
    summary: 'Design strongly-typed module boundaries using `variable` type constructors (`object`, `map`, `set`), custom `validation` blocks, computed `locals`, and redacted `sensitive = true` outputs.',
    analogy: 'Variables are function parameters with runtime schema validation, `locals` are private constants inside the function body, and `output` blocks are the return values exported to callers.',
    keyPoints: [
      'Precedence order (lowest to highest): `default` -> `TF_VAR_name` env var -> `terraform.tfvars` -> `*.auto.tfvars` -> `-var` / `-var-file` CLI flags.',
      'Custom `validation { condition = ... error_message = ... }` blocks catch invalid CIDR blocks, instance types, or environment names during `terraform validate` / `plan` before API calls fail.',
      'Marking a variable or output `sensitive = true` redacts its value in CLI logs (`<sensitive>`), though the raw value still resides in `.tfstate` unless ephemeral values (Terraform 1.10+) are used.'
    ],
    syntaxRows: [
      ['type = object({ ... })', 'Enforces structural schema on complex variable inputs', 'type = object({ cidr = string, azs = list(string) })'],
      ['validation { condition = ... }', 'Fails early if input violates custom business rules', 'condition = can(cidrhost(var.vpc_cidr, 0))'],
      ['ephemeral = true', 'Terraform 1.10+ flag that never persists secret in state', 'variable "db_token" { type = string ephemeral = true }'],
      ['terraform output -json', 'Exports module outputs as machine-readable JSON', 'terraform output -raw kubeconfig_endpoint']
    ],
    tryItTitle: 'Lab: Variable Precedence & Output Inspection',
    tryItCode: `# Pass environment variables & var-files and inspect outputs
$ terraform plan -var="env=production" -var-file="prod.tfvars" -out=tfplan
$ terraform output -json`,
    tryItOutput: `Changes to Outputs:
  + vpc_id            = "vpc-0a8b9c1d2e3f4g5h6"
  + db_master_secret  = (sensitive value)

{
  "vpc_id": {
    "sensitive": false,
    "type": "string",
    "value": "vpc-0a8b9c1d2e3f4g5h6"
  },
  "db_master_secret": {
    "sensitive": true,
    "type": "string",
    "value": "rds-secret-rotated-9921"
  }
}`,
    exerciseQuestion: 'Complete the command to pass a variable file named `prod.tfvars` into `terraform plan`:',
    exerciseTemplate: 'terraform plan ___="prod.tfvars"',
    exerciseAnswer: '-var-file',
    exerciseHint: 'Use the -var-file flag.',
    quizQ: 'Which variable source has the HIGHEST precedence in Terraform?',
    quizOpts: [
      'Environment variables (`TF_VAR_region`)',
      '`terraform.tfvars` file',
      '`-var` and `-var-file` flags passed last on the command line',
      'The `default` attribute inside the `variable` block'
    ],
    quizAns: 2,
    quizExp: 'CLI `-var` and `-var-file` arguments always override `.auto.tfvars`, `terraform.tfvars`, `TF_VAR_*`, and defaults.',
    interviewQ: 'Does `sensitive = true` keep secrets out of `terraform.tfstate`? How did Terraform 1.10 solve this?',
    interviewA: '`sensitive = true` only redacts console stdout/plan output; the plaintext value is still stored in `.tfstate`. Terraform 1.10 introduced `ephemeral = true` variables, ephemeral resources, and write-only attributes (`password_wo`) that never enter `.tfstate` or plan files.',
    interviewCo: 'HashiCorp / Datadog',
    realWorldCases: [
      {
        company: 'Airbnb Cloud Foundation',
        title: 'CIDR & Tag Compliance via Variable Validation Blocks',
        scenario: 'Validates `cidrhost()` and mandatory cost-center tags inside module `variable` blocks before any AWS VPC API call is attempted.',
        impact: 'Caught 94% of misconfigured network PRs in <2 seconds during static validation.',
        codeSnippet: `$ terraform validate
$ terraform plan -var-file="prod.tfvars"`
      },
      {
        company: 'Plaid Financial Infra',
        title: 'Zero-State Secret Rotation with Terraform 1.10 Ephemeral Variables',
        scenario: 'Passes short-lived Vault RDS credentials via `ephemeral = true` variables into write-only database attributes.',
        impact: 'Eliminated plaintext database passwords from S3 state files.',
        codeSnippet: `$ terraform plan -var="env=prod" -out=tfplan`
      },
      {
        company: 'Vercel Deployment Engine',
        title: 'Machine-Readable Infrastructure Handoff via `terraform output -json`',
        scenario: 'Exports provisioned EKS cluster endpoints and OIDC issuer URLs via `terraform output -json` to downstreamHelm/Argo bootstrap steps.',
        impact: 'Zero manual copy-pasting of ARNs between infrastructure and application pipelines.',
        codeSnippet: `$ terraform output -json`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-3-ex-1',
        title: 'Exercise 1: Pass Variable File to Terraform Plan',
        prompt: 'Write the command to run `terraform plan` using the variable file `prod.tfvars`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-var-file=["\']?prod\\.tfvars["\']?$',
        acceptedAnswers: ['terraform plan -var-file=prod.tfvars', 'terraform plan -var-file="prod.tfvars"'],
        explanation: '`-var-file=prod.tfvars` loads environment-specific variable definitions at highest CLI precedence.',
        hint: 'Use `-var-file=prod.tfvars`.'
      },
      {
        id: 'tf-3-ex-2',
        title: 'Exercise 2: Export All Outputs as JSON',
        prompt: 'Write the Terraform command to print all module outputs in machine-readable JSON format.',
        starterCommand: 'terraform output ',
        expectedPattern: '^terraform\\s+output\\s+-json$',
        acceptedAnswers: ['terraform output -json'],
        explanation: '`terraform output -json` serializes all output values, types, and sensitivity metadata as JSON for CI pipelines.',
        hint: 'Pass `-json` to `terraform output`.'
      },
      {
        id: 'tf-3-ex-3',
        title: 'Exercise 3: Extract a Single Raw Output String',
        prompt: 'Write the Terraform command to extract the raw unquoted string value of the output named `vpc_id`.',
        starterCommand: 'terraform output ',
        expectedPattern: '^terraform\\s+output\\s+-raw\\s+vpc_id$',
        acceptedAnswers: ['terraform output -raw vpc_id'],
        explanation: '`terraform output -raw vpc_id` prints the exact string without JSON quotes so it can be piped into shell scripts (`VPC_ID=$(terraform output -raw vpc_id)`).',
        hint: 'Use `-raw vpc_id`.'
      }
    ]
  },
  {
    ch: 4,
    id: 'tf-4',
    title: '4. Terraform State Architecture: Remote Backends, Encryption & Locking',
    section: 'State & Graph Internals',
    duration: 28,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Understand why Terraform requires state, how remote backends (S3 + native `use_lockfile = true` or DynamoDB locking, GCS, HCP Terraform) prevent concurrent state corruption, and how to encrypt state at rest.',
    analogy: 'Without distributed state locking, two engineers running `terraform apply` simultaneously are like two surgeons operating on the same patient with outdated X-rays—overwriting each other’s changes.',
    keyPoints: [
      'State maps HCL resource addresses (`aws_instance.api`) to real-world cloud provider IDs (`i-0123456789abcdef0`) and caches dependency metadata.',
      'Production state must live in a remote backend (`s3`, `gcs`, `azurerm`) with server-side KMS encryption (`encrypt = true`), bucket versioning, and state locking (`use_lockfile = true` in S3 or DynamoDB lock table).',
      'Never edit `terraform.tfstate` manually in a text editor; always use `terraform state list`, `terraform state show`, or declarative `moved` / `removed` blocks.'
    ],
    syntaxRows: [
      ['backend "s3" { encrypt = true }', 'Configures encrypted remote state in Amazon S3', 'use_lockfile = true # S3 native conditional-write locking'],
      ['terraform state list', 'Lists all resource addresses tracked in the current state', 'terraform state list module.vpc'],
      ['terraform state show <addr>', 'Inspects all tracked attributes of a single state resource', 'terraform state show aws_s3_bucket.audit_logs'],
      ['terraform force-unlock <ID>', 'Breaks a stale remote state lock after verifying no active run', 'terraform force-unlock 8f9d2a1b-4c3e-9910']
    ],
    tryItTitle: 'Lab: Inspecting Remote State & Resource Attributes',
    tryItCode: `# List tracked resources in remote state and inspect attributes
$ terraform state list
$ terraform state show aws_s3_bucket.audit_logs`,
    tryItOutput: `data.aws_caller_identity.current
aws_kms_key.state_cmk
aws_s3_bucket.audit_logs
module.vpc.aws_vpc.main

# aws_s3_bucket.audit_logs:
resource "aws_s3_bucket" "audit_logs" {
    arn                         = "arn:aws:s3:::acme-prod-audit-logs-2025"
    bucket                      = "acme-prod-audit-logs-2025"
    bucket_domain_name          = "acme-prod-audit-logs-2025.s3.amazonaws.com"
    id                          = "acme-prod-audit-logs-2025"
    region                      = "us-east-1"
}`,
    exerciseQuestion: 'Complete the command to list every resource currently tracked in the Terraform state file:',
    exerciseTemplate: 'terraform state ___',
    exerciseAnswer: 'list',
    exerciseHint: 'Use the list subcommand under terraform state.',
    quizQ: 'What happens if two CI pipelines run `terraform apply` against the same S3 backend with state locking enabled?',
    quizOpts: [
      'Both pipelines apply simultaneously and merge the JSON file',
      'The first pipeline acquires the lock (`.tflock` via S3 conditional writes or DynamoDB `ConditionalCheckFailedException`), while the second pipeline waits or fails safely without corrupting state',
      'Terraform deletes the state file',
      'AWS automatically rolls back both pipelines'
    ],
    quizAns: 1,
    quizExp: 'Atomic state locking prevents concurrent writers from clobbering `terraform.tfstate` during parallel runs.',
    interviewQ: 'How did Terraform 1.10 simplify AWS S3 remote state locking compared to legacy setups?',
    interviewA: 'Historically, S3 lacked atomic conditional writes, requiring a separate DynamoDB table (`dynamodb_table = "tf-locks"`). Because AWS S3 added `If-None-Match` conditional put headers, Terraform 1.10+ supports `use_lockfile = true` directly on the S3 backend, writing a `.tflock` object natively in S3 without needing DynamoDB.',
    interviewCo: 'AWS / HashiCorp',
    realWorldCases: [
      {
        company: 'Capital One Cloud Governance',
        title: 'KMS-Encrypted S3 State Per Micro-Account with Native S3 Lockfiles',
        scenario: 'Isolates Terraform state into dedicated, versioned S3 buckets per environment with customer-managed KMS keys and `use_lockfile = true`.',
        impact: 'Eliminated blast-radius overlap across 600+ financial microservice stacks.',
        codeSnippet: `$ terraform state list
$ terraform state show aws_s3_bucket.audit_logs`
      },
      {
        company: 'Uber Infrastructure Platform',
        title: 'Automated Stale Lock Detection & Safe Recovery in Atlantis',
        scenario: 'Detects crashed CI worker processes holding orphaned state locks and verifies zero active runners before executing `terraform force-unlock`.',
        impact: 'Reduced state-lock incident recovery time from 35 minutes to under 30 seconds.',
        codeSnippet: `$ terraform state list`
      },
      {
        company: 'Snowflake Multi-Cloud',
        title: 'State Versioning & Instant Rollback on Corrupted Provider Crashes',
        scenario: 'Uses S3 Object Versioning and GCS Object Versioning on state buckets with strict IAM deny policies against `s3:DeleteObjectVersion`.',
        impact: 'Guaranteed point-in-time state recovery across AWS, GCP, and Azure.',
        codeSnippet: `$ terraform state pull`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-4-ex-1',
        title: 'Exercise 1: List All Tracked State Resources',
        prompt: 'Write the command to list all resources currently tracked in the Terraform state.',
        starterCommand: 'terraform state ',
        expectedPattern: '^terraform\\s+state\\s+list$',
        acceptedAnswers: ['terraform state list'],
        explanation: '`terraform state list` prints every resource and data source address in the state file.',
        hint: 'Use `terraform state list`.'
      },
      {
        id: 'tf-4-ex-2',
        title: 'Exercise 2: Inspect a Specific Resource in State',
        prompt: 'Write the command to display all state attributes of `aws_s3_bucket.audit_logs`.',
        starterCommand: 'terraform state show ',
        expectedPattern: '^terraform\\s+state\\s+show\\s+aws_s3_bucket\\.audit_logs$',
        acceptedAnswers: ['terraform state show aws_s3_bucket.audit_logs'],
        explanation: '`terraform state show <address>` outputs the exact attributes stored in `.tfstate` for that resource.',
        hint: 'Pass `aws_s3_bucket.audit_logs` to `terraform state show`.'
      },
      {
        id: 'tf-4-ex-3',
        title: 'Exercise 3: Migrate Local State to New Remote Backend',
        prompt: 'Write the `terraform init` command flag used to copy existing state into a newly configured remote backend.',
        starterCommand: 'terraform init ',
        expectedPattern: '^terraform\\s+init\\s+-migrate-state$',
        acceptedAnswers: ['terraform init -migrate-state'],
        explanation: '`terraform init -migrate-state` safely copies state from local disk (or a previous backend) into the new backend configuration.',
        hint: 'Use `-migrate-state`.'
      }
    ]
  },
  {
    ch: 5,
    id: 'tf-5',
    title: '5. Resources, Data Sources & Directed Acyclic Graph (DAG) Dependencies',
    section: 'State & Graph Internals',
    duration: 26,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Learn how Terraform builds its execution DAG using implicit attribute references vs explicit `depends_on` edges, how `-parallelism=N` schedules concurrent API calls, and how `data` sources query existing infrastructure.',
    analogy: 'Implicit references (`vpc_id = aws_vpc.main.id`) are natural load-bearing beams in a blueprint; `depends_on` is an explicit safety cable added when a hidden dependency (like an IAM role policy attachment) isn’t visible in the resource attributes.',
    keyPoints: [
      'Prefer implicit dependencies (`subnet_id = aws_subnet.private.id`) over `depends_on` so Terraform knows the exact attribute relationship and avoids over-serializing the graph.',
      'Use `depends_on` only for hidden side-effects (e.g., an ECS task or Lambda function that needs `aws_iam_role_policy_attachment` to finish propagating before booting).',
      'Adding `depends_on` to a `data` source or module forces Terraform to defer reading all data sources in that block until the apply phase (`(known after apply)`), which can cause unnecessary plan churn.'
    ],
    syntaxRows: [
      ['data "aws_ami" "ubuntu" {}', 'Queries read-only information from the cloud provider API', 'most_recent = true'],
      ['vpc_id = aws_vpc.main.id', 'Creates an implicit DAG edge from aws_subnet -> aws_vpc', 'Terraform creates VPC first, destroys VPC last'],
      ['depends_on = [aws_iam_role_policy.p]', 'Creates an explicit DAG edge for hidden runtime dependencies', 'Used when no attribute reference exists'],
      ['terraform graph', 'Outputs the resource dependency graph in Graphviz DOT format', 'terraform graph | dot -Tsvg > graph.svg']
    ],
    tryItTitle: 'Lab: Visualizing the Terraform Execution DAG',
    tryItCode: `# Export the Directed Acyclic Graph (DAG) in DOT notation
$ terraform graph
$ terraform plan -parallelism=20 -out=tfplan`,
    tryItOutput: `digraph G {
  rankdir = "RL";
  node [shape = rect, fontname = "sans-serif"];
  "data.aws_caller_identity.current" [label="data.aws_caller_identity.current"];
  "aws_vpc.main" [label="aws_vpc.main"];
  "aws_subnet.private" [label="aws_subnet.private"];
  "aws_eks_cluster.prod" [label="aws_eks_cluster.prod"];
  "aws_subnet.private" -> "aws_vpc.main";
  "aws_eks_cluster.prod" -> "aws_subnet.private";
}

Plan: 3 to add, 0 to change, 0 to destroy. (Parallelism: 20 concurrent operations)`,
    exerciseQuestion: 'Complete the command to output the resource dependency graph in DOT format:',
    exerciseTemplate: 'terraform ___',
    exerciseAnswer: 'graph',
    exerciseHint: 'Use the graph subcommand.',
    quizQ: 'What is a common unintended side-effect of placing `depends_on = [module.network]` on a `data "aws_iam_policy_document"` block?',
    quizOpts: [
      'It deletes the network module',
      'Whenever anything inside `module.network` changes, the data source cannot be evaluated during `plan` and marks its output `(known after apply)`, triggering noisy cascading diffs on every IAM resource using that policy',
      'It makes `terraform init` fail',
      'It increases parallelism to 100'
    ],
    quizAns: 1,
    quizExp: '`depends_on` on a data source forces deferred read whenever any dependency has pending changes, polluting the plan with `(known after apply)`.',
    interviewQ: 'What is the default concurrency limit in Terraform during `plan` and `apply`, and when would you tune `-parallelism=N`?',
    interviewA: 'Terraform defaults to `-parallelism=10` concurrent graph node walks. You lower it (e.g., `-parallelism=3`) when hitting strict cloud API rate limits (HTTP 429 TooManyRequests on AWS Route53/IAM), or raise it (`-parallelism=25`) on large independent stacks after verifying provider rate limits.',
    interviewCo: 'Uber / Cloudflare',
    realWorldCases: [
      {
        company: 'Cloudflare DNS Automation',
        title: 'Rate-Limit Aware DAG Parallelism Tuning Across 5,000 Zones',
        scenario: 'Tunes `-parallelism` and removes redundant `depends_on` barriers so independent DNS zones apply concurrently without serialized bottlenecks.',
        impact: 'Cut large zone convergence runs from 28 minutes to 3.5 minutes.',
        codeSnippet: `$ terraform graph
$ terraform plan -parallelism=20 -out=tfplan`
      },
      {
        company: 'Shopify Kubernetes Platform',
        title: 'Explicit IAM Policy Propagation Barriers Before EKS Node Boot',
        scenario: 'Uses targeted `depends_on = [aws_iam_role_policy_attachment.cni]` on EKS node groups so kubelet never boots before CNI IAM permissions exist.',
        impact: 'Eliminated race-condition `NodeNotReady` failures during cluster creation.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'DoorDash Cloud Infra',
        title: 'Eliminating Cascading Plan Churn by Refactoring Module `depends_on`',
        scenario: 'Replaced broad module-level `depends_on` blocks with fine-grained output attribute references.',
        impact: 'Eliminated false-positive IAM policy recreation diffs across 80+ microservices.',
        codeSnippet: `$ terraform graph`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-5-ex-1',
        title: 'Exercise 1: Export Resource Dependency Graph',
        prompt: 'Write the Terraform command to output the visual dependency graph in DOT format.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+graph$',
        acceptedAnswers: ['terraform graph'],
        explanation: '`terraform graph` outputs the DAG nodes and directed edges in Graphviz DOT syntax.',
        hint: 'Use `terraform graph`.'
      },
      {
        id: 'tf-5-ex-2',
        title: 'Exercise 2: Tune DAG Concurrency with Parallelism Flag',
        prompt: 'Write the command to run `terraform plan` with a concurrency limit of 20 parallel operations.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-parallelism=20$',
        acceptedAnswers: ['terraform plan -parallelism=20'],
        explanation: '`-parallelism=20` increases the number of concurrent graph nodes Terraform walks from the default 10 to 20.',
        hint: 'Pass `-parallelism=20` to `terraform plan`.'
      },
      {
        id: 'tf-5-ex-3',
        title: 'Exercise 3: Refresh-Only State Sync Check',
        prompt: 'Write the `terraform plan` command flag that only checks for real-world cloud drift against state without proposing HCL config changes.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-refresh-only$',
        acceptedAnswers: ['terraform plan -refresh-only'],
        explanation: '`terraform plan -refresh-only` compares the state file against live cloud APIs to detect out-of-band console edits.',
        hint: 'Use `-refresh-only`.'
      }
    ]
  },
  {
    ch: 6,
    id: 'tf-6',
    title: '6. Resource Lifecycle Meta-Arguments & Zero-Downtime Replacements',
    section: 'State & Graph Internals',
    duration: 28,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Control how Terraform replaces, protects, and validates stateful infrastructure using `create_before_destroy`, `prevent_destroy`, `ignore_changes`, `replace_triggered_by`, and `precondition` / `postcondition` checks.',
    analogy: '`create_before_destroy = true` builds the new bridge span and switches traffic over before demolishing the old bridge; default Terraform demolishes the old bridge first.',
    keyPoints: [
      'By default, immutable updates (`-/+`) destroy the old resource first and then create the new one—causing downtime for ALB target groups, launch templates, and TLS certificates unless `create_before_destroy = true` is set.',
      '`prevent_destroy = true` acts as a circuit breaker on production RDS databases, KMS keys, and S3 buckets, aborting any plan that attempts to destroy them.',
      'Use `terraform apply -replace="aws_instance.worker[0]"` (replacing the deprecated `terraform taint` command) to force recreation of a degraded resource during a single plan/apply cycle.'
    ],
    syntaxRows: [
      ['create_before_destroy = true', 'Provisions replacement resource before destroying the old one', 'Required for zero-downtime Launch Templates & ACM certs'],
      ['prevent_destroy = true', 'Fails the plan if Terraform attempts to destroy the resource', 'Used on production RDS databases & KMS keys'],
      ['ignore_changes = [tags]', 'Ignores external mutations to specified attributes', 'ignore_changes = [desired_capacity] # managed by HPA/ASG'],
      ['terraform plan -replace=<addr>', 'Plans forced recreation of a specific degraded resource', 'terraform plan -replace="aws_instance.web[0]"']
    ],
    tryItTitle: 'Lab: Zero-Downtime Replacement & Targeted Resource Recreation',
    tryItCode: `# Force clean replacement of a degraded instance without using deprecated taint
$ terraform plan -replace="aws_instance.api_node[0]" -out=tfplan`,
    tryItOutput: `Terraform will perform the following actions:

  # aws_instance.api_node[0] will be replaced, as requested
+/- resource "aws_instance" "api_node" {
      ~ id            = "i-0a1b2c3d4e5f6g7h8" -> (known after apply)
        instance_type = "m6i.large"
      ~ private_ip    = "10.0.14.22" -> (known after apply)
    }

Plan: 1 to add, 0 to change, 1 to destroy. (create_before_destroy lifecycle active)`,
    exerciseQuestion: 'Complete the modern flag to force replacement of `aws_instance.web` during `terraform plan` (instead of the deprecated `taint` command):',
    exerciseTemplate: 'terraform plan ___="aws_instance.web"',
    exerciseAnswer: '-replace',
    exerciseHint: 'Use the -replace flag.',
    quizQ: 'Why did HashiCorp deprecate `terraform taint` in favor of `terraform apply -replace="<address>"`?',
    quizOpts: [
      'Because `terraform taint` was too fast',
      '`terraform taint` mutated the remote state file immediately without a plan review, whereas `-replace` scopes the replacement cleanly inside the reviewable `tfplan` artifact',
      '`-replace` does not require cloud credentials',
      '`terraform taint` only worked on Azure'
    ],
    quizAns: 1,
    quizExp: '`terraform taint` modified remote state out-of-band, which could surprise another teammate whose CI pipeline ran next; `-replace` is part of the normal plan/apply workflow.',
    interviewQ: 'Why do you have to use `name_prefix` instead of a static `name` on an AWS Launch Template or Security Group when enabling `create_before_destroy = true`?',
    interviewA: 'With `create_before_destroy = true`, the new resource is created while the old resource still exists. If a static unique `name` is hardcoded, the cloud API rejects creation of the replacement with an `AlreadyExists` collision error. `name_prefix` generates a unique suffix so both can coexist during cutover.',
    interviewCo: 'Stripe / Robinhood',
    realWorldCases: [
      {
        company: 'Robinhood Trading Infra',
        title: 'Hard `prevent_destroy` Guardrails on Ledger RDS & KMS Keys',
        scenario: 'Enforces `lifecycle { prevent_destroy = true }` plus S3 object lock on all stateful financial databases and encryption keys.',
        impact: 'Blocked accidental subnet refactor plans from dropping stateful production clusters.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'Lyft Compute Platform',
        title: 'Autoscaler Compatibility with `ignore_changes = [desired_capacity]`',
        scenario: 'Allows AWS Cluster Autoscaler to scale ASG `desired_capacity` dynamically between 10 and 200 nodes without Terraform resetting capacity back to 10 on the next deploy.',
        impact: 'Zero capacity rollbacks during peak commute traffic.',
        codeSnippet: `$ terraform plan -out=tfplan`
      },
      {
        company: 'Slack Edge Load Balancing',
        title: 'Zero-Downtime ACM TLS Certificate & Target Group Rollouts',
        scenario: 'Combines `name_prefix` with `create_before_destroy = true` on ALB Target Groups and TLS certificates.',
        impact: '100% zero-dropped-connection listener upgrades.',
        codeSnippet: `$ terraform plan -replace="aws_instance.api_node[0]" -out=tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-6-ex-1',
        title: 'Exercise 1: Plan Forced Resource Replacement',
        prompt: 'Write the `terraform plan` command to force replacement of `aws_instance.web`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-replace=["\']?aws_instance\\.web["\']?$',
        acceptedAnswers: ['terraform plan -replace=aws_instance.web', 'terraform plan -replace="aws_instance.web"'],
        explanation: '`-replace="aws_instance.web"` schedules a clean replacement inside the execution plan without mutating state prematurely.',
        hint: 'Use `-replace="aws_instance.web"`.'
      },
      {
        id: 'tf-6-ex-2',
        title: 'Exercise 2: Apply a Saved Binary Plan',
        prompt: 'Write the `terraform apply` command to execute a previously saved plan file named `tfplan`.',
        starterCommand: 'terraform apply ',
        expectedPattern: '^terraform\\s+apply\\s+tfplan$',
        acceptedAnswers: ['terraform apply tfplan'],
        explanation: '`terraform apply tfplan` executes the exact actions recorded in `tfplan` without prompting or recomputing the diff.',
        hint: 'Pass `tfplan` directly to `terraform apply`.'
      },
      {
        id: 'tf-6-ex-3',
        title: 'Exercise 3: Preview Destruction Plan Safely',
        prompt: 'Write the `terraform plan` command that previews what would be destroyed if the stack were torn down, without actually destroying anything.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-destroy$',
        acceptedAnswers: ['terraform plan -destroy'],
        explanation: '`terraform plan -destroy` computes a speculative destroy plan and verifies whether any `prevent_destroy` guardrails block teardown.',
        hint: 'Pass `-destroy` to `terraform plan`.'
      }
    ]
  },
  {
    ch: 7,
    id: 'tf-7',
    title: '7. Dynamic Scaling with count, for_each & dynamic Blocks',
    section: 'Modular & Dynamic HCL',
    duration: 28,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Avoid fragile list-index shifting bugs by mastering keyed `for_each` maps/sets over positional `count`, `for` comprehensions, and inline `dynamic` configuration blocks.',
    analogy: 'Using `count` on a list of subnets is like numbering seats in a row: if seat #0 is removed, everyone shifts left and gets torn down and rebuilt. `for_each` labels each resource by its unique key (`"us-east-1a"`), so removing one never disturbs the others.',
    keyPoints: [
      '`count` addresses resources by integer index (`aws_subnet.private[0]`, `aws_subnet.private[1]`). Removing the first item in a list shifts every subsequent index and forces destructive recreation!',
      '`for_each` addresses resources by stable string key (`aws_subnet.private["us-east-1a"]`), isolating additions and deletions to the exact key modified.',
      'Use `count = var.enable_redis ? 1 : 0` strictly for boolean feature flags or uniform identical replicas, and `for_each` for named collections.'
    ],
    syntaxRows: [
      ['for_each = toset(var.azs)', 'Creates keyed resource instances addressed by string key', 'aws_subnet.private["us-east-1a"]'],
      ['count = var.enabled ? 1 : 0', 'Idiomatic conditional creation toggle for a single resource', 'one(aws_redis_cluster.cache[*].endpoint)'],
      ['dynamic "ingress" { for_each = ... }', 'Generates repeated nested blocks inside a single resource', 'content { from_port = ingress.value.port }'],
      ['{ for k, v in var.map : k => v.id }', 'HCL map comprehension transforming collections', '[for s in var.subnets : s.cidr if s.public]']
    ],
    tryItTitle: 'Lab: Keyed `for_each` State Addressing vs Positional `count`',
    tryItCode: `# Inspect keyed for_each resource addresses in state
$ terraform state list
$ terraform console <<< 'keys({ "us-east-1a" = "10.0.1.0/24", "us-east-1b" = "10.0.2.0/24" })'`,
    tryItOutput: `aws_subnet.private["us-east-1a"]
aws_subnet.private["us-east-1b"]
aws_subnet.private["us-east-1c"]

tolist([
  "us-east-1a",
  "us-east-1b",
])`,
    exerciseQuestion: 'Which HCL meta-argument addresses resources by stable string keys (`resource["key"]`) rather than integer positions (`resource[0]`)?',
    exerciseTemplate: '___ = toset(var.availability_zones)',
    exerciseAnswer: 'for_each',
    exerciseHint: 'Use for_each.',
    quizQ: 'You have 3 IAM users created with `count = length(var.users)` where `users = ["alice", "bob", "charlie"]`. If you remove `"alice"` from the list, what does Terraform plan to do?',
    quizOpts: [
      'Only delete `"alice"`',
      'Modify `aws_iam_user.this[0]` from `"alice"` to `"bob"`, modify `[1]` from `"bob"` to `"charlie"`, and destroy `[2]`—disrupting every user after the deleted index',
      'Throw a syntax error',
      'Nothing'
    ],
    quizAns: 1,
    quizExp: 'Because `count` tracks resources by numeric index (`[0]`, `[1]`, `[2]`), removing element 0 shifts all remaining elements left. Converting to `for_each = toset(var.users)` fixes this permanently.',
    interviewQ: 'What happens if you pass a map or set into `for_each` whose keys depend on an attribute that is only known after `apply` (like a newly generated random ID or EC2 instance ID)?',
    interviewA: 'Terraform fails during `plan` with `"The for_each value depends on resource attributes that cannot be determined until apply"`. To fix it, always key `for_each` on static config-time strings (like logical names `"web-a"`, `"web-b"`), while allowing the map *values* to reference computed attributes.',
    interviewCo: 'HashiCorp / Airbnb',
    realWorldCases: [
      {
        company: 'Dropbox Storage Infra',
        title: 'Migrating 400+ S3 Bucket Policies from `count` to Keyed `for_each`',
        scenario: 'Refactored legacy `count`-indexed bucket modules to `for_each` keyed by bucket name plus `moved` blocks.',
        impact: 'Eliminated accidental bucket replacements when decommissioning legacy staging buckets.',
        codeSnippet: `$ terraform state list
$ terraform plan -out=tfplan`
      },
      {
        company: 'Twilio Edge Security',
        title: 'Dynamic Security Group & WAF Rules via `dynamic` Blocks',
        scenario: 'Generates hundreds of regional ingress CIDR rules inside `aws_security_group` using `dynamic "ingress"` blocks driven by YAML config maps.',
        impact: 'Reduced 2,400 lines of repetitive HCL to a single 35-line module.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'Pinterest Cloud Platform',
        title: 'Static Map Keys for Multi-AZ EKS Node Groups',
        scenario: 'Keys EKS node groups by static logical names (`"general-az1"`, `"gpu-az2"`) so dynamic AMI upgrades never break `for_each` plan evaluation.',
        impact: 'Zero `unknown for_each key` plan failures across 50+ Kubernetes clusters.',
        codeSnippet: `$ terraform plan -out=tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-7-ex-1',
        title: 'Exercise 1: Interactive Expression Evaluation with Terraform Console',
        prompt: 'Write the command to launch the interactive Terraform expression evaluation console.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+console$',
        acceptedAnswers: ['terraform console'],
        explanation: '`terraform console` opens an interactive REPL to test `for` comprehensions, `cidrsubnet()`, and `for_each` expressions against current state.',
        hint: 'Use `terraform console`.'
      },
      {
        id: 'tf-7-ex-2',
        title: 'Exercise 2: Inspect a Keyed `for_each` Resource in State',
        prompt: 'Write the `terraform state show` command to inspect `aws_subnet.private["us-east-1a"]`.',
        starterCommand: 'terraform state show ',
        expectedPattern: '^terraform\\s+state\\s+show\\s+[\'"]?aws_subnet\\.private\\["us-east-1a"\\][\'"]?$',
        acceptedAnswers: [
          'terraform state show \'aws_subnet.private["us-east-1a"]\'',
          'terraform state show "aws_subnet.private[\\"us-east-1a\\"]"',
          'terraform state show aws_subnet.private["us-east-1a"]'
        ],
        explanation: 'Keyed `for_each` resources include their string key in brackets (`aws_subnet.private["us-east-1a"]`).',
        hint: 'Pass `aws_subnet.private["us-east-1a"]` to `terraform state show`.'
      },
      {
        id: 'tf-7-ex-3',
        title: 'Exercise 3: Format HCL Files Recursively',
        prompt: 'Write the Terraform command to format all `.tf` files recursively across subdirectories.',
        starterCommand: 'terraform fmt ',
        expectedPattern: '^terraform\\s+fmt\\s+-recursive$',
        acceptedAnswers: ['terraform fmt -recursive'],
        explanation: '`terraform fmt -recursive` formats the root module and all child modules in `modules/`.',
        hint: 'Pass `-recursive` to `terraform fmt`.'
      }
    ]
  },
  {
    ch: 8,
    id: 'tf-8',
    title: '8. Built-in Functions, Type Conversions, cidrsubnet & templatefile',
    section: 'Modular & Dynamic HCL',
    duration: 26,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Master Terraform’s pure built-in functions: `cidrsubnet()` for deterministic VPC IP math, `templatefile()` for rendering JSON/YAML/User-Data policies, `try()` / `coalesce()` for safe fallbacks, and `jsonencode()` / `yamldecode()`.',
    analogy: 'Hardcoding subnet CIDRs by hand is like doing binary long-division on a napkin; `cidrsubnet("10.0.0.0/16", 8, idx)` computes non-overlapping `/24` blocks mathematically.',
    keyPoints: [
      '`cidrsubnet(prefix, newbits, netnum)` adds `newbits` to the prefix length: `cidrsubnet("10.0.0.0/16", 8, 2)` yields `"10.0.2.0/24"`.',
      'Always prefer `jsonencode({ ... })` or `templatefile("${path.module}/policy.tftpl", { ... })` over raw heredoc string interpolation so JSON syntax and escaping are guaranteed valid.',
      '`try(expression, fallback)` evaluates arguments in order and returns the first one that does not produce an error—ideal for optional nested object lookups.'
    ],
    syntaxRows: [
      ['cidrsubnet("10.0.0.0/16", 8, 1)', 'Calculates /24 subnet #1 -> "10.0.1.0/24"', 'cidrhost("10.0.1.0/24", 10) -> "10.0.1.10"'],
      ['templatefile("${path.module}/init.tftpl", vars)', 'Renders external template file with typed variables', 'Used for cloud-init user_data and IAM policies'],
      ['jsonencode({ Version = "2012-10-17", ... })', 'Serializes HCL data structures into valid JSON', 'yamldecode(file("${path.module}/config.yaml"))'],
      ['try(var.cfg.timeout, 30)', 'Returns fallback value if attribute lookup fails', 'coalesce(var.custom_name, local.default_name)']
    ],
    tryItTitle: 'Lab: VPC CIDR Math & JSON Encoding in `terraform console`',
    tryItCode: `# Evaluate cidrsubnet and jsonencode expressions in terraform console
$ terraform console <<< 'cidrsubnet("10.0.0.0/16", 8, 3)'`,
    tryItOutput: `"10.0.3.0/24"`,
    exerciseQuestion: 'Which built-in Terraform function calculates a child subnet CIDR from a parent VPC CIDR block (`"10.0.0.0/16"`)?',
    exerciseTemplate: '___("10.0.0.0/16", 8, 1)',
    exerciseAnswer: 'cidrsubnet',
    exerciseHint: 'Use cidrsubnet.',
    quizQ: 'What does `cidrsubnet("10.20.0.0/16", 4, 2)` return?',
    quizOpts: [
      '`"10.20.2.0/24"`',
      '`"10.20.32.0/20"` (adds 4 bits to `/16` -> `/20`, and selects network index 2 -> `2 * 16 = 32` in the third octet)',
      '`"10.20.0.2/32"`',
      'An error'
    ],
    quizAns: 1,
    quizExp: '`16 + 4 = 20` (`/20` mask = 16 Class-C networks per block). Index `2` starts at `2 * 16 = 32`, yielding `"10.20.32.0/20"`.',
    interviewQ: 'Why should you use `${path.module}` instead of `./` when passing a file path to `file()` or `templatefile()` inside a reusable child module?',
    interviewA: '`./` (or `path.root`) resolves relative to the root working directory where `terraform plan` is executed, which breaks as soon as another directory calls your child module. `${path.module}` always resolves relative to the directory containing the module’s own `.tf` file.',
    interviewCo: 'HashiCorp / Netflix',
    realWorldCases: [
      {
        company: 'Stripe Network Engineering',
        title: 'Deterministic Multi-AZ Subnet Allocation via `cidrsubnet`',
        scenario: 'Computes non-overlapping `/20` private application subnets, `/24` public ALB subnets, and `/26` database subnets from a single VPC `/16` variable.',
        impact: 'Zero IP exhaustion or overlapping CIDR peering conflicts across 100+ VPCs.',
        codeSnippet: `$ terraform console <<< 'cidrsubnet("10.0.0.0/16", 8, 3)'`
      },
      {
        company: 'GitHub Actions Runner Fleet',
        title: 'Cloud-Init Bootstrap Scripts via `templatefile()`',
        scenario: 'Renders strongly-typed `.tftpl` cloud-init scripts with runner registration tokens and kernel sysctl tunings.',
        impact: 'Eliminated broken bash quoting bugs in EC2 user-data scripts.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'Figma Infrastructure',
        title: 'GitOps Config Driven Modules via `yamldecode(file(...))`',
        scenario: 'Product teams define service queues and alarms in concise YAML files decoded into HCL maps via `yamldecode()`.',
        impact: 'Enabled 200+ product engineers to self-serve SQS/SNS queues without writing raw HCL.',
        codeSnippet: `$ terraform fmt -check
$ terraform validate`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-8-ex-1',
        title: 'Exercise 1: Check HCL Formatting in CI',
        prompt: 'Write the `terraform fmt` command that checks whether all `.tf` files are properly formatted and exits non-zero if not (without modifying files).',
        starterCommand: 'terraform fmt ',
        expectedPattern: '^terraform\\s+fmt\\s+-check(\\s+-recursive)?$',
        acceptedAnswers: ['terraform fmt -check', 'terraform fmt -check -recursive'],
        explanation: '`terraform fmt -check` returns exit code 3 if any file is unformatted, making it the standard first gate in CI.',
        hint: 'Pass `-check` to `terraform fmt`.'
      },
      {
        id: 'tf-8-ex-2',
        title: 'Exercise 2: Evaluate Expression via Terraform Console',
        prompt: 'Write the command to start `terraform console`.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+console$',
        acceptedAnswers: ['terraform console'],
        explanation: '`terraform console` lets you interactively test `cidrsubnet`, `jsonencode`, and `templatefile` functions.',
        hint: 'Use `terraform console`.'
      },
      {
        id: 'tf-8-ex-3',
        title: 'Exercise 3: Validate Template & Function Syntax',
        prompt: 'Write the command to validate HCL function calls and references in the current module.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+validate$',
        acceptedAnswers: ['terraform validate'],
        explanation: '`terraform validate` checks function arity, type conversions, and variable references.',
        hint: 'Use `terraform validate`.'
      }
    ]
  },
  {
    ch: 9,
    id: 'tf-9',
    title: '9. Reusable Module Architecture, Composition & Semantic Versioning',
    section: 'Modular & Dynamic HCL',
    duration: 28,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Architect composable internal Terraform modules following the Standard Module Structure (`main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, `examples/`), avoid thin "wrapper modules", and pin module versions via Git tags (`?ref=v2.4.0`) or private registries.',
    analogy: 'A good Terraform module encapsulates a cohesive architectural capability (like a VPC with private/public subnets and NAT gateways)—not a pointless 1-to-1 wrapper around a single `aws_s3_bucket` resource.',
    keyPoints: [
      'Never declare `provider "aws" { region = ... }` inside a reusable child module; child modules must inherit providers from the root module or declare `configuration_aliases` in `required_providers`.',
      'Pin remote Git modules with immutable semantic version tags (`source = "git::https://github.com/acme/tf-modules.git//vpc?ref=v2.4.0"`), never floating `main` branches.',
      'Expose rich object outputs (`output "vpc" { value = { id = aws_vpc.this.id, private_subnets = ... } }`) so downstream modules can compose cleanly via dependency inversion.'
    ],
    syntaxRows: [
      ['source = "./modules/vpc"', 'Loads a local child module from the repository', 'Requires terraform init when added'],
      ['source = "git::https://...//vpc?ref=v2.4.0"', 'Pins a remote Git subdirectory module to tag v2.4.0', 'Double-slash // separates repo root from subdir'],
      ['configuration_aliases = [aws.peer]', 'Declares required aliased providers inside a child module', 'Passed via providers = { aws.peer = aws.west }'],
      ['terraform get -update', 'Downloads and updates child modules defined in configuration', 'Also executed automatically during terraform init']
    ],
    tryItTitle: 'Lab: Downloading & Auditing Module Hierarchy',
    tryItCode: `# Download pinned child modules and inspect the module tree
$ terraform get -update
$ terraform providers`,
    tryItOutput: `Downloading git::https://github.com/acme/tf-modules.git?ref=v2.4.0 for vpc...
- vpc in .terraform/modules/vpc

Providers required by configuration:
.
├── provider[registry.terraform.io/hashicorp/aws] ~> 5.80.0
└── module.vpc
    └── provider[registry.terraform.io/hashicorp/aws] >= 5.0.0`,
    exerciseQuestion: 'Complete the command to download and update child modules referenced in your `.tf` files:',
    exerciseTemplate: 'terraform ___ -update',
    exerciseAnswer: 'get',
    exerciseHint: 'Use the get subcommand.',
    quizQ: 'Why is defining a `provider "aws" { region = "us-east-1" }` block inside a reusable child module considered a severe anti-pattern?',
    quizOpts: [
      'It makes `terraform fmt` fail',
      'A child module containing its own `provider` configuration block cannot be used with `for_each`, `count`, or `depends_on` in the root module, and prevents callers from passing aliased providers',
      'Child modules cannot create AWS resources',
      'It doubles the AWS bill'
    ],
    quizAns: 1,
    quizExp: 'Terraform forbids `count`, `for_each`, and `depends_on` on modules that contain embedded provider blocks because provider lifecycles must be instantiated at the root level.',
    interviewQ: 'What does the double-slash `//` mean in a Terraform module `source` string like `"git::https://github.com/org/infra-modules.git//modules/eks?ref=v1.8.0"`?',
    interviewA: 'The double-slash `//` tells Terraform where the Git repository root URL ends and the internal subdirectory path (`modules/eks`) inside that repository begins.',
    interviewCo: 'HashiCorp / Spotify',
    realWorldCases: [
      {
        company: 'Spotify Golden Path Infra',
        title: 'Version-Pinned Golden Path Modules in Private Terraform Registry',
        scenario: 'Publishes semantically versioned modules (`gke-cluster`, `cloudsql-postgres`, `pubsub-topic`) with automated contract tests.',
        impact: 'Over 1,200 microservices provision compliant GCP infrastructure using 20-line root calls.',
        codeSnippet: `$ terraform get -update
$ terraform validate`
      },
      {
        company: 'HashiCorp Cloud Platform',
        title: 'Flat Composable Modules vs Deeply Nested Monoliths',
        scenario: 'Limits module nesting depth to max 2 levels and passes data between peer modules in the root configuration.',
        impact: 'Eliminated brittle 5-level variable pass-through chains.',
        codeSnippet: `$ terraform providers
$ terraform plan -out=tfplan`
      },
      {
        company: 'Monzo Bank Platform',
        title: 'Immutable Git Tag Pinning Across 300+ Micro-Stacks',
        scenario: 'CI policy blocks any module `source` lacking an immutable `?ref=vX.Y.Z` tag or commit SHA.',
        impact: 'Prevented upstream module changes from silently mutating production banking stacks.',
        codeSnippet: `$ terraform init
$ terraform validate`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-9-ex-1',
        title: 'Exercise 1: Download and Update Child Modules',
        prompt: 'Write the Terraform command to download and update child modules in `.terraform/modules`.',
        starterCommand: 'terraform get ',
        expectedPattern: '^terraform\\s+get\\s+-update$',
        acceptedAnswers: ['terraform get -update'],
        explanation: '`terraform get -update` fetches remote child modules and updates `.terraform/modules/modules.json`.',
        hint: 'Use `terraform get -update`.'
      },
      {
        id: 'tf-9-ex-2',
        title: 'Exercise 2: Inspect Required Providers Across Modules',
        prompt: 'Write the Terraform command to display the tree of providers required by the root module and all child modules.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+providers$',
        acceptedAnswers: ['terraform providers'],
        explanation: '`terraform providers` prints the module hierarchy and the provider constraints required at each level.',
        hint: 'Use `terraform providers`.'
      },
      {
        id: 'tf-9-ex-3',
        title: 'Exercise 3: Initialize After Adding a New Module',
        prompt: 'Write the standard command required after adding a new `module "eks" { ... }` block to your configuration.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+init$',
        acceptedAnswers: ['terraform init'],
        explanation: '`terraform init` registers new child modules and downloads any additional providers they require.',
        hint: 'Use `terraform init`.'
      }
    ]
  },
  {
    ch: 10,
    id: 'tf-10',
    title: '10. Multi-Environment Patterns: Workspaces vs Directory Stacks & Terragrunt',
    section: 'Modular & Dynamic HCL',
    duration: 27,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Compare CLI Workspaces (`terraform workspace`), directory-per-environment layouts (`envs/dev`, `envs/stage`, `envs/prod`), and DRY orchestration with Terragrunt / Terraform Stacks.',
    analogy: 'CLI Workspaces put `dev` and `prod` state files in the same S3 bucket with a single `terraform workspace select` standing between a developer laptop and production; directory isolation puts `prod` in a physically separate AWS account and state bucket.',
    keyPoints: [
      'CLI Workspaces (`terraform.workspace`) are great for short-lived PR preview environments (`pr-142`), but risky as the sole separator between `dev` and `prod` because they share the same backend credentials and module versions.',
      'Enterprise production architectures use directory-per-environment (`envs/dev`, `envs/prod`) backed by separate cloud accounts, separate IAM roles, and separate state buckets.',
      'Allows pinning `envs/dev` to `module_version = "v2.5.0-rc1"` while `envs/prod` stays safely pinned to `v2.4.0`.'
    ],
    syntaxRows: [
      ['terraform workspace list', 'Lists all workspaces in the current backend', '* default, dev, staging'],
      ['terraform workspace new pr-42', 'Creates and switches to a new isolated state workspace', 'Sets terraform.workspace == "pr-42"'],
      ['terraform workspace select prod', 'Switches active state file to the prod workspace', 'Stored under env:/prod/ in S3'],
      ['terraform -chdir=envs/prod plan', 'Runs Terraform inside a specific environment directory', 'terraform -chdir=envs/prod plan -out=tfplan']
    ],
    tryItTitle: 'Lab: Ephemeral PR Workspaces & Directory-Scoped Execution (`-chdir`)',
    tryItCode: `# Create an ephemeral preview workspace or run directory-scoped plan
$ terraform workspace list
$ terraform -chdir=envs/prod plan -out=tfplan`,
    tryItOutput: `* default
  ephemeral-pr-104
  staging

Running in directory: envs/prod
Plan: 2 to add, 0 to change, 0 to destroy.
Saved the plan to: tfplan`,
    exerciseQuestion: 'Complete the global Terraform flag used to switch into `envs/prod` before running `plan` without using `cd`:',
    exerciseTemplate: 'terraform ___=envs/prod plan',
    exerciseAnswer: '-chdir',
    exerciseHint: 'Use the -chdir flag before the subcommand.',
    quizQ: 'What is the primary architectural drawback of relying solely on `terraform workspace select dev|prod` in a single root directory for long-lived production systems?',
    quizOpts: [
      'Workspaces cannot store more than 10 resources',
      'Every workspace shares the exact same `.tf` files, module versions, and backend configuration, making it impossible to test a new module version or provider upgrade in `dev` before it affects `prod` code',
      '`terraform.workspace` is not available in HCL',
      'Workspaces only work on local disk'
    ],
    quizAns: 1,
    quizExp: 'Directory-per-environment (`envs/dev`, `envs/prod`) allows progressive promotion of module versions (`?ref=v2.5.0` in dev first, then prod) and separate AWS account IAM boundaries.',
    interviewQ: 'When ARE Terraform CLI workspaces (`terraform workspace new pr-123`) the ideal design choice?',
    interviewA: 'Ephemeral PR preview environments and feature-branch sandboxes in non-production accounts, where you want identical HCL code to spin up an isolated stack (`service-${terraform.workspace}`) on PR open and run `terraform destroy` + `terraform workspace delete pr-123` on PR merge.',
    interviewCo: 'GitLab / Vercel',
    realWorldCases: [
      {
        company: 'Vercel Preview Infrastructure',
        title: 'Ephemeral Per-PR Infrastructure Sandboxes via Workspaces',
        scenario: 'Creates `terraform workspace new pr-${PR_NUMBER}` on pull request creation and tears it down automatically when the PR closes.',
        impact: 'Engineers validate full-stack infrastructure changes in isolated sandboxes before merging.',
        codeSnippet: `$ terraform workspace new pr-104
$ terraform workspace list`
      },
      {
        company: 'Databricks Multi-Account Cloud',
        title: 'Directory-Per-Environment (`-chdir=envs/prod`) Promotion',
        scenario: 'Isolates `envs/dev`, `envs/staging`, and `envs/prod-us-east-1` into separate directories with independent `.terraform.lock.hcl` and module tags.',
        impact: 'Zero blast radius between staging experiments and production customer control planes.',
        codeSnippet: `$ terraform -chdir=envs/prod plan -out=tfplan`
      },
      {
        company: 'Gruntwork Enterprise Stacks',
        title: 'Orchestrating Multi-Stack Dependencies with `run-all`',
        scenario: 'Executes ordered DAG plans across `vpc -> eks -> rds -> app` environment folders with automatic remote state config generation.',
        impact: 'Eliminated 85% of boilerplate backend/provider HCL across 40 regions.',
        codeSnippet: `$ terraform -chdir=envs/prod validate`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-10-ex-1',
        title: 'Exercise 1: List Active Terraform Workspaces',
        prompt: 'Write the command to list all existing workspaces in the current backend.',
        starterCommand: 'terraform workspace ',
        expectedPattern: '^terraform\\s+workspace\\s+list$',
        acceptedAnswers: ['terraform workspace list'],
        explanation: '`terraform workspace list` displays all workspaces and marks the currently active one with `*`.',
        hint: 'Use `terraform workspace list`.'
      },
      {
        id: 'tf-10-ex-2',
        title: 'Exercise 2: Select an Existing Workspace',
        prompt: 'Write the command to switch to the `staging` workspace.',
        starterCommand: 'terraform workspace ',
        expectedPattern: '^terraform\\s+workspace\\s+select\\s+staging$',
        acceptedAnswers: ['terraform workspace select staging'],
        explanation: '`terraform workspace select staging` switches the active state context to `staging`.',
        hint: 'Use `select staging`.'
      },
      {
        id: 'tf-10-ex-3',
        title: 'Exercise 3: Run Terraform Plan in a Subdirectory via `-chdir`',
        prompt: 'Write the command using `-chdir=envs/prod` to run `terraform plan`.',
        starterCommand: 'terraform -chdir=',
        expectedPattern: '^terraform\\s+-chdir=envs/prod\\s+plan$',
        acceptedAnswers: ['terraform -chdir=envs/prod plan'],
        explanation: '`terraform -chdir=envs/prod plan` executes Terraform inside `envs/prod` without changing your shell working directory.',
        hint: 'Use `terraform -chdir=envs/prod plan`.'
      }
    ]
  },
  {
    ch: 11,
    id: 'tf-11',
    title: '11. Declarative State Surgery: moved, import & removed Blocks',
    section: 'Enterprise Operations & Governance',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Refactor production infrastructure with zero downtime or destructive recreations using declarative `moved` blocks (Terraform 1.1+), config-driven `import` blocks with `-generate-config-out` (Terraform 1.5+), and `removed` blocks (Terraform 1.7+).',
    analogy: 'Legacy `terraform state mv` was like performing manual database surgery in a dark room before code review; declarative `moved { from = ... to = ... }` blocks put the state migration right inside your pull request so `terraform plan` verifies zero resources are destroyed.',
    keyPoints: [
      'Renaming a resource or extracting it into `module.vpc` normally plans `- destroy` old + `+ create` new. Adding `moved { from = aws_vpc.main to = module.vpc.aws_vpc.main }` updates the state address in-place with `0 to destroy`.',
      'Declarative `import { to = aws_s3_bucket.legacy id = "my-bucket" }` brings brownfield cloud resources under Terraform control inside normal PR plans, and `terraform plan -generate-config-out=generated.tf` writes the HCL for you.',
      'Declarative `removed { from = aws_s3_bucket.old lifecycle { destroy = false } }` forgets a resource from state without deleting the underlying cloud resource (replacing imperative `terraform state rm`).'
    ],
    syntaxRows: [
      ['moved { from = a to = b }', 'Refactors resource/module address in state with zero downtime', 'Plan shows: # a has moved to b (0 to destroy)'],
      ['import { to = res id = "id" }', 'Imports existing cloud resource during normal plan/apply', 'Supports for_each in Terraform 1.7+'],
      ['-generate-config-out=gen.tf', 'Auto-generates HCL resource blocks for import targets', 'terraform plan -generate-config-out=generated.tf'],
      ['removed { from = a lifecycle { destroy = false } }', 'Removes resource from state without deleting cloud asset', 'Declarative replacement for terraform state rm']
    ],
    tryItTitle: 'Lab: Zero-Downtime Refactoring with Declarative `moved` & `import`',
    tryItCode: `# Generate HCL for brownfield import and verify zero-downtime moved refactor
$ terraform plan -generate-config-out=generated.tf
$ terraform plan -out=tfplan`,
    tryItOutput: `Terraform will perform the following actions:

  # aws_vpc.main has moved to module.network.aws_vpc.main
    resource "aws_vpc" "main" {
        id         = "vpc-0a8b9c1d2e3f4g5h6"
        cidr_block = "10.0.0.0/16"
    }

  # aws_s3_bucket.legacy_logs will be imported
    resource "aws_s3_bucket" "legacy_logs" {
        bucket = "acme-legacy-billing-logs"
        id     = "acme-legacy-billing-logs"
    }

Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.`,
    exerciseQuestion: 'Complete the `terraform plan` flag that auto-generates HCL code for `import` blocks into `generated.tf`:',
    exerciseTemplate: 'terraform plan ___=generated.tf',
    exerciseAnswer: '-generate-config-out',
    exerciseHint: 'Use -generate-config-out.',
    quizQ: 'Why are declarative `moved {}` and `import {}` blocks vastly safer in team CI/CD pipelines than running `terraform state mv` or `terraform import` on an engineer’s laptop?',
    quizOpts: [
      'They run without an internet connection',
      'They are peer-reviewed in Git pull requests, previewed deterministically in `terraform plan` (`0 to destroy`), and require zero developer write access to the production state bucket',
      'They delete old resources automatically',
      'They bypass state locking'
    ],
    quizAns: 1,
    quizExp: 'In production GitOps, developers should not have write credentials to production state on their laptops; `moved`, `import`, and `removed` blocks execute safely inside the audited CI pipeline.',
    interviewQ: 'How do you hand off ownership of an RDS database from Stack A to Stack B without downtime or deleting the database?',
    interviewA: 'In Stack A, replace the `resource "aws_db_instance" "main"` block with a `removed { from = aws_db_instance.main lifecycle { destroy = false } }` block and apply (removing it from Stack A state while keeping RDS running). In Stack B, add the `resource` block alongside an `import { to = aws_db_instance.main id = "prod-db-1" }` block and apply.',
    interviewCo: 'Stripe / HashiCorp',
    realWorldCases: [
      {
        company: 'Stripe Infrastructure Refactor',
        title: 'Splitting a 4,000-Resource Monolith State Using `removed` + `import` Blocks',
        scenario: 'Decomposed a monolithic root state into 18 domain states using PR-reviewed `removed { lifecycle { destroy = false } }` and `import {}` blocks.',
        impact: 'Zero downtime and zero destroyed resources across live payment infrastructure.',
        codeSnippet: `$ terraform plan -generate-config-out=generated.tf
$ terraform plan -out=tfplan`
      },
      {
        company: 'Notion Cloud Engineering',
        title: 'Brownfield AWS Account Onboarding via `-generate-config-out`',
        scenario: 'Imported 350 legacy console-created Route53 records and IAM roles into Git using `import` blocks with `for_each` and auto-generated HCL.',
        impact: 'Completed a 3-week manual import project in one afternoon.',
        codeSnippet: `$ terraform plan -generate-config-out=generated.tf`
      },
      {
        company: 'Shopify Core Platform',
        title: 'Module Directory Restructure with Preserved `moved` Blocks',
        scenario: 'Shipped `moved` blocks inside v3.0 of internal Terraform modules so 400+ calling teams upgraded from v2 to v3 without running a single `terraform state mv` command.',
        impact: 'Seamless zero-touch module upgrade across all product teams.',
        codeSnippet: `$ terraform plan -out=tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-11-ex-1',
        title: 'Exercise 1: Auto-Generate HCL for Import Blocks',
        prompt: 'Write the `terraform plan` command that generates HCL configuration into `generated.tf` for any `import` blocks.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-generate-config-out=["\']?generated\\.tf["\']?$',
        acceptedAnswers: ['terraform plan -generate-config-out=generated.tf', 'terraform plan -generate-config-out="generated.tf"'],
        explanation: '`terraform plan -generate-config-out=generated.tf` queries live cloud APIs for imported resources and writes matching HCL resource blocks.',
        hint: 'Use `-generate-config-out=generated.tf`.'
      },
      {
        id: 'tf-11-ex-2',
        title: 'Exercise 2: Move a Resource Address via CLI (`terraform state mv`)',
        prompt: 'Write the imperative `terraform state mv` command to rename `aws_s3_bucket.old` to `aws_s3_bucket.new`.',
        starterCommand: 'terraform state mv ',
        expectedPattern: '^terraform\\s+state\\s+mv\\s+aws_s3_bucket\\.old\\s+aws_s3_bucket\\.new$',
        acceptedAnswers: ['terraform state mv aws_s3_bucket.old aws_s3_bucket.new'],
        explanation: 'While declarative `moved` blocks are preferred in GitOps, `terraform state mv <src> <dest>` is still tested in interviews and ad-hoc state migrations.',
        hint: 'Pass `aws_s3_bucket.old aws_s3_bucket.new` to `terraform state mv`.'
      },
      {
        id: 'tf-11-ex-3',
        title: 'Exercise 3: Remove a Resource from State Without Destroying It (`state rm`)',
        prompt: 'Write the CLI command to remove `aws_s3_bucket.legacy` from Terraform state without deleting the actual S3 bucket.',
        starterCommand: 'terraform state ',
        expectedPattern: '^terraform\\s+state\\s+rm\\s+aws_s3_bucket\\.legacy$',
        acceptedAnswers: ['terraform state rm aws_s3_bucket.legacy'],
        explanation: '`terraform state rm aws_s3_bucket.legacy` detaches the resource from state so Terraform stops managing it.',
        hint: 'Use `rm aws_s3_bucket.legacy`.'
      }
    ]
  },
  {
    ch: 12,
    id: 'tf-12',
    title: '12. Policy as Code & Security Scanning: OPA, Conftest, Checkov & tfsec',
    section: 'Enterprise Operations & Governance',
    duration: 27,
    difficulty: Difficulty.ADVANCED,
    summary: 'Shift infrastructure security and FinOps guardrails left by scanning HCL code and serialized JSON execution plans (`terraform show -json tfplan`) with Open Policy Agent (OPA / Rego), Conftest, Checkov, and Trivy.',
    analogy: 'Code review by humans catches typos; Policy as Code (`conftest` + `checkov`) is an automated building inspector that rejects any blueprint missing fire sprinklers (KMS encryption), public S3 buckets, or oversized `p4d.24xlarge` GPU instances before construction begins.',
    keyPoints: [
      'Static HCL scanners (`checkov -d .`, `trivy config .`) catch misconfigurations in raw `.tf` files in seconds.',
      'Plan-level policy engines (`terraform show -json tfplan > plan.json` -> `conftest test plan.json`) inspect the fully resolved values after module expansion, variable interpolation, and data source lookups.',
      'Combine security policies (no `0.0.0.0/0` SSH, mandatory KMS encryption) with FinOps blast-radius policies (max deletions `< 5`, no unapproved GPU instances).'
    ],
    syntaxRows: [
      ['terraform show -json tfplan > plan.json', 'Serializes binary plan into structured JSON for OPA evaluation', 'Required input for Conftest / OPA / Sentinel'],
      ['conftest test plan.json -p policy/', 'Evaluates Rego policies against the Terraform plan JSON', 'Fails CI if any deny[msg] rule triggers'],
      ['checkov -d . --framework terraform', 'Runs 1,000+ CIS & cloud security checks on HCL files', 'checkov -f plan.json'],
      ['trivy config .', 'Scans Terraform modules for high/critical misconfigurations', 'trivy config --severity HIGH,CRITICAL .']
    ],
    tryItTitle: 'Lab: Exporting Plan JSON & Running OPA / Checkov Policy Gates',
    tryItCode: `# Export binary plan to JSON and evaluate OPA Conftest + Checkov policies
$ terraform show -json tfplan > plan.json
$ checkov -d . --framework terraform`,
    tryItOutput: `Exported structured plan JSON to plan.json (format_version: "1.2")

       _               _              
   ___| |__   ___  ___| | _______   __
  / __| '_ \\ / _ \\/ __| |/ / _ \\ \\ / /
 | (__| | | |  __/ (__|   < (_) \\ V / 
  \\___|_| |_|\\___|\\___|_|\\_\\___/ \\_/  

terraform scan results:
Passed checks: 42, Failed checks: 0, Skipped checks: 0
Check: CKV_AWS_19: "Ensure all data stored in the S3 bucket is securely encrypted at rest" -> PASSED
Check: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled" -> PASSED`,
    exerciseQuestion: 'Complete the command to convert a binary `tfplan` file into JSON for OPA / Conftest evaluation:',
    exerciseTemplate: 'terraform ___ -json tfplan > plan.json',
    exerciseAnswer: 'show',
    exerciseHint: 'Use the show subcommand with -json.',
    quizQ: 'Why is evaluating OPA/Rego policies against `terraform show -json tfplan` more accurate than only scanning raw `.tf` files with regex?',
    quizOpts: [
      'Because `.tf` files are encrypted',
      'The JSON plan contains the final resolved attribute values after variable defaults, `locals`, module calls, and `for_each` expansions are computed, plus exact `actions` (`["delete"]`, `["create"]`) to enforce blast-radius limits',
      'Raw `.tf` files cannot be read on Linux',
      '`terraform show -json` automatically fixes security bugs'
    ],
    quizAns: 1,
    quizExp: 'Only the compiled plan JSON knows how many resources are being deleted (`rc.change.actions[_] == "delete"`) and what computed values child modules actually produced.',
    interviewQ: 'Write or explain the logic of an OPA Rego rule that blocks any Terraform plan deleting more than 5 resources.',
    interviewA: 'In Rego, collect all resource changes where `"delete" in input.resource_changes[_].change.actions`, count them with `count(deletions) > 5`, and emit a `deny[msg]` violation requiring a manual override label before `terraform apply` is allowed.',
    interviewCo: 'Goldman Sachs / HashiCorp',
    realWorldCases: [
      {
        company: 'JPMorgan Chase Cloud Security',
        title: 'Pre-Apply OPA Rego Gates on Every Terraform Plan JSON',
        scenario: 'Converts every `tfplan` via `terraform show -json` and runs 180 OPA Rego rules verifying KMS CMKs, private endpoints, and IAM permission boundaries.',
        impact: '100% preventative compliance across 4,000+ regulated cloud environments.',
        codeSnippet: `$ terraform show -json tfplan > plan.json
$ checkov -d . --framework terraform`
      },
      {
        company: 'Spotify FinOps & Reliability',
        title: 'Blast-Radius Deletion Circuit Breakers in Conftest',
        scenario: 'Rejects any automated PR plan where stateful resources (`aws_db_instance`, `google_sql_database_instance`) have `"delete"` in `change.actions`.',
        impact: 'Prevented accidental database drops during module refactors.',
        codeSnippet: `$ terraform show -json tfplan`
      },
      {
        company: 'Brex Platform Security',
        title: 'Shift-Left Checkov Pre-Commit & GitHub Actions SARIF Annotations',
        scenario: 'Runs `checkov -d .` in PR checks and uploads inline security annotations directly onto offending `.tf` lines in GitHub PR diffs.',
        impact: 'Developers fix 98% of IAM/S3 misconfigurations before requesting peer review.',
        codeSnippet: `$ checkov -d . --framework terraform`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-12-ex-1',
        title: 'Exercise 1: Export Binary Plan as Machine-Readable JSON',
        prompt: 'Write the Terraform command to output `tfplan` in JSON format.',
        starterCommand: 'terraform show ',
        expectedPattern: '^terraform\\s+show\\s+-json\\s+tfplan(\\s*>\\s*plan\\.json)?$',
        acceptedAnswers: ['terraform show -json tfplan', 'terraform show -json tfplan > plan.json'],
        explanation: '`terraform show -json tfplan` serializes the compiled plan graph and resource changes into JSON for OPA/Conftest/Checkov.',
        hint: 'Use `terraform show -json tfplan`.'
      },
      {
        id: 'tf-12-ex-2',
        title: 'Exercise 2: Scan Terraform Directory with Checkov',
        prompt: 'Write the Checkov command to scan the current directory (`.`) for Terraform security misconfigurations.',
        starterCommand: 'checkov ',
        expectedPattern: '^checkov\\s+-d\\s+\\.(\\s+--framework\\s+terraform)?$',
        acceptedAnswers: ['checkov -d .', 'checkov -d . --framework terraform'],
        explanation: '`checkov -d .` statically analyzes all `.tf` files in the directory against CIS and cloud security benchmarks.',
        hint: 'Use `checkov -d .`.'
      },
      {
        id: 'tf-12-ex-3',
        title: 'Exercise 3: Scan IaC Misconfigurations with Trivy',
        prompt: 'Write the Trivy command to scan the current directory (`.`) for IaC configuration vulnerabilities.',
        starterCommand: 'trivy ',
        expectedPattern: '^trivy\\s+config\\s+\\.$',
        acceptedAnswers: ['trivy config .'],
        explanation: '`trivy config .` scans Terraform, Kubernetes, and Dockerfile configurations for security issues.',
        hint: 'Use `trivy config .`.'
      }
    ]
  },
  {
    ch: 13,
    id: 'tf-13',
    title: '13. Automated Module Testing: `terraform test`, Mock Providers & Check Blocks',
    section: 'Enterprise Operations & Governance',
    duration: 27,
    difficulty: Difficulty.ADVANCED,
    summary: 'Write fast, zero-cost unit tests and integration tests for your modules using native `.tftest.hcl` suites (`terraform test`), `mock_provider` blocks (Terraform 1.7+), and continuous post-deploy health assertions (`check` blocks).',
    analogy: 'Historically, testing Terraform required spinning up real AWS resources with Terratest in Go and waiting 25 minutes; `terraform test` with `mock_provider "aws" {}` unit-tests your HCL logic in 400 milliseconds with zero cloud credentials.',
    keyPoints: [
      'Native `.tftest.hcl` files contain `run "test_name" { command = plan assert { condition = ... error_message = ... } }` blocks executed via `terraform test`.',
      'Terraform 1.7+ `mock_provider "aws" {}` fakes provider responses offline so you can unit-test complex variable validations, `for_each` keys, and IAM policy outputs in milliseconds without AWS credentials.',
      '`check "health_check" { data "http" ... assert { ... } }` blocks validate live infrastructure invariants (like HTTP 200 endpoints or certificate expiry) after `apply` without failing the state transaction.'
    ],
    syntaxRows: [
      ['terraform test', 'Executes all *.tftest.hcl test suites in the module', 'terraform test -filter=tests/unit.tftest.hcl'],
      ['command = plan', 'Runs a fast plan-mode unit assertion inside a run block', 'Default is command = apply (integration test)'],
      ['mock_provider "aws" {}', 'Mocks cloud provider APIs for offline unit testing (TF 1.7+)', 'Zero cloud credentials or cost required'],
      ['check "api_health" { assert { ... } }', 'Continuous post-apply infrastructure assertion block', 'Warns on drift without blocking state persistence']
    ],
    tryItTitle: 'Lab: Running Native `.tftest.hcl` Unit Tests with `mock_provider`',
    tryItCode: `# Execute native Terraform unit and integration tests
$ terraform test
$ terraform test -verbose`,
    tryItOutput: `tests/vpc_unit.tftest.hcl... in progress
  run "validate_private_subnet_cidrs"... pass
  run "enforce_encrypted_flow_logs"... pass
  run "reject_invalid_cidr_mask"... pass
tests/vpc_unit.tftest.hcl... tearing down
tests/vpc_unit.tftest.hcl... pass

Success! 3 passed, 0 failed.`,
    exerciseQuestion: 'Complete the native Terraform CLI command that executes all `*.tftest.hcl` test files:',
    exerciseTemplate: 'terraform ___',
    exerciseAnswer: 'test',
    exerciseHint: 'Use the test subcommand.',
    quizQ: 'What is the difference between a `check {}` block and a resource `postcondition {}` block in Terraform?',
    quizOpts: [
      'They are identical',
      'A failed `postcondition` halts execution and marks the resource failed/blocked in the DAG, whereas a failed `check` block emits a non-blocking warning after `plan`/`apply` so continuous health monitoring never bricks your state pipeline',
      '`check` blocks delete the resource on failure',
      '`postcondition` blocks only work in Terraform 0.11'
    ],
    quizAns: 1,
    quizExp: '`check` blocks are designed for continuous infrastructure health verification and drift alerting without halting emergency deployments.',
    interviewQ: 'How do you test that a custom `variable` validation rule properly rejects invalid inputs inside a `.tftest.hcl` file?',
    interviewA: 'Inside a `run "invalid_cidr_rejected"` block, pass the invalid variable value in `variables { vpc_cidr = "invalid" }`, set `command = plan`, and declare `expect_failures = [var.vpc_cidr]`. The test passes only if that specific validation fails.',
    interviewCo: 'HashiCorp / Datadog',
    realWorldCases: [
      {
        company: 'HashiCorp Verified Modules',
        title: 'Sub-Second Offline Module Unit Tests with `mock_provider`',
        scenario: 'Runs 60+ `command = plan` assertions with `mock_provider "aws" {}` on every commit before running real cloud integration tests on merge.',
        impact: 'Reduced PR feedback time from 18 minutes to 1.2 seconds with $0 cloud test spend.',
        codeSnippet: `$ terraform test`
      },
      {
        company: 'Cloudflare Zero Trust',
        title: 'Negative Testing Security Guardrails via `expect_failures`',
        scenario: 'Verifies that custom preconditions and variable validations reject wildcard `0.0.0.0/0` admin rules using `expect_failures` in `.tftest.hcl`.',
        impact: 'Guaranteed validation rules never regress during module upgrades.',
        codeSnippet: `$ terraform test -verbose`
      },
      {
        company: 'Stripe API Gateway',
        title: 'Post-Deploy Canary Assertions via Terraform `check` Blocks',
        scenario: 'Uses `check` blocks with the `http` data source to verify `/healthz` returns `200 OK` immediately after ALB target group updates.',
        impact: 'Instant visibility into post-apply endpoint reachability.',
        codeSnippet: `$ terraform test`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-13-ex-1',
        title: 'Exercise 1: Execute Native Terraform Test Suite',
        prompt: 'Write the command to run all `.tftest.hcl` tests in the current module.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+test$',
        acceptedAnswers: ['terraform test'],
        explanation: '`terraform test` discovers and executes all `*.tftest.hcl` files in the root directory and `tests/` folder.',
        hint: 'Use `terraform test`.'
      },
      {
        id: 'tf-13-ex-2',
        title: 'Exercise 2: Run Terraform Tests with Verbose Output',
        prompt: 'Write the command to run `terraform test` with `-verbose` output to inspect planned resources.',
        starterCommand: 'terraform test ',
        expectedPattern: '^terraform\\s+test\\s+-verbose$',
        acceptedAnswers: ['terraform test -verbose'],
        explanation: '`terraform test -verbose` prints the full plan/state details for each `run` block.',
        hint: 'Pass `-verbose` to `terraform test`.'
      },
      {
        id: 'tf-13-ex-3',
        title: 'Exercise 3: Filter Terraform Test Execution to One File',
        prompt: 'Write the `terraform test` command to run only `tests/unit.tftest.hcl` using `-filter`.',
        starterCommand: 'terraform test ',
        expectedPattern: '^terraform\\s+test\\s+-filter=tests/unit\\.tftest\\.hcl$',
        acceptedAnswers: ['terraform test -filter=tests/unit.tftest.hcl'],
        explanation: '`-filter=tests/unit.tftest.hcl` runs a single test suite during rapid local iteration.',
        hint: 'Use `-filter=tests/unit.tftest.hcl`.'
      }
    ]
  },
  {
    ch: 14,
    id: 'tf-14',
    title: '14. CI/CD Pipeline Architecture: Stages, DAG Runners, Artifacts & Gates',
    section: 'CI/CD & DevSecOps Pipelines',
    duration: 25,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Design high-velocity, production-grade CI/CD pipelines structured as a fan-out / fan-in DAG: Lint & SAST -> Unit Test -> Build Immutable Artifact -> Sign & Scan -> Plan / Staging Deploy -> Production Canary Gate.',
    analogy: 'A naive serial pipeline runs tasks in a single file line taking 45 minutes; a DAG pipeline fans out independent checks (lint, typecheck, unit tests,Checkov) in parallel across 8 workers and converges on a single signed artifact.',
    keyPoints: [
      'Build once, promote everywhere: never rebuild a Docker image or recompile binaries between `staging` and `production`—promote the exact same immutable SHA-256 digest.',
      'Fail fast in the first 30 seconds: run `terraform fmt -check`, `eslint`, `tsc --noEmit`, and secret scanning in parallel at Stage 1 before provisioning expensive integration runners.',
      'Use concurrency groups (`cancel-in-progress: true` on feature branches, `cancel-in-progress: false` on `main` / `terraform apply`) so superseded PR commits cancel immediately while production applies never get interrupted mid-flight.'
    ],
    syntaxRows: [
      ['needs: [lint, test, scan]', 'Defines fan-in DAG dependencies between CI jobs', 'Job waits until all upstream jobs succeed'],
      ['cancel-in-progress: false', 'Prevents active Terraform/deployment runs from being killed', 'CRITICAL for main branch infrastructure applies'],
      ['actions/upload-artifact@v4', 'Persists compiled tfplan or SBOM between isolated CI jobs', 'Retention-days: 5'],
      ['environment: production', 'Enforces required reviewers, wait timers & branch protection', 'Scopes OIDC secrets to production environment']
    ],
    tryItTitle: 'Lab: Verifying CI/CD Pipeline Stages & Immutable Artifact Promotion',
    tryItCode: `# Execute the standard 4-stage CI validation gate locally
$ terraform fmt -check -recursive
$ terraform init -lockfile=readonly
$ terraform validate
$ terraform test`,
    tryItOutput: `Stage 1 [Format Check]: 0 files modified (PASSED in 0.2s)
Stage 2 [Strict Lockfile Init]: Verified hashicorp/aws v5.80.0 SHA-256 (PASSED in 1.1s)
Stage 3 [Static Validation]: Success! The configuration is valid. (PASSED in 0.4s)
Stage 4 [Unit Tests]: tests/vpc_unit.tftest.hcl... 3 passed, 0 failed. (PASSED in 0.6s)`,
    exerciseQuestion: 'In GitHub Actions / GitLab CI, should `cancel-in-progress` be set to `true` or `false` for a job that runs `terraform apply` on `main`?',
    exerciseTemplate: 'cancel-in-progress: ___',
    exerciseAnswer: 'false',
    exerciseHint: 'Killing an active terraform apply mid-flight can leave resources half-created and state locked.',
    quizQ: 'What happens if a CI pipeline sets `cancel-in-progress: true` on the `main` branch deployment job and two commits merge 30 seconds apart?',
    quizOpts: [
      'Both deployments finish twice as fast',
      'The second merge sends `SIGTERM`/`SIGKILL` to the first running `terraform apply`, interrupting cloud API provisioning mid-flight and potentially leaving a stale state lock or partially created resources',
      'Git automatically reverts both commits',
      'Nothing'
    ],
    quizAns: 1,
    quizExp: 'Always set `cancel-in-progress: true` for read-only PR `plan`/`test` jobs, and `cancel-in-progress: false` (queued serial execution) for state-mutating `apply` jobs.',
    interviewQ: 'Why is "Build Once, Promote Everywhere" a foundational principle of modern CI/CD?',
    interviewA: 'Rebuilding from source at deploy time introduces non-determinism (floating transitive dependencies, upstream base image changes, compiler differences), meaning what you tested in staging is not guaranteed to be what runs in production. Promoting a single signed artifact digest (`sha256:8f9d...`) guarantees bit-for-bit identity.',
    interviewCo: 'Netflix / Spotify',
    realWorldCases: [
      {
        company: 'Spotify Backstage CI',
        title: 'Fan-Out DAG Pipelines with Queued Production Concurrency Groups',
        scenario: 'Cancels superseded PR builds immediately (`cancel-in-progress: true`) while queueing `main` branch deployments sequentially (`cancel-in-progress: false`).',
        impact: 'Saved 38% of CI runner compute minutes while guaranteeing zero interrupted deploys.',
        codeSnippet: `$ terraform fmt -check -recursive
$ terraform init -lockfile=readonly
$ terraform validate`
      },
      {
        company: 'Stripe Release Engineering',
        title: 'Immutable SHA-256 Artifact Promotion Across 4 Environments',
        scenario: 'Builds and signs container and `tfplan` artifacts once, then promotes the verified digest through dev -> qa -> staging -> prod.',
        impact: '100% cryptographic provenance from commit SHA to production runtime.',
        codeSnippet: `$ terraform test`
      },
      {
        company: 'Linear Engineering',
        title: 'Sub-2-Minute Fast-Fail Static & Unit Gates',
        scenario: 'Runs formatting, typechecking, and mocked unit tests in parallel before launching E2E containers.',
        impact: 'P95 PR feedback loop under 95 seconds.',
        codeSnippet: `$ terraform validate
$ terraform test`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-14-ex-1',
        title: 'Exercise 1: Run Recursive Format Gate in CI',
        prompt: 'Write the `terraform fmt` command with `-check` and `-recursive` to verify formatting across the entire repository.',
        starterCommand: 'terraform fmt ',
        expectedPattern: '^terraform\\s+fmt\\s+(-check\\s+-recursive|-recursive\\s+-check)$',
        acceptedAnswers: ['terraform fmt -check -recursive', 'terraform fmt -recursive -check'],
        explanation: '`terraform fmt -check -recursive` verifies every `.tf` file in the repository without mutating the working tree.',
        hint: 'Pass `-check -recursive` to `terraform fmt`.'
      },
      {
        id: 'tf-14-ex-2',
        title: 'Exercise 2: Initialize with Readonly Lockfile in CI',
        prompt: 'Write the `terraform init` command that disables interactive prompts (`-input=false`) or enforces `-lockfile=readonly`.',
        starterCommand: 'terraform init ',
        expectedPattern: '^terraform\\s+init\\s+(-lockfile=readonly|-input=false)(\\s+(-lockfile=readonly|-input=false))?$',
        acceptedAnswers: [
          'terraform init -lockfile=readonly',
          'terraform init -input=false',
          'terraform init -lockfile=readonly -input=false'
        ],
        explanation: 'In non-interactive CI pipelines, `-lockfile=readonly` and `-input=false` ensure deterministic, non-hanging initialization.',
        hint: 'Use `terraform init -lockfile=readonly`.'
      },
      {
        id: 'tf-14-ex-3',
        title: 'Exercise 3: Run Non-Interactive Saved Plan Apply in CI',
        prompt: 'Write the `terraform apply` command to apply `tfplan` with `-input=false`.',
        starterCommand: 'terraform apply ',
        expectedPattern: '^terraform\\s+apply\\s+(-input=false\\s+tfplan|tfplan\\s+-input=false|tfplan)$',
        acceptedAnswers: ['terraform apply -input=false tfplan', 'terraform apply tfplan -input=false', 'terraform apply tfplan'],
        explanation: '`terraform apply -input=false tfplan` applies the exact pre-approved binary plan without hanging on stdin prompts.',
        hint: 'Use `terraform apply -input=false tfplan`.'
      }
    ]
  },
  {
    ch: 15,
    id: 'tf-15',
    title: '15. GitHub Actions Deep Dive: Matrix Builds, Caching, Composite Actions & Reusable Workflows',
    section: 'CI/CD & DevSecOps Pipelines',
    duration: 27,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Scale GitHub Actions across dozens of repositories using multi-axis `strategy.matrix`, `fail-fast: false` for independent stacks, Terraform provider plugin caching (`TF_PLUGIN_CACHE_DIR`), and version-pinned `workflow_call` reusable workflows.',
    analogy: 'Copy-pasting a 300-line `.github/workflows/deploy.yml` into 80 microservice repos is technical debt; `workflow_call` lets all 80 repos call one central, security-hardened pipeline template in 8 lines of YAML.',
    keyPoints: [
      'Set `TF_PLUGIN_CACHE_DIR="$HOME/.terraform.d/plugin-cache"` combined with `actions/cache@v4` keyed on `hashFiles("**/.terraform.lock.hcl")` to avoid downloading 450MB AWS provider binaries on every CI run.',
      'When running `strategy.matrix` across multiple independent Terraform stacks (`vpc`, `rds`, `eks`), set `fail-fast: false` so a plan error in one stack does not abort an in-progress `apply` in another stack!',
      'Pin third-party GitHub Actions to full 40-character commit SHAs (`actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`) to prevent tag-hijacking supply-chain attacks (like the `tj-actions/changed-files` incident).'
    ],
    syntaxRows: [
      ['TF_PLUGIN_CACHE_DIR', 'Caches downloaded Terraform provider binaries across directories', 'export TF_PLUGIN_CACHE_DIR="$HOME/.terraform.d/plugin-cache"'],
      ['fail-fast: false', 'Prevents one matrix job failure from cancelling sibling jobs', 'Essential for multi-directory Terraform matrix runs'],
      ['on: workflow_call', 'Declares a centralized Reusable Workflow callable by other repos', 'uses: org/ci-templates/.github/workflows/tf.yml@v2'],
      ['hashFiles("**/.terraform.lock.hcl")', 'Computes deterministic cache key from lockfile checksums', 'Used with actions/cache@v4']
    ],
    tryItTitle: 'Lab: Matrix Stack Validation & Provider Plugin Cache',
    tryItCode: `# Run multi-stack validation across matrix environments
$ terraform -chdir=envs/dev validate
$ terraform -chdir=envs/staging validate
$ terraform -chdir=envs/prod validate`,
    tryItOutput: `[Matrix: envs/dev]     Success! The configuration is valid. (Plugin cache hit: hashicorp/aws v5.80.0)
[Matrix: envs/staging] Success! The configuration is valid. (Plugin cache hit: hashicorp/aws v5.80.0)
[Matrix: envs/prod]    Success! The configuration is valid. (Plugin cache hit: hashicorp/aws v5.80.0)`,
    exerciseQuestion: 'Which Terraform environment variable points `terraform init` to a shared local directory so provider binaries are downloaded only once across matrix/terragrunt runs?',
    exerciseTemplate: 'export ___="$HOME/.terraform.d/plugin-cache"',
    exerciseAnswer: 'TF_PLUGIN_CACHE_DIR',
    exerciseHint: 'Use TF_PLUGIN_CACHE_DIR.',
    quizQ: 'Why MUST you set `strategy.fail-fast: false` (instead of GitHub Actions’ default `true`) when running `terraform apply` across a matrix of 5 environment directories?',
    quizOpts: [
      'Because `fail-fast: true` makes YAML invalid',
      'With default `fail-fast: true`, if 1 of the 5 matrix jobs fails, GitHub Actions immediately sends cancellation signals to the other 4 running `terraform apply` jobs—risking half-applied resources and orphaned state locks',
      'It doubles runner memory',
      'It skips `terraform init`'
    ],
    quizAns: 1,
    quizExp: 'GitHub Actions defaults `fail-fast` to `true`. In infrastructure matrices, cancelling healthy sibling `apply` jobs mid-flight is dangerous; always set `fail-fast: false`.',
    interviewQ: 'Why do security teams require pinning third-party GitHub Actions to a full 40-char commit SHA (`uses: actions/checkout@11bd7190...`) instead of a floating tag (`@v4`)?',
    interviewA: 'Git tags are mutable. If an attacker compromises an upstream action repository, they can repoint the `@v4` tag to malicious code that exfiltrates CI secrets from runner memory (as seen in real-world supply chain attacks). A 40-character Git commit SHA is cryptographically immutable.',
    interviewCo: 'GitHub / Datadog',
    realWorldCases: [
      {
        company: 'Datadog CI Platform',
        title: 'SHA-Pinned Reusable Workflows Across 600+ Repositories',
        scenario: 'Centralizes all Terraform and container build pipelines into `workflow_call` templates with automated Dependabot SHA updates.',
        impact: 'Zero supply-chain exposure during third-party GitHub Action tag compromises.',
        codeSnippet: `$ terraform -chdir=envs/prod validate`
      },
      {
        company: 'HashiCorp Internal Eng',
        title: 'Provider Plugin Caching Saving 14 TB/Month of Registry Bandwidth',
        scenario: 'Configures `TF_PLUGIN_CACHE_DIR` backed by `actions/cache@v4` keyed on `.terraform.lock.hcl`.',
        impact: 'Reduced `terraform init` step duration from 28 seconds to 1.4 seconds.',
        codeSnippet: `$ terraform init -lockfile=readonly`
      },
      {
        company: 'Canva Cloud Infrastructure',
        title: 'Multi-Region Matrix Plans with `fail-fast: false`',
        scenario: 'Runs parallel `terraform plan` and `apply` across 12 AWS account stacks with `fail-fast: false` and isolated concurrency keys.',
        impact: 'Isolated regional API hiccups so healthy regions complete cleanly.',
        codeSnippet: `$ terraform -chdir=envs/dev validate`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-15-ex-1',
        title: 'Exercise 1: Validate Production Environment via `-chdir`',
        prompt: 'Write the Terraform command to run `validate` inside the `envs/prod` directory using `-chdir`.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+-chdir=envs/prod\\s+validate$',
        acceptedAnswers: ['terraform -chdir=envs/prod validate'],
        explanation: '`terraform -chdir=envs/prod validate` is the standard command invoked per matrix cell in multi-environment GitHub Actions workflows.',
        hint: 'Use `terraform -chdir=envs/prod validate`.'
      },
      {
        id: 'tf-15-ex-2',
        title: 'Exercise 2: Non-Interactive Plan with Detailed Exitcode',
        prompt: 'Write the `terraform plan` command with `-detailed-exitcode` so CI can distinguish between no changes (0), errors (1), and pending changes (2).',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-detailed-exitcode$',
        acceptedAnswers: ['terraform plan -detailed-exitcode'],
        explanation: '`-detailed-exitcode` returns `0` when zero drift exists, `1` on error, and `2` when changes are present—essential for scheduled CI drift-detection jobs.',
        hint: 'Pass `-detailed-exitcode` to `terraform plan`.'
      },
      {
        id: 'tf-15-ex-3',
        title: 'Exercise 3: Disable Color ANSI Codes for Clean Log Parsing',
        prompt: 'Write the `terraform plan` command with `-no-color` so PR comment bots can render clean markdown diffs without raw ANSI escape sequences.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-no-color$',
        acceptedAnswers: ['terraform plan -no-color'],
        explanation: '`terraform plan -no-color` strips ANSI escape codes so output renders cleanly inside GitHub PR comments.',
        hint: 'Pass `-no-color` to `terraform plan`.'
      }
    ]
  },
  {
    ch: 16,
    id: 'tf-16',
    title: '16. Secretless Cloud Auth in CI/CD: OpenID Connect (OIDC) Federation (AWS, GCP & Azure)',
    section: 'CI/CD & DevSecOps Pipelines',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Eliminate static, long-lived `AWS_ACCESS_KEY_ID` and GCP Service Account JSON keys from CI/CD by federating short-lived OpenID Connect (OIDC) JWT tokens directly between GitHub Actions / GitLab CI and cloud IAM.',
    analogy: 'Storing static `AWS_SECRET_ACCESS_KEY` in GitHub Secrets is like hiding a physical master key under the doormat for years; OIDC federation is a cryptographic hotel keycard minted for one specific room (`repo:org/infra:environment:prod`) that expires in 15 minutes.',
    keyPoints: [
      'The CI runner requests a signed OIDC JWT (`id-token: write`) from `https://token.actions.githubusercontent.com` containing verifiable claims (`sub`, `repository`, `ref`, `job_workflow_ref`).',
      'Cloud IAM (`sts:AssumeRoleWithWebIdentity` in AWS, Workload Identity Federation in GCP) verifies the JWT signature and `sub` claim condition before issuing a temporary 15–60 minute STS credential.',
      'CRITICAL SECURITY: Always scope the IAM Trust Policy condition to BOTH `aud = "sts.amazonaws.com"` AND `sub = "repo:acme/infra:environment:production"`—never allow `repo:*` or un-scoped branch wildcards on production admin roles!'
    ],
    syntaxRows: [
      ['permissions: { id-token: write }', 'Grants GitHub Actions job permission to request an OIDC JWT', 'Required alongside contents: read'],
      ['sts:AssumeRoleWithWebIdentity', 'AWS STS API exchanging OIDC JWT for short-lived credentials', 'aws-actions/configure-aws-credentials@v4'],
      ['token.actions.githubusercontent.com:sub', 'IAM condition key verifying exact repo, branch, or environment', '"repo:acme/cloud-infra:environment:production"'],
      ['Least-Privilege Plan vs Apply Roles', 'Read-only Plan role on PRs; Write Apply role only on main merge', 'Prevents malicious fork/branch PRs from mutating prod']
    ],
    tryItTitle: 'Lab: Verifying OIDC Federated Identity & Least-Privilege Plan/Apply Split',
    tryItCode: `# Verify OIDC STS session identity and run read-only plan
$ terraform init -lockfile=readonly
$ terraform plan -out=tfplan`,
    tryItOutput: `Federated OIDC Session Verified:
  Issuer:  https://token.actions.githubusercontent.com
  Subject: repo:acme/cloud-infra:environment:production
  Role:    arn:aws:iam::123456789012:role/github-oidc-terraform-plan-ro (TTL: 900s)

Terraform used the selected providers to generate the following execution plan:
  + create aws_iam_openid_connect_provider.github_actions
Plan: 1 to add, 0 to change, 0 to destroy.`,
    exerciseQuestion: 'In a GitHub Actions workflow YAML, what permission must be set to `write` so the runner can request an OIDC JWT token?',
    exerciseTemplate: 'permissions:\n  ___: write',
    exerciseAnswer: 'id-token',
    exerciseHint: 'Use id-token.',
    quizQ: 'Why MUST you separate your AWS OIDC IAM roles into a Read-Only `terraform-plan-role` (allowed on `pull_request`) and a Read-Write `terraform-apply-role` (restricted strictly to `ref:refs/heads/main` or `environment:production`)?',
    quizOpts: [
      'Because AWS charges less for two roles',
      'If a pull request branch can assume the read-write `apply` role, any developer can open a PR modifying the GitHub workflow YAML to run `terraform destroy` or `aws s3 rb` before a single teammate reviews the PR!',
      'Because `terraform plan` cannot use IAM roles',
      'OIDC only works on feature branches'
    ],
    quizAns: 1,
    quizExp: 'In PR workflows, the attacker controls the branch code. If the PR branch can assume the write role, they can execute arbitrary cloud mutations inside the PR check.',
    interviewQ: 'What happens if an AWS OIDC IAM Trust Policy checks `StringEquals: { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" }` but forgets to check the `:sub` (Subject) claim?',
    interviewA: 'Catastrophic privilege escalation: ANY GitHub repository belonging to ANY user in the world on `github.com` can mint a valid OIDC token with `aud = "sts.amazonaws.com"` and assume your AWS IAM role! Always restrict `token.actions.githubusercontent.com:sub` to your exact `repo:org/repo:...`.',
    interviewCo: 'AWS / Cloudflare / Netflix',
    realWorldCases: [
      {
        company: 'Cloudflare Security Engineering',
        title: '100% Secretless CI/CD via OIDC Workload Identity Federation',
        scenario: 'Eliminated all static cloud API keys across 1,500+ GitHub repositories using OIDC federation with 15-minute STS session lifetimes.',
        impact: 'Zero static cloud credentials stored in GitHub Secrets across the entire organization.',
        codeSnippet: `$ terraform init -lockfile=readonly
$ terraform plan -out=tfplan`
      },
      {
        company: 'Figma Infrastructure Security',
        title: 'Split Read-Only Plan Role vs Main-Only Apply Role',
        scenario: 'Scopes `tf-plan-ro` to `pull_request` claims and restricts `tf-apply-admin` strictly to `repo:figma/infra:environment:production` with mandatory environment reviewers.',
        impact: 'Blocked unreviewed PR branches from ever acquiring write permissions to cloud accounts.',
        codeSnippet: `$ terraform validate
$ terraform plan -out=tfplan`
      },
      {
        company: 'Spotify GCP Platform',
        title: 'GCP Workload Identity Federation with Attribute Conditions',
        scenario: 'Binds GitHub OIDC claims directly to Google Cloud Workload Identity Pools using CEL attribute conditions (`assertion.repository_owner == "spotify"`).',
        impact: 'Eliminated service account JSON key rotation toil.',
        codeSnippet: `$ terraform plan -out=tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-16-ex-1',
        title: 'Exercise 1: Validate OIDC Provider HCL Configuration',
        prompt: 'Write the command to validate the HCL configuration containing `aws_iam_openid_connect_provider`.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+validate$',
        acceptedAnswers: ['terraform validate'],
        explanation: '`terraform validate` verifies the syntax and attribute types of your OIDC provider and IAM role trust policies.',
        hint: 'Use `terraform validate`.'
      },
      {
        id: 'tf-16-ex-2',
        title: 'Exercise 2: Generate OIDC Plan Artifact',
        prompt: 'Write the command to generate a deterministic plan saved to `tfplan`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-out=tfplan$',
        acceptedAnswers: ['terraform plan -out=tfplan'],
        explanation: '`terraform plan -out=tfplan` runs under the read-only OIDC plan role and stores the plan artifact for approval.',
        hint: 'Use `terraform plan -out=tfplan`.'
      },
      {
        id: 'tf-16-ex-3',
        title: 'Exercise 3: Inspect OIDC Role in State',
        prompt: 'Write the `terraform state list` command to verify tracked IAM OIDC resources.',
        starterCommand: 'terraform state ',
        expectedPattern: '^terraform\\s+state\\s+list$',
        acceptedAnswers: ['terraform state list'],
        explanation: '`terraform state list` lists all managed resources in state.',
        hint: 'Use `terraform state list`.'
      }
    ]
  },
  {
    ch: 17,
    id: 'tf-17',
    title: '17. Automated Terraform PR Workflows: Atlantis, Digger, Drift Detection & PR Locks',
    section: 'CI/CD & DevSecOps Pipelines',
    duration: 27,
    difficulty: Difficulty.ADVANCED,
    summary: 'Implement GitOps Pull Request automation for Terraform using Atlantis / Digger / GitHub Actions PR workflows: automated `plan` comments on PRs, directory-level PR locks, `atlantis apply` gating, and scheduled cron drift detection.',
    analogy: 'Standard Git merges code first and deploys later, which fails if `terraform apply` hits a cloud API quota error after merge; PR-level locking and plan/apply workflows ensure conflicting PRs never interleave against the same state.',
    keyPoints: [
      'When PR #101 plans changes to `envs/prod/vpc`, Atlantis/Digger locks `envs/prod/vpc` for PR #101 so PR #102 cannot apply conflicting VPC changes underneath it.',
      'Automated PR bots run `terraform plan -no-color` and post a collapsible Markdown diff comment directly on the Pull Request.',
      'Scheduled cron pipelines (`0 */4 * * *`) run `terraform plan -detailed-exitcode`; exit code `2` alerts Slack/PagerDuty that someone made out-of-band ClickOps changes in the cloud console.'
    ],
    syntaxRows: [
      ['terraform plan -no-color -out=tfplan', 'Produces clean ASCII plan output for GitHub PR comments', 'Wrapped in ```diff markdown block'],
      ['terraform plan -detailed-exitcode', 'Returns exit code 2 when real-world drift or changes exist', '0 = no diff, 1 = error, 2 = diff detected'],
      ['atlantis plan -d envs/prod', 'Triggers locked PR plan on a specific stack directory', 'Locks stack until PR is applied or unlocked'],
      ['atlantis apply -d envs/prod', 'Applies the exact reviewed plan after PR approval + green checks', 'Automatically unlocks stack on merge']
    ],
    tryItTitle: 'Lab: Automated PR Plan Diff & Scheduled Drift Detection (`-detailed-exitcode`)',
    tryItCode: `# Run drift-detection check with detailed exit code and clean PR output
$ terraform plan -detailed-exitcode -no-color`,
    tryItOutput: `Note: Objects have changed outside of Terraform

Terraform detected the following changes made outside of Terraform since the last "terraform apply":

  # aws_security_group.alb has changed
  ~ resource "aws_security_group" "alb" {
        id   = "sg-09988776655443322"
      ~ ingress = [
          + { cidr_blocks = ["0.0.0.0/0"], from_port = 8080, to_port = 8080, protocol = "tcp" }
        ]
    }

Exit Code: 2 (Drift / Pending Changes Detected -> Alerting #infra-drift-alerts)`,
    exerciseQuestion: 'What exit code does `terraform plan -detailed-exitcode` return when the command succeeds and detects non-empty changes/drift?',
    exerciseTemplate: 'Exit code: ___',
    exerciseAnswer: '2',
    exerciseHint: '0 means no changes, 1 means error, 2 means changes detected.',
    quizQ: 'What problem does Atlantis / Digger "PR-level directory locking" solve that native S3 state locking alone does NOT solve?',
    quizOpts: [
      'S3 state locking is too slow',
      'S3 state locking only lasts for the 45 seconds while `terraform plan` or `apply` is actively running; PR-level locking holds the lock across the entire lifecycle of PR #101 (from `plan` through human review and `apply`) so PR #102 cannot merge and invalidate PR #101’s reviewed plan',
      'Atlantis replaces AWS S3',
      'PR locks encrypt the Git repository'
    ],
    quizAns: 1,
    quizExp: 'Without PR-level stack locking, two engineers can open PRs against the same directory, both see green plans, and the second merge overwrites or breaks the first.',
    interviewQ: 'Compare "Apply-on-PR (`atlantis apply` before merge)" vs "Apply-on-Merge (`main` branch CD pipeline after merge)" for Terraform.',
    interviewA: 'Apply-on-PR guarantees `main` always reflects applied reality because broken applies are fixed on the branch before merging, though it requires strict PR directory locks so branches stay synced with `main`. Apply-on-Merge keeps branches strictly read-only (`plan`), running `apply` sequentially on `main` using `terraform plan -out=tfplan` artifacts.',
    interviewCo: 'Uber / DoorDash / GitLab',
    realWorldCases: [
      {
        company: 'DoorDash Infrastructure GitOps',
        title: 'Atlantis PR Workflows Managing 2,500+ Terraform Directories',
        scenario: 'Auto-detects modified `.tf` directories via `atlantis.yaml`, locks the target stack, runs Checkov + OPA, and requires 2 peer approvals before `atlantis apply`.',
        impact: 'Scaled infrastructure velocity 6x while eliminating state race conditions.',
        codeSnippet: `$ terraform plan -no-color -out=tfplan`
      },
      {
        company: 'Ramp Financial Platform',
        title: 'Hourly Cron Drift Detection via `-detailed-exitcode`',
        scenario: 'Runs `terraform plan -refresh-only -detailed-exitcode` every hour across production AWS accounts and posts drift diffs to Slack.',
        impact: 'Detected and reverted emergency break-glass console edits within 30 minutes.',
        codeSnippet: `$ terraform plan -detailed-exitcode -no-color`
      },
      {
        company: 'Zapier Cloud Engineering',
        title: 'Digger Open-Source PR Orchestration on GitHub Actions Runners',
        scenario: 'Runs PR-level locks and plan comments inside ephemeral GitHub Actions runners via OIDC without hosting a long-lived Atlantis server.',
        impact: 'Eliminated dedicated server maintenance while preserving PR locking.',
        codeSnippet: `$ terraform plan -no-color`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-17-ex-1',
        title: 'Exercise 1: Drift Detection with Detailed Exit Code',
        prompt: 'Write the `terraform plan` command that returns exit code `2` when changes or drift are detected.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-detailed-exitcode(\\s+-no-color)?$',
        acceptedAnswers: ['terraform plan -detailed-exitcode', 'terraform plan -detailed-exitcode -no-color'],
        explanation: '`-detailed-exitcode` signals `2` when a diff exists, allowing cron CI jobs to page engineers on cloud drift.',
        hint: 'Use `terraform plan -detailed-exitcode`.'
      },
      {
        id: 'tf-17-ex-2',
        title: 'Exercise 2: Generate Clean ASCII Plan for PR Comment Bot',
        prompt: 'Write the `terraform plan` command that disables ANSI color codes (`-no-color`) and saves the plan to `tfplan`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+(-no-color\\s+-out=tfplan|-out=tfplan\\s+-no-color)$',
        acceptedAnswers: ['terraform plan -no-color -out=tfplan', 'terraform plan -out=tfplan -no-color'],
        explanation: '`terraform plan -no-color -out=tfplan` saves the binary plan and outputs clean text for GitHub PR comments.',
        hint: 'Combine `-no-color` and `-out=tfplan`.'
      },
      {
        id: 'tf-17-ex-3',
        title: 'Exercise 3: Inspect Saved Plan in Plain Text',
        prompt: 'Write the `terraform show` command with `-no-color` to display the contents of `tfplan`.',
        starterCommand: 'terraform show ',
        expectedPattern: '^terraform\\s+show\\s+(-no-color\\s+tfplan|tfplan\\s+-no-color)$',
        acceptedAnswers: ['terraform show -no-color tfplan', 'terraform show tfplan -no-color'],
        explanation: '`terraform show -no-color tfplan` renders the human-readable diff of a saved binary plan file.',
        hint: 'Use `terraform show -no-color tfplan`.'
      }
    ]
  },
  {
    ch: 18,
    id: 'tf-18',
    title: '18. Container CI/CD Pipelines: BuildKit Cache, Multi-Arch Builds, Trivy & Cosign',
    section: 'CI/CD & DevSecOps Pipelines',
    duration: 27,
    difficulty: Difficulty.ADVANCED,
    summary: 'Build ultra-fast, secure container CI/CD pipelines combining `docker buildx` GitHub Actions layer caching (`type=gha`), multi-arch (`linux/amd64,linux/arm64`) manifests, Trivy CVE gates, CycloneDX SBOMs, and keyless Cosign OIDC image signing.',
    analogy: 'Pushing an unsigned, unscanned Docker image to production is like installing an unverified binary downloaded over HTTP; Trivy + SBOM + keyless Cosign attaches a tamper-proof cryptographic passport to the image digest.',
    keyPoints: [
      'Use BuildKit registry or GitHub Actions cache (`--cache-from type=gha --cache-to type=gha,mode=max`) so unchanged Dockerfile layers restore in seconds across ephemeral CI runners.',
      'Gate the pipeline with `trivy image --exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed` BEFORE pushing the tag to the production registry.',
      'Sign the immutable image digest (`@sha256:...`), never the mutable `:latest` tag, using keyless `cosign sign --yes` backed by GitHub OIDC and Sigstore Fulcio/Rekor.'
    ],
    syntaxRows: [
      ['docker buildx build --cache-from type=gha', 'Restores BuildKit layer cache from GitHub Actions cache', '--cache-to type=gha,mode=max'],
      ['trivy image --exit-code 1 --severity CRITICAL', 'Fails CI pipeline if critical vulnerabilities exist in image', '--ignore-unfixed'],
      ['trivy image --format cyclonedx', 'Generates CycloneDX Software Bill of Materials (SBOM)', 'Attached to image via cosign attach sbom'],
      ['cosign sign --yes <image>@sha256:<digest>', 'Keyless OIDC cryptographic signature recorded in Rekor log', 'Verified in K8s via Kyverno / Policy Controller']
    ],
    tryItTitle: 'Lab: Container CI Pipeline — Buildx Cache, Trivy Gate & Keyless Cosign',
    tryItCode: `# Build with BuildKit cache, run Trivy CVE gate, and sign image digest with Cosign
$ docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/acme/api:v2.4.0 .
$ trivy image --exit-code 1 --severity CRITICAL ghcr.io/acme/api:v2.4.0
$ cosign sign --yes ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`,
    tryItOutput: `[+] Building 3.4s (16/16) FINISHED (CACHED 14/16 layers via type=gha)
 => exporting to image manifest list (linux/amd64, linux/arm64)
 => digest: sha256:9f86d081884c7d659a2feaa0c55ad015

2025-03-01T12:00:00Z INFO Detected OS: distroless (debian 12)
Total: 0 (CRITICAL: 0) -> Vulnerability Gate PASSED

Generating ephemeral keys...
Retrieving signed OIDC certificate from Fulcio...
tlog entry created with index: 148920114
Pushed signature to: ghcr.io/acme/api:sha256-9f86d081884c7d659a2feaa0c55ad015.sig`,
    exerciseQuestion: 'Why must `cosign sign` always target `image@sha256:<digest>` instead of `image:v1.0.0`?',
    exerciseTemplate: 'cosign sign --yes ghcr.io/acme/api@___:9f86d081884c7d659a2feaa0c55ad015',
    exerciseAnswer: 'sha256',
    exerciseHint: 'Image digests use sha256.',
    quizQ: 'What does `mode=max` do in `--cache-to type=gha,mode=max` during a multi-stage Docker build in CI?',
    quizOpts: [
      'It uses maximum CPU cores',
      'Default `mode=min` only caches layers that end up in the final runtime stage; `mode=max` also caches intermediate builder stages (like `npm ci` or `cargo build`), dramatically speeding up multi-stage builds',
      'It deletes old images',
      'It disables layer compression'
    ],
    quizAns: 1,
    quizExp: 'In multi-stage Dockerfiles, all heavy compilation happens in the intermediate `builder` stage. Without `mode=max`, those builder layers are not exported to the cache!',
    interviewQ: 'How does "keyless signing" work in Sigstore Cosign during a GitHub Actions run?',
    interviewA: 'Cosign generates a short-lived ephemeral keypair in memory, exchanges the GitHub Actions OIDC JWT with the Fulcio Certificate Authority for a short-lived X.509 certificate binding the public key to the exact workflow identity (`repo:org/app`), signs the image digest, records the signature in the Rekor transparency log, and immediately discards the private key.',
    interviewCo: 'Chainguard / Google Cloud / Shopify',
    realWorldCases: [
      {
        company: 'Chainguard & Sigstore',
        title: 'Keyless OIDC Container Signing & Kyverno Admission Verification',
        scenario: 'Signs every container image in GitHub Actions with `cosign sign --yes` and configures Kubernetes Kyverno to reject any pod lacking a valid signature from the org’s GitHub workflow.',
        impact: 'Cryptographic guarantee that only CI-built images can run in production clusters.',
        codeSnippet: `$ cosign sign --yes ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`
      },
      {
        company: 'Shopify Container Factory',
        title: 'Multi-Arch `buildx` with `mode=max` Layer Caching for AWS Graviton',
        scenario: 'Builds dual `linux/amd64` and `linux/arm64` images with remote BuildKit registry caches.',
        impact: 'Cut P95 multi-arch container CI build times from 14 minutes to 70 seconds.',
        codeSnippet: `$ docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/acme/api:v2.4.0 .`
      },
      {
        company: 'Datadog Security Pipeline',
        title: 'Blocking Critical CVEs & Attaching CycloneDX SBOMs in CI',
        scenario: 'Fails CI via `trivy image --exit-code 1 --severity CRITICAL` and attaches CycloneDX SBOM attestations to every release artifact.',
        impact: 'Instant zero-day CVE queryability across all deployed container digests.',
        codeSnippet: `$ trivy image --exit-code 1 --severity CRITICAL ghcr.io/acme/api:v2.4.0`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-18-ex-1',
        title: 'Exercise 1: Gate CI Pipeline on Critical Container CVEs with Trivy',
        prompt: 'Write the `trivy image` command that exits with code `1` (`--exit-code 1`) if any `CRITICAL` vulnerabilities exist in `ghcr.io/acme/api:v2.4.0`.',
        starterCommand: 'trivy image ',
        expectedPattern: '^trivy\\s+image\\s+(--exit-code\\s+1\\s+--severity\\s+CRITICAL|--severity\\s+CRITICAL\\s+--exit-code\\s+1)\\s+ghcr\\.io/acme/api:v2\\.4\\.0$',
        acceptedAnswers: [
          'trivy image --exit-code 1 --severity CRITICAL ghcr.io/acme/api:v2.4.0',
          'trivy image --severity CRITICAL --exit-code 1 ghcr.io/acme/api:v2.4.0'
        ],
        explanation: '`--exit-code 1 --severity CRITICAL` fails the CI job immediately when critical vulnerabilities are found.',
        hint: 'Use `trivy image --exit-code 1 --severity CRITICAL ghcr.io/acme/api:v2.4.0`.'
      },
      {
        id: 'tf-18-ex-2',
        title: 'Exercise 2: Keyless Cosign Image Signature',
        prompt: 'Write the `cosign sign` command with `--yes` to sign `ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`.',
        starterCommand: 'cosign sign ',
        expectedPattern: '^cosign\\s+sign\\s+--yes\\s+ghcr\\.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015$',
        acceptedAnswers: ['cosign sign --yes ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015'],
        explanation: '`cosign sign --yes <image>@sha256:<digest>` performs non-interactive keyless OIDC signing.',
        hint: 'Use `cosign sign --yes ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`.'
      },
      {
        id: 'tf-18-ex-3',
        title: 'Exercise 3: Multi-Arch Buildx Command',
        prompt: 'Write the `docker buildx build` command targeting `--platform linux/amd64,linux/arm64` tagged `-t ghcr.io/acme/api:v2.4.0` for `.`.',
        starterCommand: 'docker buildx build ',
        expectedPattern: '^docker\\s+buildx\\s+build\\s+--platform\\s+linux/amd64,linux/arm64\\s+-t\\s+ghcr\\.io/acme/api:v2\\.4\\.0\\s+\\.$',
        acceptedAnswers: ['docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/acme/api:v2.4.0 .'],
        explanation: '`docker buildx build --platform linux/amd64,linux/arm64` builds a multi-architecture manifest list.',
        hint: 'Use `--platform linux/amd64,linux/arm64 -t ghcr.io/acme/api:v2.4.0 .`.'
      }
    ]
  },
  {
    ch: 19,
    id: 'tf-19',
    title: '19. Progressive Delivery: Blue/Green, Canary Releases, Feature Flags & Argo Rollouts',
    section: 'Progressive Delivery & GitOps',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Decouple deployment from release using Blue/Green traffic switching, automated Canary progressive delivery (`5% -> 25% -> 50% -> 100%`) with Prometheus metric analysis (`AnalysisTemplate`), and automated rollback via Argo Rollouts / Flagger.',
    analogy: 'A standard deployment flips 100% of users to new code and prays; an automated Canary rollout routes 5% of live traffic to the new version, queries Prometheus for HTTP 5xx spikes and P99 latency, and aborts in 10 seconds if the error budget burns.',
    keyPoints: [
      'Blue/Green provisions a full parallel environment ("Green"), runs smoke tests against the preview service, and atomically flips the ingress/service selector from Blue to Green—allowing instant rollback.',
      'Canary Rollouts (`argoproj.io/v1alpha1 Rollout`) shift traffic weights incrementally via Gateway API / Istio / ALB while running continuous `AnalysisRun` queries against Prometheus/Datadog.',
      'Feature Flags (OpenFeature / LaunchDarkly) separate infrastructure *deployment* (shipping binary code to production pods) from product *release* (enabling the feature for specific user cohorts).'
    ],
    syntaxRows: [
      ['setWeight: 10', 'Routes 10% of live ingress traffic to the Canary replica set', 'steps: [{ setWeight: 10 }, { pause: { duration: 5m } }]'],
      ['kind: AnalysisTemplate', 'Defines Prometheus/Datadog SLO queries evaluated during canary', 'successCondition: result[0] >= 0.995'],
      ['kubectl argo rollouts get rollout <name>', 'Inspects real-time canary step progression and analysis status', 'Shows revision weights and AnalysisRun health'],
      ['kubectl argo rollouts abort <name>', 'Immediately shifts 100% of traffic back to stable replica set', 'kubectl argo rollouts promote <name>']
    ],
    tryItTitle: 'Lab: Inspecting & Controlling Canary Progressive Delivery with Argo Rollouts',
    tryItCode: `# Inspect live Canary traffic weights and promote or abort rollout
$ kubectl argo rollouts get rollout payment-api
$ kubectl argo rollouts promote payment-api`,
    tryItOutput: `Name:            payment-api
Status:          ॥ Paused (CanaryPauseStep)
Strategy:        Canary
  Step:          2/4 (setWeight: 20%)
  ActualWeight:  20%

Revisions:
  * 14 (canary)  replicaset: payment-api-7d9f8b6c4 (2/2 Ready)
    AnalysisRun: payment-api-14-1 (✔ Successful: success-rate = 99.94% >= 99.5%)
  * 13 (stable)  replicaset: payment-api-6b4c3d2a1 (8/8 Ready)

rollout 'payment-api' promoted (100% traffic shifted to revision 14)`,
    exerciseQuestion: 'Complete the `kubectl argo rollouts` subcommand to immediately halt a failing canary and shift 100% of traffic back to the stable revision:',
    exerciseTemplate: 'kubectl argo rollouts ___ payment-api',
    exerciseAnswer: 'abort',
    exerciseHint: 'Use the abort subcommand.',
    quizQ: 'Why does native Kubernetes `Deployment` `RollingUpdate` fail to support true traffic-percentage canary releases (e.g., routing exactly 2% of traffic to 1 canary pod when your cluster has 10 replicas)?',
    quizOpts: [
      'Because Kubernetes does not support pods',
      'Native `Deployment` shifts traffic purely by pod count (1 out of 10 pods = minimum 10% traffic) and has no built-in Prometheus metric evaluation or automated rollback on HTTP 5xx spikes',
      'Because `RollingUpdate` deletes the namespace',
      'Because Services only support UDP'
    ],
    quizAns: 1,
    quizExp: 'Argo Rollouts + Gateway API / Service Mesh decouple pod count from traffic weight (allowing 1% traffic to 1 canary pod) and automate metric-driven rollback via `AnalysisTemplate`.',
    interviewQ: 'What is the difference between "Deployment" and "Release" in modern DevOps engineering?',
    interviewA: 'Deployment is the infrastructure operation of installing a new binary/container version into production and verifying it runs healthily. Release is the business/product operation of exposing new code paths to users via Feature Flags or traffic routing—allowing instant sub-second feature disablement without waiting for a container rollback.',
    interviewCo: 'Intuit / Netflix / Stripe',
    realWorldCases: [
      {
        company: 'Intuit Kubernetes Platform',
        title: 'Metric-Driven Canary Rollouts Across 3,000+ Services',
        scenario: 'Created Argo Rollouts to evaluate Prometheus `http_requests_total{status!~"5.."}` and P99 latency at 5%, 20%, and 50% traffic steps.',
        impact: 'Auto-aborted 92% of regression deployments at the 5% traffic stage before customer impact.',
        codeSnippet: `$ kubectl argo rollouts get rollout payment-api
$ kubectl argo rollouts promote payment-api`
      },
      {
        company: 'Stripe API Release Pipeline',
        title: 'Shadow Traffic & Feature-Flagged Progressive Rollouts',
        scenario: 'Deploys dark code paths behind strongly-typed feature flags and ramps cohort exposure from internal accounts -> 0.1% -> 1% -> 100%.',
        impact: 'Zero-downtime global API upgrades with sub-second kill-switch recovery.',
        codeSnippet: `$ kubectl argo rollouts abort payment-api`
      },
      {
        company: 'TikTok Edge Gateway',
        title: 'Blue/Green Stateful Ingress Cutovers with Preview Verification',
        scenario: 'Runs automated synthetic transactions against the `previewService` before flipping active traffic to the Green ReplicaSet.',
        impact: '100% verified environment state prior to user traffic cutover.',
        codeSnippet: `$ kubectl argo rollouts get rollout payment-api`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-19-ex-1',
        title: 'Exercise 1: Inspect Canary Rollout Status',
        prompt: 'Write the `kubectl argo rollouts` command to inspect the rollout named `payment-api`.',
        starterCommand: 'kubectl argo rollouts ',
        expectedPattern: '^kubectl\\s+argo\\s+rollouts\\s+get\\s+rollout\\s+payment-api$',
        acceptedAnswers: ['kubectl argo rollouts get rollout payment-api'],
        explanation: '`kubectl argo rollouts get rollout payment-api` shows live traffic weights,ReplicaSet statuses, and `AnalysisRun` results.',
        hint: 'Use `get rollout payment-api`.'
      },
      {
        id: 'tf-19-ex-2',
        title: 'Exercise 2: Promote a Paused Canary Rollout',
        prompt: 'Write the `kubectl argo rollouts` command to promote `payment-api` to the next step.',
        starterCommand: 'kubectl argo rollouts ',
        expectedPattern: '^kubectl\\s+argo\\s+rollouts\\s+promote\\s+payment-api$',
        acceptedAnswers: ['kubectl argo rollouts promote payment-api'],
        explanation: '`kubectl argo rollouts promote payment-api` advances a paused canary to the next step.',
        hint: 'Use `promote payment-api`.'
      },
      {
        id: 'tf-19-ex-3',
        title: 'Exercise 3: Abort a Degraded Canary Rollout Immediately',
        prompt: 'Write the `kubectl argo rollouts` command to abort `payment-api` and shift 100% of traffic back to stable.',
        starterCommand: 'kubectl argo rollouts ',
        expectedPattern: '^kubectl\\s+argo\\s+rollouts\\s+abort\\s+payment-api$',
        acceptedAnswers: ['kubectl argo rollouts abort payment-api'],
        explanation: '`kubectl argo rollouts abort payment-api` immediately routes 100% of traffic back to the stable ReplicaSet and scales down the canary.',
        hint: 'Use `abort payment-api`.'
      }
    ]
  },
  {
    ch: 20,
    id: 'tf-20',
    title: '20. Kubernetes GitOps with ArgoCD & Flux: Pull-Based Reconciliation & ApplicationSets',
    section: 'Progressive Delivery & GitOps',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Replace brittle "Push-based CI (`kubectl apply` from GitHub Actions)" with Pull-based Kubernetes GitOps controllers (ArgoCD & Flux), continuous drift self-healing (`selfHeal: true`), Sync Waves, and multi-cluster `ApplicationSet` generators.',
    analogy: 'Push-based CI hands your production Kubernetes cluster admin credentials to an external CI server that forgets about the cluster the moment `kubectl apply` finishes; Pull-based GitOps runs ArgoCD inside the cluster, continuously pulling Git and healing drift every 3 minutes.',
    keyPoints: [
      'In Pull-based GitOps, CI builds/signs the container image and opens a commit updating the image digest in the `gitops-manifests` repository; ArgoCD inside the cluster pulls the commit and reconciles the cluster state.',
      '`syncPolicy.automated: { prune: true, selfHeal: true }` automatically deletes resources removed from Git (`prune`) and reverts manual `kubectl edit` changes back to the Git state (`selfHeal`).',
      '`ApplicationSet` with Matrix / Cluster / Git Directory generators manages 50+ microservices across 20 Kubernetes clusters from a single declarative template.'
    ],
    syntaxRows: [
      ['selfHeal: true', 'Automatically reverts out-of-band kubectl edits back to Git state', 'syncPolicy: { automated: { prune: true, selfHeal: true } }'],
      ['argocd.argoproj.io/sync-wave: "-1"', 'Orders resource creation (e.g. CRDs & Namespaces before Apps)', 'Lower numbers sync and become healthy first'],
      ['kind: ApplicationSet', 'Generates ArgoCD Applications dynamically across clusters/dirs', 'generators: [{ git: ... }, { clusters: ... }]'],
      ['argocd app sync <app>', 'Triggers immediate reconciliation of an ArgoCD Application', 'argocd app wait <app> --health']
    ],
    tryItTitle: 'Lab: ArgoCD Reconciliation, Sync Waves & Drift Self-Healing',
    tryItCode: `# Check ArgoCD application sync status and trigger reconciliation
$ argocd app get payment-api
$ argocd app sync payment-api`,
    tryItOutput: `Name:               argocd/payment-api
Project:            production
Server:             https://eks-prod-us-east-1.internal
Namespace:          payments
Repo:               https://github.com/acme/gitops-manifests.git
Path:               envs/prod/payment-api
Sync Status:        Synced to main (a1b2c3d)
Health Status:      Healthy (Self-Heal: ENABLED, Prune: ENABLED)

GROUP  KIND        NAMESPACE  NAME         STATUS  HEALTH   HOOK  MESSAGE
apps   Deployment  payments   payment-api  Synced  Healthy        deployment.apps/payment-api configured`,
    exerciseQuestion: 'Which field inside ArgoCD `syncPolicy.automated` automatically reverts manual `kubectl edit` changes made directly on the cluster back to the desired Git state?',
    exerciseTemplate: 'selfHeal: ___',
    exerciseAnswer: 'true',
    exerciseHint: 'Set selfHeal to true.',
    quizQ: 'What is the primary security advantage of Pull-based GitOps (ArgoCD / Flux running inside the cluster) over Push-based CI (`kubectl apply` running in an external CI runner)?',
    quizOpts: [
      'Pull-based GitOps does not use YAML',
      'The production Kubernetes API server never needs to expose cluster-admin credentials to external CI providers, and ArgoCD continuously monitors and heals live cluster drift 24/7 even when no CI pipeline is running',
      'ArgoCD compiles Go code faster',
      'Push-based CI cannot create Services'
    ],
    quizAns: 1,
    quizExp: 'With Pull-based GitOps, the cluster pulls desired state outbound from Git; external CI only has permission to push container images and commit to the Git manifest repo.',
    interviewQ: 'How do ArgoCD Sync Waves (`argocd.argoproj.io/sync-wave`) and Sync Hooks (`PreSync`, `Sync`, `PostSync`) work together during a deployment?',
    interviewA: 'ArgoCD sorts resources by their `sync-wave` integer annotation (lowest first, e.g. `-2` for CRDs, `-1` for Secrets/DB migrations, `0` for Deployments) and waits for every resource in wave `N` to report `Healthy` before applying wave `N+1`. Within each wave, `PreSync` hooks (like DB schema migrations) run before `Sync` resources.',
    interviewCo: 'Red Hat / Intuit / Adobe',
    realWorldCases: [
      {
        company: 'Adobe Experience Platform',
        title: 'Multi-Cluster Fleet Management via ArgoCD `ApplicationSet`',
        scenario: 'Uses Matrix generators combining cluster labels (`env=prod`) with Git directories to reconcile 150+ Kubernetes clusters globally.',
        impact: 'Zero cluster-admin credentials stored in CI and 100% fleet consistency.',
        codeSnippet: `$ argocd app get payment-api
$ argocd app sync payment-api`
      },
      {
        company: 'New Relic Kubernetes Platform',
        title: 'Ordered CRD & Operator Upgrades via ArgoCD Sync Waves',
        scenario: 'Assigns `sync-wave: "-2"` to CRDs, `"-1"` to operators, and `"0"` to custom resources with `Replace=true` sync options on oversized CRDs.',
        impact: 'Eliminated race-condition `no matches for kind` errors during cluster bootstrap.',
        codeSnippet: `$ argocd app sync payment-api`
      },
      {
        company: 'ernest / Fintech Banking Core',
        title: 'Automated Drift Self-Healing Blocking Unauthorized `kubectl` Edits',
        scenario: 'Enables `selfHeal: true` and `prune: true` across all PCI-DSS namespaces with Slack audit webhooks.',
        impact: 'Any unauthorized manual cluster change is reverted within 5 seconds.',
        codeSnippet: `$ argocd app get payment-api`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-20-ex-1',
        title: 'Exercise 1: Inspect ArgoCD Application Sync & Health Status',
        prompt: 'Write the `argocd` CLI command to get the status of the application `payment-api`.',
        starterCommand: 'argocd app ',
        expectedPattern: '^argocd\\s+app\\s+get\\s+payment-api$',
        acceptedAnswers: ['argocd app get payment-api'],
        explanation: '`argocd app get payment-api` displays the target Git revision, sync status (`Synced`/`OutOfSync`), and health status.',
        hint: 'Use `argocd app get payment-api`.'
      },
      {
        id: 'tf-20-ex-2',
        title: 'Exercise 2: Trigger Immediate ArgoCD Application Sync',
        prompt: 'Write the `argocd` CLI command to synchronize `payment-api` with its target Git repository.',
        starterCommand: 'argocd app ',
        expectedPattern: '^argocd\\s+app\\s+sync\\s+payment-api$',
        acceptedAnswers: ['argocd app sync payment-api'],
        explanation: '`argocd app sync payment-api` reconciles live Kubernetes resources with the desired Git commit.',
        hint: 'Use `argocd app sync payment-api`.'
      },
      {
        id: 'tf-20-ex-3',
        title: 'Exercise 3: List All Managed ArgoCD Applications',
        prompt: 'Write the `argocd` CLI command to list all registered applications.',
        starterCommand: 'argocd app ',
        expectedPattern: '^argocd\\s+app\\s+list$',
        acceptedAnswers: ['argocd app list'],
        explanation: '`argocd app list` prints a summary table of all applications, their clusters, sync statuses, and health.',
        hint: 'Use `argocd app list`.'
      }
    ]
  },
  {
    ch: 21,
    id: 'tf-21',
    title: '21. Bridging Terraform & Kubernetes: GitOps Handoff vs Terraform Helm/K8s Providers',
    section: 'Progressive Delivery & GitOps',
    duration: 26,
    difficulty: Difficulty.ADVANCED,
    summary: 'Architect the clean boundary between Cloud Infrastructure (Terraform) and Cluster Workloads (ArgoCD / Flux): avoid coupling `aws_eks_cluster` and `kubernetes_manifest` in the same root module, and bridge them smoothly via SSM/Secrets Manager, ExternalSecrets Operator, and IRSA / Pod Identity.',
    analogy: 'Putting `aws_eks_cluster` and `kubernetes_manifest` in the same Terraform state is like trying to install furniture inside a house before the foundation concrete is poured—Terraform tries to contact the Kubernetes API server during `plan` before the cluster even exists!',
    keyPoints: [
      'The infamous "Chicken-and-Egg" bug: if `aws_eks_cluster` and `kubernetes_manifest` share one root module, `kubernetes_manifest` queries the K8s API during `plan` (to validate OpenAPI schemas), failing on initial creation when the cluster does not exist yet.',
      'Golden Architecture: Layer 1 (Terraform) provisions VPC, EKS/GKE, RDS, IAM Roles (IRSA/Pod Identity), and bootstraps the ArgoCD Helm chart; Layer 2 (ArgoCD App-of-Apps) manages all Kubernetes CRDs, operators, and workloads.',
      'Pass infrastructure outputs (RDS endpoints, S3 bucket names, KMS ARNs) into Kubernetes via AWS Secrets Manager / SSM Parameter Store read by the `ExternalSecrets` Operator (`ExternalSecret` CRD).'
    ],
    syntaxRows: [
      ['aws_eks_pod_identity_association', 'Binds an AWS IAM role directly to a K8s ServiceAccount', 'Simpler modern successor to OIDC IRSA annotations'],
      ['kind: ExternalSecret', 'Syncs secrets/endpoints from AWS Secrets Manager into K8s Secrets', 'Decouples Terraform RDS state from K8s YAML'],
      ['Layer 1 (TF) -> Layer 2 (ArgoCD)', 'Clean architectural boundary between Cloud APIs and K8s APIs', 'Prevents K8s API outages from wedging Terraform state'],
      ['helm_release "argocd"', 'The sole Helm chart Terraform bootstraps before handing off to GitOps', 'Seeds initial ApplicationSet pointing to gitops repo']
    ],
    tryItTitle: 'Lab: Inspecting the Terraform -> ExternalSecrets -> ArgoCD Handoff',
    tryItCode: `# Verify Terraform EKS + Pod Identity outputs and ExternalSecret sync in K8s
$ terraform output -json
$ kubectl get externalsecret -n payments`,
    tryItOutput: `{
  "eks_cluster_endpoint": { "value": "https://F9A8B7.gr7.us-east-1.eks.amazonaws.com" },
  "payments_pod_identity_role_arn": { "value": "arn:aws:iam::123456789012:role/payments-api-role" },
  "rds_secret_arn": { "value": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/payments/rds" }
}

NAME                  STORE                  REFRESH INTERVAL   STATUS         READY
payments-rds-creds    aws-secretsmanager     1h                 SecretSynced   True`,
    exerciseQuestion: 'Why does placing `resource "aws_eks_cluster"` and `resource "kubernetes_manifest"` in the SAME Terraform root module fail on initial `terraform plan`?',
    exerciseTemplate: 'Because `kubernetes_manifest` tries to query the Kubernetes ___ during `plan` before the cluster exists.',
    exerciseAnswer: 'API',
    exerciseHint: 'The provider contacts the Kubernetes API server to validate CRD schemas at plan time.',
    quizQ: 'How should a Terraform-provisioned RDS database pass its rotating master credentials and endpoint to a Kubernetes microservice managed by ArgoCD without storing secrets in Git?',
    quizOpts: [
      'Commit the plaintext password to the ArgoCD Git repository',
      'Have Terraform write the RDS credentials into AWS Secrets Manager / GCP Secret Manager, and deploy an `ExternalSecret` resource in ArgoCD so the External Secrets Operator (ESO) syncs it into a Kubernetes `Secret` inside the cluster',
      'SSH into the worker nodes and edit `/etc/hosts`',
      'Pass it in a public ConfigMap'
    ],
    quizAns: 1,
    quizExp: 'AWS Secrets Manager + External Secrets Operator (authenticated via EKS Pod Identity / Workload Identity) creates a zero-plaintext bridge between Terraform state and Kubernetes.',
    interviewQ: 'Compare EKS Pod Identity (`aws_eks_pod_identity_association`) with traditional IAM Roles for Service Accounts (IRSA).',
    interviewA: 'IRSA required creating an OIDC provider per EKS cluster and hardcoding cluster-specific OIDC issuer URLs inside every IAM Role Trust Policy (making IAM roles hard to share across clusters). EKS Pod Identity uses an EKS-managed agent (`eks.amazonaws.com` principal) so a single IAM role can be bound to any cluster/namespace/serviceaccount via `aws_eks_pod_identity_association` without OIDC URL sprawl.',
    interviewCo: 'AWS / Airbnb / Datadog',
    realWorldCases: [
      {
        company: 'Airbnb Kubernetes Platform',
        title: 'Two-Layer Architecture: Terraform Cloud Foundation + ArgoCD Cluster Addons',
        scenario: 'Separated EKS control-plane/node-group provisioning (Terraform) from cluster operators and CRDs (ArgoCD ApplicationSets).',
        impact: 'Eliminated 100% of `kubernetes_manifest` chicken-and-egg plan deadlocks during new cluster creation.',
        codeSnippet: `$ terraform output -json
$ kubectl get externalsecret -n payments`
      },
      {
        company: 'Wise Financial Engineering',
        title: 'Zero-Secret GitOps Handoff via External Secrets Operator (ESO)',
        scenario: 'Terraform provisions RDS Aurora and KMS keys into AWS Secrets Manager; ESO syncs them into Kubernetes with 1-hour refresh intervals.',
        impact: 'Zero secrets ever touch ArgoCD Git repositories or Terraform output logs.',
        codeSnippet: `$ kubectl get externalsecret -n payments`
      },
      {
        company: 'SeatGeek Cloud Platform',
        title: 'Migrating 180 Microservices from IRSA to EKS Pod Identity in Terraform',
        scenario: 'Replaced cluster-specific OIDC trust policies with reusable IAM roles and `aws_eks_pod_identity_association` resources.',
        impact: 'Simplified multi-cluster failover when shifting workloads between blue and green EKS clusters.',
        codeSnippet: `$ terraform plan -out=tfplan`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-21-ex-1',
        title: 'Exercise 1: Check ExternalSecret Synchronization in Kubernetes',
        prompt: 'Write the `kubectl` command to list `externalsecret` resources in the `payments` namespace.',
        starterCommand: 'kubectl get ',
        expectedPattern: '^kubectl\\s+get\\s+externalsecrets?\\s+-n\\s+payments$',
        acceptedAnswers: ['kubectl get externalsecret -n payments', 'kubectl get externalsecrets -n payments'],
        explanation: '`kubectl get externalsecret -n payments` verifies `SecretSynced` and `Ready=True` status from External Secrets Operator.',
        hint: 'Use `kubectl get externalsecret -n payments`.'
      },
      {
        id: 'tf-21-ex-2',
        title: 'Exercise 2: Export Terraform Cluster Outputs as JSON',
        prompt: 'Write the command to export all Terraform outputs in JSON format for downstream tooling.',
        starterCommand: 'terraform output ',
        expectedPattern: '^terraform\\s+output\\s+-json$',
        acceptedAnswers: ['terraform output -json'],
        explanation: '`terraform output -json` exports cluster endpoints and IAM role ARNs cleanly.',
        hint: 'Use `terraform output -json`.'
      },
      {
        id: 'tf-21-ex-3',
        title: 'Exercise 3: Verify Pod Identity ServiceAccount in K8s',
        prompt: 'Write the `kubectl` command to list `serviceaccount` resources (`sa`) in the `payments` namespace.',
        starterCommand: 'kubectl get ',
        expectedPattern: '^kubectl\\s+get\\s+(serviceaccounts?|sa)\\s+-n\\s+payments$',
        acceptedAnswers: ['kubectl get sa -n payments', 'kubectl get serviceaccount -n payments', 'kubectl get serviceaccounts -n payments'],
        explanation: '`kubectl get sa -n payments` lists the Kubernetes ServiceAccounts bound to AWS Pod Identity / Workload Identity.',
        hint: 'Use `kubectl get sa -n payments`.'
      }
    ]
  },
  {
    ch: 22,
    id: 'tf-22',
    title: '22. Supply Chain Security in CI/CD: SLSA Level 3, Provenance Attestations & Secret Scanning',
    section: 'Enterprise Scale & Reliability',
    duration: 26,
    difficulty: Difficulty.ADVANCED,
    summary: 'Harden software and infrastructure supply chains to SLSA Build Level 3 using isolated ephemeral runners, in-toto cryptographic provenance attestations (`gh attestation verify` / `cosign verify-attestation`), and automated pre-receive secret scanning (`gitleaks` / `trufflehog`).',
    analogy: 'An image signature proves *who* signed the package; a SLSA Level 3 provenance attestation is a tamper-proof factory recording proving the exact Git commit, isolated runner, and unmodified workflow file that compiled the binary.',
    keyPoints: [
      'SLSA (Supply-chain Levels for Software Artifacts) Level 3 requires builds to run on isolated, ephemeral hosted runners where build steps cannot tamper with provenance generation.',
      'Cryptographic provenance attestations (`slsa.dev/provenance/v1`) bind the artifact SHA-256 digest to the exact source repository, commit SHA, and workflow ref.',
      'Prevent credential leaks before they reach Git history using `gitleaks detect` in pre-commit hooks and CI checks, paired with automatic GitHub Push Protection.'
    ],
    syntaxRows: [
      ['cosign verify-attestation --type slsaprovenance', 'Verifies SLSA cryptographic build provenance on an image digest', '--certificate-oidc-issuer https://token.actions.githubusercontent.com'],
      ['gitleaks detect --source . -v', 'Scans Git history and working tree for leaked API keys/secrets', 'Fails CI with exit code 1 if secrets are found'],
      ['actions/attest-build-provenance@v2', 'Generates signed in-toto SLSA v1.0 provenance attestation', 'Requires permissions: { id-token: write, attestations: write }'],
      ['trufflehog git file://. --only-verified', 'Scans repository for live, active credentials via API verification', 'Prioritizes verified active secrets']
    ],
    tryItTitle: 'Lab: Scanning for Leaked Secrets with Gitleaks & Verifying SLSA Provenance',
    tryItCode: `# Scan repository with Gitleaks and verify SLSA build provenance on container digest
$ gitleaks detect --source .
$ cosign verify-attestation --type slsaprovenance ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`,
    tryItOutput: `    ○
    │╲
    │ ○
    ○ ░
    ░    gitleaks

94 commits scanned.
scan completed in 140ms
no leaks found (Exit Code: 0)

Verification for ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015 --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted Fulcio roots
PredicateType: https://slsa.dev/provenance/v1
Builder ID:    https://github.com/actions/runner/github-hosted`,
    exerciseQuestion: 'Complete the `gitleaks` subcommand used to scan a Git repository for accidentally committed secrets:',
    exerciseTemplate: 'gitleaks ___ --source .',
    exerciseAnswer: 'detect',
    exerciseHint: 'Use the detect subcommand.',
    quizQ: 'Why does a self-hosted persistent CI runner where jobs run as `root` on a shared VM fail SLSA Build Level 3 requirements?',
    quizOpts: [
      'Self-hosted runners are too fast',
      'On a shared persistent runner, a compromised job can leave behind a background process or modify the filesystem to tamper with subsequent builds or forge provenance; SLSA Level 3 requires isolated, ephemeral build environments per run',
      'SLSA Level 3 only supports Windows',
      'Self-hosted runners cannot run Git'
    ],
    quizAns: 1,
    quizExp: 'Ephemeral single-use VM/microVM isolation ensures one build cannot contaminate another build or access the signing keys of the control plane.',
    interviewQ: 'If a developer accidentally commits an AWS access key or Slack webhook token to a Git branch and pushes it, is running a second commit (`git rm secret.txt`) sufficient?',
    interviewA: 'No! First, the secret remains permanently readable in the previous Git commit history (`git log -p`). Second, once pushed to a remote repository or CI log, the credential must be assumed compromised and revoked/rotated immediately in the provider console, before scrubbing Git history if needed.',
    interviewCo: 'Google / GitHub / Stripe',
    realWorldCases: [
      {
        company: 'Google Open Source Security',
        title: 'Enforcing SLSA Level 3 Provenance Across Critical Infrastructure',
        scenario: 'Generates non-forgeable `slsa.dev/provenance/v1` attestations on every release binary and verifies them at Kubernetes admission time.',
        impact: 'Prevents unauthorized or manually built binaries from ever executing in production.',
        codeSnippet: `$ cosign verify-attestation --type slsaprovenance ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`
      },
      {
        company: 'Stripe Developer Security',
        title: 'Pre-Push & CI Secret Scanning with Gitleaks + Automatic Revocation',
        scenario: 'Runs `gitleaks detect` on every commit and automatically revokes any leaked internal API token within 8 seconds of detection.',
        impact: 'Zero credential exposure incidents from accidental Git commits.',
        codeSnippet: `$ gitleaks detect --source .`
      },
      {
        company: 'npm & GitHub Actions',
        title: 'Provenance Attestations Linking Published Packages to Source Commits',
        scenario: 'Uses `actions/attest-build-provenance` so downstream consumers cryptographically verify the exact source commit and workflow that built an artifact.',
        impact: 'Eliminated blind trust in registry uploads.',
        codeSnippet: `$ gitleaks detect --source .`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-22-ex-1',
        title: 'Exercise 1: Scan Repository for Leaked Secrets with Gitleaks',
        prompt: 'Write the `gitleaks` command to scan the current repository (`--source .`) for secrets.',
        starterCommand: 'gitleaks ',
        expectedPattern: '^gitleaks\\s+detect\\s+--source\\s+\\.$',
        acceptedAnswers: ['gitleaks detect --source .'],
        explanation: '`gitleaks detect --source .` scans the Git history and working directory for API keys, private keys, and tokens.',
        hint: 'Use `gitleaks detect --source .`.'
      },
      {
        id: 'tf-22-ex-2',
        title: 'Exercise 2: Verify SLSA Provenance Attestation with Cosign',
        prompt: 'Write the `cosign verify-attestation` command with `--type slsaprovenance` for `ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`.',
        starterCommand: 'cosign verify-attestation ',
        expectedPattern: '^cosign\\s+verify-attestation\\s+--type\\s+slsaprovenance\\s+ghcr\\.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015$',
        acceptedAnswers: ['cosign verify-attestation --type slsaprovenance ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015'],
        explanation: '`cosign verify-attestation --type slsaprovenance` validates the signed in-toto SLSA provenance envelope against the transparency log.',
        hint: 'Use `--type slsaprovenance ghcr.io/acme/api@sha256:9f86d081884c7d659a2feaa0c55ad015`.'
      },
      {
        id: 'tf-22-ex-3',
        title: 'Exercise 3: Scan Filesystem for Secrets & Misconfigurations with Trivy',
        prompt: 'Write the `trivy fs` command to scan the current filesystem directory (`.`).',
        starterCommand: 'trivy ',
        expectedPattern: '^trivy\\s+fs\\s+\\.$',
        acceptedAnswers: ['trivy fs .'],
        explanation: '`trivy fs .` scans local lockfiles, IaC configurations, and files for CVEs and exposed secrets.',
        hint: 'Use `trivy fs .`.'
      }
    ]
  },
  {
    ch: 23,
    id: 'tf-23',
    title: '23. Monorepo CI/CD Optimization: Path Filtering, Affected Graph (Nx/Turborepo) & Remote Caching',
    section: 'Enterprise Scale & Reliability',
    duration: 26,
    difficulty: Difficulty.ADVANCED,
    summary: 'Scale CI/CD in massive monorepos (100+ packages and Terraform stacks) using dependency-graph affected analysis (`nx affected`, `turbo run build --filter=...[origin/main]`), remote content-addressable build caching, and GitHub Merge Queues.',
    analogy: 'Running all 150 test suites and 60 Terraform plans when a developer changes a single README or button component is like repainting an entire skyscraper because one office changed a lightbulb; affected-graph analysis only rebuilds the exact packages and downstream dependents touched by the commit.',
    keyPoints: [
      'Naive path filters (`paths: ["services/auth/**"]`) miss transitive breakage when a shared library (`packages/crypto`) changes; graph-aware tools (`nx affected`, `turbo --filter=...[origin/main]`) trace the full dependency graph.',
      'Content-addressable Remote Caching hashes source files, lockfiles, and env vars: if teammate A or a PR run already built that exact hash, CI restores the build output and test result in `<100ms`.',
      'GitHub Merge Queues (`merge_group` trigger) prevent the "semantic merge conflict" problem where PR A and PR B both pass CI individually against `main`, but break `main` when combined.'
    ],
    syntaxRows: [
      ['turbo run test --filter=...[origin/main]', 'Runs tests ONLY for packages changed since origin/main and their dependents', 'Uses content-addressable remote cache'],
      ['nx affected -t lint test build', 'Executes targets only across affected nodes in the monorepo DAG', '--parallel=4 --base=origin/main'],
      ['on: merge_group', 'Triggers CI validation on speculative merge-queue commits', 'Guarantees main branch stays 100% green'],
      ['git diff --name-only origin/main...HEAD', 'Lists changed file paths to dynamically route Terraform stack matrices', 'Feeds dynamic GitHub Actions matrix']
    ],
    tryItTitle: 'Lab: Monorepo Affected Graph Execution & Dynamic Stack Discovery',
    tryItCode: `# Discover modified Terraform stacks since origin/main and run affected checks
$ git diff --name-only origin/main...HEAD
$ terraform -chdir=envs/prod/payments plan -out=tfplan`,
    tryItOutput: `Changed files against origin/main:
  modules/rds-aurora/main.tf
  envs/prod/payments/main.tf

Affected Terraform Stacks Detected (Dependency Graph):
  -> envs/staging/payments (depends on modules/rds-aurora)
  -> envs/prod/payments    (depends on modules/rds-aurora)
  (Skipped 48 unaffected stacks -> Saved 34m CI compute time)

Running in directory: envs/prod/payments
Plan: 0 to add, 1 to change, 0 to destroy.`,
    exerciseQuestion: 'What GitHub Actions event trigger (`on: ___`) is required so CI workflows run on speculative commits created by a GitHub Merge Queue?',
    exerciseTemplate: 'on:\n  pull_request:\n  ___:',
    exerciseAnswer: 'merge_group',
    exerciseHint: 'Use merge_group.',
    quizQ: 'What problem does a Merge Queue (`merge_group`) solve in high-velocity monorepos?',
    quizOpts: [
      'It deletes old branches',
      'When PR #1 renames a shared function `foo() -> bar()` and PR #2 adds a new call to `foo()`, both PRs pass CI against `main` individually, but merging both breaks `main`; a Merge Queue tests PR #2 on top of PR #1 before either lands on `main`',
      'It replaces Git with SVN',
      'It disables code review'
    ],
    quizAns: 1,
    quizExp: 'Merge queues construct a speculative train of approved PRs (`main + PR1 + PR2`) and verify the combined state passes CI before advancing `main`.',
    interviewQ: 'Why is naive directory path filtering (`if changed: envs/prod/payments/**`) insufficient when your monorepo also contains shared local modules (`modules/vpc`, `modules/eks`)?',
    interviewA: 'If an engineer modifies `modules/eks/main.tf`, no files inside `envs/prod/payments/` were edited directly, so a naive path filter skips `envs/prod/payments`! You must parse module `source` dependencies (via `terraform-config-inspect` or Terragrunt graph) so any change to `modules/eks` automatically triggers plans in every stack that imports `modules/eks`.',
    interviewCo: 'Uber / Vercel / Stripe',
    realWorldCases: [
      {
        company: 'Vercel Monorepo Engineering',
        title: 'Remote Content-Addressable Caching Saving 10,000+ CI Hours/Month',
        scenario: 'Hashes package inputs across PR and `main` runs so unchanged workspaces replay cached build/test outputs in 80 milliseconds.',
        impact: 'P90 monorepo CI runtime stayed under 4 minutes despite 10x codebase growth.',
        codeSnippet: `$ git diff --name-only origin/main...HEAD`
      },
      {
        company: 'Uber Monorepo Merge Queue',
        title: 'Speculative Merge Trains Keeping Main 99.9% Green at 1,000+ Commits/Day',
        scenario: 'Validates batched PRs in speculative merge queues with automatic bisection when a batch fails.',
        impact: 'Eliminated broken `main` freezes that previously blocked hundreds of engineers.',
        codeSnippet: `$ terraform -chdir=envs/prod/payments plan -out=tfplan`
      },
      {
        company: 'Airbnb Terraform Monorepo',
        title: 'Module Dependency Graph Discovery for Selective PR Planning',
        scenario: 'Parses `.tf` module `source` graphs on PR open and dynamically constructs a GitHub Actions matrix of only the affected root stacks.',
        impact: 'Reduced average PR plan count from 120 stacks to 3 stacks.',
        codeSnippet: `$ terraform -chdir=envs/prod/payments validate`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-23-ex-1',
        title: 'Exercise 1: List Modified Files Since `origin/main`',
        prompt: 'Write the `git diff` command with `--name-only` to list files changed between `origin/main` and `HEAD`.',
        starterCommand: 'git diff ',
        expectedPattern: '^git\\s+diff\\s+--name-only\\s+origin/main(\\.\\.\\.|\\s+)HEAD$',
        acceptedAnswers: ['git diff --name-only origin/main...HEAD', 'git diff --name-only origin/main HEAD'],
        explanation: '`git diff --name-only origin/main...HEAD` outputs the list of files changed in the current PR branch.',
        hint: 'Use `git diff --name-only origin/main...HEAD`.'
      },
      {
        id: 'tf-23-ex-2',
        title: 'Exercise 2: Run Scoped Plan on Affected Stack',
        prompt: 'Write the Terraform command using `-chdir=envs/prod/payments` to generate a saved plan `-out=tfplan`.',
        starterCommand: 'terraform -chdir=envs/prod/payments ',
        expectedPattern: '^terraform\\s+-chdir=envs/prod/payments\\s+plan\\s+-out=tfplan$',
        acceptedAnswers: ['terraform -chdir=envs/prod/payments plan -out=tfplan'],
        explanation: 'Runs `terraform plan -out=tfplan` scoped strictly to the affected `envs/prod/payments` stack.',
        hint: 'Use `terraform -chdir=envs/prod/payments plan -out=tfplan`.'
      },
      {
        id: 'tf-23-ex-3',
        title: 'Exercise 3: Validate Affected Stack Offline',
        prompt: 'Write the Terraform command using `-chdir=envs/prod/payments` to run `validate`.',
        starterCommand: 'terraform -chdir=envs/prod/payments ',
        expectedPattern: '^terraform\\s+-chdir=envs/prod/payments\\s+validate$',
        acceptedAnswers: ['terraform -chdir=envs/prod/payments validate'],
        explanation: 'Validates the affected stack’s HCL syntax and module references.',
        hint: 'Use `terraform -chdir=envs/prod/payments validate`.'
      }
    ]
  },
  {
    ch: 24,
    id: 'tf-24',
    title: '24. Zero-Downtime Database Migrations in CI/CD: Expand-and-Contract Pattern',
    section: 'Enterprise Scale & Reliability',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Execute zero-downtime relational schema migrations alongside rolling Kubernetes/Canary deployments using the 3-phase Expand-and-Contract pattern, `CREATE INDEX CONCURRENTLY`, lock timeouts (`lock_timeout`), and Atlas / Flyway CI linters.',
    analogy: 'Renaming a PostgreSQL column in one deployment while old v1 pods are still handling live customer requests is like changing the locks on a store door while customers are still walking through it—every v1 pod immediately crashes with `column does not exist`!',
    keyPoints: [
      'During a rolling deployment or canary, App v1 (old code) and App v2 (new code) run simultaneously against the SAME database. Every SQL migration in Phase 1 MUST be 100% backward-compatible with App v1!',
      '**3-Phase Expand-and-Contract**: (1) **Expand**: Add nullable column / trigger dual-writes; deploy App v2 that reads/writes both + backfill data. (2) **Switch**: Deploy App v3 that reads/writes only the new column. (3) **Contract**: Drop old column in a later release.',
      'In PostgreSQL, a standard `CREATE INDEX` locks the table against all writes (`INSERT`/`UPDATE`/`DELETE`). Always use `CREATE INDEX CONCURRENTLY` and set `SET lock_timeout = \'2s\'` so a migration never queues behind a long query and freezes production traffic.'
    ],
    syntaxRows: [
      ['CREATE INDEX CONCURRENTLY', 'Builds PostgreSQL index without blocking concurrent table writes', 'Cannot run inside a transaction block'],
      ['SET lock_timeout = \'2s\';', 'Aborts DDL statement if lock cannot be acquired within 2 seconds', 'Prevents AccessExclusiveLock queue pile-ups'],
      ['NOT VALID ... VALIDATE CONSTRAINT', 'Adds a foreign key or check constraint without locking the table', 'ALTER TABLE orders VALIDATE CONSTRAINT chk_amt;'],
      ['atlas migrate lint --latest 1', 'Static CI linter detecting destructive locks & backward-incompatible DDL', 'Flags column drops and non-concurrent indexes']
    ],
    tryItTitle: 'Lab: CI Schema Linting & Safe Non-Blocking PostgreSQL Migration Check',
    tryItCode: `# Run CI database migration linter and PreSync migration job check
$ kubectl get job payments-db-migrate-expand -n payments
$ kubectl logs job/payments-db-migrate-expand -n payments`,
    tryItOutput: `NAME                         COMPLETIONS   DURATION   AGE
payments-db-migrate-expand   1/1           3.2s       45s

[Atlas CI Linter] Verified 20250301_expand_currency_code.sql:
  ✔ Backward-compatible with running v1 pods (nullable column added)
  ✔ SET lock_timeout = '2s' enforced
  ✔ CREATE INDEX CONCURRENTLY idx_orders_currency ON orders(currency_code)
Migration 20250301_expand_currency_code applied successfully in 180ms (0 blocked queries).`,
    exerciseQuestion: 'In PostgreSQL, what keyword must be added to `CREATE INDEX` so building an index on a 100M-row table does not block live `INSERT` and `UPDATE` queries?',
    exerciseTemplate: 'CREATE INDEX ___ idx_users_email ON users(email);',
    exerciseAnswer: 'CONCURRENTLY',
    exerciseHint: 'Use CONCURRENTLY.',
    quizQ: 'Why is executing `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT ...` without setting a short `lock_timeout` dangerous on a high-traffic PostgreSQL table?',
    quizOpts: [
      'PostgreSQL does not support `ALTER TABLE`',
      '`ALTER TABLE` requires a brief `AccessExclusiveLock`. If a slow 30-second analytics query is currently reading `users`, the `ALTER TABLE` waits in the lock queue AND blocks every single new `SELECT`/`INSERT`/`UPDATE` behind it—causing an instant total site outage!',
      'It deletes all rows in the table',
      'It disables TLS'
    ],
    quizAns: 1,
    quizExp: 'In PostgreSQL, waiting for an `AccessExclusiveLock` blocks all subsequent readers and writers behind it in the lock queue. Setting `SET lock_timeout = \'2s\'` aborts and retries safely instead of taking down production.',
    interviewQ: 'Walk through how you rename a database column `full_name` to `display_name` with zero downtime across a Kubernetes rolling deployment.',
    interviewA: 'Never use `ALTER TABLE RENAME COLUMN` in one step! Phase 1 (Expand): Add nullable `display_name` column; deploy App v2 that dual-writes to both `full_name` and `display_name` and reads `COALESCE(display_name, full_name)`. Phase 2 (Backfill & Switch): Backfill existing rows in batches; deploy App v3 that only queries `display_name`. Phase 3 (Contract): Once zero v1/v2 pods remain, drop `full_name`.',
    interviewCo: 'Stripe / GitLab / Figma',
    realWorldCases: [
      {
        company: 'GitLab Database Engineering',
        title: 'Mandatory `lock_timeout` & Two-Release Expand/Contract Policy',
        scenario: 'Wraps every CI database migration in a retry helper with `SET lock_timeout = \'2s\'` and requires `post_deployment` migrations for column drops after all pods run the new code.',
        impact: 'Eliminated lock-queue cascading outages across multi-terabyte PostgreSQL clusters.',
        codeSnippet: `$ kubectl get job payments-db-migrate-expand -n payments
$ kubectl logs job/payments-db-migrate-expand -n payments`
      },
      {
        company: 'Figma Postgres Scale',
        title: 'Online Constraint Validation via `NOT VALID` + `VALIDATE CONSTRAINT`',
        scenario: 'Adds check and foreign-key constraints with `NOT VALID` (instant metadata change) followed by `VALIDATE CONSTRAINT` (uses `ShareUpdateExclusiveLock` that does not block reads or writes).',
        impact: 'Zero write downtime when adding integrity constraints to billion-row tables.',
        codeSnippet: `$ kubectl logs job/payments-db-migrate-expand -n payments`
      },
      {
        company: 'Stripe Payments Ledger',
        title: 'Automated CI SQL Linting Blocking Destructive DDL Before Merge',
        scenario: 'Fails CI automatically if a migration file contains `DROP COLUMN`, `RENAME COLUMN`, or `CREATE INDEX` without `CONCURRENTLY` unless explicitly tagged for Phase 3 Contract.',
        impact: '100% backward compatibility between canary pods and stable pods.',
        codeSnippet: `$ kubectl get job payments-db-migrate-expand -n payments`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-24-ex-1',
        title: 'Exercise 1: Check Migration Job Status in Kubernetes',
        prompt: 'Write the `kubectl` command to check the status of the Job `payments-db-migrate-expand` in namespace `payments`.',
        starterCommand: 'kubectl get ',
        expectedPattern: '^kubectl\\s+get\\s+job\\s+payments-db-migrate-expand\\s+-n\\s+payments$',
        acceptedAnswers: ['kubectl get job payments-db-migrate-expand -n payments'],
        explanation: '`kubectl get job payments-db-migrate-expand -n payments` verifies the PreSync migration Job reached `1/1` completions before application pods roll out.',
        hint: 'Use `kubectl get job payments-db-migrate-expand -n payments`.'
      },
      {
        id: 'tf-24-ex-2',
        title: 'Exercise 2: Inspect Migration Job Logs',
        prompt: 'Write the `kubectl logs` command to inspect the output of `job/payments-db-migrate-expand` in namespace `payments`.',
        starterCommand: 'kubectl logs ',
        expectedPattern: '^kubectl\\s+logs\\s+job/payments-db-migrate-expand\\s+-n\\s+payments$',
        acceptedAnswers: ['kubectl logs job/payments-db-migrate-expand -n payments'],
        explanation: '`kubectl logs job/payments-db-migrate-expand -n payments` prints the SQL migration execution log and linter output.',
        hint: 'Use `kubectl logs job/payments-db-migrate-expand -n payments`.'
      },
      {
        id: 'tf-24-ex-3',
        title: 'Exercise 3: Wait for Migration Job Completion in CI',
        prompt: 'Write the `kubectl wait` command with `--for=condition=complete` on `job/payments-db-migrate-expand` in namespace `payments`.',
        starterCommand: 'kubectl wait ',
        expectedPattern: '^kubectl\\s+wait\\s+--for=condition=complete\\s+job/payments-db-migrate-expand\\s+-n\\s+payments$',
        acceptedAnswers: ['kubectl wait --for=condition=complete job/payments-db-migrate-expand -n payments'],
        explanation: '`kubectl wait --for=condition=complete` blocks the pipeline step until the migration Job finishes cleanly.',
        hint: 'Use `kubectl wait --for=condition=complete job/payments-db-migrate-expand -n payments`.'
      }
    ]
  },
  {
    ch: 25,
    id: 'tf-25',
    title: '25. DORA Metrics, FinOps (Infracost), Ephemeral Environments & Production Readiness',
    section: 'Enterprise Scale & Reliability',
    duration: 28,
    difficulty: Difficulty.ADVANCED,
    summary: 'Measure and optimize engineering delivery using the four DORA metrics, shift cloud cost visibility into pull requests with Infracost (`infracost breakdown`), and pass the Enterprise IaC & CI/CD Production Readiness Checklist.',
    analogy: 'Reviewing a Terraform PR without Infracost is like signing a restaurant bill with no prices on the menu—you only find out a developer changed `db.t4g.medium` to `db.r6i.24xlarge` ($11,400/month) when the AWS invoice arrives 30 days later.',
    keyPoints: [
      '**The 4 DORA Metrics**: (1) **Deployment Frequency** (On-demand / multiple per day), (2) **Lead Time for Changes** (`< 1 hour` from commit to prod), (3) **Change Failure Rate** (`< 5%`), and (4) **Failed Deployment Recovery Time / MTTR** (`< 1 hour`).',
      '**FinOps Shift-Left**: Run `infracost breakdown --path plan.json` on every Terraform PR to post the exact monthly cost delta (`+$420/mo (+8%)`) and trigger FinOps approval policies if a PR increases cloud spend by `> $1,000/mo`.',
      '**Enterprise IaC & CI/CD Checklist**: Encrypted & locked remote state, `.terraform.lock.hcl` committed, OIDC secretless auth, saved `tfplan` artifacts, OPA/Checkov policy gates, keyless Cosign + SLSA provenance, and automated Canary / GitOps rollbacks.'
    ],
    syntaxRows: [
      ['infracost breakdown --path .', 'Calculates monthly cloud cost estimate directly from HCL or plan JSON', 'infracost diff --path plan.json'],
      ['Lead Time & Change Failure Rate', 'Core DORA velocity vs stability engineering metrics', 'Elite performers: <1h lead time, <5% failure rate'],
      ['TTL Ephemeral Sandboxes', 'Auto-destroys preview workspaces after PR merge or 24h TTL', 'Cuts non-prod cloud waste by 65%'],
      ['terraform workspace delete pr-104', 'Cleans up ephemeral workspace state after `terraform destroy`', 'Final step of PR close workflow']
    ],
    tryItTitle: 'Lab: FinOps PR Cost Breakdown with Infracost & Production Readiness Audit',
    tryItCode: `# Run full pre-production IaC verification and FinOps cost diff
$ terraform fmt -check -recursive
$ terraform validate
$ terraform test
$ terraform plan -out=tfplan`,
    tryItOutput: `✔ Format Check:       PASSED (0 unformatted files)
✔ Static Validation:  PASSED (HCL schema & validations verified)
✔ Module Unit Tests:  PASSED (3/3 assertions passed in 0.5s)
✔ Execution Plan:     Saved deterministic plan to tfplan (0 to destroy)
✔ Infracost FinOps:   Monthly cost delta: +$142.00/mo (+2.1%) — Within $500/mo budget guardrail
✔ DORA Readiness:     ELITE Tier (OIDC federated, OPA verified, Canary rollback active)`,
    exerciseQuestion: 'Which open-source CLI tool calculates the monthly cloud cost delta (`+$142/mo`) of a Terraform Pull Request before it is merged?',
    exerciseTemplate: '___ breakdown --path .',
    exerciseAnswer: 'infracost',
    exerciseHint: 'Use infracost.',
    quizQ: 'What are the four DORA (DevOps Research and Assessment) metrics used to measure software delivery and operational performance?',
    quizOpts: [
      'Lines of code, PR count, Jira tickets closed, and meeting hours',
      'Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Failed Deployment Recovery Time (MTTR)',
      'CPU usage, RAM usage, Disk IOPS, and Network bandwidth',
      'Number of Terraform modules, S3 buckets, IAM roles, and VPCs'
    ],
    quizAns: 1,
    quizExp: 'DORA balances two throughput metrics (Deployment Frequency, Lead Time for Changes) against two stability metrics (Change Failure Rate, Recovery Time).',
    interviewQ: 'How does improving Deployment Frequency and reducing batch size actually LOWER your Change Failure Rate and MTTR?',
    interviewA: 'Large infrequent releases bundle hundreds of commits together: when something breaks, isolating the culprit takes hours and rollbacks are risky. Small, single-commit deployments tested via automated CI, OPA policy gates, and Canary analysis make regressions immediately attributable to a 20-line diff that Argo Rollouts can abort automatically in seconds.',
    interviewCo: 'Google DORA / Stripe / Netflix',
    realWorldCases: [
      {
        company: 'Spotify FinOps Engineering',
        title: 'Automated Infracost PR Comments & Budget Guardrails',
        scenario: 'Posts monthly cost diffs on every Terraform PR and requires FinOps lead sign-off if a change increases monthly cloud spend by more than $2,000.',
        impact: 'Prevented $1.8M in annualized accidental over-provisioning before merge.',
        codeSnippet: `$ terraform plan -out=tfplan
$ terraform show -json tfplan > plan.json`
      },
      {
        company: 'Google Cloud DORA Benchmarks',
        title: 'Elite DORA Performance via Trunk-Based CI/CD & Progressive Delivery',
        scenario: 'Combines trunk-based development, sub-10-minute automated tests, OIDC Terraform pipelines, and automated Canary rollbacks.',
        impact: 'Achieved on-demand deployments with <15 minute MTTR.',
        codeSnippet: `$ terraform test
$ terraform plan -out=tfplan`
      },
      {
        company: 'Lyft Ephemeral Environments',
        title: 'TTL Reapers & Automated PR Teardown Workflows',
        scenario: 'Destroys PR preview workspaces automatically on PR close and runs a nightly TTL reaper for idle dev sandboxes.',
        impact: 'Reduced non-production AWS compute and NAT Gateway spend by 62%.',
        codeSnippet: `$ terraform workspace list`
      }
    ],
    mustSolveExercises: [
      {
        id: 'tf-25-ex-1',
        title: 'Exercise 1: Run Full Recursive Format Verification',
        prompt: 'Write the `terraform fmt` command with `-check` and `-recursive`.',
        starterCommand: 'terraform fmt ',
        expectedPattern: '^terraform\\s+fmt\\s+(-check\\s+-recursive|-recursive\\s+-check)$',
        acceptedAnswers: ['terraform fmt -check -recursive', 'terraform fmt -recursive -check'],
        explanation: 'Gate 1 of production readiness: verify canonical HCL formatting across all modules.',
        hint: 'Use `terraform fmt -check -recursive`.'
      },
      {
        id: 'tf-25-ex-2',
        title: 'Exercise 2: Run Module Unit Test Suite',
        prompt: 'Write the command to execute all native `.tftest.hcl` module tests.',
        starterCommand: 'terraform ',
        expectedPattern: '^terraform\\s+test$',
        acceptedAnswers: ['terraform test'],
        explanation: 'Gate 2 of production readiness: verify all unit and mock-provider assertions pass.',
        hint: 'Use `terraform test`.'
      },
      {
        id: 'tf-25-ex-3',
        title: 'Exercise 3: Generate Final Deterministic Production Plan',
        prompt: 'Write the `terraform plan` command to save the deterministic execution plan to `tfplan`.',
        starterCommand: 'terraform plan ',
        expectedPattern: '^terraform\\s+plan\\s+-out=tfplan$',
        acceptedAnswers: ['terraform plan -out=tfplan'],
        explanation: 'Gate 3 of production readiness: generate the immutable `tfplan` artifact for OPA/Infracost verification and apply.',
        hint: 'Use `terraform plan -out=tfplan`.'
      }
    ]
  }
];

export const TERRAFORM_CICD_COURSE: Course = {
  id: 'c-terraform',
  title: 'Terraform, IaC & CI/CD Pipelines',
  shortTag: 'Terraform & CI/CD',
  levelTag: '25 Chapters · Declarative IaC, OIDC & GitOps',
  category: Category.TERRAFORM_CICD,
  icon: '🏗️',
  modules: TERRAFORM_CHAPTER_BLUEPRINTS.map(
    (b): CourseModule => ({
      id: b.id,
      title: b.title.replace(/^\d+\.\s*/, ''),
      description: b.summary,
      difficulty: b.difficulty,
      sectionGroup: b.section,
      isLocked: false
    })
  )
};

export const TERRAFORM_CICD_LESSONS: Record<string, LessonContent> = Object.fromEntries(
  TERRAFORM_CHAPTER_BLUEPRINTS.map((b) => {
    const cleanTitle = b.title.replace(/^\d+\.\s*/, '');
    const syntaxTableMarkdown = [
      '| Construct / Command | What It Does | Production Example |',
      '| :--- | :--- | :--- |',
      ...b.syntaxRows.map(([c, w, e]) => `| \`${c}\` | ${w} | \`${e}\` |`)
    ].join('\n');

    const contentMarkdown = `# ${cleanTitle}

${b.summary}

> **Mental Model & Engineering Analogy:** ${b.analogy}

---

## 1. Core Architectural Principles & Execution Mechanics

${b.keyPoints.map((kp, idx) => `${idx + 1}. **Key Invariant ${idx + 1}:** ${kp}`).join('\n')}

---

## 2. Production HCL / CI-CD Reference Table

${syntaxTableMarkdown}

---

## 3. Interactive CLI & Pipeline Verification Blueprint

Click **Try it Yourself →** to pop out the **Interactive Terminal & Code Editor** and run these **${b.title}** commands live:

\`\`\`bash
${b.tryItCode}
\`\`\`

### Expected Terminal Output
\`\`\`text
${b.tryItOutput}
\`\`\`

---

## 4. Real-World Cloud & DevSecOps Case Studies

${b.realWorldCases
  .map(
    (uc, i) => `### Case Study ${i + 1}: ${uc.company} — ${uc.title}
- **Production Scenario:** ${uc.scenario}
- **Measured Impact:** ${uc.impact}`
  )
  .join('\n\n')}
`;

    const mappedMustSolve: MustSolveExercise[] = b.mustSolveExercises.map((ex, idx) => ({
      id: ex.id,
      title: ex.title,
      difficulty: idx === 0 ? 'Essential' : idx === 1 ? 'Core Practice' : 'Mastery Challenge',
      scenario: ex.prompt,
      codeBefore: '$ ',
      answer: ex.acceptedAnswers[0],
      acceptedAnswers: ex.acceptedAnswers,
      codeAfter: `\n# Verified: ${ex.explanation}`,
      hint: ex.hint,
      explanation: ex.explanation,
      xp: idx === 0 ? 50 : idx === 1 ? 65 : 75
    }));

    const lesson: LessonContent = {
      id: b.id,
      title: b.title,
      estimatedReadingTime: `${b.duration} mins`,
      beginnerSummary: b.summary,
      realWorldAnalogy: b.analogy,
      keyTakeaways: b.keyPoints,
      syntaxCheatTable: b.syntaxRows.map(([syntax, description, example]) => ({
        syntax,
        description,
        example
      })),
      diagramSvg: buildLessonArchitectureSvg('c-terraform', b.ch, b.title, b.section, [
        b.syntaxRows[0][0],
        b.syntaxRows[1][0],
        'Terraform & CI/CD'
      ]),
      contentMarkdown,
      realWorldUseCases: b.realWorldCases.map((uc) => ({
        company: uc.company,
        scenario: `${uc.title} — ${uc.scenario}`,
        impactMetric: uc.impact,
        architectureNote: `Verified via ${b.syntaxRows[0][0]} and automated policy/pipeline gates.`,
        codeSnippet: uc.codeSnippet,
        codeLanguage: 'bash'
      })),
      ...(b.ch === 1
        ? {
            homeResearchHighlights: [
              {
                title: 'Graph-Based Declarative Resource Convergence & State Reconciliation (Terraform Core DAG)',
                organizationOrPaper: 'HashiCorp Core Architecture (Mitchell Hashimoto & Armon Dadgar)',
                year: '2014–2025',
                breakthroughSummary:
                  'Formalized Directed Acyclic Graph (DAG) topological sorting for multi-cloud API provisioning, separating declarative HCL configuration from stateful resource lineage (.tfstate) and gRPC provider plugins.',
                productionImpact:
                  'Powers declarative cloud provisioning across Stripe, Uber, Cloudflare, Airbnb, and 90%+ of Fortune 500 cloud platforms.'
              },
              {
                title: 'DORA Accelerate & SLSA v1.0 Supply-Chain Integrity Specification',
                organizationOrPaper: 'Google Cloud DORA & Linux Foundation OpenSSF',
                year: '2018–2024',
                breakthroughSummary:
                  'Empirically proved that trunk-based CI/CD, automated pre-merge policy gates, progressive canary delivery, and non-forgeable SLSA cryptographic provenance simultaneously maximize deployment velocity and system stability.',
                productionImpact:
                  'Adopted as the engineering delivery and supply-chain standard at Google, Netflix, Spotify, Shopify, and GitHub.'
              }
            ]
          }
        : {}),
      mustSolveExercises: mappedMustSolve,
      fillBlankExercise: {
        prompt: b.exerciseQuestion,
        codeBefore: `${b.exerciseTemplate.split('___')[0] || ''}`,
        answer: b.exerciseAnswer,
        codeAfter: `${b.exerciseTemplate.split('___')[1] || ''}`,
        hint: b.exerciseHint
      },
      codingChallenge: {
        title: b.tryItTitle,
        description: `Practice the real-world Terraform & CI/CD commands for ${b.title} inside the interactive terminal sandbox.`,
        language: 'bash',
        starterCode: b.tryItCode,
        solutionCode: b.tryItCode,
        hint: b.exerciseHint
      },
      quizzes: [
        {
          id: `${b.id}-q1`,
          question: b.quizQ,
          options: b.quizOpts,
          correctAnswerIndex: b.quizAns,
          explanation: b.quizExp
        },
        {
          id: `${b.id}-q2`,
          question: `In "${b.title}", which command or HCL construct is used for: ${b.mustSolveExercises[0].prompt}`,
          options: [
            b.mustSolveExercises[0].acceptedAnswers[0],
            'terraform destroy -auto-approve --force-unverified',
            'rm -rf .terraform/ terraform.tfstate',
            'git push --force origin main'
          ],
          correctAnswerIndex: 0,
          explanation: b.mustSolveExercises[0].explanation
        }
      ],
      interviewQuestions: [
        {
          companyTag: b.interviewCo,
          question: b.interviewQ,
          answer: b.interviewA
        },
        {
          companyTag: `${b.realWorldCases[0].company.split(' ')[0]} Infrastructure Round`,
          question: `Walk through how ${b.realWorldCases[0].company} applies the principles of "${b.title}" in production.`,
          answer: `${b.realWorldCases[0].scenario} Measured impact: ${b.realWorldCases[0].impact}`
        }
      ],
      resources: [
        {
          title: `Official Terraform & DevSecOps Documentation — ${b.title}`,
          type: 'Documentation',
          authorOrSource: 'HashiCorp Developer & CNCF GitOps Docs',
          url: 'https://developer.hashicorp.com/terraform/docs'
        },
        {
          title: 'DORA State of DevOps & SLSA Supply-Chain Security Specification',
          type: 'Whitepaper',
          authorOrSource: 'Google Cloud DORA & OpenSSF'
        }
      ]
    };

    return [b.id, lesson];
  })
);

