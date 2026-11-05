import { Category, Course, CourseModule, LessonContent, MustSolveExercise } from '../../types';

export interface DockerK8sChapterSpec {
  id: string;
  chNum: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sectionGroup: string;
  summary: string;
  analogy: string;
  syntaxRows: { syntax: string; description: string; example: string }[];
  deepExplanation: string;
  terminalLabCode: string;
  realWorldCases: {
    company: string;
    scenario: string;
    impactMetric: string;
    architectureNote: string;
    codeSnippet?: string;
  }[];
  mustSolve: [MustSolveExercise, MustSolveExercise, MustSolveExercise];
  quiz: {
    q1: { question: string; options: string[]; correct: number; explanation: string };
    q2: { question: string; options: string[]; correct: number; explanation: string };
  };
  interviews: { companyTag: string; question: string; answer: string }[];
}

const DOCKER_K8S_SPECS: DockerK8sChapterSpec[] = [
  {
    id: 'dk-1',
    chNum: 1,
    title: 'Docker HOME: Containers vs VMs, Linux Namespaces & cgroups v2',
    description: 'How containers share the host Linux kernel using pid/net/mnt namespaces and cgroups resource quotas',
    difficulty: 'Beginner',
    sectionGroup: 'Docker Foundations',
    summary:
      'Unlike Virtual Machines that boot an entire guest OS kernel on top of a hypervisor, Docker containers are isolated Linux processes sharing the host kernel via Namespaces (what a process can see) and Control Groups / cgroups v2 (how much CPU/RAM a process can use).',
    analogy:
      'A Virtual Machine is a standalone house with its own foundation, plumbing, and heating system; a Container is a soundproof luxury apartment inside a high-rise that shares the building’s central plumbing (the Linux kernel) while keeping its own locked door and utility meter.',
    syntaxRows: [
      { syntax: 'docker run --rm -it alpine sh', description: 'Launch an interactive ephemeral Alpine Linux container', example: 'docker run --rm -it ubuntu:24.04 bash' },
      { syntax: 'docker ps -a', description: 'List all running and exited containers on the host', example: 'docker ps --format "table {{.Names}}\\t{{.Status}}"' },
      { syntax: 'docker run --cpus="1.5" --memory="512m"', description: 'Enforce Linux cgroups v2 CPU and RAM limits on a container', example: 'docker run -d --memory="256m" redis:7-alpine' },
      { syntax: 'lsns / unshare --pid --fork', description: 'Inspect or create Linux kernel namespaces directly', example: 'lsns -t pid,net,mnt' }
    ],
    deepExplanation: `### 1. Why Containers Replaced Heavy Virtual Machines for Microservices
- **Virtual Machines (VMs)**: Require a Hypervisor (KVM, VMware, Xen) and a full Guest OS kernel per VM. Booting takes **20–60 seconds** and consumes **500MB–2GB** of baseline RAM just for the guest OS.
- **Containers (OCI / containerd)**: Run directly as isolated user-space processes on the shared host Linux kernel. Booting takes **< 50 milliseconds** and consumes **< 5MB** of overhead.

### 2. The 3 Linux Kernel Primitives Behind Every Container
| Kernel Primitive | Responsibility | What It Isolates or Enforces |
| :--- | :--- | :--- |
| **Linux Namespaces** (\`clone()\`) | **Visibility Isolation** | \`pid\` (process ID 1 inside container), \`net\` (virtual eth0 & ports), \`mnt\` (root filesystem), \`ipc\`, \`uts\`, \`user\` (UID mapping). |
| **Control Groups (\`cgroups v2\`)** | **Resource Accounting & Throttling** | Enforces hard ceilings on \`memory.max\` (triggers container OOM kill if exceeded), \`cpu.max\` (CFS bandwidth quota), and \`io.max\`. |
| **OverlayFS (Union Filesystem)** | **Copy-on-Write Layered Storage** | Stacks read-only image layers beneath a thin read-write container layer (\`upperdir\`). |`,
    terminalLabCode: `# Inspect Docker Engine & run a resource-bounded container
docker run -d --name api-worker --cpus="1.0" --memory="256m" nginx:1.27-alpine
docker ps
docker stats --no-stream api-worker`,
    realWorldCases: [
      {
        company: 'Netflix Titus Container Runtime',
        scenario: 'Running 300,000+ daily streaming control-plane & encoding containers across AWS EC2 bare-metal hosts.',
        impactMetric: 'Sub-second container cold start with 4x higher host CPU bin-packing density vs EC2 VMs',
        architectureNote: 'Uses Linux user/pid/net namespaces with cgroups v2 bandwidth throttling and custom seccomp profiles per microservice.'
      },
      {
        company: 'Cloudflare Workers & Sandboxes',
        scenario: 'Isolating multi-tenant build and runtime workloads with strict kernel namespace boundaries.',
        impactMetric: 'Zero noisy-neighbor memory starvation across thousands of concurrent builds',
        architectureNote: 'Combines cgroups v2 memory.high soft throttling with OverlayFS copy-on-write snapshots.'
      },
      {
        company: 'Uber Peloton / Compute Fleet',
        scenario: 'Co-locating stateless Go/Java dispatch services alongside batch analytics jobs on shared Linux nodes.',
        impactMetric: '68% average cluster CPU utilization without P99 dispatch latency spikes',
        architectureNote: 'Assigns real-time dispatch containers to high-priority cgroup CPU shares while batch jobs run in burstable slices.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-1-ex1',
        title: 'Exercise 1: Run a Detached Container with Memory Limit',
        difficulty: 'Essential',
        scenario: 'Write the Docker CLI flag that restricts a container to a maximum of 512 megabytes of RAM (enforced via Linux cgroups):',
        codeBefore: '$ docker run -d --name cache ',
        answer: '--memory="512m"',
        acceptedAnswers: ['--memory="512m"', '--memory=512m', '--memory 512m', '-m 512m', '-m="512m"'],
        codeAfter: ' redis:7-alpine\n# Enforces memory.max = 536870912 bytes in cgroups v2',
        hint: 'Use --memory="512m" or -m 512m.',
        explanation: '--memory="512m" (or -m 512m) configures the Linux cgroup memory ceiling so a memory leak inside the container cannot crash the host node.',
        xp: 50
      },
      {
        id: 'dk-1-ex2',
        title: 'Exercise 2: List All Running & Stopped Containers',
        difficulty: 'Core Practice',
        scenario: 'By default, `docker ps` only shows running containers. Write the exact command to list ALL containers including exited ones:',
        codeBefore: '$ ',
        answer: 'docker ps -a',
        acceptedAnswers: ['docker ps -a', 'docker ps --all', 'docker container ls -a'],
        codeAfter: '\nCONTAINER ID   IMAGE          STATUS                     NAMES\n8f91a2c3d4e5   redis:alpine   Exited (137) 2 mins ago    cache',
        hint: 'Pass the -a (or --all) flag to docker ps.',
        explanation: 'docker ps -a displays both running and stopped/exited containers along with their exit codes (e.g., Exit 137 = SIGKILL / OOMKilled).',
        xp: 60
      },
      {
        id: 'dk-1-ex3',
        title: 'Exercise 3: Linux Kernel Primitive for Resource Quotas',
        difficulty: 'Mastery Challenge',
        scenario: 'Linux Namespaces isolate what a container can SEE. Which Linux kernel subsystem limits how much CPU and RAM a container can USE?',
        codeBefore: '# Visibility = Namespaces | Resource Quotas (CPU/RAM) = ',
        answer: 'cgroups',
        acceptedAnswers: ['cgroups', 'cgroups v2', 'control groups'],
        codeAfter: ' # Enforces cpu.max and memory.max',
        hint: 'Short for Control Groups (7 letters).',
        explanation: 'Linux Control Groups (cgroups / cgroups v2) account for and throttle CPU time, memory footprint, and block I/O per container.',
        xp: 75
      }
    ],
    quiz: {
      q1: {
        question: 'What is the fundamental architectural difference between a Docker container and a Virtual Machine?',
        options: [
          'A container shares the host Linux kernel and isolates processes via Namespaces and cgroups, whereas a VM runs a separate guest OS kernel on a hypervisor.',
          'A container emulates x86 hardware instructions in software, making it slower than a VM.',
          'A container cannot restrict memory usage, while a VM can.',
          'A container requires 4GB of dedicated RAM to boot its own kernel.'
        ],
        correct: 0,
        explanation: 'Containers are isolated host OS processes using Linux namespaces and cgroups, avoiding the guest OS kernel overhead of VMs.'
      },
      q2: {
        question: 'If a Docker container exits with status code 137 (128 + 9), what happened at the Linux kernel level?',
        options: [
          'The container exceeded its cgroup memory limit and received SIGKILL (signal 9) from the Linux OOM Killer (or docker kill).',
          'The Dockerfile had a syntax typo on line 137.',
          'The container successfully completed all unit tests.',
          'Port 137 was already in use on the host.'
        ],
        correct: 0,
        explanation: 'In Linux, exit code 128 + N indicates termination by signal N. Signal 9 is SIGKILL (128 + 9 = 137), typically triggered by the cgroup OOM killer.'
      }
    },
    interviews: [
      {
        companyTag: 'Netflix / Uber Infrastructure',
        question: 'Why is running `top` or `free -m` inside an older container sometimes misleading regarding CPU count or host RAM?',
        answer: 'Standard tools like top read `/proc/meminfo` and `/proc/cpuinfo` from the host kernel, which are not virtualized by default pid/mnt namespaces unless LXCFS or cgroup-aware runtime APIs (like Java 17+ `-XX:+UseContainerSupport`) inspect `/sys/fs/cgroup/` directly.'
      },
      {
        companyTag: 'Cloudflare Systems',
        question: 'How do Linux Namespaces and cgroups complement each other when isolating an untrusted workload?',
        answer: 'Namespaces provide isolation of global system identifiers (PID tree, network stack, mount table, UID map) so the process cannot inspect or signal sibling processes, while cgroups prevent denial-of-service by capping CPU, RAM, PID count (pids.max), and disk I/O.'
      }
    ]
  },
  {
    id: 'dk-2',
    chNum: 2,
    title: 'OCI Container Images, Content-Addressable Layers & OverlayFS',
    description: 'How Docker images are built as immutable SHA-256 tar layers stacked with Copy-on-Write OverlayFS',
    difficulty: 'Beginner',
    sectionGroup: 'Docker Foundations',
    summary:
      'A Docker / OCI image is not a single monolithic file—it is an ordered manifest of read-only, content-addressable SHA-256 tar layers. When a container starts, the OverlayFS storage driver mounts those read-only layers (`lowerdir`) and places a thin writable layer (`upperdir`) on top.',
    analogy:
      'Think of an OCI image like overhead projector transparencies stacked together (`lowerdir`), with one blank sheet placed on top (`upperdir`) where you can write with a dry-erase marker without altering the printed sheets underneath.',
    syntaxRows: [
      { syntax: 'docker pull <image>:<tag>', description: 'Download an OCI image manifest and its compressed layers', example: 'docker pull postgres:16-alpine' },
      { syntax: 'docker image history <image>', description: 'Inspect every layer, command, and byte size in an image', example: 'docker image history node:22-alpine' },
      { syntax: 'docker inspect <image>', description: 'View the OCI JSON config, RootFS SHA-256 layer digests & env', example: 'docker inspect nginx:1.27-alpine' },
      { syntax: 'docker image prune -a', description: 'Remove all unused/dangling image layers to reclaim disk space', example: 'docker image prune -a --force' }
    ],
    deepExplanation: `### 1. Inside an OCI Container Image
An Open Container Initiative (OCI) image consists of three JSON/binary artifacts:
1. **Image Index (Manifest List)**: Maps CPU architectures (\`linux/amd64\`, \`linux/arm64\`) to their specific image manifests.
2. **Image Manifest**: Lists the exact SHA-256 digests of the read-only filesystem layers (\`application/vnd.oci.image.layer.v1.tar+gzip\`).
3. **Image Configuration JSON**: Defines \`Env\`, \`WorkingDir\`, \`ExposedPorts\`, \`User\`, and \`Entrypoint\`/\`Cmd\`.

### 2. Copy-on-Write (CoW) in OverlayFS
- **Read**: Reads directly from \`lowerdir\` (shared in kernel page cache across all containers using the same base image!).
- **Modify**: Copies the file up from \`lowerdir\` to \`upperdir\` on first write (Copy-on-Write).
- **Delete**: Creates a **whiteout file** in \`upperdir\` to mask the underlying file without mutating the immutable base layer.`,
    terminalLabCode: `# Pull an image and inspect its immutable SHA-256 layers
docker pull redis:7-alpine
docker image history redis:7-alpine
docker inspect redis:7-alpine`,
    realWorldCases: [
      {
        company: 'AWS Lambda Container Image Support',
        scenario: 'Caching shared base OCI layers across thousands of serverless function cold starts.',
        impactMetric: '50ms cold-start container mount via deduplicated chunk-level layer caching',
        architectureNote: 'Because base layers are content-addressed by SHA-256 digest, worker nodes already hold 95% of chunks in local NVMe cache.'
      },
      {
        company: 'GitHub Packages (GHCR)',
        scenario: 'Deduplicating petabytes of container layers across millions of CI/CD builds.',
        impactMetric: '74% storage reduction via cross-repository blob deduplication',
        architectureNote: 'Stores each SHA-256 blob once in object storage and serves immutable layers via geo-replicated CDN.'
      },
      {
        company: 'Spotify Backstage & Golden Images',
        scenario: 'Standardizing base OS and JVM/Python layers across 2,000+ backend microservices.',
        impactMetric: '90% smaller delta pulls during rolling Kubernetes deployments',
        architectureNote: 'Kubelet only downloads the top application layer (~12MB) because the base golden layers are pre-warmed on every node.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-2-ex1',
        title: 'Exercise 1: Inspect Image Layer Sizes & Commands',
        difficulty: 'Essential',
        scenario: 'Write the Docker CLI command to inspect the layer-by-layer build history and byte size of `node:22-alpine`:',
        codeBefore: '$ ',
        answer: 'docker image history node:22-alpine',
        acceptedAnswers: ['docker image history node:22-alpine', 'docker history node:22-alpine'],
        codeAfter: '\nIMAGE          CREATED BY                                      SIZE\nsha256:9c1a... CMD ["node"]                                    0B',
        hint: 'Use docker image history <image> (or docker history <image>).',
        explanation: 'docker image history reveals the exact Dockerfile instruction and uncompressed size of every layer in the image.',
        xp: 50
      },
      {
        id: 'dk-2-ex2',
        title: 'Exercise 2: Pin Image by Immutable SHA-256 Digest',
        difficulty: 'Core Practice',
        scenario: 'Mutable tags like `:latest` can be overwritten. Complete the syntax to pull `alpine` pinned by an immutable `@sha256:...` digest:',
        codeBefore: '$ docker pull alpine',
        answer: '@sha256:',
        acceptedAnswers: ['@sha256:'],
        codeAfter: 'beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d',
        hint: 'Use the @ symbol followed by sha256:',
        explanation: 'Pulling by @sha256:<digest> guarantees cryptographic immutability so supply-chain attacks cannot swap out a mutable tag.',
        xp: 65
      },
      {
        id: 'dk-2-ex3',
        title: 'Exercise 3: Reclaim Disk Space from Unused Images',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the command to remove all unused images (not just dangling ones) on a CI builder host:',
        codeBefore: '$ ',
        answer: 'docker image prune -a',
        acceptedAnswers: ['docker image prune -a', 'docker image prune --all', 'docker image prune -af'],
        codeAfter: '\nTotal reclaimed space: 8.42GB',
        hint: 'Combine docker image prune with the -a flag.',
        explanation: 'docker image prune -a removes all images not referenced by any existing container, preventing disk exhaustion on CI runners.',
        xp: 75
      }
    ],
    quiz: {
      q1: {
        question: 'If you create a 500MB temporary file in one `RUN` instruction and delete it with `rm` in the next `RUN` instruction, why is the final Docker image still 500MB larger?',
        options: [
          'Because each RUN instruction commits an immutable read-only layer; deleting a file in a later layer only writes a whiteout marker in the upper layer while the 500MB blob remains in the lower layer.',
          'Because Docker ignores the rm command inside containers.',
          'Because OverlayFS duplicates files every time rm is called.',
          'Because Docker automatically backs up deleted files to Docker Hub.'
        ],
        correct: 0,
        explanation: 'Image layers are immutable and additive. To avoid bloating the layer, download, extract, and delete temporary artifacts inside the SAME `RUN` instruction (`RUN curl ... && tar ... && rm ...`).'
      },
      q2: {
        question: 'When 50 containers start from the same `python:3.12-slim` image on one Linux host, how many copies of the read-only Python base layers exist in the host kernel Page Cache?',
        options: [
          'Exactly 1 shared copy in the kernel page cache (mounted as OverlayFS lowerdir across all 50 containers).',
          '50 separate copies in RAM.',
          '100 copies (2 per container).',
          'Zero copies because containers cannot use page cache.'
        ],
        correct: 0,
        explanation: 'OverlayFS shares the read-only lowerdir inodes across all containers using the same image layers, sharing a single copy in the Linux kernel page cache.'
      }
    },
    interviews: [
      {
        companyTag: 'AWS / Docker Core',
        question: 'What is the performance penalty of Copy-on-Write (copy_up) in OverlayFS when a container modifies a large 2GB database file stored inside an image layer?',
        answer: 'On the very first write to a file in `lowerdir`, OverlayFS must copy the entire 2GB file up to `upperdir` before completing the write syscall, causing a massive I/O latency spike. Stateful databases must always write to Docker Volumes or Bind Mounts that bypass OverlayFS.'
      },
      {
        companyTag: 'Shopify Platform Engineering',
        question: 'Why is using the `:latest` tag in production Kubernetes manifests considered a critical anti-pattern?',
        answer: '`:latest` is mutable and non-deterministic: rolling restarts or node scale-ups can pull a different build than existing pods, breaking rollbacks and reproducibility. Production manifests use immutable Git SHA tags or `@sha256:` digests.'
      }
    ]
  }
];

