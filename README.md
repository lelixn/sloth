<div align="center">

<img src="./assets/sloth.svg" alt="Sloth" width="280" />

Sloth

Git, without the busywork.

A lightweight, open-source VS Code extension for faster Git workflows.

Sloth brings the repetitive parts of Git into your editor — from repository status and smart commit messages to a fast, reviewable commit workflow.

<br />



<br />

Website · Documentation · Issues · Discussions · Contributing

</div>

Why Sloth?

Git is already great.

The problem is the repetition.

$ git status
$ git add .
$ git diff
$ git commit -m "..."
$ git push

Sloth removes the small interruptions between writing code and shipping code.

Write code → Sloth handles the boring Git parts → keep building.

✨ What Sloth does

<table>
<tr>
<td width="50%">

🧠 Smart commits

Generate a conventional commit message from the files you're changing.

feat(auth): improve token refresh flow

The message is always editable before anything is committed.

</td>
<td width="50%">

📊 Git status

Get a compact repository snapshot without leaving VS Code.

main

2 staged
3 modified
1 untracked

</td>
</tr>

<tr>
<td width="50%">

⚡ Local commit workflow

One command turns the usual sequence into:

Changes
  ↓
Analyze
  ↓
Review
  ↓
Stage
  ↓
Commit

</td>
<td width="50%">

🖥 Developer-first UI

Sloth uses a terminal-inspired experience instead of another dashboard competing for your screen.

[✓] repository detected
[✓] changes analyzed
[✓] commit created

</td>
</tr>
</table>

🚀 Current status

Sloth is intentionally being built in public.

Capability

Status

VS Code extension foundation

✅

Git repository detection

✅

Git status

✅

Smart commit generation

✅

Local commit workflow

✅

Terminal-style output

✅

Push / Pull

🚧

Branch management

📋

AI commit messages

📋

Sloth sidebar

📋

One-click Ship workflow

📋

VS Code Marketplace release

📋

✅ shipped · 🚧 in progress · 📋 planned

🧪 See it in action

══════════════════════════════════════════════════
             S L O T H  /  G I T
══════════════════════════════════════════════════

$ sloth commit

> scanning repository...
  ✓ repository detected

> analyzing changes...
  ✓ 4 files changed

> generating commit message...
  ✓ feat(auth): improve token refresh flow

> waiting for confirmation...

  [ Commit ]  [ Cancel ]

> staging changes...
  ✓ git add complete

> creating commit...
  ✓ a83f21c

──────────────────────────────────────────────────

             🦥 SHIPPED LOCALLY

  a83f21c  feat(auth): improve token refresh flow

══════════════════════════════════════════════════

📦 Installation

Development build

Sloth is currently pre-release.

git clone https://github.com/YOUR_USERNAME/sloth.git
cd sloth
npm install
npm run compile

Open the project in VS Code:

code .

Press F5 to launch the Extension Development Host.

Marketplace

Coming soon.

The Marketplace listing will be linked here once the first stable release is published.

🎮 Commands

Open the VS Code Command Palette with Ctrl + Shift + P and search for Sloth.

Command

Description

Sloth: Hello

Verify the extension is running

Sloth: Git Status

Inspect the current repository

Sloth: Generate Commit Message

Generate an editable commit message

Sloth: Commit

Analyze, stage and commit current changes

🧠 How commit generation works

The current generator is intentionally local and deterministic.

It looks at:

changed file names

file extensions

folder names

common development patterns

Then it derives a conventional commit type and scope.

Changed files
     │
     ▼
┌───────────────┐
│ File analysis │
└───────┬───────┘
        │
        ▼
 Type + Scope
        │
        ▼
┌──────────────────────────────┐
│ feat(auth): improve login   │
└──────────────────────────────┘

For example:

src/auth/login.ts
src/auth/token.ts

may produce:

feat(auth): improve authentication workflow

While:

README.md

may produce:

docs: update documentation

The developer remains in control: Sloth suggests, you decide.

🏗 Architecture

Sloth keeps the extension small and modular.

┌───────────────────────────────┐
│          VS Code UI           │
└───────────────┬───────────────┘
                │
        ┌───────▼────────┐
        │    Commands    │
        └───────┬────────┘
                │
        ┌───────▼───────────────┐
        │       Services        │
        │                       │
        │  GitService           │
        │  CommitMessageService │
        └───────┬───────────────┘
                │
        ┌───────▼────────┐
        │      Git       │
        └────────────────┘

Repository structure

src/
├── commands/
│   ├── hello.ts
│   ├── status.ts
│   ├── generateCommit.ts
│   └── commit.ts
│
├── services/
│   ├── gitService.ts
│   └── commitMessageService.ts
│
├── providers/
├── utils/
└── extension.ts

The goal is simple:

Commands orchestrate. Services do the work.

🛠 Tech stack

Technology

Role

TypeScript

Extension language

VS Code Extension API

Editor integration

Node.js

Runtime

simple-git

Git operations

ESLint

Code quality

npm

Dependency management

No backend is required for the current core workflow.

🧑‍💻 Development

# install dependencies
npm install

# compile
npm run compile

# watch TypeScript
npm run watch

# lint
npm run lint

Then open the project in VS Code and press:

F5

This launches the Extension Development Host.

Before opening a PR

npm run compile
npm run lint

Make sure both complete without errors.

🤝 Contributing

Sloth is built in public and contributions are welcome.

You can contribute by:

fixing bugs

improving Git workflows

improving commit generation

improving the developer experience

adding documentation

creating issues

proposing new ideas

Local setup

git clone https://github.com/YOUR_USERNAME/sloth.git
cd sloth
npm install
npm run compile

Create a branch:

git checkout -b feat/your-feature

Make your changes, test them, and open a pull request.

Commit convention

Sloth follows Conventional Commits where practical:

feat(status): add repository summary
fix(commit): handle empty commit message
docs(readme): improve installation guide
refactor(git): simplify repository detection

💡 Roadmap

0.1 — Foundation

Extension foundation

Git service

Git status

Commit message generation

Local commit workflow

0.2 — Git workflow

Push

Pull

Stage / unstage

Branch management

Commit history

0.3 — Sloth UI

Custom activity-bar sidebar

Repository dashboard

Interactive workflow

Better terminal experience

2D Sloth animations

0.4 — Intelligence

AI commit messages

Diff summarization

Commit suggestions

Configurable commit styles

1.0 — Ship

One-click Ship

Stable API

Marketplace release

Full documentation

Community-driven roadmap

🔐 Privacy

Sloth's current core workflow is local.

There is no required Sloth backend for:

Git status

commit generation

staging

local commits

Future AI functionality will clearly document what data is sent to an external provider and how that behavior can be configured.

📄 License

Sloth is intended to be released under the MIT License.

See LICENSE for the complete license text.

🦥 Philosophy

Sloth isn't trying to replace Git.

Git is excellent.

Sloth exists because developers shouldn't have to repeatedly stop building to perform the same tiny Git tasks.

You build.

Sloth handles the boring parts.

              🦥

<div align="center">

Git, without the busywork.

Built in public. Built for developers.

<br />

⭐ Star · 🐛 Report a bug · 💡 Request a feature

</div>
