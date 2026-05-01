# Sportology - AI Agent Steering Guide

> **Purpose**: This file steers AI agents working on this codebase. It focuses on principles, patterns, and verification — not implementation details.
> **MANDATORY**: You MUST follow the Auto Agent Detection & Parallel Execution Protocol below on EVERY task and read the karabathy skill and examples and follow it perfectly for each task and thinking process .opencode\agent\karpathy-guidelines.md  D:\clones\edrak\.opencode\agent\karpathy-guidelines-EXAMPLES.md   .

---

## Auto Agent Detection & Parallel Execution Protocol [MANDATORY]

> **These rules are NOT optional. They are the default mode of operation for every task.**

### 1. Automatic Agent Detection
**You MUST automatically detect and delegate to the correct specialized agent for the task.** Do NOT ask the user which agent to use. Do NOT default to a generic agent. Analyze the task and pick the best fit immediately.

**Detection Rules:**
- Database schema changes, migrations, queries, indexing → `database-architect` (or `prisma-optimizer` for query-only fixes)
- Auth flows, security reviews, vulnerability scanning → `security-auditor` (or `security-scanner` for focused scans)
- Performance issues, Web Vitals, bundle size, slow queries → `performance-engineer` (or `perf-analyzer` for profiling)
- API endpoints, tRPC routers, Zod schemas, validation → `api-designer`
- React components, hooks, state management, rendering → `react-specialist`
- Next.js routing, App Router, Server Components, deployment → `nextjs-developer`
- UI design, component libraries, design systems → `ui-designer`
- Full end-to-end features (DB + API + UI) → `fullstack-developer`
- Backend services, business logic, microservices → `backend-developer`
- TypeScript types, generics, type safety → `typescript-pro`
- Tests (unit, integration, E2E, Playwright) → `testing-qa-expert`
- Accessibility audits, ARIA, screen readers → `accessibility-expert`
- SEO metadata, structured data, sitemaps → `seo-specialist`
- CI/CD, Docker, Vercel, infrastructure → `devops-engineer`
- Code quality, refactoring, ESLint, standards → `code-quality-enforcer`
- Complex task planning and architecture → `dev-planner`
- Post-implementation code review → `superpowers-code-reviewer`

### 2. Automatic Skill Loading
**You MUST automatically load relevant skills BEFORE starting work.** Do NOT ask the user if they want to load a skill. Match the task to skills and load them immediately.

**Auto-Load Mapping:**
- Schema changes → `skill database-design`
- Auth/security work → `skill security-hardening` + `skill auth-security`
- Performance work → `skill performance-optimization` + `skill prisma-optimization`
- API work → `skill api-design`
- React/Next.js work → `skill nextjs-patterns`
- Component building → `skill accessibility` + `skill responsive-design`
- Testing → `skill testing-strategy`
- SEO work → `skill seo-optimization`
- Payment features → `skill payment-integration`
- Notifications → `skill notification-system`
- Error handling → `skill error-handling`
- Code review → `skill code-review`

### 3. Parallel Execution is DEFAULT
**You MUST use parallel execution for multi-step tasks.** Do NOT work sequentially unless there is a strict dependency chain. Launch multiple agents/tools in parallel whenever possible.

**Parallel Patterns:**
- **Research + Implementation**: Research context with `ctx_execute` while preparing implementation plan
- **Multi-file changes**: Edit independent files in parallel
- **Subagent delegation**: Launch multiple subagents for different aspects of the same task
- **Verification**: Run build/lint/type-check in parallel after changes

**Example:**
```
User: "Add a quiz system to courses"
Agent Response:
1. skill database-design
2. skill api-design
3. skill nextjs-patterns
4. Launch parallel tasks:
   - database-architect: Design schema
   - api-designer: Create tRPC routers
   - react-specialist: Build UI components
5. Merge results and implement
6. Run verification in parallel (build:strict + type-check + lint)
```

### 4. Visual & Organized Output
**You MUST organize ALL output for the user in a clear, visual format.** Never dump raw text or unorganized code blocks.