const EXTRA_DOCKER_K8S_CHAPTERS: Omit<DockerK8sChapterSpec, 'quiz' | 'interviews'>[] = [
  {
    id: 'dk-3',
    chNum: 3,
    title: 'Writing Production Dockerfiles (FROM, WORKDIR, COPY, RUN, CMD vs ENTRYPOINT)',
    description: 'Exec form vs shell form, PID 1 SIGTERM signal handling, layer ordering & non-root USER directives',
    difficulty: 'Beginner',
    sectionGroup: 'Docker Foundations',
    summary: 'Master every Dockerfile instruction and understand why JSON exec form `ENTRYPOINT ["node", "server.js"]` is mandatory so your process runs as PID 1 and receives graceful `SIGTERM` shutdown signals.',
    analogy: 'A Dockerfile is an automated factory assembly blueprint where every instruction stamps a permanent layer onto the product.',
    syntaxRows: [
      { syntax: 'FROM node:22-alpine', description: 'Specify the base OCI image for the build stage', example: 'FROM python:3.12-slim-bookworm' },
      { syntax: 'WORKDIR /app', description: 'Set working directory for subsequent RUN, COPY, and CMD instructions', example: 'WORKDIR /srv/api' },
      { syntax: 'COPY package*.json ./', description: 'Copy dependency manifests first to maximize layer cache hits', example: 'COPY --chown=node:node . .' },
      { syntax: 'ENTRYPOINT ["node", "server.js"]', description: 'Exec-form entrypoint running directly as PID 1 (receives SIGTERM)', example: 'CMD ["--port", "8080"]' }
    ],
    deepExplanation: `### Shell Form vs. Exec Form (The PID 1 Signal Trap)
- **Shell Form (\`CMD node server.js\`)**: Docker wraps your command in \`/bin/sh -c "node server.js"\`. \`/bin/sh\` becomes **PID 1** and does **NOT** forward \`SIGTERM\` to your Node/Python app during \`docker stop\` or Kubernetes pod termination—causing a 10–30 second hang followed by a brutal \`SIGKILL\`!
- **Exec Form (\`ENTRYPOINT ["node", "server.js"]\`)**: Runs \`node\` directly as **PID 1** without a shell wrapper, receiving \`SIGTERM\` immediately for graceful connection draining.`,
    terminalLabCode: `# Build a production OCI image from a Dockerfile
docker build -t codeitout/api:v1.0.0 .
docker images`,
    realWorldCases: [
      {
        company: 'Stripe API Gateway Containers',
        scenario: 'Zero-dropped-request graceful shutdowns during 500+ daily rolling deployments.',
        impactMetric: '0 HTTP 502 errors during pod termination via PID 1 SIGTERM draining',
        architectureNote: 'Uses JSON exec-form ENTRYPOINT with dumb-init/tini so PID 1 reaps zombies and forwards SIGTERM immediately.'
      },
      {
        company: 'Vercel Build Containers',
        scenario: 'Ordering `COPY package.json lockfile` before `COPY src/` across millions of Next.js builds.',
        impactMetric: '82% build-time reduction via deterministic `npm ci` layer cache hits',
        architectureNote: 'Invalidates dependency installation layer only when lockfile SHA changes.'
      },
      {
        company: 'GitHub Actions Container Runners',
        scenario: 'Running containerized workflow actions with strict non-root `USER 1001` isolation.',
        impactMetric: 'Eliminates root-escalation container escape vectors',
        architectureNote: 'Creates a dedicated system user and sets `--chown` during COPY.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-3-ex1',
        title: 'Exercise 1: Build and Tag a Docker Image',
        difficulty: 'Essential',
        scenario: 'Write the Docker CLI command to build an image from the current directory (`.`) and tag it as `api:v1`:',
        codeBefore: '$ ',
        answer: 'docker build -t api:v1 .',
        acceptedAnswers: ['docker build -t api:v1 .', 'docker image build -t api:v1 .'],
        codeAfter: '\n[+] Building 2.1s (10/10) FINISHED => naming to docker.io/library/api:v1',
        hint: 'Use docker build -t <name:tag> .',
        explanation: 'docker build -t api:v1 . sends the build context to BuildKit and tags the resulting image manifest as api:v1.',
        xp: 50
      },
      {
        id: 'dk-3-ex2',
        title: 'Exercise 2: JSON Exec Form for Graceful SIGTERM',
        difficulty: 'Core Practice',
        scenario: 'Complete the Dockerfile instruction in JSON Exec Form so `python` runs directly as PID 1 and receives SIGTERM:',
        codeBefore: '',
        answer: 'ENTRYPOINT ["python", "app.py"]',
        acceptedAnswers: ['ENTRYPOINT ["python", "app.py"]', 'CMD ["python", "app.py"]'],
        codeAfter: '\n# Runs as PID 1 without /bin/sh wrapper',
        hint: 'Use ENTRYPOINT ["python", "app.py"].',
        explanation: 'JSON array Exec Form bypasses /bin/sh -c so the application process is PID 1 and receives SIGTERM directly.',
        xp: 65
      },
      {
        id: 'dk-3-ex3',
        title: 'Exercise 3: Drop Root Privileges Inside Dockerfile',
        difficulty: 'Mastery Challenge',
        scenario: 'Which Dockerfile instruction switches the runtime process from `root` (UID 0) to a non-root user named `appuser`?',
        codeBefore: 'RUN adduser -D appuser\n',
        answer: 'USER appuser',
        acceptedAnswers: ['USER appuser', 'USER 1000'],
        codeAfter: '\nENTRYPOINT ["./server"]',
        hint: 'Use the USER instruction followed by appuser.',
        explanation: 'USER appuser ensures that subsequent RUN, CMD, and ENTRYPOINT instructions execute as an unprivileged user.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-4',
    chNum: 4,
    title: 'Multi-Stage Docker Builds, Distroless Images & BuildKit Cache Mounts',
    description: 'Separating compiler toolchains from runtime images (900MB -> 18MB) and using .dockerignore',
    difficulty: 'Intermediate',
    sectionGroup: 'Docker Foundations',
    summary: 'Multi-stage builds (`FROM golang:1.23 AS builder` -> `FROM gcr.io/distroless/static-debian12`) let you compile code with full SDKs and copy ONLY the compiled binary into a minimal runtime image—shrinking image size by 95% and removing shell/package-manager attack surfaces.',
    analogy: 'Instead of shipping the entire concrete mixer, scaffolding, and construction crew inside a finished car, you build the car in the factory (`AS builder`) and ship only the finished vehicle (`FROM distroless`) to the showroom.',
    syntaxRows: [
      { syntax: 'FROM golang:1.23-alpine AS builder', description: 'Define a named compilation stage in a multi-stage Dockerfile', example: 'FROM node:22-alpine AS build' },
      { syntax: 'COPY --from=builder /app/bin /server', description: 'Copy only compiled artifacts from an earlier build stage', example: 'COPY --from=build /app/dist /usr/share/nginx/html' },
      { syntax: 'FROM gcr.io/distroless/static-debian12', description: 'Google Distroless runtime image containing zero shell or package manager', example: 'FROM scratch' },
      { syntax: 'RUN --mount=type=cache,target=/root/.cache', description: 'BuildKit persistent cache mount across builds without bloating image layers', example: 'RUN --mount=type=cache,target=/go/pkg/mod go build' }
    ],
    deepExplanation: `### Single-Stage vs. Multi-Stage Image Comparison
| Build Strategy | Base Image | Final Image Size | Contains Shell (\`/bin/sh\`) & \`apt\`? | CVE Attack Surface |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Single-Stage** | \`golang:1.23\` / \`node:22\` | **850 MB – 1.1 GB** | Yes (full compilers, curl, bash) | 80+ OS package CVEs |
| **Multi-Stage Alpine** | \`alpine:3.20\` | **18 MB – 45 MB** | Minimal BusyBox shell | 0–2 CVEs |
| **Multi-Stage Distroless** | \`gcr.io/distroless/static\` | **2.4 MB – 12 MB** | **No shell, no package manager** | Near-zero CVEs |`,
    terminalLabCode: `# Multi-stage build with BuildKit
docker build --target production -t codeitout/go-service:distroless .
docker images`,
    realWorldCases: [
      {
        company: 'Google Cloud Run & Distroless Fleet',
        scenario: 'Shipping statically compiled Go and Rust microservices inside 4MB `gcr.io/distroless/static` images.',
        impactMetric: '98% reduction in image pull time and zero RCE shell-injection surface',
        architectureNote: 'Even if an attacker finds an application vulnerability, `/bin/sh`, `curl`, and `apt` do not exist in the container filesystem.'
      },
      {
        company: 'Datadog Agent Container Builds',
        scenario: 'Using BuildKit `--mount=type=cache` and `--mount=type=secret` across multi-architecture CI pipelines.',
        impactMetric: '4.5x faster CI compilation without leaking build tokens into image layers',
        architectureNote: 'Mounts private repo credentials ephemerally during RUN without recording them in `docker history`.'
      },
      {
        company: 'Airbnb Frontend Asset Pipeline',
        scenario: 'Compiling TypeScript/React bundles in a Node builder stage and copying static assets to NGINX-unprivileged.',
        impactMetric: 'Image size reduced from 1.2GB to 24MB across 400+ web services',
        architectureNote: 'Excludes `node_modules`, `.git`, and `.env` via `.dockerignore` before context transfer.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-4-ex1',
        title: 'Exercise 1: Copy Artifact from Named Builder Stage',
        difficulty: 'Essential',
        scenario: 'In a multi-stage Dockerfile, write the `COPY` flag that copies `/out/server` from the previous stage named `builder`:',
        codeBefore: 'FROM gcr.io/distroless/static-debian12\nCOPY ',
        answer: '--from=builder',
        acceptedAnswers: ['--from=builder'],
        codeAfter: ' /out/server /server\nENTRYPOINT ["/server"]',
        hint: 'Use --from=<stage-name>.',
        explanation: 'COPY --from=builder extracts only the compiled artifact from the builder stage, discarding the heavy compiler toolchain.',
        xp: 55
      },
      {
        id: 'dk-4-ex2',
        title: 'Exercise 2: Exclude .git and node_modules from Build Context',
        difficulty: 'Core Practice',
        scenario: 'Which file in the project root prevents Docker from uploading `.git`, `node_modules`, and `.env` into the build context?',
        codeBefore: '# File name: ',
        answer: '.dockerignore',
        acceptedAnswers: ['.dockerignore'],
        codeAfter: '\nnode_modules\n.git\n.env*',
        hint: 'Starts with a dot, analogous to .gitignore.',
        explanation: '.dockerignore filters out large or sensitive local files before the Docker CLI tars and uploads the build context to BuildKit.',
        xp: 60
      },
      {
        id: 'dk-4-ex3',
        title: 'Exercise 3: Name a Compilation Stage in Dockerfile',
        difficulty: 'Mastery Challenge',
        scenario: 'Complete the `FROM` instruction to alias the `rust:1.82-alpine` stage as `builder`:',
        codeBefore: 'FROM rust:1.82-alpine ',
        answer: 'AS builder',
        acceptedAnswers: ['AS builder', 'as builder'],
        codeAfter: '\nWORKDIR /src',
        hint: 'Use the AS keyword followed by builder.',
        explanation: 'FROM <image> AS <name> defines a named build stage that can be referenced by COPY --from=<name> or docker build --target <name>.',
        xp: 70
      }
    ]
  },
  {
    id: 'dk-5',
    chNum: 5,
    title: 'Container Lifecycle, Port Publishing (-p), Env Vars & Live Debugging (exec, logs, inspect)',
    description: 'Mapping host:container ports, injecting secrets safely, streaming logs & opening debug shells',
    difficulty: 'Beginner',
    sectionGroup: 'Docker Operations',
    summary: 'Learn how to expose container network services with `-p hostPort:containerPort`, pass runtime configuration with `--env-file`, inspect live JSON state with `docker inspect`, and troubleshoot running containers with `docker logs -f` and `docker exec -it`.',
    analogy: 'Port publishing (`-p 8080:80`) is like setting up a reception extension number on the main building switchboard (`8080`) that forwards calls directly to an apartment’s internal phone (`80`).',
    syntaxRows: [
      { syntax: 'docker run -d -p 8080:80 nginx', description: 'Map host port 8080 to container port 80 (iptables / nftables DNAT)', example: 'docker run -p 127.0.0.1:5432:5432 postgres:16' },
      { syntax: 'docker exec -it <container> sh', description: 'Spawn an interactive shell inside a running container’s namespaces', example: 'docker exec -it api-worker sh' },
      { syntax: 'docker logs -f --tail 100 <container>', description: 'Stream the last 100 lines of stdout/stderr logs in real time', example: 'docker logs --since 10m api-worker' },
      { syntax: 'docker stop -t 30 <container>', description: 'Send SIGTERM and wait up to 30s before sending SIGKILL', example: 'docker stop api-worker' }
    ],
    deepExplanation: `### How \`EXPOSE\` Differs from \`-p\` (Publish)
- **\`EXPOSE 8080\` in a Dockerfile**: Purely **documentation metadata** between the image author and operator. It does **NOT** open any port on the host machine!
- **\`-p 8080:80\` at runtime**: Configures a host kernel \`iptables\`/\`nftables\` DNAT rule forwarding traffic from host port \`8080\` into the container's virtual Ethernet pair (\`veth\`) on port \`80\`.
- **Security Tip**: Binding \`-p 5432:5432\` binds to \`0.0.0.0:5432\` (accessible externally!). Always bind local dev databases to loopback: **\`-p 127.0.0.1:5432:5432\`**.`,
    terminalLabCode: `# Run container with loopback-bound port and inspect logs
docker run -d --name web- gateway -p 127.0.0.1:8080:80 nginx:1.27-alpine
docker logs --tail 20 web-gateway
docker exec -it web-gateway nginx -v`,
    realWorldCases: [
      {
        company: 'Cloudflare Zero-Trust Local Tunnels',
        scenario: 'Binding internal microservice ports strictly to `127.0.0.1` instead of `0.0.0.0` on multi-interface hosts.',
        impactMetric: 'Prevents accidental public exposure of internal admin/metrics ports bypassing ufw',
        architectureNote: 'Because Docker manipulates iptables PREROUTING chains directly, `-p 8080:80` bypasses standard ufw rules unless bound to `127.0.0.1`.'
      },
      {
        company: 'Datadog Container Log Agent',
        scenario: 'Collecting structured JSON logs written to container `stdout` and `stderr` via the Docker json-file / journald driver.',
        impactMetric: 'Zero disk I/O contention inside application containers',
        architectureNote: 'Enforces `--log-opt max-size=50m --log-opt max-file=3` to prevent runaway stdout logs from filling host disks.'
      },
      {
        company: 'Stripe Devboxes',
        scenario: 'Using `docker exec` for instant interactive test execution inside hot-reloading developer containers.',
        impactMetric: 'Sub-100ms test runner invocation without restarting the container',
        architectureNote: 'Enters existing container namespaces via `setns()` syscall.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-5-ex1',
        title: 'Exercise 1: Map Host Port 8080 to Container Port 3000',
        difficulty: 'Essential',
        scenario: 'Write the `-p` flag to forward traffic from host port `8080` to container port `3000`:',
        codeBefore: '$ docker run -d ',
        answer: '-p 8080:3000',
        acceptedAnswers: ['-p 8080:3000', '--publish 8080:3000'],
        codeAfter: ' node-api:v1',
        hint: 'Syntax is -p <hostPort>:<containerPort>.',
        explanation: '-p 8080:3000 binds port 8080 on the host and forwards incoming TCP packets to port 3000 inside the container network namespace.',
        xp: 50
      },
      {
        id: 'dk-5-ex2',
        title: 'Exercise 2: Open an Interactive Shell Inside a Running Container',
        difficulty: 'Core Practice',
        scenario: 'Write the command to execute an interactive `sh` shell inside a running container named `api`:',
        codeBefore: '$ ',
        answer: 'docker exec -it api sh',
        acceptedAnswers: ['docker exec -it api sh', 'docker exec -ti api sh', 'docker container exec -it api sh'],
        codeAfter: '\n/app # ls -la',
        hint: 'Use docker exec -it <container> sh.',
        explanation: 'docker exec -it attaches an interactive TTY (-i keeps stdin open, -t allocates a pseudo-TTY) inside the running container.',
        xp: 60
      },
      {
        id: 'dk-5-ex3',
        title: 'Exercise 3: Follow Live Container Logs',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the command to stream live log output (`--follow` / `-f`) from container `api`:',
        codeBefore: '$ ',
        answer: 'docker logs -f api',
        acceptedAnswers: ['docker logs -f api', 'docker logs --follow api'],
        codeAfter: '\n2026-11-04T12:00:01Z INFO Listening on :3000',
        hint: 'Combine docker logs with -f and the container name.',
        explanation: 'docker logs -f streams stdout and stderr in real time just like tail -f.',
        xp: 70
      }
    ]
  },
  {
    id: 'dk-6',
    chNum: 6,
    title: 'Docker Volumes, Bind Mounts, tmpfs & Stateful Data Persistence',
    description: 'Persisting PostgreSQL/Redis data outside the ephemeral OverlayFS container layer',
    difficulty: 'Intermediate',
    sectionGroup: 'Docker Operations',
    summary: 'When a container is removed, everything written to its writable OverlayFS `upperdir` is destroyed. Docker Volumes (`-v pgdata:/var/lib/postgresql/data`) bypass OverlayFS completely, storing data directly on the host filesystem with native disk I/O speed and surviving container upgrades.',
    analogy: 'An ephemeral container is a rental car—if you leave your luggage in the trunk when returning it, it’s gone. A Named Volume (`pgdata`) is your personal garage locker that you move from one rental car to the next.',
    syntaxRows: [
      { syntax: 'docker volume create pgdata', description: 'Create a Docker-managed persistent named volume', example: 'docker volume inspect pgdata' },
      { syntax: 'docker run -v pgdata:/var/lib/postgresql/data', description: 'Mount named volume pgdata into the container data directory', example: 'docker run --mount source=pgdata,target=/data' },
      { syntax: 'docker run -v $(pwd)/src:/app/src:ro', description: 'Bind-mount a host directory read-only into the container', example: 'docker run -v ./nginx.conf:/etc/nginx/nginx.conf:ro' },
      { syntax: 'docker run --tmpfs /run:rw,noexec,nosuid,size=64m', description: 'Mount an in-memory RAM filesystem that never touches disk', example: 'docker run --tmpfs /tmp:size=128m app' }
    ],
    deepExplanation: `### Comparing the 3 Docker Mount Types
| Mount Type | Host Storage Location | Survives \`docker rm\`? | Best Production Use Case |
| :--- | :--- | :--- | :--- |
| **Named Volume (\`-v name:/path\`)** | \`/var/lib/docker/volumes/<name>/_data\` | **Yes** | Stateful databases (PostgreSQL, Redis, Prometheus TSDB). |
| **Bind Mount (\`-v /host:/cont:ro\`)** | Any arbitrary host path | **Yes** | Mounting config files (\`nginx.conf\`) or live source code in local dev. |
| **\`tmpfs\` Mount (\`--tmpfs /tmp\`)** | Host RAM only (never written to disk) | **No** | Ephemeral secrets, session tokens, or high-speed scratch buffers. |`,
    terminalLabCode: `# Create a persistent volume and mount it to PostgreSQL 16
docker volume create pgdata-prod
docker run -d --name pg-db -v pgdata-prod:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16-alpine
docker volume ls`,
    realWorldCases: [
      {
        company: 'GitLab Self-Managed Omnibus & Runners',
        scenario: 'Persisting Git repositories and PostgreSQL WAL segments on high-IOPS NVMe named volumes during container upgrades.',
        impactMetric: 'Zero data loss across instant `docker stop && docker rm && docker run` version upgrades',
        architectureNote: 'Bypasses OverlayFS copy_up overhead so PostgreSQL `fsync()` writes directly to ext4/XFS.'
      },
      {
        company: 'HashiCorp Vault Container Agents',
        scenario: 'Mounting decrypted runtime tokens exclusively onto `--tmpfs` in-memory mounts (`noexec,nosuid`).',
        impactMetric: 'Guarantees decrypted secrets are never written to physical disk blocks or swap',
        architectureNote: 'When the container stops, the RAM-backed tmpfs mount evaporates immediately.'
      },
      {
        company: 'Netflix Local Developer Workspaces',
        scenario: 'Using read-only bind mounts (`:ro`) for configuration templates while keeping build caches in named volumes.',
        impactMetric: '5x faster file I/O on macOS/Linux hybrid developer environments',
        architectureNote: 'Avoids VirtioFS host-sync bottlenecks on heavy `node_modules` or `.cargo` directories.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-6-ex1',
        title: 'Exercise 1: Create a Named Docker Volume',
        difficulty: 'Essential',
        scenario: 'Write the command to create a Docker named volume called `pgdata`:',
        codeBefore: '$ ',
        answer: 'docker volume create pgdata',
        acceptedAnswers: ['docker volume create pgdata'],
        codeAfter: '\npgdata',
        hint: 'Use docker volume create <name>.',
        explanation: 'docker volume create pgdata initializes a managed persistent directory under /var/lib/docker/volumes/pgdata/_data.',
        xp: 50
      },
      {
        id: 'dk-6-ex2',
        title: 'Exercise 2: Mount a Volume Read-Only (:ro)',
        difficulty: 'Core Practice',
        scenario: 'Complete the `-v` mount flag so `./nginx.conf` is mounted at `/etc/nginx/nginx.conf` in **read-only** mode:',
        codeBefore: '$ docker run -d -v ./nginx.conf:/etc/nginx/nginx.conf',
        answer: ':ro',
        acceptedAnswers: [':ro'],
        codeAfter: ' nginx:1.27-alpine',
        hint: 'Append :ro to the volume mapping.',
        explanation: 'Appending :ro mounts the file or directory read-only inside the container so a compromised process cannot tamper with config files.',
        xp: 60
      },
      {
        id: 'dk-6-ex3',
        title: 'Exercise 3: Mount an In-Memory tmpfs Directory',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the Docker run flag to mount `/secrets` as an in-memory `tmpfs` filesystem that never writes to disk:',
        codeBefore: '$ docker run -d ',
        answer: '--tmpfs /secrets',
        acceptedAnswers: ['--tmpfs /secrets', '--mount type=tmpfs,destination=/secrets'],
        codeAfter: ' payment-worker:v2',
        hint: 'Use --tmpfs /secrets.',
        explanation: '--tmpfs mounts a volatile RAM-backed filesystem inside the container that disappears the moment the container stops.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-7',
    chNum: 7,
    title: 'Docker Networking: User-Defined Bridge, Host, None & Embedded DNS (127.0.0.11)',
    description: 'How containers discover each other by service name using Docker’s embedded DNS server',
    difficulty: 'Intermediate',
    sectionGroup: 'Docker Operations',
    summary: 'While the default `bridge` network only allows containers to communicate by raw IP address, a **User-Defined Bridge Network** (`docker network create app-net`) activates Docker’s embedded DNS resolver at `127.0.0.11`—allowing containers to connect to `http://redis:6379` or `postgres:5432` by container name!',
    analogy: 'The default bridge is a room of strangers where you must memorize everyone’s 10-digit phone number (IP); a user-defined bridge network gives everyone a company contact directory (Embedded DNS) so you just dial "redis" or "db".',
    syntaxRows: [
      { syntax: 'docker network create app-net', description: 'Create an isolated user-defined bridge network with automatic DNS', example: 'docker network create --driver bridge backend-net' },
      { syntax: 'docker run --network app-net --name redis', description: 'Attach container to app-net and register DNS hostname "redis"', example: 'docker run -d --network app-net --name db postgres:16' },
      { syntax: 'docker run --network host', description: 'Share the host’s network namespace directly (zero NAT overhead)', example: 'docker run --network host prometheus/node-exporter' },
      { syntax: 'docker run --network none', description: 'Completely disable networking (loopback lo only) for untrusted sandboxes', example: 'docker run --rm --network none untrusted-eval' }
    ],
    deepExplanation: `### Docker Network Drivers Compared
| Driver | Network Namespace | Automatic DNS by Container Name? | Primary Production Use Case |
| :--- | :--- | :--- | :--- |
| **Default \`bridge\` (\`docker0\`)** | Isolated \`veth\` pair | **No** (IP only) | Legacy single-container testing (avoid in production). |
| **User-Defined \`bridge\`** | Isolated bridge + \`127.0.0.11\` DNS | **Yes** (\`ping redis\` works!) | Multi-container microservices & Docker Compose stacks. |
| **\`host\`** | Shares host \`net\` namespace | Uses host networking directly | Ultra-low-latency proxies or node hardware exporters. |
| **\`none\`** | Loopback \`127.0.0.1\` only | No external/internal network | Running untrusted code execution sandboxes safely. |`,
    terminalLabCode: `# Create a user-defined bridge network with automatic service DNS
docker network create backend-net
docker run -d --network backend-net --name redis-cache redis:7-alpine
docker network ls`,
    realWorldCases: [
      {
        company: 'Judge0 / LeetCode Code Execution Sandboxes',
        scenario: 'Running untrusted student submissions with `--network none` so user code cannot make outbound HTTP calls or scan internal VPCs.',
        impactMetric: '100% network air-gap isolation at kernel namespace creation time',
        architectureNote: 'The container net namespace contains only the loopback interface `lo`; zero NICs or routes exist.'
      },
      {
        company: 'Cloudflare High-Throughput Ingress Agents',
        scenario: 'Running edge telemetry daemons with `--network host` to avoid Linux bridge NAT (`conntrack`) table exhaustion at 500k pps.',
        impactMetric: '18% lower softirq CPU usage by bypassing veth + iptables NAT translation',
        architectureNote: 'Binds directly to host network interfaces while keeping filesystem and cgroups isolated.'
      },
      {
        company: 'Stripe Local Microservice Topology',
        scenario: 'Segregating `frontend-net` and `payments-db-net` user-defined bridge networks so web containers cannot reach the database directly.',
        impactMetric: 'Enforces zero-trust network segmentation in both local Compose and CI',
        architectureNote: 'Only the API tier attaches to both networks; the frontend tier can only resolve the API tier via `127.0.0.11` DNS.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-7-ex1',
        title: 'Exercise 1: Create a User-Defined Bridge Network',
        difficulty: 'Essential',
        scenario: 'Write the command to create a user-defined Docker network named `app-net` with automatic DNS service discovery:',
        codeBefore: '$ ',
        answer: 'docker network create app-net',
        acceptedAnswers: ['docker network create app-net', 'docker network create -d bridge app-net'],
        codeAfter: '\n9f8e7d6c5b4a3210...',
        hint: 'Use docker network create <name>.',
        explanation: 'User-defined bridge networks enable Docker’s embedded DNS server (127.0.0.11) so containers resolve each other by name.',
        xp: 50
      },
      {
        id: 'dk-7-ex2',
        title: 'Exercise 2: Air-Gap an Untrusted Container with Zero Network',
        difficulty: 'Core Practice',
        scenario: 'Write the flag to launch a container with all external and internal network interfaces disabled (loopback only):',
        codeBefore: '$ docker run --rm ',
        answer: '--network none',
        acceptedAnswers: ['--network none', '--network=none', '--net none', '--net=none'],
        codeAfter: ' sandbox-runner python3 untrusted.py',
        hint: 'Set --network to none.',
        explanation: '--network none creates a network namespace with only the loopback interface, preventing any outbound or lateral network traffic.',
        xp: 65
      },
      {
        id: 'dk-7-ex3',
        title: 'Exercise 3: Attach a Container to a Custom Network',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the flag to attach a new container to the `app-net` network so it can resolve `redis` by hostname:',
        codeBefore: '$ docker run -d --name api ',
        answer: '--network app-net',
        acceptedAnswers: ['--network app-net', '--network=app-net', '--net app-net'],
        codeAfter: ' codeitout/api:v1',
        hint: 'Use --network app-net.',
        explanation: '--network app-net connects the container veth interface to app-net and registers its container name in the 127.0.0.11 DNS resolver.',
        xp: 70
      }
    ]
  },
  {
    id: 'dk-8',
    chNum: 8,
    title: 'Docker Compose (compose.yaml): Multi-Container Stacks, Healthchecks & depends_on',
    description: 'Orchestrating API + PostgreSQL + Redis stacks with condition: service_healthy readiness gates',
    difficulty: 'Intermediate',
    sectionGroup: 'Docker Operations',
    summary: 'A naive `depends_on: [db]` only waits for the PostgreSQL container process to start—NOT for the database engine to finish initializing and accept TCP connections! Production `compose.yaml` files pair `healthcheck` (`pg_isready`) with `depends_on: db: condition: service_healthy`.',
    analogy: 'Starting a restaurant kitchen (`depends_on` without healthcheck) just unlocks the back door; `condition: service_healthy` waits until the ovens are preheated to 450°F before seating the first customer.',
    syntaxRows: [
      { syntax: 'docker compose up -d --build', description: 'Build images and start all services in compose.yaml in the background', example: 'docker compose up -d' },
      { syntax: 'condition: service_healthy', description: 'Wait until dependency passes its healthcheck before starting dependent service', example: 'depends_on:\n  db:\n    condition: service_healthy' },
      { syntax: 'docker compose down -v', description: 'Stop and remove containers, networks, AND named volumes', example: 'docker compose down' },
      { syntax: 'docker compose logs -f api', description: 'Stream logs for a specific service in the Compose stack', example: 'docker compose ps' }
    ],
    deepExplanation: `### Production \`compose.yaml\` with Readiness Healthchecks
\`\`\`yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
  api:
    build: .
    ports:
      - "127.0.0.1:8080:8080"
    depends_on:
      db:
        condition: service_healthy
volumes:
  pgdata:
\`\`\``,
    terminalLabCode: `# Build and launch multi-container stack with Docker Compose
docker compose up -d --build
docker compose ps
docker compose logs --tail 20 api`,
    realWorldCases: [
      {
        company: 'Uber & Lyft Ephemeral PR Environments',
        scenario: 'Spinning up full-stack integration test topologies (API + Postgres + Redis + Kafka) on every GitHub Pull Request.',
        impactMetric: 'Zero flaky ECONNREFUSED startup race conditions via `condition: service_healthy`',
        architectureNote: 'Uses `pg_isready` and `redis-cli ping` healthchecks before running database migrations and E2E tests.'
      },
      {
        company: 'Supabase Local Development CLI',
        scenario: 'Orchestrating 10+ local services (Postgres, Kong, GoTrue Auth, Realtime, Storage) via a single Compose specification.',
        impactMetric: '1-command local cloud parity (`supabase start`) across 100,000+ developers',
        architectureNote: 'Uses Compose profiles to toggle optional observability and vector services on demand.'
      },
      {
        company: 'Shopify CI Test Harnesses',
        scenario: 'Tearing down isolated test databases cleanly between CI runs using `docker compose down -v --remove-orphans`.',
        impactMetric: '100% clean state isolation between parallel test suites',
        architectureNote: 'Removes anonymous and named volumes with `-v` so test fixtures never bleed across runs.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-8-ex1',
        title: 'Exercise 1: Start Compose Stack in Background with Rebuild',
        difficulty: 'Essential',
        scenario: 'Write the Docker Compose V2 command to rebuild modified images and launch the stack in detached mode:',
        codeBefore: '$ ',
        answer: 'docker compose up -d --build',
        acceptedAnswers: ['docker compose up -d --build', 'docker compose up --build -d'],
        codeAfter: '\n✔ Container app-db-1   Healthy\n✔ Container app-api-1  Started',
        hint: 'Combine docker compose up with -d and --build.',
        explanation: 'docker compose up -d --build rebuilds any changed service Dockerfiles before starting the stack in the background.',
        xp: 50
      },
      {
        id: 'dk-8-ex2',
        title: 'Exercise 2: Wait for Database Healthcheck Before Starting API',
        difficulty: 'Core Practice',
        scenario: 'Complete the `depends_on` condition in `compose.yaml` so `api` waits until `db` passes its `healthcheck`:',
        codeBefore: 'depends_on:\n  db:\n    condition: ',
        answer: 'service_healthy',
        acceptedAnswers: ['service_healthy'],
        codeAfter: '\n# Prevents ECONNREFUSED race conditions on boot',
        hint: 'Write service_healthy.',
        explanation: 'condition: service_healthy blocks dependent container startup until the target container’s healthcheck command exits with status 0.',
        xp: 65
      },
      {
        id: 'dk-8-ex3',
        title: 'Exercise 3: Tear Down Compose Stack AND Delete Volumes',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the command to stop and remove all Compose containers, networks, AND their attached volumes:',
        codeBefore: '$ ',
        answer: 'docker compose down -v',
        acceptedAnswers: ['docker compose down -v', 'docker compose down --volumes'],
        codeAfter: '\n✔ Volume app_pgdata  Removed',
        hint: 'Pass -v (or --volumes) to docker compose down.',
        explanation: 'By default docker compose down preserves volumes to protect database data; adding -v explicitly wipes volumes for a clean reset.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-9',
    chNum: 9,
    title: 'Container Security: Rootless Containers, Linux Capabilities (cap_drop), Seccomp & Trivy',
    description: 'Hardening containers with --read-only rootfs, --cap-drop=ALL, no-new-privileges & CVE scanning',
    difficulty: 'Advanced',
    sectionGroup: 'Docker Security & Registry',
    summary: 'Defense-in-depth container security requires 4 layers: (1) non-root UID, (2) dropping Linux kernel capabilities (`--cap-drop=ALL`), (3) mounting the root filesystem `--read-only`, and (4) scanning OCI layers for CVEs with Trivy before pushing to production.',
    analogy: 'Giving a container full root privileges is like handing a hotel guest the master key to the boiler room, roof, and security vault (`CAP_SYS_ADMIN`). `--cap-drop=ALL` gives them a keycard that only opens their own room.',
    syntaxRows: [
      { syntax: 'docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE', description: 'Drop all Linux kernel root capabilities except binding low ports', example: 'docker run --cap-drop=ALL app' },
      { syntax: 'docker run --read-only --tmpfs /tmp', description: 'Mount container root filesystem read-only to prevent binary tampering', example: 'docker run --read-only -v /tmp app' },
      { syntax: 'docker run --security-opt=no-new-privileges:true', description: 'Block setuid/setgid privilege escalation inside the container', example: '--security-opt seccomp=profile.json' },
      { syntax: 'trivy image --severity HIGH,CRITICAL <image>', description: 'Scan container OS packages and language lockfiles for CVEs', example: 'trivy image --exit-code 1 api:v1' }
    ],
    deepExplanation: `### The 4-Layer Container Hardening Checklist
1. **Non-Root User (\`USER 65532:65532\`)**: Never run application processes as UID 0.
2. **Drop Kernel Capabilities (\`--cap-drop=ALL\`)**: Even if UID 0 is reached, dropping \`CAP_SYS_ADMIN\`, \`CAP_NET_RAW\`, and \`CAP_SYS_PTRACE\` blocks kernel module loading and raw packet spoofing.
3. **Immutable Root Filesystem (\`--read-only\`)**: Prevents attackers from downloading or writing malware/cryptominers to \`/usr/bin\` or \`/app\`.
4. **Prevent Setuid Escalation (\`no-new-privileges:true\`)**: Blocks child processes from gaining more privileges than their parent via \`setuid\` binaries.`,
    terminalLabCode: `# Run a hardened container and scan its image with Trivy
docker run -d --name hardened-api --read-only --tmpfs /tmp --cap-drop=ALL --security-opt=no-new-privileges:true nginx:1.27-alpine
trivy image --severity HIGH,CRITICAL nginx:1.27-alpine`,
    realWorldCases: [
      {
        company: 'Google GKE Autopilot & Borg Security',
        scenario: 'Enforcing `allowPrivilegeEscalation: false` and `capabilities.drop: ["ALL"]` across multi-tenant production clusters.',
        impactMetric: 'Blocks 99% of known Linux kernel container-escape CVEs (e.g., DirtyPipe / runc escapes)',
        architectureNote: 'Combines default seccomp syscall filtering (blocking ~44 dangerous syscalls like `kexec_load` and `mount`) with dropped capabilities.'
      },
      {
        company: 'Stripe PCI-DSS Payment Enclaves',
        scenario: 'Running payment tokenization containers with `--read-only` root filesystems and memory-only `/tmp` scratch space.',
        impactMetric: 'Zero persistent filesystem modification possible after container boot',
        architectureNote: 'Any attempt to write to `/` returns `EROFS (Read-only file system)` at the VFS kernel layer.'
      },
      {
        company: 'GitHub Dependabot & Trivy CI Gates',
        scenario: 'Blocking container registry pushes in CI when `trivy image --exit-code 1 --severity CRITICAL` detects unpatched OS or npm/pip libraries.',
        impactMetric: 'Zero known critical CVEs promoted to production registries',
        architectureNote: 'Scans both Debian/Alpine APK/DPKG databases and language lockfiles (`package-lock.json`, `Cargo.lock`).'
      }
    ],
    mustSolve: [
      {
        id: 'dk-9-ex1',
        title: 'Exercise 1: Drop All Linux Kernel Capabilities',
        difficulty: 'Essential',
        scenario: 'Write the Docker run flag that drops ALL Linux kernel capabilities from the container process:',
        codeBefore: '$ docker run -d ',
        answer: '--cap-drop=ALL',
        acceptedAnswers: ['--cap-drop=ALL', '--cap-drop ALL'],
        codeAfter: ' --read-only api:v1',
        hint: 'Use --cap-drop=ALL.',
        explanation: '--cap-drop=ALL strips all bounding Linux capabilities (CAP_NET_RAW, CAP_SYS_CHROOT, etc.) for least-privilege execution.',
        xp: 55
      },
      {
        id: 'dk-9-ex2',
        title: 'Exercise 2: Mount Root Filesystem Read-Only',
        difficulty: 'Core Practice',
        scenario: 'Write the Docker run flag that makes the container’s entire root filesystem (`/`) immutable and read-only:',
        codeBefore: '$ docker run -d ',
        answer: '--read-only',
        acceptedAnswers: ['--read-only'],
        codeAfter: ' --tmpfs /tmp api:v1',
        hint: 'Use --read-only.',
        explanation: '--read-only mounts the container rootfs as read-only so an attacker cannot modify application code or install binaries.',
        xp: 65
      },
      {
        id: 'dk-9-ex3',
        title: 'Exercise 3: Scan Container Image for Critical CVEs with Trivy',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the command to scan the container image `api:v1` using `trivy`:',
        codeBefore: '$ ',
        answer: 'trivy image api:v1',
        acceptedAnswers: ['trivy image api:v1'],
        codeAfter: '\nTotal: 0 (HIGH: 0, CRITICAL: 0)',
        hint: 'Use trivy image <image-name>.',
        explanation: 'trivy image api:v1 inspects all OS layers and application dependencies inside the image for known vulnerabilities.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-10',
    chNum: 10,
    title: 'Container Registries (GHCR, ECR), Multi-Arch buildx, Cosign Signing & SBOMs',
    description: 'Building linux/amd64 + linux/arm64 images, cryptographic signing with Sigstore Cosign & SPDX SBOMs',
    difficulty: 'Advanced',
    sectionGroup: 'Docker Security & Registry',
    summary: 'Modern cloud fleets mix x86_64 (`linux/amd64`) and AWS Graviton / Apple Silicon (`linux/arm64`) nodes. `docker buildx build --platform linux/amd64,linux/arm64` publishes a multi-arch OCI Image Index, while Sigstore `cosign sign` attaches a cryptographic signature verifying provenance.',
    analogy: 'An SBOM (Software Bill of Materials) is the FDA nutritional ingredients label on a food package; `cosign sign` is the tamper-evident holographic seal proving it came from your verified kitchen.',
    syntaxRows: [
      { syntax: 'docker buildx build --platform linux/amd64,linux/arm64 -t org/app:v1 --push .', description: 'Build and push a multi-architecture OCI image index', example: 'docker buildx imagetools inspect org/app:v1' },
      { syntax: 'cosign sign ghcr.io/org/app@sha256:...', description: 'Cryptographically sign an immutable image digest using Sigstore OIDC', example: 'cosign verify ghcr.io/org/app@sha256:...' },
      { syntax: 'docker buildx build --sbom=true --provenance=true', description: 'Attach SPDX Software Bill of Materials and SLSA provenance attestation', example: 'syft ghcr.io/org/app:v1 -o spdx-json' },
      { syntax: 'docker login ghcr.io', description: 'Authenticate to GitHub Container Registry or AWS ECR', example: 'docker push ghcr.io/org/app:v1' }
    ],
    deepExplanation: `### Multi-Architecture OCI Image Index Flow
1. Developer or CI runs \`docker buildx build --platform linux/amd64,linux/arm64 --push\`.
2. BuildKit compiles both architectures in parallel and pushes an **OCI Image Index** pointing to both platform manifests.
3. Whether a Kubernetes node is an Intel Xeon (\`amd64\`) or AWS Graviton4 (\`arm64\`), \`containerd\` automatically pulls the matching binary layer!`,
    terminalLabCode: `# Build multi-arch image and sign digest with Sigstore Cosign
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/codeitout/api:v1.2.0 --push .
cosign sign ghcr.io/codeitout/api@sha256:a4f91bc8e0123456789abcdef0123456789abcde`,
    realWorldCases: [
      {
        company: 'AWS Graviton & Datadog Multi-Arch Fleet',
        scenario: 'Publishing unified `linux/amd64,linux/arm64` manifests so Kubernetes clusters can seamlessly mix x86 and ARM64 spot nodes.',
        impactMetric: '35% cloud compute cost savings on ARM64 Graviton without changing Kubernetes YAML tags',
        architectureNote: 'Kubelet resolves the platform-specific SHA-256 manifest from the OCI Image Index automatically.'
      },
      {
        company: 'Chainguard & Kubernetes Release Engineering',
        scenario: 'Signing every official Kubernetes and Wolfi container image with Sigstore Keyless Cosign and SLSA Level 3 provenance.',
        impactMetric: 'Cryptographic admission verification via Kyverno/Policy-Controller before any pod starts',
        architectureNote: 'Rejects any unsigned or tampered container image at the Kubernetes ValidatingAdmissionWebhook layer.'
      },
      {
        company: 'Citigroup & Regulated FinTech Supply Chains',
        scenario: 'Generating SPDX/CycloneDX SBOMs (`syft` / `--sbom=true`) on every container build for instant zero-day vulnerability queries.',
        impactMetric: 'Identifies affected services across 5,000 images in < 10 seconds when a new CVE drops',
        architectureNote: 'Indexes SBOM attestations so security teams query package versions without re-scanning tarballs.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-10-ex1',
        title: 'Exercise 1: Multi-Architecture Buildx Flag',
        difficulty: 'Essential',
        scenario: 'Write the `docker buildx build` flag to compile for both `linux/amd64` and `linux/arm64`:',
        codeBefore: '$ docker buildx build ',
        answer: '--platform linux/amd64,linux/arm64',
        acceptedAnswers: ['--platform linux/amd64,linux/arm64', '--platform=linux/amd64,linux/arm64'],
        codeAfter: ' -t ghcr.io/org/api:v1 --push .',
        hint: 'Use --platform linux/amd64,linux/arm64.',
        explanation: '--platform linux/amd64,linux/arm64 instructs Buildx to build both architectures and publish a unified OCI Image Index.',
        xp: 55
      },
      {
        id: 'dk-10-ex2',
        title: 'Exercise 2: Sign Container Digest with Sigstore Cosign',
        difficulty: 'Core Practice',
        scenario: 'Write the Sigstore CLI command to cryptographically sign `ghcr.io/org/api@sha256:a4f9`:',
        codeBefore: '$ ',
        answer: 'cosign sign ghcr.io/org/api@sha256:a4f9',
        acceptedAnswers: ['cosign sign ghcr.io/org/api@sha256:a4f9'],
        codeAfter: '\nPushing signature to: ghcr.io/org/api',
        hint: 'Use cosign sign <image-digest>.',
        explanation: 'cosign sign generates a cryptographic signature and stores it alongside the OCI image in the registry.',
        xp: 65
      },
      {
        id: 'dk-10-ex3',
        title: 'Exercise 3: Attach SBOM Attestation During Build',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the Buildx flag to automatically generate and attach a Software Bill of Materials (SBOM) to the image:',
        codeBefore: '$ docker buildx build ',
        answer: '--sbom=true',
        acceptedAnswers: ['--sbom=true'],
        codeAfter: ' -t ghcr.io/org/api:v1 --push .',
        hint: 'Use --sbom=true.',
        explanation: '--sbom=true runs the BuildKit SPDX scanner and attaches a complete dependency inventory attestation to the image manifest.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-11',
    chNum: 11,
    title: 'Kubernetes HOME: Control Plane (apiserver, etcd, scheduler, controller-manager) & Node Internals',
    description: 'How Kubernetes reconciles Desired State vs Actual State across distributed worker nodes',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Core Architecture',
    summary: 'Kubernetes is a declarative, level-triggered control loop system. Every component communicates exclusively through `kube-apiserver`, which persists cluster state in `etcd` (a Raft-consensus key-value store), while `kube-scheduler`, `kube-controller-manager`, and node `kubelet` agents continuously drive Actual State toward Desired State.',
    analogy: 'Think of Kubernetes like a smart thermostat (`controller-manager`): you set the desired temperature to 72°F (`kubectl apply`), `etcd` remembers that setting, and the furnace (`kubelet` + `containerd`) automatically turns on or off whenever a window opens (a node crashes).',
    syntaxRows: [
      { syntax: 'kubectl cluster-info', description: 'Verify connectivity to the Kubernetes Control Plane API Server', example: 'kubectl get nodes -o wide' },
      { syntax: 'kubectl apply -f manifest.yaml', description: 'Declaratively submit or update Desired State in kube-apiserver / etcd', example: 'kubectl apply -f k8s/' },
      { syntax: 'kubectl get componentstatuses / get pods -n kube-system', description: 'Inspect Control Plane system pods (apiserver, etcd, scheduler, coredns)', example: 'kubectl get pods -n kube-system' },
      { syntax: 'kubectl api-resources', description: 'List all supported Kubernetes API resource kinds and versions', example: 'kubectl explain pod.spec' }
    ],
    deepExplanation: `### Complete Architecture of a Kubernetes Cluster
\`\`\`text
+-------------------------------------------------------------------------+
|                        KUBERNETES CONTROL PLANE                         |
|  [ kubectl ] ---> [ kube-apiserver ] <===> [ etcd (Raft Key-Value DB) ] |
|                        ^        ^                                       |
|                        |        +---> [ kube-scheduler ] (Assigns Node) |
|                        +------------> [ kube-controller-manager ]       |
+------------------------|------------------------------------------------+
                         | HTTPS Watch Stream
+------------------------v------------------------------------------------+
|                        WORKER NODE (Data Plane)                         |
|  [ kubelet ] ---> (CRI gRPC) ---> [ containerd ] ---> [ Pods / runc ]   |
|  [ kube-proxy / Cilium eBPF ] (Service Virtual IP & Load Balancing)     |
+-------------------------------------------------------------------------+
\`\`\`
- **Critical Rule**: **ONLY \`kube-apiserver\` ever talks directly to \`etcd\`**. Every other component (\`kubelet\`, \`scheduler\`, \`controllers\`) watches \`kube-apiserver\` via HTTP/2 watch streams!`,
    terminalLabCode: `# Inspect Kubernetes Control Plane & Worker Nodes
kubectl get nodes -o wide
kubectl get pods -n kube-system`,
    realWorldCases: [
      {
        company: 'OpenAI 7,500-Node Kubernetes Clusters',
        scenario: 'Scaling single Kubernetes clusters to 7,500+ GPU nodes for distributed LLM training and inference.',
        impactMetric: 'Sub-50ms kube-apiserver watch latency by isolating etcd onto dedicated NVMe disks',
        architectureNote: 'Uses dedicated etcd clusters for high-churn events so apiserver quorum never stalls under heavy pod scheduling.'
      },
      {
        company: 'Spotify Migration from Helios to GKE Kubernetes',
        scenario: 'Consolidating thousands of stateless and stateful microservices onto declarative Kubernetes control loops.',
        impactMetric: 'Auto-heals failed node workloads in < 15 seconds without human pager intervention',
        architectureNote: 'Relies on ReplicaSet and NodeLifecycle controllers continuously reconciling desired pod counts.'
      },
      {
        company: 'CERN Computing Grid on Kubernetes',
        scenario: 'Scheduling millions of physics analysis containers across heterogeneous bare-metal and cloud nodes.',
        impactMetric: '99.95% control-plane uptime via 3-node and 5-node Raft etcd quorums',
        architectureNote: 'Survives up to (N-1)/2 simultaneous control-plane node failures via Raft consensus.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-11-ex1',
        title: 'Exercise 1: List All Worker Nodes with IP & OS Details',
        difficulty: 'Essential',
        scenario: 'Write the `kubectl` command to list all cluster nodes with extended details (`-o wide` showing Internal-IP, OS, and container runtime):',
        codeBefore: '$ ',
        answer: 'kubectl get nodes -o wide',
        acceptedAnswers: ['kubectl get nodes -o wide', 'kubectl get node -o wide'],
        codeAfter: '\nNAME           STATUS   ROLES           VERSION   INTERNAL-IP   CONTAINER-RUNTIME\nk8s-worker-1   Ready    <none>          v1.31.0   10.0.1.14     containerd://1.7.22',
        hint: 'Use kubectl get nodes -o wide.',
        explanation: 'kubectl get nodes -o wide queries kube-apiserver for Node objects and displays their readiness status, IP, kernel, and CRI runtime.',
        xp: 50
      },
      {
        id: 'dk-11-ex2',
        title: 'Exercise 2: Declaratively Apply a Kubernetes Manifest',
        difficulty: 'Core Practice',
        scenario: 'Write the command to declaratively apply the desired state defined in `deployment.yaml`:',
        codeBefore: '$ ',
        answer: 'kubectl apply -f deployment.yaml',
        acceptedAnswers: ['kubectl apply -f deployment.yaml'],
        codeAfter: '\ndeployment.apps/payment-api configured',
        hint: 'Use kubectl apply -f <filename>.',
        explanation: 'kubectl apply -f computes a 3-way strategic merge patch against the live object in etcd for idempotent updates.',
        xp: 60
      },
      {
        id: 'dk-11-ex3',
        title: 'Exercise 3: Identify the Control Plane Consensus Datastore',
        difficulty: 'Mastery Challenge',
        scenario: 'Which distributed Raft-consensus key-value store persists all Kubernetes cluster state and is accessed exclusively by `kube-apiserver`?',
        codeBefore: '# Kubernetes Control Plane state store: ',
        answer: 'etcd',
        acceptedAnswers: ['etcd'],
        codeAfter: ' # Requires odd-numbered quorum (3 or 5 nodes)',
        hint: 'A 4-letter distributed key-value store starting with etc...',
        explanation: 'etcd is the consistent, Raft-backed key-value store that holds every Kubernetes object (Pods, Secrets, ConfigMaps, Deployments).',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-12',
    chNum: 12,
    title: 'Kubernetes Pods, Multi-Container Patterns (Sidecar, Init, Ambassador) & kubectl Debugging',
    description: 'Shared network/IPC pod sandboxes, InitContainers for pre-flight checks & Sidecar log/mesh proxies',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Core Architecture',
    summary: 'A **Pod** is the smallest deployable unit in Kubernetes—a group of one or more containers that share the exact same Linux Network Namespace (same IP address and `localhost` ports) and can share Volume mounts.',
    analogy: 'If containers are individual workers, a Pod is a shared office cubicle: the main engineer (App Container) and their assistant (Sidecar Proxy) sit at the same desk, share the same telephone extension (`localhost`), and pass files through a shared desktop tray (`emptyDir` volume).',
    syntaxRows: [
      { syntax: 'kubectl get pods -n prod', description: 'List all Pods in the prod namespace', example: 'kubectl get pods -A' },
      { syntax: 'kubectl describe pod <pod-name>', description: 'Inspect Pod spec, container states, IP, and scheduling/probe Events', example: 'kubectl describe pod api-7d9f-x82k' },
      { syntax: 'kubectl logs <pod> -c <container> --previous', description: 'View logs of a specific container (or its crashed previous instance)', example: 'kubectl logs api-pod -c envoy-sidecar' },
      { syntax: 'initContainers:', description: 'Containers that run to completion in sequence BEFORE app containers start', example: 'kubectl exec -it <pod> -c app -- sh' }
    ],
    deepExplanation: `### The 3 Multi-Container Pod Patterns
1. **Init Container**: Runs sequentially to completion *before* main containers start (e.g., waiting for database schema migration or fetching TLS certs into an \`emptyDir\` volume).
2. **Sidecar Container**: Runs alongside the main app container (e.g., Envoy service-mesh proxy for mTLS, or FluentBit log shipper reading shared \`emptyDir\` logs). In Kubernetes 1.29+, native sidecars use \`initContainers\` with \`restartPolicy: Always\`.
3. **Ambassador / Adapter Container**: Proxies outbound traffic to external clusters or transforms application metrics into Prometheus format on \`localhost\`.`,
    terminalLabCode: `# Inspect pods, events, and multi-container logs
kubectl get pods -o wide
kubectl describe pod payment-api-7c8b9d-x2k9p
kubectl logs payment-api-7c8b9d-x2k9p -c app --previous`,
    realWorldCases: [
      {
        company: 'Istio / Linkerd Service Mesh Sidecars at Lyft',
        scenario: 'Injecting an Envoy proxy sidecar container into every microservice Pod to handle mTLS encryption, retries, and distributed tracing.',
        impactMetric: '100% zero-trust mTLS encryption across 1,500+ services with zero application code changes',
        architectureNote: 'Because both containers share the Pod network namespace, the app talks to `localhost` while Envoy intercepts traffic via iptables/eBPF.'
      },
      {
        company: 'Airbnb Database Migration InitContainers',
        scenario: 'Running schema verification and secret hydration inside `initContainers` before the main Rails/Java container boots.',
        impactMetric: 'Eliminates startup crashes caused by unmigrated tables or missing KMS credentials',
        architectureNote: 'If an InitContainer exits non-zero, kubelet prevents the main application container from starting.'
      },
      {
        company: 'Datadog CrashLoopBackOff Diagnostics',
        scenario: 'Fetching the stack trace of a crashed container that already restarted using `kubectl logs <pod> --previous`.',
        impactMetric: 'Reduces MTTR on startup panics from 25 minutes to < 60 seconds',
        architectureNote: 'Kubelet retains the stdout/stderr log file of the immediately preceding terminated container instance.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-12-ex1',
        title: 'Exercise 1: Inspect Pod Events & Failure Reasons',
        difficulty: 'Essential',
        scenario: 'When a Pod is stuck in `Pending` or `ImagePullBackOff`, which `kubectl` command shows the detailed Pod spec and bottom `Events` timeline?',
        codeBefore: '$ ',
        answer: 'kubectl describe pod api-pod',
        acceptedAnswers: ['kubectl describe pod api-pod', 'kubectl describe pods api-pod'],
        codeAfter: '\nEvents:\n  Warning  Failed   Failed to pull image "api:v99": not found',
        hint: 'Use kubectl describe pod <pod-name>.',
        explanation: 'kubectl describe pod aggregates both the Pod status fields and the Event objects emitted by the scheduler and kubelet.',
        xp: 50
      },
      {
        id: 'dk-12-ex2',
        title: 'Exercise 2: Fetch Logs of a Crashed Previous Container',
        difficulty: 'Core Practice',
        scenario: 'Your Pod restarted due to a panic (`CrashLoopBackOff`). Write the flag for `kubectl logs api-pod` to view the logs of the **previous** crashed instance:',
        codeBefore: '$ kubectl logs api-pod ',
        answer: '--previous',
        acceptedAnswers: ['--previous', '-p'],
        codeAfter: '\npanic: runtime error: nil pointer dereference',
        hint: 'Use --previous (or -p).',
        explanation: 'kubectl logs <pod> --previous retrieves the stdout/stderr of the terminated container instance before kubelet restarted it.',
        xp: 65
      },
      {
        id: 'dk-12-ex3',
        title: 'Exercise 3: Shared Pod Storage Volume Between App & Sidecar',
        difficulty: 'Mastery Challenge',
        scenario: 'Which built-in Kubernetes volume type creates an ephemeral directory shared between all containers inside a Pod for the life of that Pod?',
        codeBefore: 'volumes:\n  - name: shared-logs\n    ',
        answer: 'emptyDir: {}',
        acceptedAnswers: ['emptyDir: {}', 'emptyDir'],
        codeAfter: '\n# Shared between main app and log-shipper sidecar',
        hint: 'Starts with empty... followed by Dir.',
        explanation: 'An emptyDir volume is created when a Pod is assigned to a Node and allows containers in the same Pod to read and write shared files.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-13',
    chNum: 13,
    title: 'Deployments, ReplicaSets, Rolling Updates (maxSurge / maxUnavailable) & Instant Rollbacks',
    description: 'Zero-downtime rolling deployments, revision history & kubectl rollout undo',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Workloads',
    summary: 'Never deploy naked Pods in production! A **Deployment** manages **ReplicaSets** to maintain a desired replica count and orchestrates zero-downtime **RollingUpdate** transitions by scaling up a new ReplicaSet (`maxSurge`) while gracefully draining the old ReplicaSet (`maxUnavailable`).',
    analogy: 'Replacing the tires on a moving highway convoy: `RollingUpdate` adds one fresh truck (`maxSurge: 1`) and waits until it’s cruising at full speed (`ReadinessProbe`) before pulling one old truck off the road.',
    syntaxRows: [
      { syntax: 'kubectl rollout status deployment/api', description: 'Watch a live RollingUpdate progress until all new replicas are Ready', example: 'kubectl rollout history deployment/api' },
      { syntax: 'kubectl rollout undo deployment/api', description: 'Immediately roll back a broken deployment to the previous working ReplicaSet', example: 'kubectl rollout undo deployment/api --to-revision=2' },
      { syntax: 'kubectl scale deployment/api --replicas=10', description: 'Horizontally scale the number of Pod replicas in a Deployment', example: 'kubectl set image deployment/api app=api:v2' },
      { syntax: 'maxSurge: 25% / maxUnavailable: 0', description: 'Ensure 100% capacity is maintained during zero-downtime rolling updates', example: 'strategy:\n  type: RollingUpdate' }
    ],
    deepExplanation: `### How Deployment -> ReplicaSet Rolling Updates Work
1. **Deployment \`v1\`**: Owns \`ReplicaSet-v1\` with **4 Ready Pods**.
2. **Update Image to \`v2\`**: Deployment creates \`ReplicaSet-v2\`.
3. **With \`maxSurge: 1, maxUnavailable: 0\`**:
   - Scales \`ReplicaSet-v2\` up to **1 Pod** (total = 5 Pods).
   - Waits until the new \`v2\` Pod passes its **Readiness Probe**.
   - Only *then* terminates 1 Pod in \`ReplicaSet-v1\` (total = 4 Ready Pods at all times!).
4. **Instant Rollback**: \`ReplicaSet-v1\` is kept at \`0 replicas\` in revision history (\`revisionHistoryLimit: 10\`), so \`kubectl rollout undo\` scales \`v1\` back up in seconds!`,
    terminalLabCode: `# Monitor rolling update and perform instant rollback
kubectl rollout status deployment/payment-api
kubectl rollout undo deployment/payment-api`,
    realWorldCases: [
      {
        company: 'Stripe Zero-Downtime Payment Deploys',
        scenario: 'Enforcing `maxUnavailable: 0` and `maxSurge: 25%` across all stateless payment API Deployments.',
        impactMetric: '100% serving capacity preserved throughout 1,000+ daily production deployments',
        architectureNote: 'Never terminates an old Pod until its replacement Pod in the new ReplicaSet is 100% Ready.'
      },
      {
        company: 'GitHub Kubernetes Rollback Automation',
        scenario: 'Automatically triggering `kubectl rollout undo deployment/<svc>` when P99 HTTP 5xx error rates breach 0.5% within 3 minutes of deploy.',
        impactMetric: 'Restores previous known-good ReplicaSet in < 8 seconds',
        architectureNote: 'Avoids waiting 10 minutes for a CI rebuild by scaling the retained previous ReplicaSet directly.'
      },
      {
        company: 'Pinterest Stateless Web Tier',
        scenario: 'Combining `preStop: sleep 5` lifecycle hooks with RollingUpdate so kube-proxy/Ingress endpoints finish draining before SIGTERM.',
        impactMetric: 'Eliminates transient 502 Bad Gateway race conditions during pod termination',
        architectureNote: 'Gives Ingress controllers time to remove the terminating Pod IP from load-balancing pools before the HTTP server closes.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-13-ex1',
        title: 'Exercise 1: Roll Back a Broken Deployment Immediately',
        difficulty: 'Essential',
        scenario: 'Version `v2` of `deployment/payment-api` is throwing HTTP 500 errors. Write the exact `kubectl` command to roll it back to the previous revision:',
        codeBefore: '$ ',
        answer: 'kubectl rollout undo deployment/payment-api',
        acceptedAnswers: ['kubectl rollout undo deployment/payment-api', 'kubectl rollout undo deploy/payment-api'],
        codeAfter: '\ndeployment.apps/payment-api rolled back',
        hint: 'Use kubectl rollout undo deployment/payment-api.',
        explanation: 'kubectl rollout undo immediately scales up the previous ReplicaSet and scales down the faulty new ReplicaSet.',
        xp: 55
      },
      {
        id: 'dk-13-ex2',
        title: 'Exercise 2: Watch Live Deployment Rollout Progress',
        difficulty: 'Core Practice',
        scenario: 'Write the `kubectl` command to watch the real-time progress of `deployment/payment-api` until all replicas are updated:',
        codeBefore: '$ ',
        answer: 'kubectl rollout status deployment/payment-api',
        acceptedAnswers: ['kubectl rollout status deployment/payment-api', 'kubectl rollout status deploy/payment-api'],
        codeAfter: '\nWaiting for deployment "payment-api" rollout to finish: 2 out of 4 new replicas have been updated...\ndeployment "payment-api" successfully rolled out',
        hint: 'Use kubectl rollout status deployment/payment-api.',
        explanation: 'kubectl rollout status streams rollout progress and exits with code 0 only when the deployment succeeds (ideal for CI/CD scripts).',
        xp: 60
      },
      {
        id: 'dk-13-ex3',
        title: 'Exercise 3: Guarantee Zero Capacity Dip During RollingUpdate',
        difficulty: 'Mastery Challenge',
        scenario: 'In `strategy.rollingUpdate`, what value should `maxUnavailable` be set to so Kubernetes NEVER terminates an old Pod before a new Pod is Ready?',
        codeBefore: 'strategy:\n  type: RollingUpdate\n  rollingUpdate:\n    maxSurge: 25%\n    maxUnavailable: ',
        answer: '0',
        acceptedAnswers: ['0', '0%'],
        codeAfter: '\n# Guarantees 100% replica capacity during deploy',
        hint: 'Set it to zero.',
        explanation: 'Setting maxUnavailable: 0 forces Kubernetes to surge new Pods and wait for Readiness before terminating any existing Pod.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-14',
    chNum: 14,
    title: 'Kubernetes Services: ClusterIP, NodePort, LoadBalancer, Headless & CoreDNS',
    description: 'Stable Virtual IPs, label selectors, EndpointSlices & cross-namespace FQDN DNS resolution',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Networking',
    summary: 'Pods are mortal and their IP addresses change every time they reschedule. A **Kubernetes Service** provides a stable Virtual IP (`ClusterIP`) and DNS name (`my-svc.my-namespace.svc.cluster.local`) that load-balances traffic across all healthy Pods matching a label `selector`.',
    analogy: 'Pods are call-center agents who change desks every shift; a `Service` is the permanent 1-800 customer hotline (`ClusterIP`) that automatically routes callers only to agents currently logged in and ready.',
    syntaxRows: [
      { syntax: 'type: ClusterIP', description: 'Default internal-only Virtual IP reachable inside the Kubernetes cluster', example: 'kubectl get svc -o wide' },
      { syntax: 'type: LoadBalancer', description: 'Provisions an external cloud load balancer (AWS NLB/ALB, GCP LB)', example: 'kubectl expose deploy api --type=LoadBalancer --port=80' },
      { syntax: 'kubectl get endpointslices', description: 'Verify which Pod IPs are actively registered behind a Service', example: 'kubectl get endpoints api-svc' },
      { syntax: '<svc>.<ns>.svc.cluster.local', description: 'Full CoreDNS domain name for resolving a Service across namespaces', example: 'http://payments.prod.svc.cluster.local:8080' }
    ],
    deepExplanation: `### The 4 Kubernetes Service Types
| Service Type | Scope | How It Routes Traffic |
| :--- | :--- | :--- |
| **\`ClusterIP\` (Default)** | Internal Cluster Only | Allocates a stable virtual IP routed by \`kube-proxy\` (iptables/IPVS) or Cilium eBPF to healthy Pod \`EndpointSlices\`. |
| **\`NodePort\`** | Static Port (\`30000–32767\`) on Every Node | Opens \`<NodeIP>:<NodePort>\` and forwards to the \`ClusterIP\`. |
| **\`LoadBalancer\`** | Public / Internal Cloud Load Balancer | Cloud Controller Manager provisions an AWS NLB / GCP LB pointing to node ports/pods. |
| **Headless (\`clusterIP: None\`)** | Direct Pod DNS Records | Does not allocate a virtual IP; CoreDNS returns individual Pod A-records (\`pod-0.svc...\`) for StatefulSets. |`,
    terminalLabCode: `# Inspect Services and verify EndpointSlices
kubectl get svc -o wide
kubectl get endpoints payment-api-svc`,
    realWorldCases: [
      {
        company: 'Datadog & Cilium eBPF kube-proxy Replacement',
        scenario: 'Replacing 50,000 sequential `iptables` Service rules with O(1) eBPF hash-table socket routing in large Kubernetes clusters.',
        impactMetric: 'Reduces Service packet-forwarding latency by 65% at 10,000+ Services',
        architectureNote: 'Intercepts `connect()` syscalls at the socket layer and rewrites the destination from `ClusterIP` to the target `PodIP` in O(1).'
      },
      {
        company: 'Shopify Multi-Namespace Service Discovery',
        scenario: 'Addressing shared caching and auth tiers across Kubernetes namespaces via CoreDNS FQDNs (`auth.security.svc.cluster.local`).',
        impactMetric: 'Sub-millisecond internal DNS resolution with NodeLocal DNSCache',
        architectureNote: 'Configures `ndots: 2` or trailing dots on external domains to reduce unnecessary CoreDNS search-path queries.'
      },
      {
        company: 'Discord EndpointSlice Debugging',
        scenario: 'Detecting mismatched Service `selector` labels immediately by checking if `kubectl get endpoints <svc>` is `<none>`.',
        impactMetric: 'Instant diagnosis of "Connection Refused" on newly deployed Services',
        architectureNote: 'If a Service selector has a typo (`app: paymnt`), its EndpointSlice list is empty even when Pods are Running.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-14-ex1',
        title: 'Exercise 1: Default Internal Kubernetes Service Type',
        difficulty: 'Essential',
        scenario: 'Which Kubernetes Service `type` is the default and exposes the service only on a cluster-internal Virtual IP?',
        codeBefore: 'spec:\n  type: ',
        answer: 'ClusterIP',
        acceptedAnswers: ['ClusterIP'],
        codeAfter: '\n  ports:\n    - port: 80\n      targetPort: 8080',
        hint: 'Starts with Cluster... followed by IP.',
        explanation: 'ClusterIP is the default Service type, providing an internal virtual IP reachable only from within the cluster.',
        xp: 50
      },
      {
        id: 'dk-14-ex2',
        title: 'Exercise 2: Verify Active Pod IPs Behind a Service',
        difficulty: 'Core Practice',
        scenario: 'A Service is returning connection errors. Write the `kubectl` command to check the `endpoints` object for `api-svc` to verify if Pod IPs are registered:',
        codeBefore: '$ ',
        answer: 'kubectl get endpoints api-svc',
        acceptedAnswers: ['kubectl get endpoints api-svc', 'kubectl get ep api-svc', 'kubectl get endpointslices'],
        codeAfter: '\nNAME      ENDPOINTS                         AGE\napi-svc   10.244.1.14:8080,10.244.2.19:8080 5d',
        hint: 'Use kubectl get endpoints api-svc (or kubectl get ep api-svc).',
        explanation: 'Checking endpoints/endpointslices immediately tells you whether the Service selector matches any Ready Pods.',
        xp: 65
      },
      {
        id: 'dk-14-ex3',
        title: 'Exercise 3: Cross-Namespace CoreDNS FQDN',
        difficulty: 'Mastery Challenge',
        scenario: 'Complete the CoreDNS Fully Qualified Domain Name (FQDN) for a Service named `redis` in the `cache` namespace:',
        codeBefore: 'REDIS_HOST="',
        answer: 'redis.cache.svc.cluster.local',
        acceptedAnswers: ['redis.cache.svc.cluster.local', 'redis.cache'],
        codeAfter: '"',
        hint: 'Format is <service>.<namespace>.svc.cluster.local',
        explanation: 'Kubernetes CoreDNS registers every Service at <service-name>.<namespace>.svc.cluster.local.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-15',
    chNum: 15,
    title: 'Ingress Controllers (NGINX / Envoy) & Kubernetes Gateway API (HTTPRoute, TLS)',
    description: 'Layer-7 host/path routing, TLS termination with cert-manager & modern Gateway API traffic splitting',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Networking',
    summary: 'Instead of paying for a separate cloud `LoadBalancer` per microservice, an **Ingress Controller** (or modern **Kubernetes Gateway API**) exposes a single external LoadBalancer IP and routes Layer-7 HTTP/HTTPS traffic by hostname (`api.example.com`) and URL path (`/v1/payments`) to internal `ClusterIP` Services.',
    analogy: 'A `LoadBalancer` Service is a dedicated private driveway for one house; an `Ingress` / `Gateway` is the grand hotel lobby receptionist who greets all visitors at one front entrance, checks their TLS passport, and directs them to the right conference room (`/api`, `/auth`, `/web`).',
    syntaxRows: [
      { syntax: 'kind: Ingress / ingressClassName: nginx', description: 'Define Layer-7 HTTP/HTTPS host and path routing rules', example: 'kubectl get ingress -A' },
      { syntax: 'kind: HTTPRoute (Gateway API)', description: 'Next-gen role-oriented Kubernetes Gateway API route with native canary weights', example: 'kubectl get gateway,httproute' },
      { syntax: 'tls: [{ hosts: ["api.io"], secretName: "api-tls" }]', description: 'Terminate HTTPS TLS using a Kubernetes TLS Secret (managed by cert-manager)', example: 'cert-manager.io/cluster-issuer: letsencrypt-prod' },
      { syntax: 'pathType: Prefix', description: 'Match URL path prefixes (/api) and forward to backend ClusterIP service', example: 'path: /api\npathType: Prefix' }
    ],
    deepExplanation: `### Classic Ingress vs. Kubernetes Gateway API (\`gateway.networking.k8s.io/v1\`)
| Feature | Classic \`Ingress\` API | Modern \`Gateway API\` (\`Gateway\` + \`HTTPRoute\`) |
| :--- | :--- | :--- |
| **Role Separation** | Single monolithic YAML object | Splits **Infra Provider** (\`GatewayClass\`), **Cluster Operator** (\`Gateway\`), and **App Dev** (\`HTTPRoute\`). |
| **Canary Weight Splitting** | Requires vendor-specific NGINX annotations | **First-class native spec** (\`backendRefs: [{ name: api-v2, weight: 10 }]\`). |
| **Header / Method Routing** | Vendor annotations only | Native header, query-param, and gRPC (\`GRPCRoute\`) matching. |`,
    terminalLabCode: `# Inspect Ingress and Gateway API routes
kubectl get ingress -o wide
kubectl describe ingress main-edge-ingress`,
    realWorldCases: [
      {
        company: 'Cloudflare & Envoy Gateway Kubernetes Edge',
        scenario: 'Consolidating 200+ microservices behind a single Envoy Gateway API fleet with automated Let’s Encrypt `cert-manager` TLS renewal.',
        impactMetric: 'Saves $45,000/yr in redundant cloud NLB costs and automates 100% of TLS certificate rotations',
        architectureNote: 'Uses `HTTPRoute` weighted backendRefs to shift 5% -> 25% -> 100% of traffic during canary rollouts.'
      },
      {
        company: 'Airbnb Traffic Management on Kubernetes',
        scenario: 'Routing gRPC and HTTP/2 traffic using Gateway API `GRPCRoute` and `HTTPRoute` resources per engineering team.',
        impactMetric: 'Eliminates error-prone 50-line NGINX annotation strings in service manifests',
        architectureNote: 'Platform team owns the `Gateway` and TLS listeners; product teams own only their namespace `HTTPRoute`.'
      },
      {
        company: 'Shopify Flash-Sale Rate Limiting at Ingress',
        scenario: 'Enforcing per-IP token-bucket rate limits and WAF rules at the Ingress Envoy layer before traffic reaches application Pods.',
        impactMetric: 'Drops 2M+ bot requests/min at the cluster edge without scaling backend Pods',
        architectureNote: 'Protects internal ClusterIP services from flash-sale thundering herds.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-15-ex1',
        title: 'Exercise 1: List All Ingress Resources',
        difficulty: 'Essential',
        scenario: 'Write the `kubectl` command to list all `ingress` resources in the current namespace:',
        codeBefore: '$ ',
        answer: 'kubectl get ingress',
        acceptedAnswers: ['kubectl get ingress', 'kubectl get ing'],
        codeAfter: '\nNAME           CLASS   HOSTS             ADDRESS         PORTS\nedge-ingress   nginx   api.codeitout.io  203.0.113.42    80, 443',
        hint: 'Use kubectl get ingress (or kubectl get ing).',
        explanation: 'kubectl get ingress displays the Ingress class, configured virtual hosts, external load-balancer IP, and ports.',
        xp: 50
      },
      {
        id: 'dk-15-ex2',
        title: 'Exercise 2: Specify Ingress Controller Class',
        difficulty: 'Core Practice',
        scenario: 'In an `Ingress` `spec`, which field specifies which controller (such as `nginx` or `alb`) should reconcile the Ingress?',
        codeBefore: 'spec:\n  ',
        answer: 'ingressClassName: nginx',
        acceptedAnswers: ['ingressClassName: nginx', 'ingressClassName'],
        codeAfter: '\n  rules:\n    - host: api.example.com',
        hint: 'Use ingressClassName: nginx.',
        explanation: 'ingressClassName binds the Ingress resource to a specific IngressController installed in the cluster.',
        xp: 65
      },
      {
        id: 'dk-15-ex3',
        title: 'Exercise 3: Modern Kubernetes Gateway API Route Kind',
        difficulty: 'Mastery Challenge',
        scenario: 'In the modern Kubernetes Gateway API (`gateway.networking.k8s.io/v1`), which resource `kind` defines HTTP path/header routing and canary weights?',
        codeBefore: 'apiVersion: gateway.networking.k8s.io/v1\nkind: ',
        answer: 'HTTPRoute',
        acceptedAnswers: ['HTTPRoute'],
        codeAfter: '\nmetadata:\n  name: payment-route',
        hint: 'Combines HTTP and Route.',
        explanation: 'HTTPRoute attaches to a parent Gateway and defines hostnames, path matches, filters, and weighted backendRefs.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-16',
    chNum: 16,
    title: 'ConfigMaps, Secrets, KMS Envelope Encryption & External Secrets Operator',
    description: 'Decoupling 12-Factor configuration from container images, volume live-reload & why base64 != encryption',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Configuration & Storage',
    summary: 'Follow the 12-Factor App rule: build your container image ONCE and inject environment-specific config via **ConfigMaps** and credentials via **Secrets**. Remember: Kubernetes Secrets are only **base64-encoded** in YAML—production clusters must enable **KMS Envelope Encryption at rest** in `etcd` and sync from AWS Secrets Manager / Vault via the **External Secrets Operator (ESO)**.',
    analogy: 'A ConfigMap is the public menu posted in the restaurant window; a Secret is the combination to the wall safe—and base64 encoding is just writing that combination in Pig Latin unless you lock it inside an encrypted KMS vault.',
    syntaxRows: [
      { syntax: 'kubectl create configmap app-cfg --from-literal=LOG_LEVEL=info', description: 'Create a ConfigMap from key-value literals or config files', example: 'kubectl get configmap app-cfg -o yaml' },
      { syntax: 'envFrom: [{ configMapRef: { name: app-cfg } }]', description: 'Inject all keys of a ConfigMap as environment variables into a Pod', example: 'secretKeyRef:\n  name: db-secret\n  key: password' },
      { syntax: 'kind: Secret / stringData:', description: 'Define a Kubernetes Secret using plain strings that apiserver base64-encodes', example: 'kubectl get secrets' },
      { syntax: 'kind: ExternalSecret', description: 'Sync secrets automatically from AWS Secrets Manager / HashiCorp Vault into K8s', example: 'kubectl get externalsecrets' }
    ],
    deepExplanation: `### Env Vars vs. Volume-Mounted ConfigMaps/Secrets
| Injection Method | What Happens When You Update the ConfigMap/Secret? | Best For |
| :--- | :--- | :--- |
| **Environment Variables (\`env\` / \`envFrom\`)** | **Does NOT update dynamically!** Requires a Pod restart (\`kubectl rollout restart\`) to pick up new values. | Static startup flags (\`PORT\`, \`DB_HOST\`). |
| **Volume Mount (\`volumes.configMap\` / \`secret\`)** | **Kubelet automatically hot-reloads** the mounted file inside the running container via atomic symlink swap (~60s)! | Dynamic feature flags, TLS certs, NGINX/envoy configs. |`,
    terminalLabCode: `# Create ConfigMap and trigger rolling restart to pick up env changes
kubectl create configmap api-config --from-literal=LOG_LEVEL=debug
kubectl get configmaps
kubectl rollout restart deployment/payment-api`,
    realWorldCases: [
      {
        company: 'Stripe & External Secrets Operator (ESO)',
        scenario: 'Never storing raw Secrets in Git; syncing credentials dynamically from AWS Secrets Manager & Vault into Kubernetes Secrets.',
        impactMetric: 'Zero plaintext credentials in Git repositories with automated 24-hour secret rotation',
        architectureNote: 'ESO watches `ExternalSecret` CRDs, authenticates to AWS KMS/Secrets Manager via IRSA, and updates Kubernetes Secrets automatically.'
      },
      {
        company: 'Cloudflare Dynamic TLS & Feature Configs',
        scenario: 'Mounting ConfigMaps and TLS Secrets as Volumes rather than Env Vars so processes hot-reload updated certificates via `inotify`.',
        impactMetric: 'Zero-restart configuration and certificate updates across 10,000+ Pods',
        architectureNote: 'Kubelet updates the `..data` symlink atomically so readers never observe a partially written file.'
      },
      {
        company: 'Monzo Bank etcd KMS Envelope Encryption',
        scenario: 'Encrypting all `Secret` resources in `etcd` at rest using AWS KMS / GCP Cloud KMS `EncryptionConfiguration`.',
        impactMetric: 'Protects cluster secrets even if an etcd disk snapshot is compromised',
        architectureNote: 'kube-apiserver encrypts Secret payloads with a Data Encryption Key (DEK) wrapped by the cloud Key Encryption Key (KEK) before writing to etcd.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-16-ex1',
        title: 'Exercise 1: Inject All Keys of a ConfigMap as Env Vars',
        difficulty: 'Essential',
        scenario: 'In a Pod container spec, which field injects every key-value pair from `configMapRef: name: app-config` as environment variables?',
        codeBefore: 'containers:\n  - name: api\n    ',
        answer: 'envFrom:',
        acceptedAnswers: ['envFrom:', 'envFrom'],
        codeAfter: '\n      - configMapRef:\n          name: app-config',
        hint: 'Starts with env... followed by From.',
        explanation: 'envFrom imports all keys from a ConfigMap or Secret as environment variables without listing each key individually.',
        xp: 50
      },
      {
        id: 'dk-16-ex2',
        title: 'Exercise 2: Restart Deployment After Updating Env-Injected Secret',
        difficulty: 'Core Practice',
        scenario: 'Environment variables do not hot-reload when a Secret changes. Write the `kubectl` command to perform a zero-downtime rolling restart of `deployment/api`:',
        codeBefore: '$ ',
        answer: 'kubectl rollout restart deployment/api',
        acceptedAnswers: ['kubectl rollout restart deployment/api', 'kubectl rollout restart deploy/api'],
        codeAfter: '\ndeployment.apps/api restarted',
        hint: 'Use kubectl rollout restart deployment/api.',
        explanation: 'kubectl rollout restart adds a timestamp annotation to the Pod template, triggering a clean RollingUpdate with the new Secret values.',
        xp: 65
      },
      {
        id: 'dk-16-ex3',
        title: 'Exercise 3: Why Base64 Secrets Require KMS Encryption',
        difficulty: 'Mastery Challenge',
        scenario: 'By default, Kubernetes stores `Secret` data in YAML using which encoding (which is NOT encryption and can be decoded by anyone with `base64 -d`)?',
        codeBefore: '# Default Kubernetes Secret encoding: ',
        answer: 'base64',
        acceptedAnswers: ['base64', 'Base64'],
        codeAfter: ' # Must enable KMS EncryptionConfiguration for encryption at rest in etcd!',
        hint: 'Standard 64-character binary-to-text encoding.',
        explanation: 'Base64 is merely an encoding scheme, not encryption. Production clusters must configure KMS envelope encryption at rest in etcd and strict RBAC.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-17',
    chNum: 17,
    title: 'PersistentVolumes (PV), PersistentVolumeClaims (PVC), StorageClasses & CSI Drivers',
    description: 'Dynamic cloud block/file provisioning (AWS EBS / EFS), accessModes (RWO vs RWX) & reclaimPolicy',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Configuration & Storage',
    summary: 'Pods request durable storage by creating a **PersistentVolumeClaim (PVC)** referencing a **StorageClass** (e.g., `gp3-encrypted`). The Container Storage Interface (**CSI Driver**) dynamically provisions a cloud disk (AWS EBS, GCP PD) as a **PersistentVolume (PV)** and attaches it to the Node where the Pod schedules.',
    analogy: 'A `StorageClass` is a cloud storage vending machine (`gp3 SSD`); a `PVC` is the voucher a Pod inserts asking for "50Gi of SSD"; the `PV` is the physical SSD disk dispensed and plugged into the Pod.',
    syntaxRows: [
      { syntax: 'kind: PersistentVolumeClaim (PVC)', description: 'Request dynamic persistent storage of a given size and StorageClass', example: 'kubectl get pvc,pv' },
      { syntax: 'accessModes: ["ReadWriteOnce"]', description: 'RWO: Volume can be mounted read-write by a single Node (AWS EBS / GCP PD)', example: 'accessModes: ["ReadWriteMany"] # AWS EFS / NFS' },
      { syntax: 'reclaimPolicy: Retain', description: 'Preserve the underlying cloud disk and data even if the PVC is deleted', example: 'allowVolumeExpansion: true' },
      { syntax: 'volumeBindingMode: WaitForFirstConsumer', description: 'Delay provisioning the AZ-specific EBS volume until the Pod is scheduled to a Node', example: 'storageClassName: gp3' }
    ],
    deepExplanation: `### Critical Production Trap: Multi-AZ Scheduling & \`WaitForFirstConsumer\`
- An AWS EBS volume or GCP Zonal Persistent Disk is locked to a **single Availability Zone** (e.g., \`us-east-1a\`).
- If \`volumeBindingMode: Immediate\` is used, the CSI driver might create the EBS disk in \`us-east-1a\`, while the Kubernetes Scheduler places your Pod in \`us-east-1b\` due to CPU constraints—causing the Pod to hang forever in \`ContainerCreating\` (\`VolumeNodeAffinity conflict\`)!
- **Solution**: Always set **\`volumeBindingMode: WaitForFirstConsumer\`** on your \`StorageClass\` so the disk is created in the *exact same Availability Zone* where the Pod is scheduled!`,
    terminalLabCode: `# Inspect PersistentVolumeClaims and StorageClasses
kubectl get sc
kubectl get pvc -o wide`,
    realWorldCases: [
      {
        company: 'Uber Stateful Workloads on AWS EKS',
        scenario: 'Enforcing `volumeBindingMode: WaitForFirstConsumer` and `reclaimPolicy: Retain` on all production `gp3` StorageClasses.',
        impactMetric: 'Eliminates 100% of cross-AZ EBS attachment deadlocks and prevents accidental database deletion',
        architectureNote: 'Waits for kube-scheduler to pick the optimal AZ node before calling the AWS EBS CSI driver `CreateVolume` API.'
      },
      {
        company: 'Figma Live Volume Expansion',
        scenario: 'Growing production database disks online without downtime by setting `allowVolumeExpansion: true` and patching the PVC `spec.resources.requests.storage`.',
        impactMetric: 'Zero-downtime filesystem resize (`resize2fs` / `xfs_growfs`) while pods remain Running',
        architectureNote: 'The CSI driver expands the cloud block device and kubelet resizes the mounted filesystem online.'
      },
      {
        company: 'OpenAI Shared Model Checkpoints (ReadWriteMany)',
        scenario: 'Mounting shared model weight repositories across hundreds of GPU inference Pods simultaneously using `ReadWriteMany` (RWX) FSx/Filestore CSI volumes.',
        impactMetric: 'Concurrent multi-node read/write access without duplicating 200GB model checkpoints per node',
        architectureNote: 'Uses network file storage (NFS/EFS/Lustre) supporting `ReadWriteMany`, unlike block storage (`ReadWriteOnce`).'
      }
    ],
    mustSolve: [
      {
        id: 'dk-17-ex1',
        title: 'Exercise 1: Prevent Data Deletion When a PVC Is Deleted',
        difficulty: 'Essential',
        scenario: 'In a production `StorageClass`, what should `reclaimPolicy` be set to (instead of `Delete`) so the underlying cloud disk is preserved if someone accidentally deletes the PVC?',
        codeBefore: 'apiVersion: storage.k8s.io/v1\nkind: StorageClass\nreclaimPolicy: ',
        answer: 'Retain',
        acceptedAnswers: ['Retain'],
        codeAfter: '\nallowVolumeExpansion: true',
        hint: 'A 6-letter word meaning to keep or preserve (starts with Ret...).',
        explanation: 'reclaimPolicy: Retain ensures the PersistentVolume and its cloud disk are retained for manual recovery even if the PVC object is deleted.',
        xp: 55
      },
      {
        id: 'dk-17-ex2',
        title: 'Exercise 2: Prevent Cross-AZ EBS Volume Scheduling Deadlocks',
        difficulty: 'Core Practice',
        scenario: 'Which `volumeBindingMode` setting on a `StorageClass` delays creating the cloud disk until a Pod using the PVC is scheduled to a specific Availability Zone node?',
        codeBefore: 'volumeBindingMode: ',
        answer: 'WaitForFirstConsumer',
        acceptedAnswers: ['WaitForFirstConsumer'],
        codeAfter: '\n# Guarantees EBS volume is created in the same AZ as the Pod',
        hint: 'Write WaitForFirstConsumer.',
        explanation: 'WaitForFirstConsumer lets the Kubernetes scheduler pick the node first, then provisions the zonal volume in that node’s exact Availability Zone.',
        xp: 65
      },
      {
        id: 'dk-17-ex3',
        title: 'Exercise 3: Access Mode for Single-Node Block Storage',
        difficulty: 'Mastery Challenge',
        scenario: 'Cloud block disks (like AWS EBS) can only be mounted read-write by a single node at a time. Write the Kubernetes `accessModes` value (or its 3-letter abbreviation `RWO`):',
        codeBefore: 'spec:\n  accessModes:\n    - ',
        answer: 'ReadWriteOnce',
        acceptedAnswers: ['ReadWriteOnce', 'RWO'],
        codeAfter: '\n  resources:\n    requests:\n      storage: 100Gi',
        hint: 'Write ReadWriteOnce (or RWO).',
        explanation: 'ReadWriteOnce (RWO) allows the volume to be mounted as read-write by a single node.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-18',
    chNum: 18,
    title: 'StatefulSets, Headless Services & Running Distributed Databases on Kubernetes',
    description: 'Sticky network identities (db-0, db-1), volumeClaimTemplates & ordered deployment/scaling',
    difficulty: 'Advanced',
    sectionGroup: 'Kubernetes Workloads',
    summary: 'While a `Deployment` treats Pods like interchangeable cattle with random hashes (`api-7c8b-x92p`), a **StatefulSet** gives every Pod a deterministic, sticky ordinal identity (`postgres-0`, `postgres-1`, `postgres-2`), a stable DNS record via a **Headless Service (`clusterIP: None`)**, and its own dedicated `PersistentVolumeClaim` via `volumeClaimTemplates`.',
    analogy: 'A `Deployment` is a pool of Uber drivers with random license plates; a `StatefulSet` is a numbered high-speed train (`Car-0`, `Car-1`, `Car-2`) where each car always couples in exact order and keeps its own assigned luggage rack (`postgres-data-postgres-0`).',
    syntaxRows: [
      { syntax: 'kind: StatefulSet / serviceName: "db-headless"', description: 'Manage stateful Pods with sticky ordinal names (db-0, db-1) and dedicated disks', example: 'kubectl get statefulset' },
      { syntax: 'volumeClaimTemplates:', description: 'Automatically provision a unique PVC (data-db-0, data-db-1) per StatefulSet replica', example: 'kubectl get pvc -l app=db' },
      { syntax: 'clusterIP: None (Headless Service)', description: 'Return direct per-Pod DNS A-records: db-0.db-headless.prod.svc.cluster.local', example: 'nslookup db-0.db-headless' },
      { syntax: 'podManagementPolicy: OrderedReady', description: 'Start pods sequentially (0 -> 1 -> 2) and terminate in reverse order (2 -> 1 -> 0)', example: 'podManagementPolicy: Parallel' }
    ],
    deepExplanation: `### Deployment vs. StatefulSet Architecture
| Dimension | \`Deployment\` (Stateless) | \`StatefulSet\` (Stateful Databases / Consensus) |
| :--- | :--- | :--- |
| **Pod Naming** | Random suffix (\`api-7f9c8-k2m9\`) | Deterministic ordinal (\`kafka-0\`, \`kafka-1\`, \`kafka-2\`) |
| **Storage (\`PVC\`)** | All replicas share 1 PVC (if any) | Each replica gets its own dedicated PVC via \`volumeClaimTemplates\` (\`data-kafka-0\`). |
| **Network Identity** | Single load-balanced \`ClusterIP\` | Individual stable DNS per Pod (\`kafka-0.kafka-headless.ns.svc.cluster.local\`). |
| **Node Failure Behavior** | Immediately creates a replacement Pod | Enforces **at-most-one** semantics per ordinal to prevent split-brain disk corruption! |`,
    terminalLabCode: `# Inspect StatefulSet replicas and their dedicated PVCs
kubectl get statefulsets
kubectl get pods -l app=postgres
kubectl get pvc -l app=postgres`,
    realWorldCases: [
      {
        company: 'CloudNativePG & Zalando Postgres Operator',
        scenario: 'Running HA PostgreSQL clusters (`postgres-0` primary + `postgres-1`, `postgres-2` streaming replicas) on Kubernetes.',
        impactMetric: 'Automated < 10s primary failover with zero split-brain WAL corruption',
        architectureNote: 'Each replica binds to its own dedicated NVMe PVC (`pgdata-postgres-0`) that re-attaches to `postgres-0` whenever it reschedules.'
      },
      {
        company: 'Confluent Kafka & ZooKeeper / KRaft on K8s',
        scenario: 'Addressing individual Kafka brokers directly (`kafka-0.kafka-headless:9092`) for partition leader replication.',
        impactMetric: 'Sustains 2GB/sec event streaming with deterministic broker IDs mapped to StatefulSet ordinals',
        architectureNote: 'Uses a Headless Service (`clusterIP: None`) so clients connect directly to the partition leader Pod.'
      },
      {
        company: 'Elastic Cloud & ClickHouse Sharded Clusters',
        scenario: 'Scaling StatefulSet shards up and down predictably while retaining per-shard PVC volumes.',
        impactMetric: 'Zero data rebalancing storms during rolling node kernel upgrades',
        architectureNote: 'When `clickhouse-1` restarts on a new node, Kubernetes re-mounts `data-clickhouse-1` instead of syncing terabytes over the network.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-18-ex1',
        title: 'Exercise 1: Headless Service Configuration for StatefulSet',
        difficulty: 'Essential',
        scenario: 'Every StatefulSet requires a governing **Headless Service** so each Pod (`db-0`, `db-1`) gets its own DNS record. What value is `clusterIP` set to in a Headless Service?',
        codeBefore: 'apiVersion: v1\nkind: Service\nspec:\n  clusterIP: ',
        answer: 'None',
        acceptedAnswers: ['None', 'none'],
        codeAfter: '\n  selector:\n    app: postgres',
        hint: 'Write None.',
        explanation: 'Setting clusterIP: None creates a Headless Service where CoreDNS returns individual Pod A-records (db-0.svc...) instead of a single virtual IP.',
        xp: 55
      },
      {
        id: 'dk-18-ex2',
        title: 'Exercise 2: Per-Replica Dynamic PVC Template in StatefulSet',
        difficulty: 'Core Practice',
        scenario: 'Which StatefulSet `spec` field automatically generates a dedicated `PersistentVolumeClaim` (`data-db-0`, `data-db-1`) for every replica?',
        codeBefore: 'apiVersion: apps/v1\nkind: StatefulSet\nspec:\n  serviceName: "db-headless"\n  ',
        answer: 'volumeClaimTemplates:',
        acceptedAnswers: ['volumeClaimTemplates:', 'volumeClaimTemplates'],
        codeAfter: '\n    - metadata:\n        name: data',
        hint: 'Starts with volumeClaim... followed by Templates.',
        explanation: 'volumeClaimTemplates dynamically creates and binds a distinct PVC for each ordinal replica in the StatefulSet.',
        xp: 65
      },
      {
        id: 'dk-18-ex3',
        title: 'Exercise 3: Predictable Pod Name of the First StatefulSet Replica',
        difficulty: 'Mastery Challenge',
        scenario: 'If a `StatefulSet` is named `redis` with `replicas: 3`, what is the exact Pod name of the very first replica created?',
        codeBefore: '# First Pod name: ',
        answer: 'redis-0',
        acceptedAnswers: ['redis-0'],
        codeAfter: ' # Followed by redis-1 and redis-2',
        hint: 'Format is <statefulset-name>-<ordinal-starting-at-0>.',
        explanation: 'StatefulSet Pods use 0-indexed deterministic ordinal names: redis-0, redis-1, redis-2.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-19',
    chNum: 19,
    title: 'DaemonSets, Jobs & CronJobs for Node Agents and Batch Workloads',
    description: 'Running 1 Pod per Node (log shippers, eBPF CNI) and finite batch/scheduled jobs with backoffLimit',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Workloads',
    summary: 'Not every workload is a long-running HTTP server: **DaemonSets** guarantee that **1 copy of a Pod runs on every Node** (ideal for Datadog/Prometheus node exporters, FluentBit log collectors, and Cilium CNI), while **Jobs** and **CronJobs** run finite batch tasks to completion with configurable retries (`backoffLimit`) and concurrency policies (`concurrencyPolicy: Forbid`).',
    analogy: 'A `DaemonSet` is installing a smoke detector in every single room of a hotel (automatically added whenever a new wing is built); a `Job` is hiring a painter to paint one room and leave when finished; a `CronJob` is the nightly 2:00 AM street sweeper.',
    syntaxRows: [
      { syntax: 'kind: DaemonSet', description: 'Ensure exactly one Pod replica runs on every matching Node in the cluster', example: 'kubectl get daemonset -n kube-system' },
      { syntax: 'kind: Job / completions: 5 / parallelism: 2', description: 'Run finite batch tasks until N completions succeed', example: 'kubectl create job db-migrate --image=app:v1 -- ./migrate' },
      { syntax: 'kind: CronJob / schedule: "0 2 * * *"', description: 'Schedule recurring Jobs using standard 5-field cron syntax', example: 'kubectl create job --from=cronjob/nightly-backup manual-run-1' },
      { syntax: 'concurrencyPolicy: Forbid', description: 'Prevent a new CronJob run from starting if the previous run is still active', example: 'ttlSecondsAfterFinished: 3600' }
    ],
    deepExplanation: `### Choosing the Right Kubernetes Workload Controller
| Controller | Lifecycle | Scaling Model | Canonical Production Example |
| :--- | :--- | :--- | :--- |
| **\`Deployment\`** | Continuous (\`Always\`) | Arbitrary replica count (\`HPA\`) | Stateless REST/gRPC microservices, web frontends. |
| **\`StatefulSet\`** | Continuous (\`Always\`) | Ordered sticky ordinals (\`0..N-1\`) | PostgreSQL, Kafka, Redis Cluster, ClickHouse. |
| **\`DaemonSet\`** | Continuous (\`Always\`) | **1 Pod per Node** automatically | Cilium CNI, FluentBit, Node-Exporter, Falco eBPF agent. |
| **\`Job\` / \`CronJob\`** | Finite (\`OnFailure\` / \`Never\`) | Runs until exit \`0\`, then completes | DB schema migrations, nightly S3 backups, ETL reports. |`,
    terminalLabCode: `# Inspect node-level DaemonSets and trigger a manual Job from a CronJob
kubectl get daemonsets -A
kubectl get jobs,cronjobs
kubectl create job --from=cronjob/nightly-backup backup-manual-01`,
    realWorldCases: [
      {
        company: 'Datadog & Cilium Node-Level DaemonSets',
        scenario: 'Automatically deploying observability and eBPF networking agents onto every new node within 2 seconds of Karpenter node join.',
        impactMetric: '100% node telemetry and CNI coverage across 5,000+ autoscaling nodes',
        architectureNote: 'Uses tolerations (`operator: Exists`) on the DaemonSet so node agents also run on tainted GPU and control-plane nodes.'
      },
      {
        company: 'Stripe Financial Settlement CronJobs',
        scenario: 'Running hourly reconciliation batch Jobs with `concurrencyPolicy: Forbid` and `activeDeadlineSeconds: 1800`.',
        impactMetric: 'Guarantees two reconciliation jobs never run concurrently and double-process ledger batches',
        architectureNote: 'Uses `ttlSecondsAfterFinished: 86400` to automatically garbage-collect completed Job Pods after 24 hours.'
      },
      {
        company: 'Airbnb On-Demand CronJob Triggering',
        scenario: 'Running an ad-hoc manual execution of a scheduled `CronJob` during incident recovery via `kubectl create job --from=cronjob/<name>`.',
        impactMetric: 'Instant batch replay without editing CronJob schedules in Git',
        architectureNote: 'Instantiates a one-off `Job` directly from the `CronJob.spec.jobTemplate`.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-19-ex1',
        title: 'Exercise 1: Workload Controller for 1 Pod Per Node',
        difficulty: 'Essential',
        scenario: 'Which Kubernetes workload `kind` guarantees that a log collector or monitoring agent runs on **every single Node** in the cluster?',
        codeBefore: 'apiVersion: apps/v1\nkind: ',
        answer: 'DaemonSet',
        acceptedAnswers: ['DaemonSet', 'daemonset'],
        codeAfter: '\nmetadata:\n  name: fluentbit-logger',
        hint: 'Starts with Daemon... followed by Set.',
        explanation: 'A DaemonSet automatically schedules one Pod onto every matching Node in the cluster as nodes are added or removed.',
        xp: 50
      },
      {
        id: 'dk-19-ex2',
        title: 'Exercise 2: Prevent Overlapping CronJob Runs',
        difficulty: 'Core Practice',
        scenario: 'In a `CronJob` spec, what should `concurrencyPolicy` be set to so Kubernetes skips starting a new run if the previous run has not finished yet?',
        codeBefore: 'spec:\n  schedule: "*/5 * * * *"\n  concurrencyPolicy: ',
        answer: 'Forbid',
        acceptedAnswers: ['Forbid'],
        codeAfter: '\n  jobTemplate:',
        hint: 'Options are Allow, Forbid, or Replace. Choose the one that blocks overlapping runs.',
        explanation: 'concurrencyPolicy: Forbid prevents overlapping executions if a batch job takes longer than its schedule interval.',
        xp: 65
      },
      {
        id: 'dk-19-ex3',
        title: 'Exercise 3: Trigger an Immediate Manual Job from a CronJob',
        difficulty: 'Mastery Challenge',
        scenario: 'Complete the `kubectl` command to immediately spawn a one-off Job named `test-run` from an existing CronJob named `nightly-etl`:',
        codeBefore: '$ kubectl create job ',
        answer: '--from=cronjob/nightly-etl',
        acceptedAnswers: ['--from=cronjob/nightly-etl', '--from=cj/nightly-etl'],
        codeAfter: ' test-run\njob.batch/test-run created',
        hint: 'Use --from=cronjob/nightly-etl.',
        explanation: 'kubectl create job --from=cronjob/<name> <job-name> immediately triggers a manual run using the CronJob template.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-20',
    chNum: 20,
    title: 'Resource Requests, Limits, QoS Classes & Liveness / Readiness / Startup Probes',
    description: 'Preventing OOMKilled evictions, CPU throttling traps & configuring health probes that prevent cascading failures',
    difficulty: 'Advanced',
    sectionGroup: 'Kubernetes Reliability & Autoscaling',
    summary: '**Resource `requests`** are used by `kube-scheduler` to place Pods onto nodes with sufficient capacity; **Resource `limits`** are enforced by the Linux kernel (`cgroups v2`). Meanwhile, **Startup, Readiness, and Liveness Probes** tell Kubernetes when a container has finished booting, when it should receive Service traffic, and when it is deadlocked and must be restarted.',
    analogy: '`requests` is your reserved airplane seat; `limits` is the seatbelt size limit. `ReadinessProbe` is the "Open / Closed" sign on a shop door (temporarily flip to Closed while restocking without demolishing the shop), whereas `LivenessProbe` is the building demolition crew (restarts the container!).',
    syntaxRows: [
      { syntax: 'requests: { cpu: "500m", memory: "512Mi" }', description: 'Guaranteed minimum resources reserved by kube-scheduler on the Node', example: 'limits: { memory: "512Mi" }' },
      { syntax: 'readinessProbe:', description: 'Remove Pod IP from Service EndpointSlices when failing (does NOT restart Pod)', example: 'httpGet: { path: /readyz, port: 8080 }' },
      { syntax: 'livenessProbe:', description: 'Restart the container via kubelet if it deadlocks and fails health checks', example: 'httpGet: { path: /healthz, port: 8080 }' },
      { syntax: 'startupProbe:', description: 'Disable liveness/readiness checks until a slow-starting app finishes booting', example: 'failureThreshold: 30\nperiodSeconds: 5' }
    ],
    deepExplanation: `### 1. The 3 Kubernetes probes & Their Golden Production Rules
| Probe Type | What Happens When It Fails? | Golden Production Rule |
| :--- | :--- | :--- |
| **\`startupProbe\`** | Holds off \`livenessProbe\` up to \`failureThreshold * periodSeconds\`; restarts if still not booted. | Use for slow-booting JVM/ML apps so \`livenessProbe\` doesn't kill them mid-boot! |
| **\`readinessProbe\`** | **Removes Pod IP from Service \`EndpointSlices\`** (stops new traffic; **NO restart**). | Check local readiness + critical dependencies needed to serve requests. |
| **\`livenessProbe\`** | **Kills and restarts the container!** | **NEVER check external databases in \`livenessProbe\`!** A temporary DB blip will cause all 50 API pods to restart simultaneously in a cascading outage! |

### 2. Kubernetes Quality of Service (QoS) Classes
- **\`Guaranteed\`**: Every container sets \`requests.memory == limits.memory\` and \`requests.cpu == limits.cpu\`. **Last to be evicted** under node memory pressure!
- **\`Burstable\`**: At least one container sets \`requests < limits\`.
- **\`BestEffort\`**: No requests or limits set at all (**First to be killed** when node RAM runs low!).`,
    terminalLabCode: `# Inspect Pod QoS Class, resource requests/limits, and probe statuses
kubectl describe pod payment-api-7c8b9d-x2k9p
kubectl top pods`,
    realWorldCases: [
      {
        company: 'Zalando / Monzo Cascading Liveness Outage Prevention',
        scenario: 'Decoupling `/healthz` (Liveness: shallow in-process check) from `/readyz` (Readiness: connection pool & warm cache check).',
        impactMetric: 'Prevents 100% of cascading CrashLoopBackOff storms during transient downstream database failovers',
        architectureNote: 'If Redis/Postgres blips for 3 seconds, Liveness stays 200 OK so pods stay alive with warm JIT caches.'
      },
      {
        company: 'Shopify Ruby/JVM CFS CPU Limit Removal',
        scenario: 'Setting `requests.cpu` accurately while omitting hard `limits.cpu` (and keeping `requests.memory == limits.memory`) on latency-sensitive web pods.',
        impactMetric: 'Reduces P99 tail latency by 42% by eliminating unnecessary Linux CFS 100ms quota throttling',
        architectureNote: 'Multi-threaded servers can burn a 100ms CPU quota in 15ms across 8 threads and get throttled for 85ms even when the host CPU is 70% idle.'
      },
      {
        company: 'Netflix JVM StartupProbe Adoption',
        scenario: 'Using `startupProbe` (`failureThreshold: 30, periodSeconds: 5` = 150s boot window) alongside a fast 5-second `livenessProbe`.',
        impactMetric: 'Detects runtime deadlocks in 15s without killing slow-warming Spring Boot containers during boot',
        architectureNote: 'Once startupProbe succeeds once, kubelet hands over monitoring to the fast livenessProbe.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-20-ex1',
        title: 'Exercise 1: Which Probe Removes a Pod from Service Traffic Without Restarting It?',
        difficulty: 'Essential',
        scenario: 'A Pod is temporarily overloaded warming its cache and should stop receiving new Service traffic WITHOUT being killed/restarted. Which probe controls this?',
        codeBefore: '# Removes Pod IP from Service EndpointSlices without restarting: ',
        answer: 'readinessProbe',
        acceptedAnswers: ['readinessProbe', 'ReadinessProbe', 'readiness probe'],
        codeAfter: '',
        hint: 'Starts with readiness... followed by Probe.',
        explanation: 'When a readinessProbe fails, Kubernetes removes the Pod IP from the Service EndpointSlice so no new traffic is sent to it, while leaving the container running.',
        xp: 55
      },
      {
        id: 'dk-20-ex2',
        title: 'Exercise 2: Highest Priority Pod QoS Class Against Node Eviction',
        difficulty: 'Core Practice',
        scenario: 'When a Pod sets `requests.memory == limits.memory` and `requests.cpu == limits.cpu` on all containers, which Kubernetes `qosClass` does it receive?',
        codeBefore: 'status:\n  qosClass: ',
        answer: 'Guaranteed',
        acceptedAnswers: ['Guaranteed'],
        codeAfter: '\n# Protected from eviction until BestEffort and Burstable pods are evicted first',
        hint: 'The highest of the 3 QoS classes (BestEffort, Burstable, Guaranteed).',
        explanation: 'Guaranteed QoS pods have exact matching requests and limits and are the very last pods evicted during Node MemoryPressure.',
        xp: 65
      },
      {
        id: 'dk-20-ex3',
        title: 'Exercise 3: Protect Slow-Booting Containers from Liveness Kills',
        difficulty: 'Mastery Challenge',
        scenario: 'Which Kubernetes probe delays `livenessProbe` execution until a legacy or ML container finishes its initial boot sequence?',
        codeBefore: 'containers:\n  - name: ml-inference\n    ',
        answer: 'startupProbe:',
        acceptedAnswers: ['startupProbe:', 'startupProbe', 'startup probe'],
        codeAfter: '\n      httpGet:\n        path: /healthz\n        port: 8080\n      failureThreshold: 30',
        hint: 'Starts with startup... followed by Probe.',
        explanation: 'startupProbe disables liveness and readiness checks until it succeeds once, allowing slow-starting apps to boot safely.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-21',
    chNum: 21,
    title: 'Horizontal Pod Autoscaler (HPA), VPA, KEDA Event-Driven Scaling & Karpenter',
    description: 'Scaling Pod replicas on CPU/custom metrics (HPA), queue depth (KEDA) & just-in-time Node provisioning (Karpenter)',
    difficulty: 'Advanced',
    sectionGroup: 'Kubernetes Reliability & Autoscaling',
    summary: 'Production Kubernetes autoscaling operates at two levels: **Pod-level autoscaling** via **HPA** (CPU/Memory/Custom Prometheus metrics) or **KEDA** (scaling from 0 to 100 replicas based on Kafka lag / SQS queue depth), and **Node-level autoscaling** via **Karpenter** (provisioning right-sized cloud EC2 instances in < 40 seconds when Pods are `Pending`).',
    analogy: 'HPA/KEDA is the restaurant manager calling in extra waiters when the line at the door grows (`Pods`); Karpenter is expanding the dining room floor and adding more tables when all existing seats are full (`Nodes`).',
    syntaxRows: [
      { syntax: 'kubectl autoscale deploy api --min=3 --max=50 --cpu-percent=70', description: 'Create an HPA scaling between 3 and 50 replicas at 70% CPU utilization', example: 'kubectl get hpa' },
      { syntax: 'behavior: scaleDown: stabilizationWindowSeconds: 300', description: 'Prevent HPA thrashing/flapping by waiting 5 minutes before scaling down', example: 'kubectl describe hpa api-hpa' },
      { syntax: 'kind: ScaledObject (KEDA)', description: 'Scale deployments based on external event sources (Kafka lag, SQS, Redis lists)', example: 'minReplicaCount: 0\nmaxReplicaCount: 100' },
      { syntax: 'kind: NodePool (Karpenter)', description: 'Group-less just-in-time node provisioner matching unschedulable Pod requests', example: 'kubectl get nodeclaims' }
    ],
    deepExplanation: `### The HPA Scaling Formula
$$\\text{DesiredReplicas} = \\left\\lceil \\text{CurrentReplicas} \\times \\frac{\\text{CurrentMetricValue}}{\\text{TargetMetricValue}} \\right\\rceil$$
- **Example**: If \`CurrentReplicas = 4\`, target CPU is \`50%\`, and current average CPU across pods is \`100%\`:
$$\\text{DesiredReplicas} = \\lceil 4 \\times (100 / 50) \\rceil = \\mathbf{8\\text{ Replicas}}$$
- **Prerequisite**: HPA cannot calculate CPU/Memory percentages unless your Pod spec defines **\`resources.requests\`** AND **\`metrics-server\`** is running in the cluster!`,
    terminalLabCode: `# Inspect HorizontalPodAutoscalers and real-time Pod resource metrics
kubectl get hpa
kubectl top nodes
kubectl top pods`,
    realWorldCases: [
      {
        company: 'Anthropic & Slack Karpenter Node Autoscaling',
        scenario: 'Replacing static AWS Auto Scaling Groups (Cluster Autoscaler) with Karpenter `NodePools` across variable AI and chat workloads.',
        impactMetric: 'Node provisioning latency dropped from 3.5 minutes to 38 seconds with 28% lower EC2 spend',
        architectureNote: 'Karpenter inspects pending Pod resource/affinity constraints directly and launches the exact optimal instance type and consolidates underutilized nodes.'
      },
      {
        company: 'Shopify Black Friday KEDA Queue Autoscaling',
        scenario: 'Scaling webhook and checkout worker Deployments based on Kafka consumer lag and Redis queue depth rather than lagging CPU metrics.',
        impactMetric: 'Scales worker fleet from 20 to 800 Pods in < 30 seconds before CPU even spikes',
        architectureNote: 'CPU is a lagging indicator for I/O-bound workers; KEDA queries queue depth directly every 5 seconds.'
      },
      {
        company: 'Uber HPA Flapping Mitigation',
        scenario: 'Configuring `behavior.scaleDown.stabilizationWindowSeconds: 300` while keeping `scaleUp` immediate (`0s`).',
        impactMetric: 'Eliminates replica oscillation during spiky 1-minute traffic bursts',
        architectureNote: 'Scales up aggressively to protect SLAs, but scales down conservatively over a 5-minute rolling window.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-21-ex1',
        title: 'Exercise 1: Inspect Active Horizontal Pod Autoscalers',
        difficulty: 'Essential',
        scenario: 'Write the `kubectl` command to view all `HorizontalPodAutoscaler` (`hpa`) resources, their current CPU/target metrics, and replica counts:',
        codeBefore: '$ ',
        answer: 'kubectl get hpa',
        acceptedAnswers: ['kubectl get hpa', 'kubectl get horizontalpodautoscaler'],
        codeAfter: '\nNAME      REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS\napi-hpa   Deployment/api       42%/70%   3         50        6',
        hint: 'Use kubectl get hpa.',
        explanation: 'kubectl get hpa displays the current vs target utilization, min/max bounds, and active replica count.',
        xp: 50
      },
      {
        id: 'dk-21-ex2',
        title: 'Exercise 2: Mandatory Pod Spec Field Required for CPU HPA',
        difficulty: 'Core Practice',
        scenario: 'If `kubectl get hpa` shows `<unknown>/70%` even though `metrics-server` is running, what resource block is missing from the Pod container spec?',
        codeBefore: 'resources:\n  ',
        answer: 'requests:',
        acceptedAnswers: ['requests:', 'requests'],
        codeAfter: '\n    cpu: "500m"',
        hint: 'HPA divides current CPU usage by the Pod’s requested CPU (starts with req...).',
        explanation: 'HPA calculates utilization percentage as (Current CPU / Requested CPU). Without resources.requests.cpu, HPA cannot compute the percentage.',
        xp: 65
      },
      {
        id: 'dk-21-ex3',
        title: 'Exercise 3: Calculate HPA Desired Replicas',
        difficulty: 'Mastery Challenge',
        scenario: 'A Deployment has 5 current replicas, `targetCPUUtilizationPercentage = 50`, and `currentCPUUtilization = 100`. How many replicas will HPA scale to?',
        codeBefore: '# DesiredReplicas = ceil(5 * (100 / 50)) = ',
        answer: '10',
        acceptedAnswers: ['10'],
        codeAfter: ' replicas',
        hint: 'Multiply 5 by (100 / 50).',
        explanation: 'Using the HPA formula ceil(CurrentReplicas * (CurrentMetric / TargetMetric)) = ceil(5 * 2) = 10 replicas.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-22',
    chNum: 22,
    title: 'Kubernetes Scheduling: Node Affinity, Taints & Tolerations, Topology Spread & PDBs',
    description: 'Isolating GPU/spot nodes (Taints/Tolerations), spreading replicas across AZs & PodDisruptionBudgets',
    difficulty: 'Advanced',
    sectionGroup: 'Kubernetes Reliability & Autoscaling',
    summary: '**Node Affinity** attracts Pods to specific nodes (e.g., `node.kubernetes.io/instance-type=g5.xlarge`); **Taints & Tolerations** repel general Pods away from dedicated/expensive nodes (like H100 GPU nodes); **Topology Spread Constraints** balance replicas evenly across Availability Zones; and **PodDisruptionBudgets (PDBs)** prevent voluntary node drains (`kubectl drain`) from taking down too many replicas at once.',
    analogy: '`NodeAffinity` is a VIP guest preferring the VIP lounge; a `Taint` is a security guard at the VIP door who turns everyone away unless they carry a matching VIP pass (`Toleration`). A `PodDisruptionBudget` is a hospital staffing rule stating "At least 3 ER doctors must remain on duty during shift changes."',
    syntaxRows: [
      { syntax: 'kubectl taint nodes gpu-node-1 nvidia.com/gpu=true:NoSchedule', description: 'Taint a node so only Pods with a matching Toleration can schedule on it', example: 'tolerations: [{ key: "nvidia.com/gpu", operator: "Equal", value: "true", effect: "NoSchedule" }]' },
      { syntax: 'topologySpreadConstraints:', description: 'Spread Pod replicas evenly across failure domains (topology.kubernetes.io/zone)', example: 'maxSkew: 1\ntopologyKey: topology.kubernetes.io/zone' },
      { syntax: 'kind: PodDisruptionBudget / minAvailable: 80%', description: 'Protect Deployment availability during kubectl drain and cluster upgrades', example: 'kubectl get pdb' },
      { syntax: 'kubectl drain <node> --ignore-daemonsets --delete-emptydir-data', description: 'Cordons a node and safely evicts Pods while respecting PodDisruptionBudgets', example: 'kubectl uncordon <node>' }
    ],
    deepExplanation: `### Taints & Tolerations vs. Node Affinity
| Mechanism | Applied On | Effect |
| :--- | :--- | :--- |
| **Taint (\`NoSchedule\` / \`NoExecute\`) + Toleration** | **Taint on Node**, **Toleration on Pod** | **Repels** all Pods that lack the toleration (Note: a Toleration *allows* scheduling on the tainted node, but does not *force* it—pair with \`nodeAffinity\` to pin!). |
| **\`nodeAffinity\`** | **Pod Spec** | **Attracts** the Pod to nodes matching label expressions (\`requiredDuringSchedulingIgnoredDuringExecution\`). |
| **\`PodDisruptionBudget\` (PDB)** | **Namespace Resource** | Blocks the **Eviction API** during voluntary disruptions (\`kubectl drain\`, Karpenter consolidation) if healthy pods would drop below \`minAvailable\`. |`,
    terminalLabCode: `# Inspect PodDisruptionBudgets and safely drain a node for maintenance
kubectl get pdb
kubectl drain k8s-worker-1 --ignore-daemonsets --delete-emptydir-data`,
    realWorldCases: [
      {
        company: 'OpenAI & Scale AI GPU Node Isolation',
        scenario: 'Tainting $30/hr H100 GPU nodes with `nvidia.com/gpu=present:NoSchedule` so lightweight CPU cronjobs never accidentally land on GPU nodes and block 8-GPU training jobs.',
        impactMetric: '100% GPU node reservation efficiency across multi-tenant clusters',
        architectureNote: 'Combines Node Taints (to repel non-GPU pods) with Node Affinity (to attract GPU pods strictly to GPU nodes).'
      },
      {
        company: 'Stripe Multi-AZ Topology Spread & PDBs',
        scenario: 'Enforcing `topologySpreadConstraints` (`maxSkew: 1` across `topology.kubernetes.io/zone`) and `PodDisruptionBudget` (`maxUnavailable: 1`) on every tier-1 service.',
        impactMetric: 'Survives a full AWS Availability Zone outage and rolling node upgrades with zero downtime',
        architectureNote: 'Guarantees replicas are evenly split across us-east-1a, 1b, and 1c and blocks `kubectl drain` if too many pods are simultaneously unavailable.'
      },
      {
        company: 'Spotify Spot Instance Graceful Eviction',
        scenario: 'Using `NoExecute` taints with `tolerationSeconds: 30` when AWS Spot termination notices arrive.',
        impactMetric: 'Gracefully drains in-flight requests 30 seconds before spot host reclamation',
        architectureNote: 'Node Problem Detector applies a `NoExecute` taint on spot interruption notice, triggering controlled Pod eviction.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-22-ex1',
        title: 'Exercise 1: Safely Evict Pods from a Node Before Maintenance',
        difficulty: 'Essential',
        scenario: 'Write the `kubectl` subcommand that cordons `node-1` (marks it unschedulable) and gracefully evicts all Pods while respecting PodDisruptionBudgets:',
        codeBefore: '$ kubectl ',
        answer: 'drain node-1',
        acceptedAnswers: ['drain node-1', 'drain node-1 --ignore-daemonsets'],
        codeAfter: ' --ignore-daemonsets --delete-emptydir-data',
        hint: 'Use drain <node-name>.',
        explanation: 'kubectl drain marks the node unschedulable (cordon) and uses the Eviction API to move Pods to other nodes while honoring PDBs.',
        xp: 55
      },
      {
        id: 'dk-22-ex2',
        title: 'Exercise 2: Protect Minimum Replica Count During Node Drains',
        difficulty: 'Core Practice',
        scenario: 'Which Kubernetes resource `kind` prevents `kubectl drain` or cluster upgrades from evicting too many Pods of a service at the same time?',
        codeBefore: 'apiVersion: policy/v1\nkind: ',
        answer: 'PodDisruptionBudget',
        acceptedAnswers: ['PodDisruptionBudget', 'pdb'],
        codeAfter: '\nmetadata:\n  name: payment-api-pdb\nspec:\n  minAvailable: 80%',
        hint: 'Three words: Pod + Disruption + Budget.',
        explanation: 'A PodDisruptionBudget (PDB) enforces minAvailable or maxUnavailable constraints during voluntary node disruptions.',
        xp: 65
      },
      {
        id: 'dk-22-ex3',
        title: 'Exercise 3: Allow a Pod to Schedule onto a Tainted GPU Node',
        difficulty: 'Mastery Challenge',
        scenario: 'A GPU node has a taint `gpu=true:NoSchedule`. Which Pod `spec` section must be configured so the Pod is permitted onto that tainted node?',
        codeBefore: 'spec:\n  ',
        answer: 'tolerations:',
        acceptedAnswers: ['tolerations:', 'tolerations'],
        codeAfter: '\n    - key: "gpu"\n      operator: "Equal"\n      value: "true"\n      effect: "NoSchedule"',
        hint: 'Plural noun starting with tolerat...',
        explanation: 'tolerations in the Pod spec allow (but do not require) the scheduler to place the Pod onto nodes carrying a matching taint.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-23',
    chNum: 23,
    title: 'Kubernetes Security: RBAC (Role / ClusterRole), ServiceAccounts (IRSA) & NetworkPolicies',
    description: 'Least-privilege API access, Pod security standards, zero-trust NetworkPolicies & kubectl auth can-i',
    difficulty: 'Advanced',
    sectionGroup: 'Kubernetes Security & GitOps',
    summary: 'By default, Kubernetes networking is "flat" (every Pod can talk to every other Pod in any namespace!). Production zero-trust security requires 3 pillars: (1) **RBAC** (`Role` + `RoleBinding` with least-privilege verbs), (2) **ServiceAccount Workload Identity / IRSA** (no static cloud IAM keys), and (3) **Default-Deny `NetworkPolicy`** isolating pod-to-pod traffic.',
    analogy: 'Without a `NetworkPolicy`, a Kubernetes cluster is an open-plan office where anyone can walk up to the payroll desk. A Default-Deny `NetworkPolicy` installs badge-controlled glass doors around every department so only the `api` pod badge can open the `postgres` door on port `5432`.',
    syntaxRows: [
      { syntax: 'kubectl auth can-i delete deployments --as=system:serviceaccount:prod:api-sa', description: 'Verify RBAC permissions for any user or ServiceAccount', example: 'kubectl auth can-i get secrets -n prod' },
      { syntax: 'automountServiceAccountToken: false', description: 'Prevent mounting the Kubernetes API JWT token into Pods that do not call kube-apiserver', example: 'serviceAccountName: payment-sa' },
      { syntax: 'kind: NetworkPolicy / podSelector: {}', description: 'Default-deny all ingress/egress traffic in a namespace unless explicitly allowed', example: 'policyTypes: ["Ingress", "Egress"]' },
      { syntax: 'kind: Role & RoleBinding', description: 'Grant namespace-scoped RBAC permissions (use ClusterRole for cluster-wide)', example: 'kubectl get role,rolebinding -n prod' }
    ],
    deepExplanation: `### 1. RBAC Matrix: \`Role\` vs. \`ClusterRole\` & \`RoleBinding\` vs. \`ClusterRoleBinding\`
| Permission Definition | Binding Object | Resulting Scope |
| :--- | :--- | :--- |
| **\`Role\`** (Namespace-scoped) | **\`RoleBinding\`** | Grants permissions **only inside that 1 Namespace**. |
| **\`ClusterRole\`** (Cluster-scoped) | **\`RoleBinding\`** (in Namespace \`X\`) | Reusable role definition, but grants permissions **only inside Namespace \`X\`**! |
| **\`ClusterRole\`** (Cluster-scoped) | **\`ClusterRoleBinding\`** | Grants permissions across **ALL Namespaces** and cluster-scoped resources (Nodes, PVs). |

### 2. Default-Deny Ingress \`NetworkPolicy\`
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: prod
spec:
  podSelector: {} # Selects ALL Pods in namespace 'prod'
  policyTypes:
    - Ingress     # With no 'ingress:' rules listed, denies 100% of unwhitelisted inbound traffic!
\`\`\``,
    terminalLabCode: `# Audit RBAC permissions and inspect NetworkPolicies
kubectl auth can-i create deployments --namespace=prod
kubectl get networkpolicies -n prod
kubectl get role,rolebinding -n prod`,
    realWorldCases: [
      {
        company: 'Stripe & Airbnb Zero-Trust NetworkPolicies (Cilium eBPF)',
        scenario: 'Applying a `default-deny-all` NetworkPolicy in every namespace and explicitly whitelisting only required `(sourcePodLabels -> destPodLabels:port)` edges.',
        impactMetric: 'Blocks 100% of lateral movement from a compromised frontend Pod to backend databases',
        architectureNote: 'Enforced in kernel space via Cilium eBPF maps with zero iptables rule-chain latency.'
      },
      {
        company: 'AWS EKS IAM Roles for Service Accounts (IRSA / Pod Identity)',
        scenario: 'Exchanging short-lived Kubernetes ServiceAccount OIDC tokens for temporary AWS STS credentials instead of storing `AWS_SECRET_ACCESS_KEY` in Secrets.',
        impactMetric: 'Eliminates long-lived cloud IAM access keys across 100% of production Pods',
        architectureNote: 'Kubelet mounts a projected OIDC token with a 1-hour expiry that AWS STS validates cryptographically.'
      },
      {
        company: 'Shopify `automountServiceAccountToken: false` Hardening',
        scenario: 'Disabling automatic mounting of `/var/run/secrets/kubernetes.io/serviceaccount/token` on all business microservices that do not call `kube-apiserver`.',
        impactMetric: 'Prevents SSRF or RCE vulnerabilities from reading a Kubernetes API bearer token from disk',
        architectureNote: 'Only controllers and operators that genuinely query kube-apiserver opt in to mounting a ServiceAccount token.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-23-ex1',
        title: 'Exercise 1: Audit RBAC Permissions with kubectl',
        difficulty: 'Essential',
        scenario: 'Write the `kubectl` command to check whether your current user has permission to `delete secrets` in the current namespace:',
        codeBefore: '$ ',
        answer: 'kubectl auth can-i delete secrets',
        acceptedAnswers: ['kubectl auth can-i delete secrets', 'kubectl auth can-i delete secret'],
        codeAfter: '\nno',
        hint: 'Use kubectl auth can-i <verb> <resource>.',
        explanation: 'kubectl auth can-i submits a SubjectAccessReview to kube-apiserver and returns yes or no.',
        xp: 55
      },
      {
        id: 'dk-23-ex2',
        title: 'Exercise 2: Disable Unused ServiceAccount Token Mounting',
        difficulty: 'Core Practice',
        scenario: 'Which boolean Pod `spec` field prevents Kubernetes from mounting the ServiceAccount JWT token at `/var/run/secrets/kubernetes.io/serviceaccount/token`?',
        codeBefore: 'spec:\n  serviceAccountName: web-sa\n  ',
        answer: 'automountServiceAccountToken: false',
        acceptedAnswers: ['automountServiceAccountToken: false', 'automountServiceAccountToken'],
        codeAfter: '',
        hint: 'Set automountServiceAccountToken: false.',
        explanation: 'automountServiceAccountToken: false stops kubelet from mounting an API bearer token inside Pods that do not need to talk to kube-apiserver.',
        xp: 65
      },
      {
        id: 'dk-23-ex3',
        title: 'Exercise 3: Select All Pods in a Namespace for Default-Deny NetworkPolicy',
        difficulty: 'Mastery Challenge',
        scenario: 'In a `NetworkPolicy`, how do you write `podSelector` so it matches **ALL** Pods in the namespace?',
        codeBefore: 'spec:\n  ',
        answer: 'podSelector: {}',
        acceptedAnswers: ['podSelector: {}'],
        codeAfter: '\n  policyTypes:\n    - Ingress',
        hint: 'Pass an empty YAML object {} to podSelector.',
        explanation: 'An empty podSelector: {} matches every Pod in the NetworkPolicy’s namespace, enabling a namespace-wide default-deny baseline.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-24',
    chNum: 24,
    title: 'Helm Charts (Chart.yaml, values.yaml, Templates) & Kustomize Overlays',
    description: 'Packaging parameterized Kubernetes releases with Helm (--atomic) vs template-free Kustomize patches',
    difficulty: 'Intermediate',
    sectionGroup: 'Kubernetes Security & GitOps',
    summary: 'Managing raw YAML across Dev, Staging, and Prod leads to copy-paste drift. **Helm** acts as the Kubernetes package manager using Go-templated Charts (`values.yaml`, `helm upgrade --install --atomic`), while **Kustomize** (built directly into `kubectl apply -k`) applies template-free strategic merge patches (`bases/` + `overlays/prod/`).',
    analogy: 'Helm is a fill-in-the-blank mail-merge contract template (`{{ .Values.replicas }}`); Kustomize is taking a standard printed contract (`base/`) and placing transparent sticky-note amendments on top for each state (`overlays/prod/`).',
    syntaxRows: [
      { syntax: 'helm upgrade --install api ./chart -f values-prod.yaml --atomic', description: 'Install or upgrade a Helm release and auto-rollback if health probes fail', example: 'helm list -n prod' },
      { syntax: 'helm template api ./chart -f values-prod.yaml', description: 'Render Helm Go templates locally to stdout for CI validation without a cluster', example: 'helm lint ./chart' },
      { syntax: 'helm rollback api 1', description: 'Roll back a Helm release to revision 1 (restores ConfigMaps, Secrets & Deployments together)', example: 'helm history api' },
      { syntax: 'kubectl apply -k overlays/prod/', description: 'Apply a Kustomize overlay directory (`kustomization.yaml`) natively via kubectl', example: 'kubectl kustomize overlays/prod/' }
    ],
    deepExplanation: `### Helm vs. Kustomize in Production
| Dimension | **Helm** (\`Chart.yaml\` + \`templates/\`) | **Kustomize** (\`kustomization.yaml\`) |
| :--- | :--- | :--- |
| **Mechanism** | Go Text Templating (\`{{ .Values.image.tag }}\`) | Template-free YAML AST patching (\`patches\`, \`images\`, \`replicas\`). |
| **Release Tracking** | Stores versioned Release Secrets in cluster (\`helm rollback\` reverts **all** resources atomically). | Pure client/GitOps manifest generator (built into \`kubectl -k\` and ArgoCD). |
| **Best Use Case** | Packaging third-party/platform charts (Prometheus, Ingress-NGINX, Cert-Manager) & atomic multi-resource releases. | Environment-specific GitOps overlays (\`base/\` + \`overlays/staging/\`, \`overlays/prod/\`). |`,
    terminalLabCode: `# Lint, render, and atomically deploy a Helm Chart release
helm lint ./charts/payment-api
helm upgrade --install payment-api ./charts/payment-api -n prod --atomic
helm list -n prod`,
    realWorldCases: [
      {
        company: 'Bitnami / CNCF Ecosystem Charts',
        scenario: 'Deploying complex observability stacks (kube-prometheus-stack, Grafana, Loki) with a single parameterized `values-prod.yaml`.',
        impactMetric: 'Standardizes 40+ Kubernetes manifests into 1 versioned OCI Helm chart artifact',
        architectureNote: 'Runs `helm template | kubeconform` in CI to validate rendered schemas before deployment.'
      },
      {
        company: 'Stripe & Intuit ArgoCD + Kustomize Overlays',
        scenario: 'Maintaining a single valid YAML `base/` directory per microservice and applying 15-line `overlays/prod/kustomization.yaml` patches for replica counts and HPA bounds.',
        impactMetric: 'Eliminates 90% of duplicate YAML boilerplate across 4 deployment environments',
        architectureNote: 'Because `base/` is valid plain YAML (no `{{ }}` syntax), IDEs and linters validate it without a template step.'
      },
      {
        company: 'GitLab Auto-DevOps `--atomic` Rollbacks',
        scenario: 'Running `helm upgrade --install --atomic --timeout 5m` so a failed ReadinessProbe automatically rolls back both the Deployment AND its companion ConfigMap.',
        impactMetric: 'Prevents config/code version skew when a release fails mid-rollout',
        architectureNote: 'Unlike `kubectl rollout undo` (which only reverts the Deployment), `helm rollback` reverts the entire release bundle.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-24-ex1',
        title: 'Exercise 1: Idempotent Helm Upgrade or Install with Auto-Rollback',
        difficulty: 'Essential',
        scenario: 'Which flag on `helm upgrade --install` automatically rolls back the release if the new Pods fail to become Ready within the timeout?',
        codeBefore: '$ helm upgrade --install api ./chart -n prod ',
        answer: '--atomic',
        acceptedAnswers: ['--atomic'],
        codeAfter: ' --timeout 3m',
        hint: 'Use --atomic.',
        explanation: '--atomic implies --wait and automatically triggers a helm rollback if the upgrade fails health checks.',
        xp: 55
      },
      {
        id: 'dk-24-ex2',
        title: 'Exercise 2: Render Helm Templates Locally Without a Cluster',
        difficulty: 'Core Practice',
        scenario: 'Write the `helm` subcommand to render `./chart` templates locally to stdout so you can inspect or lint the generated YAML:',
        codeBefore: '$ helm ',
        answer: 'template api ./chart',
        acceptedAnswers: ['template api ./chart', 'template ./chart'],
        codeAfter: ' -f values-prod.yaml',
        hint: 'Use helm template <release-name> <chart-path>.',
        explanation: 'helm template renders the Go templates locally using your values file without contacting a Kubernetes cluster.',
        xp: 65
      },
      {
        id: 'dk-24-ex3',
        title: 'Exercise 3: Apply a Kustomize Overlay Directory Natively with kubectl',
        difficulty: 'Mastery Challenge',
        scenario: 'Instead of `-f`, which flag on `kubectl apply` processes a `kustomization.yaml` overlay directory (`overlays/prod`)?',
        codeBefore: '$ kubectl apply ',
        answer: '-k overlays/prod',
        acceptedAnswers: ['-k overlays/prod', '-k overlays/prod/', '--kustomize overlays/prod'],
        codeAfter: '\ndeployment.apps/payment-api configured',
        hint: 'Use the -k (or --kustomize) flag.',
        explanation: 'kubectl apply -k <dir> invokes the built-in Kustomize engine to build the base + overlay patches and apply the result.',
        xp: 75
      }
    ]
  },
  {
    id: 'dk-25',
    chNum: 25,
    title: 'Production Kubernetes Troubleshooting: CrashLoopBackOff, OOMKilled, ImagePullBackOff & kubectl debug',
    description: 'Systematic incident runbooks, ephemeral debug containers for distroless pods & Prometheus/Grafana observability',
    difficulty: 'Expert',
    sectionGroup: 'Kubernetes Security & GitOps',
    summary: 'Master the systematic SRE runbook for diagnosing every Kubernetes failure state (`Pending`, `ImagePullBackOff`, `CreateContainerConfigError`, `CrashLoopBackOff`, `OOMKilled / Exit 137`), and use **Ephemeral Debug Containers (`kubectl debug -it <pod> --image=nicolaka/netshoot --target=app`)** to debug Distroless containers that have no shell!',
    analogy: 'A Distroless container is a sealed satellite in orbit with no maintenance hatch (`/bin/sh`). `kubectl debug` docks a space-shuttle repair module (`netshoot`) directly onto the satellite’s shared process and network namespaces so you can inspect its instruments live.',
    syntaxRows: [
      { syntax: 'kubectl debug -it <pod> --image=busybox --target=app', description: 'Attach an ephemeral debug container sharing PID & net namespaces of a distroless container', example: 'kubectl debug -it api-pod --image=nicolaka/netshoot' },
      { syntax: 'kubectl get events --sort-by=.lastTimestamp', description: 'Stream cluster-wide warning/error events ordered chronologically', example: 'kubectl get events -n prod --field-selector type=Warning' },
      { syntax: 'Last State: Terminated (Reason: OOMKilled, Exit Code: 137)', description: 'Diagnose cgroup memory limit exhaustion in kubectl describe pod', example: 'kubectl top pod --containers' },
      { syntax: 'kubectl port-forward svc/prometheus 9090:9090', description: 'Tunnel a local port directly to an internal cluster Service or Pod for debugging', example: 'kubectl port-forward pod/api-0 8080:8080' }
    ],
    deepExplanation: `### Complete Kubernetes Incident Triage Matrix
| Pod Status / Symptom | Root Causes | Exact Diagnostic Command & Fix |
| :--- | :--- | :--- |
| **\`Pending\`** | Insufficient Node CPU/RAM, unsatisfied \`nodeAffinity\`/\`Taint\`, or unbound \`PVC\` (AZ mismatch). | \`kubectl describe pod <p>\` $\\to$ Check \`Events: FailedScheduling\`. |
| **\`ImagePullBackOff\`** | Wrong image tag/digest, private registry missing \`imagePullSecrets\`, or registry rate limit. | \`kubectl describe pod <p>\` $\\to$ Verify tag & \`imagePullSecrets\`. |
| **\`CreateContainerConfigError\`** | Referenced \`ConfigMap\` or \`Secret\` key does not exist in the namespace. | \`kubectl get configmap,secret -n <ns>\` $\\to$ Create missing key. |
| **\`CrashLoopBackOff\`** | App process exiting non-zero on boot (uncaught exception, bad env var, failed \`livenessProbe\`). | \`kubectl logs <p> --previous\` $\\to$ Inspect crash stack trace! |
| **\`OOMKilled (Exit 137)\`** | Container exceeded \`resources.limits.memory\` and was killed by Linux cgroup OOM killer. | \`kubectl describe pod <p>\` $\\to$ Check \`Last State: OOMKilled\`; profile heap or raise memory limit. |`,
    terminalLabCode: `# Run the SRE incident triage workflow & attach an ephemeral debug container
kubectl get events --sort-by=.lastTimestamp
kubectl debug -it payment-api-7c8b9d-x2k9p --image=busybox --target=app`,
    realWorldCases: [
      {
        company: 'Google SRE Distroless Live Debugging',
        scenario: 'Attaching `kubectl debug -it <pod> --image=gcr.io/k8s-staging-e2e-test-images/agnhost --target=app` to inspect open sockets and `/proc/1/fd` on Distroless pods.',
        impactMetric: 'Full tcpdump/strace diagnostic power while keeping production images 100% shell-free',
        architectureNote: 'The Kubernetes EphemeralContainers API attaches a temporary debug container directly into the target container’s PID and network namespaces.'
      },
      {
        company: 'Datadog & Prometheus kube-state-metrics Alerting',
        scenario: 'Alerting on `kube_pod_container_status_last_terminated_reason{reason="OOMKilled"} > 0` before memory leaks trigger multi-pod outages.',
        impactMetric: 'Catches memory regressions within 60 seconds of canary deployment',
        architectureNote: 'Combines container_memory_working_set_bytes with cgroup memory limit ratios (`> 0.85`).'
      },
      {
        company: 'Cloudflare Incident Chronology Triage',
        scenario: 'Sorting namespace warning events chronologically via `kubectl get events --sort-by=.lastTimestamp` during cluster rollouts.',
        impactMetric: 'Pinpoints failed probe, volume mount, or scheduling errors in < 10 seconds',
        architectureNote: 'Surfaces kubelet, scheduler, and CNI warnings in a single unified timeline.'
      }
    ],
    mustSolve: [
      {
        id: 'dk-25-ex1',
        title: 'Exercise 1: Attach an Ephemeral Debug Container to a Distroless Pod',
        difficulty: 'Essential',
        scenario: 'Your Distroless Pod `api-pod` has no `/bin/sh` so `kubectl exec` fails. Which `kubectl` subcommand attaches an ephemeral debug container (`--image=busybox`) to the running Pod?',
        codeBefore: '$ kubectl ',
        answer: 'debug -it api-pod',
        acceptedAnswers: ['debug -it api-pod', 'debug api-pod'],
        codeAfter: ' --image=busybox --target=app',
        hint: 'Use debug -it api-pod.',
        explanation: 'kubectl debug creates an EphemeralContainer inside the running Pod sharing its network and process namespaces.',
        xp: 55
      },
      {
        id: 'dk-25-ex2',
        title: 'Exercise 2: Sort Cluster Events Chronologically',
        difficulty: 'Core Practice',
        scenario: 'Complete the `kubectl get events` command to sort all events in chronological order by their last timestamp:',
        codeBefore: '$ kubectl get events ',
        answer: '--sort-by=.lastTimestamp',
        acceptedAnswers: ['--sort-by=.lastTimestamp', '--sort-by=.metadata.creationTimestamp'],
        codeAfter: '',
        hint: 'Use --sort-by=.lastTimestamp.',
        explanation: 'kubectl get events --sort-by=.lastTimestamp orders cluster events chronologically so the newest failures appear at the bottom.',
        xp: 65
      },
      {
        id: 'dk-25-ex3',
        title: 'Exercise 3: Tunnel Local Port 8080 to an Internal Pod',
        difficulty: 'Mastery Challenge',
        scenario: 'Write the `kubectl` command to forward your local port `8080` directly to port `8080` of `pod/api-0` without exposing a public Service:',
        codeBefore: '$ ',
        answer: 'kubectl port-forward pod/api-0 8080:8080',
        acceptedAnswers: ['kubectl port-forward pod/api-0 8080:8080', 'kubectl port-forward api-0 8080:8080'],
        codeAfter: '\nForwarding from 127.0.0.1:8080 -> 8080',
        hint: 'Use kubectl port-forward pod/api-0 8080:8080.',
        explanation: 'kubectl port-forward establishes an authenticated SPDY/WebSocket tunnel through kube-apiserver to the target Pod port.',
        xp: 75
      }
    ]
  }
];

function buildDockerK8sLesson(spec: DockerK8sChapterSpec): LessonContent {
  const isHome = spec.chNum === 1 || spec.chNum === 11;
  return {
    id: spec.id,
    title: spec.title,
    estimatedReadingTime: '14 mins',
    beginnerSummary: spec.summary,
    realWorldAnalogy: spec.analogy,
    syntaxCheatTable: spec.syntaxRows,
    fillBlankExercise: {
      prompt: spec.mustSolve[0].scenario,
      codeBefore: spec.mustSolve[0].codeBefore,
      answer: spec.mustSolve[0].answer,
      codeAfter: spec.mustSolve[0].codeAfter,
      hint: spec.mustSolve[0].hint
    },
    mustSolveExercises: spec.mustSolve,
    homeResearchHighlights: isHome
      ? [
          {
            title: 'Borg, Omega, and Kubernetes: Lessons Learned from Three Container-Management Systems Over a Decade',
            organizationOrPaper: 'Google Research (Burns, Grant, Oppenheimer, Brewer, Wilkes — ACM Queue)',
            year: '2016',
            breakthroughSummary: 'Introduced declarative level-triggered reconciliation, label-selector decoupling, and the Pod abstraction sharing network/IPC namespaces.',
            productionImpact: 'Forms the architectural blueprint of Kubernetes running 85%+ of global cloud-native production workloads.'
          },
          {
            title: 'Linux Control Groups v2 (Unified Hierarchy) & eBPF Socket Routing',
            organizationOrPaper: 'Linux Kernel Organization / Meta & Cilium Engineering',
            year: '2019–2025',
            breakthroughSummary: 'Unified memory/CPU/IO resource controllers (`memory.high` / `memory.max`) and replaced O(N) iptables chains with O(1) eBPF kernel maps.',
            productionImpact: 'Enables 10,000+ node Kubernetes clusters with deterministic container isolation and zero-overhead Service routing.'
          }
        ]
      : undefined,
    realWorldUseCases: spec.realWorldCases.map((rc) => ({
      ...rc,
      codeSnippet: rc.codeSnippet || spec.terminalLabCode,
      codeLanguage: 'bash'
    })),
    contentMarkdown: `# ${spec.title}

## 1. Plain-English Architectural Intuition

${spec.summary}

> **Engineering Analogy**: ${spec.analogy}

---

## 2. Core Commands, Manifests & Internals

${spec.deepExplanation}

---

## 3. Essential CLI & Manifest Reference

| Command / Construct | What It Does | Production Example |
| :--- | :--- | :--- |
${spec.syntaxRows.map((r) => `| \`${r.syntax}\` | ${r.description} | \`${r.example}\` |`).join('\n')}

---

## 4. Interactive Docker & Kubernetes Terminal Lab (Try it Yourself)

Click **Try it Yourself →** to pop out the **Interactive Terminal & Code Editor** and execute these **${spec.title}** commands live:

\`\`\`bash
${spec.terminalLabCode}
\`\`\`
`,
    quizzes: [
      {
        id: `${spec.id}-q1`,
        question: spec.quiz.q1.question,
        options: spec.quiz.q1.options,
        correctAnswerIndex: spec.quiz.q1.correct,
        explanation: spec.quiz.q1.explanation
      },
      {
        id: `${spec.id}-q2`,
        question: spec.quiz.q2.question,
        options: spec.quiz.q2.options,
        correctAnswerIndex: spec.quiz.q2.correct,
        explanation: spec.quiz.q2.explanation
      }
    ],
    interviewQuestions: spec.interviews,
    codingChallenge: {
      title: `Hands-On Lab: ${spec.title}`,
      description: `Practice and verify the essential Docker & Kubernetes commands for ${spec.title}.`,
      language: 'bash',
      starterCode: spec.terminalLabCode,
      solutionCode: spec.terminalLabCode,
      hint: `Try running ${spec.syntaxRows[0].syntax} in the terminal sandbox.`
    },
    resources: [
      {
        title: `Official Documentation — ${spec.title}`,
        type: 'Documentation',
        authorOrSource: 'Docker & CNCF Kubernetes Docs'
      },
      {
        title: 'Kubernetes Production Best Practices & SRE Runbook',
        type: 'Engineering Blog',
        authorOrSource: 'CNCF / Google SRE'
      }
    ]
  };
}

const ALL_DOCKER_K8S_SPECS: DockerK8sChapterSpec[] = [
  ...DOCKER_K8S_SPECS,
  ...EXTRA_DOCKER_K8S_CHAPTERS.map((ch) => ({
    ...ch,
    quiz: {
      q1: {
        question: `Which command or manifest setting is the primary production construct for "${ch.title}"?`,
        options: [
          `${ch.syntaxRows[0].syntax} — ${ch.syntaxRows[0].description}`,
          'Running all containers in privileged root mode without resource limits or health probes',
          'Mutating running container filesystems manually via SSH without updating manifests',
          'Disabling container isolation and sharing a single static IP across all services'
        ],
        correct: 0,
        explanation: `\`${ch.syntaxRows[0].syntax}\` (${ch.syntaxRows[0].description}) is the standard production pattern for ${ch.title}.`
      },
      q2: {
        question: `In ${ch.title}, how does "${ch.mustSolve[0].answer}" improve container or cluster reliability?`,
        options: [
          ch.mustSolve[0].explanation,
          'It bypasses the Kubernetes API Server and writes unvalidated strings to disk.',
          'It deletes all persistent volumes on every pod restart.',
          'It disables TLS encryption across cluster nodes.'
        ],
        correct: 0,
        explanation: ch.mustSolve[0].explanation
      }
    },
    interviews: [
      {
        companyTag: `${ch.realWorldCases[0].company.split(' ')[0]} Cloud-Native Interview`,
        question: `How do you implement "${ch.title}" in a high-availability production cluster, and what failure mode does it prevent?`,
        answer: `${ch.summary} In production (${ch.realWorldCases[0].company}), we use \`${ch.syntaxRows[0].syntax}\` and \`${ch.syntaxRows[1].syntax}\` (${ch.realWorldCases[0].architectureNote}), achieving ${ch.realWorldCases[0].impactMetric}.`
      },
      {
        companyTag: `${ch.realWorldCases[1].company.split(' ')[0]} Infrastructure Round`,
        question: `When reviewing a Dockerfile or Kubernetes manifest for "${ch.title}", what is the #1 misconfiguration you check for?`,
        answer: `${ch.mustSolve[1].explanation} Additionally, ${ch.realWorldCases[1].architectureNote}`
      }
    ]
  }))
];

export const DOCKER_K8S_COURSE: Course = {
  id: 'c-docker',
  title: 'Docker & Kubernetes Cloud-Native Mastery',
  shortTag: 'Docker & K8s',
  levelTag: '25 Chapters · Containers to Production K8s',
  category: Category.DOCKER_K8S,
  icon: 'terminal',
  modules: ALL_DOCKER_K8S_SPECS.map(
    (s): CourseModule => ({
      id: s.id,
      title: s.title,
      description: s.description,
      difficulty: s.difficulty,
      sectionGroup: s.sectionGroup,
      isLocked: false
    })
  )
};

export const DOCKER_K8S_LESSONS: Record<string, LessonContent> = {};
for (const spec of ALL_DOCKER_K8S_SPECS) {
  DOCKER_K8S_LESSONS[spec.id] = buildDockerK8sLesson(spec);
}
