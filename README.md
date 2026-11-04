# TinigNa

**An Anonymous Mobile Course Feedback Application**

> *Tinig* is the Filipino word for "voice." TinigNa lets students give honest, anonymous feedback in the middle of the semester, and lets instructors act on it while the course is still running.

| | |
|---|---|
| **Course** | ITMSD1 – Introduction to Mobile Design and Tools (1st Sem 2026–2027) |
| **Event** | ITMSD1 Inter-Class Mobile Hackathon (Section C & Section F) |
| **UN SDG Track** | SDG 16: Peace, Justice and Strong Institutions |
| **Team** | [Team ID] · [Team Name] |
| **Members** | Orlando C. Tordill · Aira Mae B. Tabudlong · Dianne G. Salazar |
| **Roles** | [Assign: Lead UI/UX (Leader), Lead Mobile Dev, Product & AI Specialist] |

## Problem

Students often hold back honest feedback because they fear being identified or affecting their grades. End-of-term evaluations arrive too late to help the class that gave them, and instructors receive vague, scattered, or no feedback.

**How might we** help students give honest, safe feedback in the middle of the semester, so instructors can improve the course while the class is still running?

## Users

- **Students** (primary): give anonymous feedback, optionally report concerns, and see what changed.
- **Instructors** (secondary): create courses, review themed summaries, and publish actions.
- **Guidance office staff**: review and respond to concern reports. *(Scope to be confirmed with the school.)*

## Core Features (MVP scope)

- Join a course with a code or QR scan. No name, email, or student ID is stored with feedback.
- Rate pace, clarity, and materials, and add an optional comment.
- "You Said, We Did" feed showing instructor responses.
- Instructor dashboard with response counts, average ratings, and a themed comment summary.
- Summaries stay locked until at least 5 responses arrive, so no single comment can be traced.
- *(Module, scope to be confirmed)* Anonymous concern reporting with a tracking code and status updates.

## Design

| Deliverable | Link |
|---|---|
| Week 1: Low-fidelity wireframes, personas, journeys, information architecture | https://www.figma.com/design/e0aMk6cmEc8Ghwkv8GaivO |
| Week 2: Design system, components, hi-fi clickable prototype | https://www.figma.com/design/EBeNucUFv8DA81ZrMChduu |

- **Typeface:** Roboto
- **Spacing:** 8pt grid
- **Color:** 60-30-10 rule (60% neutral, 30% navy `#1F3A5F`, 10% gold `#F2B01E`)
- **Accessibility:** WCAG 2.1 AA contrast verified for text and key UI colors; 48 dp minimum touch targets

## Tech Stack

> Update this section when the stack is finalized.

- **Framework:** [Flutter / React Native / Kotlin / Swift]
- **State management:** [Provider / Riverpod / Bloc / setState]
- **Persistence:** [shared_preferences / SQLite / Supabase / Firebase / mock JSON]

## Project Structure

> Planned layout. Adjust to the chosen framework.

```
tinigna-mobile-app/
├── README.md
├── AI_DISCLOSURE_LOG.md
├── docs/            # reports, pitch deck, screenshots
├── assets/          # images, icons, fonts
└── lib/ or src/     # application source code
```

## Getting Started

> Add exact commands once the project scaffold exists.

```bash
git clone https://github.com/orlandojrtordil-bot/tinigna-mobile-app.git
cd tinigna-mobile-app
# install dependencies and run the app (framework-specific)
```

## Roadmap

| Week | Focus | Status |
|---|---|---|
| 1 | Problem framing, personas, low-fi wireframes | Done (verify before submitting) |
| 2 | Design system and interactive Figma prototype | In progress (usability testing pending) |
| 3 | Mobile MVP scaffold, 3+ core screens, state and persistence | Planned |
| 4 | Code freeze, pitch deck, Demo Day | Planned |

## AI Disclosure

Generative AI tools were used in this project. All usage, prompts, and human edits are documented in [`AI_DISCLOSURE_LOG.md`](./AI_DISCLOSURE_LOG.md).
