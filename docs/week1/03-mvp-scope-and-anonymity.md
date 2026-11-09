# 3. MVP scope and anonymity decisions

## MVP core (Week 3 needs at least 3 coded screens)

**Student:** join a course with a code, fill in a short feedback form (ratings for pace, clarity, materials, plus an optional comment), then see a "You Said, We Did" feed.

**Instructor:** a course dashboard with the response count, a themed summary of comments, and a way to post a response or action plan.

**Demo flow for the pitch:** join with a code, submit feedback, switch to the instructor view, see the themes, post an action.

## Second module (roadmap)

Concern Reporting (Flows 3 and 5) goes to designated staff, not to the course instructor. Treat it as a second module or future-roadmap item so the MVP stays small.

## Two design decisions

1. **Real anonymity.** Do not store a student ID on feedback records. Use a course join code or a one-time token to block duplicate submissions without linking identity.
2. **Minimum response threshold.** Hide summaries until at least 5 responses are in, because in a small class one comment can reveal who wrote it.

## Safety notes

- Reports are handled by designated staff. The app does not replace real help. Screen 17 shows emergency contacts.
- Photos can reveal identity through file metadata. Strip it on upload.
- The tracking code is how anonymous reporters follow up. Explain it clearly to users.
- Plan how staff handle false or abusive reports.

## AI feature (planned)

Group comments into themes such as "pacing too fast" or "need more examples", and remove names or identifying details before the instructor sees comments. Log every prompt in `AI_DISCLOSURE_LOG.md`.

## Team roles

| Role | Responsibility | Member |
|---|---|---|
| Lead UI/UX | Flows, wireframes, design system | ___ |
| Lead Mobile Dev | Screens, state, persistence | ___ |
| Product and AI Specialist | Personas, research, theming feature, AI log | ___ |

Members: Orlando C. Tordill, Aira Mae B. Tabudlong, Dianne G. Salazar. Fill in who holds which role.