**Output Formatting Rules:**
- Use **Markdown tables** for comparisons, agent assignments, and status tracking
- Use **emoji indicators** for status: 🟢 Complete / 🟡 In Progress / 🔴 Blocked / ✅ Verified
- Use **headers and sections** to separate concerns
- Use **collapsible summaries** for large code blocks
- Provide a **Task Summary** at the end with: what was done, files changed, agents used, verification status
- Use **progress bars** or **checklists** for multi-step work

**Required Output Structure:**
```markdown
## Task Summary
| Agent | Role | Status |
|-------|------|--------|
| database-architect | Schema design | 🟢 Done |
| api-designer | Router creation | 🟢 Done |
| react-specialist | UI components | 🟡 In Progress |

## Changes Made
- `prisma/schema.prisma` - Added Quiz, QuizQuestion, QuizAttempt models
- `src/server/api/routers/student/quiz.ts` - Quiz API endpoints
- `src/components/quiz/QuizCard.tsx` - Quiz UI component

## Verification
- [x] `pnpm run type-check` passed
- [x] `pnpm run lint` passed
- [ ] `pnpm run build:strict` pending
```

---

## Core Principles

### 1. Verify First, Assume Nothing
- **Always verify** the current state before making changes
- **Don't recreate** work that's already done
- **Read before writing** — understand the codebase before modifying it
- **Never hallucinate git state** — if you don't know, run `git status` and read the output

### 2. Clean Architecture & Structure
- Follow existing patterns and conventions
- Maintain **Separation of Concerns (SOC)** — keep business logic, UI, and data access separate
- Apply **YAGNI** — don't add functionality until it's actually needed
- Apply **DRY** — don't repeat yourself; extract reusable patterns

### 3. Auto Agent Detection & Smart Skills
- **Automatically detect** the correct agent type for the task
- **Use specialized skills** from the `.opencode/skills/` directory when available
- **Delegate to subagents** for parallel work when appropriate
- Load skills with `skill <name>` before starting relevant work

### 4. Planning & Understanding
1. **Understand** the task and context first
2. **Plan** the approach before coding
3. **Verify** assumptions about the codebase
4. **Execute** with minimal, focused changes
5. **Test** to ensure correctness

---

## CRITICAL: Git State Awareness Protocol [MANDATORY]

> **These rules prevent destructive loops, lost work, and false claims about repository state.**

### The Golden Rule of Git Operations
**Before ANY git command, verify the current state. Never assume.**

### Mandatory Checks Before Git Commands
Run ALL of these in parallel before touching git:
```bash
git status --short                # What's modified/staged/untracked?
git log --oneline -5              # Where is HEAD?
git log --oneline origin/main..HEAD  # Commits ahead of origin?
git stash list                    # Anything stashed?
git diff --cached --name-only     # Staged files?
```

