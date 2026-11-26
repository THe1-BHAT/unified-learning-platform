# Cyber Studio: public-reference coverage audit

Reviewed 2 November 2026.

## Scope

The Udemy public page was expanded to inspect all 16 sections and the listed 85 lecture titles. The paid videos, assignments, downloads, and instructor instruction were not accessed. Topic mapping does not establish equivalent duration, instruction, mastery, or accreditation.

CyberLab was inspected across all eight main areas: Cyber security, Signal Vault, Job Roles, Tools by Role, Certifications, OSINT & Threat Intel, Field Lab, and Standards & Law. Each distinct visible heading has a destination in the interactive coverage map. Directory orientation is explicitly distinguished from lessons and exercises.

## Gaps in version 1

The first version had 12 modules and 36 short lessons. It lacked sufficient VM setup, Windows, active/passive discovery, service enumeration, wireless security, interception, system assessment, malware analysis, detailed web weakness coverage, credential audits, and the broader reference directories.

## Expansion

Added 13 modules and 39 original lessons, bringing the site to 25 modules and 75 lessons with checks and practice prompts. Added 18 role orientations, 10 beginner challenges, a simulated terminal, synthetic scan interpretation, a deterministic throttle model, and a glossary. Preserved previous lesson IDs and browser-local progress. Added a 196-entry knowledge atlas and the searchable source-topic map.

## Depth and substitutions

Concept-and-defense coverage is used for evasion, disruptive wireless behavior, credential theft, persistence, and malware concealment. Python/C remote-control construction is replaced with a bounded echo design. Online brute-force construction is replaced with synthetic rate-limit analysis. These are not equivalent offensive coding labs and are labeled as such.

Historical incident topics are contextualized; unchecked headline statistics, salary estimates, and long-range dated predictions are not reproduced as established current facts. Career seniority depends on evidence and relevant experience, not a fixed number of years or a certificate alone. Adjacent AI/cloud careers are identified as adjacent pathways.

## Source corrections

- TensorFlow certificate exam: closed, per the official certificate page.
- AWS Machine Learning Specialty: last exam date 31 March 2026, per AWS.
- Azure Security Engineer Associate: retired 31 August 2026, per Microsoft; current Cloud and AI Security Engineer page linked.
- IPC: historical reference, with government notice for BNS and the July 2024 transition.
- DPDP: Act accompanied by 2025 Rules and phased-enforcement source.
- picoCTF: learning continuation at CyLab Security Academy retained.
- Redline: the unrelated source URL was replaced with a publisher-reference destination and marked for availability review.

## How to inspect

Open `#coverage` for the source-topic map, `#reference/toolkit` for tools and role filters, `#reference/credentials` for credentials and status notes, and `#field` for challenges and safe exercises. Every map row distinguishes its type of coverage.

## Sources

- [Udemy public syllabus](https://www.udemy.com/course/ethicalhackingcourse/)
- [Dr. Basavaraj Patil’s CyberLab](https://patils-cyberlab.web.app/)
- [TensorFlow exam status](https://www.tensorflow.org/certificate)
- [AWS ML Specialty status](https://aws.amazon.com/certification/certified-machine-learning-specialty/)
- [Microsoft credential retirement](https://learn.microsoft.com/en-us/credentials/support/credential-retirement)
- [Government of India new criminal laws notice](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2082757)
- [MeitY DPDP rules and timeline](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B)

## Verification

`node scripts/verify-content.cjs` passed for 321 generated view routes, 75 knowledge checks, all 196 atlas entries, and all 437 mapping rows. Browser checks verified source/topic filtering, directory search and details, retired-credential notes, role-to-tool filtering, terminal simulation including unsupported-command handling, throttle parameter changes, a new lesson quiz, and preservation of existing completion and notes. The coverage layout was visually inspected at 390px using a same-origin iframe.
