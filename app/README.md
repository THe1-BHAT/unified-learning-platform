# NxGenVarsity Unified Learning Platform

A unified static learning portal for Cybersecurity and Data Engineering & MLOps. Built with HTML, CSS, and vanilla JavaScript. No build step or server-side account system is required.

## Preview

From this directory run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. Main routes use URL hashes. The demo login is available at `#login`: `student@nxgen.demo` / `cyber123`; guest entry is also supported.

## Included

- 25 modules and 75 original short lessons with practice prompts and knowledge checks
- 24 career orientations and 4 portfolio project briefs
- 20 core resources with search, type filters, and bookmarks
- 196-entry knowledge atlas and 437-row public-reference coverage map
- 10 beginner challenges, simulated shell, synthetic scan interpretation, and rate-limit model
- Synthetic sign-in investigation and local project checklists
- Seven-stage connected curriculum with expandable syllabus, search, milestones, a downloadable syllabus, and a dedicated knowledge-check view
- Eight curated YouTube resources: existing Harvard CS50 / freeCodeCamp plus Professor Messer, Practical Networking, TCM Security, PortSwigger, and John Savill; practice links, creator materials, and local video notes
- Browser-local progress and notes, plus Markdown journal and project downloads
- JSON progress backup and restore (merge or replace) from My Progress, and a mistake-review view that collects incorrectly answered checks
- Responsive navigation, keyboard support, and reduced-motion styling

## Editing

- `dist/curriculum.js`: lesson text, sources, quizzes, career paths, projects, videos
- `dist/extension.js`: additional modules, careers, challenges, glossary, and learning order
- `dist/reference-library.js`: original tool, credential, framework, legal, institution, and research orientations
- `dist/coverage-data.js`: source-topic mapping and explicit coverage depth
- `dist/expansion-views.js`: knowledge atlas, coverage map, and safe browser exercises
- `dist/learning-flow.js`: seven-stage syllabus, flowchart, guidance, checks, and syllabus download
- `dist/industry-videos.js`: creator-verified video curation, filters, and lesson-to-video links
- `dist/app.js`: routes, view templates, and browser-local interactions
- `dist/styles.css`: visual design and responsive breakpoints
- `dist/assets/cyber-campus.jpg`: original generated hero image
- `.openai/hosting.json`: registered Sites identity and static output directory

When editing JS or CSS, update query versions in index.html for cache refresh. Keep source and deployment archives consistent when publishing with Sites.

## Privacy and limitations

Demo login does not authenticate users. No password is stored or transmitted. A learner's state is saved under `cyber-studio-v1` in that browser's localStorage, shared between guest and demo profiles in the same browser. It does not sync across devices and does not support multiple independent accounts. Never store secrets or personal information in notes. Export a Markdown journal for a readable copy; it is not an importable backup. Use the JSON backup on My Progress to move or restore progress — it is previewed before anything changes and contains no password.

There is no live news feed. Editorial snapshot: 2 November 2026. Linked platforms may require separate accounts and have independent terms. Embeds load on user interaction. Google Fonts loads typography. Private Sites hosting access is independent from the demo login.

## Credits

Design inspired by the user's Deutsch Studio. Topic coverage inspired by Dr. Basavaraj Patil's CyberLab, with official original sources linked within lessons and the source page. No provider endorsement is implied.

Illustration generated with the built-in OpenAI image tool. Final asset: `dist/assets/cyber-campus.jpg`.

Full image prompt:

> Use case: illustration-story. Asset type: cybersecurity student learning portal hero. Create a premium editorial illustration of three diverse Indian engineering students, two women and one man, collaborating at a warm modern university cybersecurity lab with laptops. One screen has a simple abstract network diagram, another shield symbol. Confident curious welcoming mood, daylight, plants, tasteful campus architecture in background, sophisticated hand-painted digital illustration with fine grain and realistic proportions, navy teal, warm cream and muted ochre palette. Landscape composition 3:2, cohesive calm scene, no text, no lettering, no numbers, no branding, no hooded hackers, no floating interface panels. Save output image for project use.

## Validation

JavaScript syntax and content reference integrity checked. Browser QA covered quiz answers, notes and completion across reload, bookmarks and filtering, career-to-project navigation, project checklists, invalid and valid demo login, and a 390px iframe rendering of responsive navigation. YouTube playback availability is governed by YouTube and may depend on browser/network settings.

## Public-reference audit

See [COVERAGE-AUDIT.md](COVERAGE-AUDIT.md). The Udemy public listing was expanded to inspect all 16 sections and 85 listed lecture titles; paid course material was not accessed. CyberLab was inspected across all eight main areas. The coverage map distinguishes lessons, concept-and-defense coverage, safe substitutes, career orientations, and reference entries. It does not claim equivalent paid-course instruction or full hands-on proficiency for every directory item. Unverified news claims are marked as not reproduced.

Run `node scripts/verify-content.cjs` to validate all 356 view routes, data references, coverage destinations, quiz integrity, backup merge/replace behavior, mistake-review filtering, and synthetic terminal/throttle behavior.

## Branded PDF study companions

Four original five-page PDFs are published in `dist/downloads/` and listed in `dist/pdf-guides.js`. The Resource Library shows all four; the Practice Lab shows the three practice workbooks. Each page uses the user-supplied, unaltered transparent NxGenVarsity logo in `dist/assets/nxgenvarsity-logo.png`.

- Cybersecurity Learning & Career Roadmap: twelve-week study sequence, role comparisons, and a portfolio worksheet.
- Safe Cyber Lab Starter Workbook: isolation plan, preflight checklist, ten challenges, and experiment record.
- SOC Investigation Workbook: synthetic sign-in case, timeline, competing hypotheses, handover template, and worked example.
- Web Security Project Playbook: scoped method, weakness/prevention map, test plan, and finding-report worksheet.

Regenerate with `scripts/build-pdf-guides.py` using a Python environment containing ReportLab and the configured bundled DejaVu fonts. The script writes final files to `output/pdf/`, copies the published files into `dist/downloads/`, and writes the download manifest. Keep the `pdfGuides` metadata aligned with the resulting manifest if content or page counts change. Local output copies and rendered QA pages are ignored by Git. Worksheets are printable rather than interactive form fields.

PDF QA checked all twenty rendered pages, searchable text, embedded logo images, page bounds, page counts, links, HTTP PDF delivery, and the website download cards. A narrow table header was adjusted during visual review.


## Connected learning flow · 7 November 2026

The Data Studio reference was inspected in its overview, curriculum, expanded module, lesson, and resource-reader views. Its useful pattern is a visible starting point, numbered expandable modules, lesson completion, practical reflection, contextual video, and a connected knowledge check. Cyber Studio now follows this pattern with a seven-stage course map, keeping its established visual identity and all existing lesson content, resources, labs, PDFs, and localStorage IDs.

The suggested route is Orient → Understand → Assess → Secure → Defend → Specialize → Launch. All 25 modules appear exactly once in this route. The `#roadmap` route remains an alias for `#curriculum`. The final stage ends with one complete portfolio case study. `#syllabus` provides the full outline and a Markdown download; the four previously published PDFs remain unchanged.

New videos were selected from creator/publisher primary sources. The TCM 2023 upload is labeled Part 1, the Savill V2 recording is labeled 2024, and current creator documentation is linked. No claim is made that a recording is a current exam syllabus or that an introductory module confers professional proficiency. Click-to-load YouTube embeds include direct playback fallback, contextual practice, and browser-local notes included in the journal export.