### Forbidden Patterns (NEVER Do These)
1. **NEVER claim "I didn't commit anything" without running `git log`**
2. **NEVER run `git reset` without first confirming HEAD vs origin/main`**
3. **NEVER assume unstaged files are the only changes** — check commits ahead of origin
4. **NEVER ignore `git stash list` — stashed work is invisible in status**
5. **NEVER run destructive commands (`reset --hard`, `clean -fd`) without user explicit confirmation**

### When User Claims File Count Mismatch
If user says "I had 90 files but only see 16", immediately check:
```bash
git diff --name-only origin/main..HEAD   # Files in unpushed commits
git diff --cached --name-only            # Staged files
git diff --name-only                     # Unstaged files
git stash show --name-only "stash@{0}"   # Stashed files
```
**Do NOT proceed with edits until you reconcile the numbers.**

### The Reset Trap
`git reset --mixed` is safe for content, but it changes commit history pointers. **Always tell the user exactly what commits are being undone before resetting.**

---

## CRITICAL: Checklist-Before-Action Protocol [MANDATORY]

> **Lessons from repeated failures: Create a checklist FIRST, then execute item by item.**

### The Pattern
When a task involves multiple similar items (tickets, files, components):

1. **Create the checklist BEFORE touching any code**
2. **Work through it item by item — do not skip**
3. **Mark each item complete immediately after finishing**
4. **Never say "done" for the batch until every item is verified**

### Real-World Example (What NOT to Do)
❌ **Wrong:** Update the master index, claim all tickets are done, but never add completion notes to individual tickets.

✅ **Right:** 
```
Tickets needing completion notes:
- [ ] 15-jobs-page.md
- [ ] 16-job-detail-page.md
- [ ] 27-application-modal.md
... (all 8)
```
Then edit each one, marking complete as you go.

### Verification Per Item
Each checklist item must have its own verification step. Do not batch-verify at the end. Verify immediately after each item.

---

## CRITICAL: Anti-Hallucination Rules [MANDATORY]

### Definition
**Hallucination** = Making a confident claim about system state without evidence, or acting on an assumption you haven't verified.

### Forbidden Hallucinations
| Hallucination | Example | Correct Action |
|---------------|---------|----------------|
| "I didn't commit anything" | Engineer claims no commits made | Run `git log --oneline -5` and read it |
| "Those files are unstaged" | Assuming all changes are in working tree | Check commits ahead of origin with `git log origin/main..HEAD` |
| "The build passes" | Claiming without running command | Actually run `pnpm run build:strict` |
| "That file exists at X" | Assuming path without checking | Use `glob` or `read` to verify |
| "This is already done" | Marking ticket complete without reading | Read the ticket file first |

### Verification Commands (Run Before Claiming)
- **File exists?** → `glob` or `read`
- **Build passes?** → `pnpm run build:strict`
- **No commits made?** → `git log --oneline -5`
- **All files accounted for?** → `git diff --name-only origin/main..HEAD`
- **Type-safe?** → `pnpm run type-check`

### The Rule of Evidence
**Every claim about system state must be backed by a tool call you just made.** If you didn't run the command, you don't know. Say "Let me check" instead of guessing.

---

## Context Mode Rules

### Purpose
- This project uses **context-mode** with OpenCode MCP/plugin support
- Prefer **`ctx_execute`** when a task benefits from structured context retrieval, repository-aware guidance, or rule-based execution flow
- Treat context-mode as part of the normal workflow, not as an optional extra, when the task is non-trivial or spans multiple files [web:4]

### When to Use `ctx_execute`
- Use `ctx_execute` for **multi-step tasks**
- Use `ctx_execute` for **cross-file refactors**
- Use `ctx_execute` for **architecture-sensitive changes**
- Use `ctx_execute` for tasks that require **understanding existing patterns before editing**
- Use `ctx_execute` when the user asks for **guided, safe, or verification-first changes** [web:4]

### When Direct Work Is Fine
- Direct edits are acceptable for **small, isolated, low-risk changes**
- Direct answers are acceptable for **simple explanations, short fixes, or single-file cosmetic edits**
- If the task grows in scope, switch back to `ctx_execute` [web:4]

### Required Behavior
1. First **understand and verify** the task
2. If the task is non-trivial, **prefer `ctx_execute` before making broad changes**
3. Follow the repository's existing conventions, architecture, and boundaries
4. Keep changes minimal, focused, and reversible
5. Re-verify after changes with the appropriate checks [web:4][page:2]

### Context Mode Priorities
- Preserve architecture over speed
- Prefer existing patterns over new abstractions
- Prefer verification over assumption
- Prefer minimal diffs over broad rewrites
- Prefer safe incremental progress over speculative changes

---

## Project Architecture

### Tech Stack
- Next.js 15 (App Router, React 19)
- tRPC 11 + SuperJSON
- PostgreSQL + Prisma 6
- NextAuth 4
- Tailwind CSS 4 + shadcn/ui
- pnpm 10

### Directory Structure
```text
src/
├── app/                 # Next.js App Router (pages by role: admin/, professor/, student/)
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── forms/           # Form components
│   └── providers/       # Context providers
├── server/
│   ├── api/             # tRPC routers (organized by domain: admin/, professor/, student/, public/)
│   ├── services/        # Business logic services
│   ├── db.ts            # Prisma client singleton
│   └── auth.ts          # NextAuth config
├── lib/
│   ├── utils.ts         # Utilities (cn(), etc.)
│   ├── auth.ts          # Auth helpers
│   └── validators/      # Zod schemas
├── hooks/               # Custom React hooks
└── types/               # TypeScript types
```

---

## Key Patterns

### Database (Prisma)
- Always import `db` from `@/server/db` — never create new `PrismaClient()`
- Migration workflow: edit schema → `pnpm prisma migrate dev --name <desc>` → `pnpm prisma generate`

### API (tRPC)
- Routers organized by domain under `src/server/api/routers/{domain}/`
- Procedures: `publicProcedure` (open), `protectedProcedure` (any auth), `adminProcedure` (admin only)
- Register new router: create → export from domain index → add to root

### UI (shadcn/ui)
- Components use Radix UI + Tailwind
- Always use `cn()` for class merging
- Prefer Server Components; use `'use client'` only for interactivity

### Auth
- Session available via `ctx.session.user` in tRPC context
- Role-based routing: `app/{role}/` directories
- Middleware handles role redirects

### Paths
- Use `@/*` aliases (maps to `src/*`)
- Never use relative paths like `../../`

---

## Essential Commands

```bash
pnpm run dev              # Start dev server
pnpm run build:strict     # Lint → type-check → prisma → build
pnpm run lint             # ESLint
pnpm run type-check       # TypeScript check
pnpm prisma migrate dev   # Create migration
pnpm prisma generate      # Regenerate client
pnpm run db:seed:all      # Seed database
pnpm run db:studio        # Prisma Studio GUI
```

---

## Working with This Codebase

### Before You Start
1. **Load relevant skills automatically** per the Auto Agent Detection Protocol above
2. **Detect and delegate** to the correct specialized agent
3. **Verify the task hasn't been done**
4. **Understand** the existing patterns
5. **Plan your changes**
6. **For non-trivial work, prefer `ctx_execute`** to gather structured context first [web:4]
7. **Check git state** — run the Mandatory Git Checks above before making any changes

### While Working
1. Follow existing code style
2. Keep changes minimal and focused
3. Maintain separation of concerns
4. Don't add what you don't need (YAGNI)
5. **Execute in parallel** whenever there are independent sub-tasks
6. If the task expands across files or layers, switch to `ctx_execute` [web:4]
7. **Use checklists** for multi-item tasks — create the list first, then work through it
8. **Verify each item individually** — don't batch-verify at the end

### When Done
1. Run `pnpm run build:strict` to verify
2. Ensure no duplication (DRY)
3. Verify logic is in the right layer (SOC)
4. Confirm the final result matches existing architectural patterns
5. **Present results in the Visual Output Format defined above**
6. **Verify git state** — ensure you know exactly what's committed, staged, unstaged, or stashed

### Multi-State File Scenarios
When a user says "I have files everywhere" or "my numbers don't match", files may exist in **four places simultaneously**:

| State | Command to Check | Included in `git status`? |
|-------|------------------|---------------------------|
| **Unpushed commits** | `git log origin/main..HEAD` | ❌ No |
| **Staged** | `git diff --cached --name-only` | ✅ Yes (green) |
| **Unstaged** | `git diff --name-only` | ✅ Yes (red) |
| **Stashed** | `git stash show --name-only "stash@{0}"` | ❌ No |

**Always check all four states** before concluding where files are.

---

## File Locations Quick Reference

| Purpose | Location |
|---------|----------|
| API endpoint | `src/server/api/routers/{domain}/{feature}.ts` |
| UI component | `src/components/ui/` |
| Page | `src/app/{route}/page.tsx` |
| Server action | `src/app/actions/` |
| Database schema | `prisma/schema.prisma` |
| Business logic | `src/server/services/` |
| Types | `src/types/` |
| Validators | `src/lib/validators/` |

---

## Agent & Skill Reference

### Primary Agents (`.opencode/agent/`)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `backend-developer` | Server-side APIs, microservices, backend systems | Building APIs, services, business logic |
| `fullstack-developer` | Complete features spanning DB, API, frontend | End-to-end feature development |
| `nextjs-developer` | Next.js 15 App Router, full-stack Next.js | Next.js architecture, routing, deployment |
| `react-nextjs-expert` | SSR, SSG, ISR, React Server Components | Rendering strategies, data fetching |
| `typescript-pro` | Advanced TypeScript, type safety | Complex types, generics, type architecture |
| `ui-designer` | Visual design, design systems, component libraries | Creating design systems, UI components |
| `ui-designer-and-code-perfector` | UI design + code quality | Design implementation with clean code |
| **database-architect** | PostgreSQL, Prisma, schema design | DB schema changes, migrations, optimization |
| **security-auditor** | OWASP, auth, input validation | Security reviews, auth flows, vulnerability scanning |
| **performance-engineer** | Core Web Vitals, bundle optimization | Performance analysis, optimization, profiling |
| **api-designer** | tRPC routers, Zod validation, API contracts | API design, validation schemas, endpoint structure |
| **testing-qa-expert** | Unit, integration, E2E with Playwright | Test writing, coverage, QA processes |
| **accessibility-expert** | WCAG 2.1 AA, ARIA, screen readers | Accessibility audits, a11y implementation |
| **seo-specialist** | Metadata, structured data, sitemaps | SEO optimization, search visibility |
| **devops-engineer** | CI/CD, Docker, Vercel, infrastructure | Deployment, pipelines, monitoring |
| **react-specialist** | React 19, Server Components, hooks | React architecture, component design |
| **code-quality-enforcer** | ESLint, refactoring, clean code | Code standards, refactoring, debt reduction |

### Subagents (`.opencode/agent/subagent/`)

| Agent | Description | When to Use |
|-------|-------------|-------------|
| `dev-planner` | Task planning and architecture | Breaking down complex tasks |
| `superpowers-code-reviewer` | Post-implementation code review | Reviewing completed work against plans |
| **prisma-optimizer** | Query-level Prisma optimization | Specific slow queries, N+1 fixes |
| **security-scanner** | Focused security vulnerability scanning | Scanning specific files/features for issues |
| **perf-analyzer** | Component/page-level performance profiling | Profiling specific pages or components |
| **ux-reviewer** | Usability and UX pattern review | Reviewing specific flows for UX issues |

### Skills (`.opencode/skills/`)

Load skills with `skill <name>` before starting relevant work.

| Skill | Description | Load When |
|-------|-------------|-----------|
| `database-design` | Prisma schema design, migrations, indexing | Working on schema changes |
| `security-hardening` | Auth, validation, OWASP, data protection | Security work, auth features |
| `performance-optimization` | Web Vitals, bundle size, caching | Performance improvements |
| `code-review` | Structured review checklists, best practices | Reviewing code |
| `api-design` | tRPC patterns, validation, error handling | Designing APIs |
| `testing-strategy` | Unit, integration, E2E test patterns | Writing tests |
| `accessibility` | WCAG, ARIA, keyboard navigation | Building UI components |
| `seo-optimization` | Metadata, structured data, sitemaps | SEO work |
| `nextjs-patterns` | App Router, Server Components, caching | Next.js development |
| `prisma-optimization` | Query optimization, N+1 prevention | Optimizing queries |
| `auth-security` | NextAuth, RBAC, session management | Auth features |
| `responsive-design` | Tailwind patterns, mobile-first, RTL | Responsive UI work |
| `error-handling` | Error boundaries, logging, monitoring | Error management |
| `payment-integration` | Paymob, webhooks, idempotency | Payment features |
| `notification-system` | In-app, WhatsApp, real-time | Notification features |

## External References

- `README.md` - Full project documentation
- `CREDENTIALS.md` - Test credentials (reference only, never hardcode)
- `prisma/seeds/README.md` - Seeding documentation
- `.opencode/skills/` - Available agent skills

---

## Agent Startup Reminder

At the start of a task:
1. Read this file first
2. **Auto-detect the correct agent** — do NOT ask the user, pick it immediately
3. **Auto-load relevant skills** per the Auto-Load Mapping above
4. Verify the current code before proposing changes
5. **Plan parallel execution** for multi-step tasks
6. Use skills from `.opencode/skills/` when relevant (load with `skill <name>`)
7. Delegate to specialized agents/subagents for complex sub-tasks
8. Prefer `ctx_execute` for non-trivial, cross-cutting, or architecture-sensitive tasks
9. **Format output visually** with tables, checklists, and status indicators
10. Finish with focused verification, not assumptions