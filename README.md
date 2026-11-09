# TinigNa

**An Anonymous Mobile Feedback and Course Improvement Platform for Students and Instructors**

| | |
|---|---|
| UN SDG track | SDG 16: Peace, Justice and Strong Institutions |
| Course | ITMSD1 · Inter-Class Mobile Hackathon |
| Team | F-3 · MGA ANAK NG A.I |
| Members | Orlando C. Tordill, Aira Mae B. Tabudlong, Dianne G. Salazar |
| Platform | Mobile (390 × 844 frames) |
| Design file | [Figma: TinigNa Low-Fi Wireframes](https://www.figma.com/design/HrlaQraT3J4v7FTTng6ZdP) (set sharing to "Anyone with the link can view") |

## The problem

End-of-term evaluations come too late to help the students who gave them. Students may hold back honest comments if they fear being identified or affecting their grades. Instructors get vague feedback, or none, and what they do get is scattered across group chats.

## Our idea

Students join a course with a code and send short, anonymous feedback in the middle of the semester. Instructors see grouped themes and post what they will change. Students see the result in a "You Said, We Did" feed. A separate concern-reporting module sends reports about bullying or rule violations to designated staff, not to the course instructor.

**How might we** help students give honest, safe feedback in the middle of the semester, so instructors can improve the course while the class is still running?

## Why SDG 16

TinigNa supports SDG 16 targets for effective, accountable and transparent institutions (16.6) and responsive, inclusive and participatory decision-making (16.7). Students get a safe voice, and instructors and schools show what they did in response.

## Design principles

- **Anonymous by design:** no name or student ID is stored with a response.
- **Protected summaries:** summaries stay locked until at least 5 responses are in, so no single comment can be traced.
- **Close the loop:** instructors post actions that students see in "You Said, We Did".

## Week 1 deliverables

| Deliverable | Where |
|---|---|
| Problem framing and HMW | [docs/week1/01-problem-and-hmw.md](docs/week1/01-problem-and-hmw.md) |
| Personas and user journeys | [docs/week1/02-personas-and-journeys.md](docs/week1/02-personas-and-journeys.md) |
| MVP scope and anonymity decisions | [docs/week1/03-mvp-scope-and-anonymity.md](docs/week1/03-mvp-scope-and-anonymity.md) |
| Low-fidelity wireframes (flows and screen list) | [docs/week1/04-wireframes.md](docs/week1/04-wireframes.md) |
| Wireframe images | `docs/week1/wireframes/` (export from Figma, see below) |
| AI use log | [AI_DISCLOSURE_LOG.md](AI_DISCLOSURE_LOG.md) |

## Status

- Week 1: low-fi wireframes (this folder)
- Week 2: interactive Figma prototype and design system
- Week 3: mobile MVP scaffold (3 coded screens)
- Week 4: final codebase and pitch

## Repository layout

```
/
├── README.md
├── SUBMISSION.md
├── AI_DISCLOSURE_LOG.md
├── App.js, app.json, eas.json, package.json
├── src/            app code (screens, logic, storage)
├── tests/          anonymity and summary tests
└── docs/week1/     problem, personas, scope, wireframes
```

---

## Mobile app (Weeks 3 to 4)

Anonymous mid-semester course feedback for students and instructors. SDG 16.
Team F-3, ITMSD1 Inter-Class Mobile Hackathon.

Built with Expo (React Native). Data is stored on the device for now (AsyncStorage), so the demo needs no server.

### Run it

```bash
npm install
npx expo install --fix     # aligns package versions with your Expo SDK
npx expo start             # scan the QR code with Expo Go, or press "a" for an Android emulator
npm test                   # runs the anonymity and summary logic tests
```

### Coded screens (Week 3 needs at least 3)

| # | Screen | File | Figma screen |
|---|---|---|---|
| 1 | Join a course (enter code, invalid-code error) | `src/screens/JoinCourseScreen.js` | 03, 14 |
| 2 | Feedback form (3 ratings, optional comment, confirm dialog, loading, success, You Said We Did) | `src/screens/FeedbackFormScreen.js` | 05, 06, 07, 32, 38 |
| 3 | Instructor dashboard (count, locked summary, themes, comments, post action, close window) | `src/screens/InstructorDashboardScreen.js` | 10, 11, 12, 13, 37 |
| + | Role select | `src/screens/RoleSelectScreen.js` | 02 |

### Demo flow (Slide 8)

1. Open the app, choose **Student**, enter `TN-4F7K`, tap **Join Course**.
2. Rate pace, clarity, and materials, add a comment, tap **Submit Anonymously**, then **Submit**.
3. Try submitting again from the same phone. It is blocked ("Already submitted").
4. Go back, choose **Instructor**. The dashboard shows 1 of 32 responses and the summary is **locked**.
5. Tap **Add 1 demo response** until there are 5. Themes, averages, and comments appear.
6. Pick a theme, write an action, tap **Publish Response**.
7. Choose Student again, join the course. "You Said, We Did" shows the action after a new device submits, or use Reset.

### How anonymity works in the code

- A feedback record holds only: random id, course id, day (no time), three ratings, scrubbed comment. There is no student ID, device ID, or receipt. See `buildFeedbackRecord` in `src/lib/feedbackCore.js`.
- Duplicate blocking uses a **receipt**: SHA-256 of the course code plus a random secret that only lives on the student's phone. Receipts are stored on the course, in sorted order, and never inside a feedback record.
- Feedback is shuffled before it is saved and before comments are shown, so order reveals nothing.
- Comments are scrubbed for emails, phone numbers, links, handles, and titled names ("Prof. Reyes"). This reduces risk but is not perfect.
- Summaries stay locked until 5 responses. A theme needs 2 mentions before it shows.

### Known limits of this MVP (say these honestly in the pitch)

- Local storage means one phone is both student and instructor, so the demo uses a **demo response** button. A real build needs a backend, and the receipt check should run on the server.
- The instructor view has no sign-in yet (Figma screens 25 and 26 are not coded).
- Theme grouping is keyword based. The AI theming feature is planned, see `AI_DISCLOSURE_LOG.md`.
- Concern Reporting (Flow 3, 5) is not coded. It is a future-roadmap module.
- Demo tools are controlled by `SHOW_DEMO_TOOLS` in `src/config.js`. Set it to `false` for a release build.
- Package versions were chosen for Expo SDK 52 and not installed here. Run `npx expo install --fix` first.

### Build the APK (Phase 2 deliverable)

```bash
npm install -g eas-cli
eas login                              # free Expo account
eas build -p android --profile preview # builds an installable .apk in the cloud
```

When the build finishes, Expo gives a download link for the APK. Install it on an Android phone, or share the link with the instructor. Test the full demo flow on the APK before submitting.

### Final checklist

- [ ] `npm test` passes (9 tests)
- [ ] Demo flow works on a real phone
- [ ] APK link works and installs
- [ ] `AI_DISCLOSURE_LOG.md` is complete for Weeks 1 to 4
- [ ] Figma link is set to "Anyone with the link can view"
- [ ] Pitch deck link opens without sign-in
