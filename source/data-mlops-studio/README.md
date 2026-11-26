# NxGenVarsity Data Studio

A generic, self-paced Data Engineering & MLOps learning workspace.

## Run

`python3 -m http.server 4173 --directory dist`

## Content

- 5 modules and 20 original lessons, including practical examples.
- 50 quiz questions with shuffled choices, explanations, scoring and result review.
- 8 embedded videos from IBM, Google Cloud and Databricks.
- 7 original in-site study briefs with primary reference links.
- 4 NxGenVarsity-branded PDFs: course guide, study companion, project workbook and quiz workbook.
- An accessible paginated reader uses the same structured content as the PDFs. Rendered PDF previews and downloads remain available.
- Browser-local notes, progress, saved resources and demo login.

Demo: `student@datastudio.demo` / `LearnData123!`. This is simulated client-side authentication. Do not use it to protect real data. Guest and demo modes share the same local learning record.

## Authoring

`build_content.py` and `enhance_content.py` create lesson and assessment content. `build_resources.py` creates the reference collection. `make_pdfs.py` writes `documents.json` and generates the PDFs from the same page structure. NxGenVarsity logo supplied by the user, preserved as received in `dist/assets/nxgen-logo.png`.

The compatibility URL `resources/original-syllabus.pdf` now serves the generic course guide. No previous institution-specific material is included in deployment.

External videos remain on their creators’ platforms. If embedding is restricted, each player has a direct source link. Study briefs are original explanations rather than reproductions of source articles.

## Verification

JavaScript syntax and content invariants checked. All 52 generated PDF pages rendered and visually inspected, with logo presence, matching online/PDF page counts and removed-wording checks. Browser verified a complete ten-question assessment scoring 90%, explanatory answer review, persisted results after reload, online pagination, rendered PDF preview, and an embedded YouTube player.
