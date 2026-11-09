# 4. Low-fidelity wireframes

Design file: https://www.figma.com/design/HrlaQraT3J4v7FTTng6ZdP (Page 1 has the wireframes, "Prototype" and "Design System" pages come in Week 2)

Frames are 390 × 844. Screen numbers match the Figma file.

## Flows

| Flow | Actor | Steps (screen number) | Alternate paths |
|---|---|---|---|
| 1. Getting Started | All users | Splash (23), Welcome (01), How anonymity works (24), Role select (02) | |
| 2. Give Anonymous Feedback | Student | Student home (27), Join course (03), Course home (04), Feedback form (05), Confirm submission (32), Submission success (06), You Said We Did (07) | Invalid course code (14), Send failed offline (16), No updates yet (15) |
| 3. Report a Concern | Student | Report type (17), Report details (18), Report submitted (19), Track a report (20) | |
| 4. Collect and Respond to Feedback | Instructor | Instructor sign in (25), Instructor home (28), Create course (08), Share join code (09), Dashboard (10), Course responses (29), Themed summary (11), Post action response (13) | Summary locked (12) |
| 5. Review and Resolve Reports | Staff | Staff sign in (26), Reports inbox (21), Report detail (22) | |
| 6. Notifications and Settings | All users | Notifications (30), Settings and privacy (31) | |
| 7. Support, Legal and Confirmations | All users | Help and FAQ (33), Terms of Use (34), Privacy Policy (35), Log out? (36), Close feedback window? (37), Loading state (38) | |

Screens 33 to 38 were added after the Week 1 checkpoint (version 2.0). The Week 1 checkpoint is screens 01 to 32.

## Add the images

In Figma, select each flow sheet, then File, Export, PNG at 1x or 2x. Save them here:

```
docs/week1/wireframes/flow-1-getting-started.png
docs/week1/wireframes/flow-2-give-feedback.png
docs/week1/wireframes/flow-3-report-concern.png
docs/week1/wireframes/flow-4-instructor.png
docs/week1/wireframes/flow-5-staff.png
docs/week1/wireframes/flow-6-notifications-settings.png
```

Then show them in this file, for example:

```markdown
![Flow 2](wireframes/flow-2-give-feedback.png)
```
