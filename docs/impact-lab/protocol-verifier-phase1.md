# Claude Impact Lab: Biotech & Life Sciences — Protocol Verifier (Phase 1)

**Track:** 1, preventing hallucinated outputs
**Format:** 2-hour hackathon
**Builder:** Stäsj Terry
**Status:** Phase 1 complete (corpus, extraction, planted-error set, reports). Phases 2 and 3 not started.

## The problem

When a language model writes a lab protocol, it can get a concentration or wavelength wrong, merge steps from two different protocols, or cite a paper or reagent that doesn't exist. These mistakes look plausible, and in a lab they waste time, reagents and cells.

The brief asked for a protocol builder that:

1. fetches papers from PubMed and Europe PMC,
2. extracts protocol steps along with the exact sentence each one came from,
3. checks every step in code first and with a model second, and
4. shows a confidence score for each step that is calculated from evidence, with a receipt showing where it came from.

I added three areas to focus on:

| Area | Example |
|---|---|
| **Incorrect parameters** | a wrong incubation time, wavelength, cell density or concentration |
| **Blended protocols** | steps from two different assays merged into one |
| **Fabricated references and products** | PMIDs, DOIs, catalog numbers or kits that don't exist |

I started with MTT in HEK293 cells, then broadened the scope to **cell culture analysis in general**: the five most common assays, plus the best reference protocol for each.

## What I built

A local Python project, `protocol-verifier`. I kept it local on purpose: no remote, and nothing pushed.

### 1. Assay survey: choosing the five assays from data
I ranked assays by how often they appear in the Methods sections of Europe PMC papers from 2020 to 2025 (`src/survey.py`). The top five:

1. CCK-8 / WST-8
2. Annexin V / PI
3. MTT
4. Calcein-AM live/dead
5. Trypan blue

### 2. Reference protocols
For each assay, the "best" protocol is the most-cited paper in a protocol journal that has not been retracted (`data/reference_protocols.json`). If a paper is paywalled, I kept only its metadata as a reference. Just 1 of the 5 is open access: JoVE, PMID 21540825.

### 3. Corpus: 10 papers from two sources
- Each assay has one paper from **PubMed** and one from **Europe PMC**. Europe PMC stands in for Google Scholar, which has no API; I chose not to scrape it.
- If a paper appeared in both sources, I kept both copies and marked them with a `dual_sourced` flag, which counts as extra verification. In this corpus the flag applies to **0 of 10** papers, because the two sources' top-50 results had no papers in common.
- Each paper record includes PMID, PMCID, DOI, title, abstract, year, journal, citation count, **study type** (assigned by code from PubMed publication types, plus a regex that detects in vivo work) and **retraction status** (based on three separate checks). None of the 10 papers is retracted.
- I recorded gaps instead of hiding them. One example: PMID 36131361 has no real abstract, and its record says so.

### 4. Step extraction with exact quotes
- **82 steps** were extracted, and **81 of them come with an exact quote** from the source paper. The one exception is in PMID 41304552.
- For PMID 35222862, the model declined the request (`stop_reason=refusal`). I skipped that paper permanently rather than retrying it.
- Model: `claude-sonnet-5-5`. Every HTTP and model response is cached, so reruns are reproducible and cost nothing. Empty model responses are never cached; the code retries once and then raises an error.

### 5. Human answer key
- There are 10 per-paper review sheets, `data/sheets/verify_<assay>_<source>_<pmid>.csv`. In each one, a person marks every step **Y**, **N** or **FIX**.
- `merge_key.py` rejects blank answers, accepts only Y/N/FIX, and requires a note for every FIX. This stops the answer key from being filled in silently.

### 6. Planted-error evaluation set
`make_planted.py` makes deterministic changes to real extracted steps, producing **25 test items**:

| Type | Count |
|---|---|
| Incorrect parameter | 8 |
| Blended protocol | 4 |
| Fabricated reference/product | 8 |
| Clean (control) | 5 |

The verifier is scored against this set. The current version is **provisional** because it was built from steps that no person has reviewed yet.

### 7. Reports
`report.py`, `report_html.py` and `report_docx.py` generate the Phase 1 report as Markdown, HTML and Word.

## Engineering guardrails
- **The API key is never copied or printed.** It is read in one place (`src/common.py`) from an existing `.env` file. A security check confirmed the credentials were present without showing their values.
- **Nothing pushed to GitHub**, as the brief required. The repo has 7 local commits; the latest is `955a240`.
- **A plan came before the code.** I agreed on scope and method before building.
- **Facts come from code; the model adds judgment.** Study type, retraction status, source overlap and quote matching are all set by code. The model only extracts steps and, in Phase 2, will try to refute them.
- **Old work was archived, not deleted.** The earlier MTT sheets are in `data/sheets/_archive_mtt/`.

## Results at a glance

| Metric | Value |
|---|---|
| Assays covered | 5 |
| Reference protocols | 5 (1 open access) |
| Corpus papers | 10 (5 PubMed, 5 Europe PMC) |
| Retracted papers | 0 |
| Steps extracted | 82 |
| Steps with exact quote | 81 |
| Papers in both sources | 0 of 10 |
| Planted evaluation items | 25 |

## What I learned
- **Searching two databases doesn't mean they confirm each other.** When each database gets its own query, the results barely overlap, so a "found in both" signal never fires. To use it as a confidence factor, both databases need the same query.
- **Most reference protocols are paywalled.** Only 1 in 5 "best" protocols could be checked against its full text.
- **Refusals are data.** When the model refused one paper, I recorded and skipped it instead of retrying until it gave an answer.
- **The answer key is the bottleneck.** Code can create planted errors, but a person has to mark the real steps before the evaluation can be trusted.

## Next steps
**Phase 2: verification and confidence**
- `verify.py` runs five checks on each step: `quote_found`, `number_unit_match`, `sanity_ok`, `refuter_survived` and `cross_paper_agreement`.
- `confidence.py` turns those checks into a calculated score with a receipt.
- `protocol.py` and a Flask app show the protocol with the score and receipt for each step.

**Phase 3: evaluation**
- `eval/run_eval.py` runs the verifier on the planted set.
- The README gets a section called **"What this does NOT guarantee"**.

**Open decisions**
- Dual sourcing: (a) send the same query to both sources so their results can overlap, or (b) drop dual sourcing as a confidence factor.
- Confirm the five assays. The alternative is wound healing and colony formation in place of Calcein-AM and trypan blue.
- Decide whether Phase 2 can start while the sheets are still being marked.
- Mark the 10 sheets, then run `merge_key.py` and `make_planted.py` without `--provisional`.
- Choose the report's brand styling. It is neutral for now.
- Widen the blended-protocol changes beyond wavelengths and densities, and vary the fake products.

## Deliverables
- Phase 1 report as `.md` and `.docx`. The Google Doc version is pending: the Drive connector failed to authenticate, so the plan is to upload the `.docx` to Drive by hand and open it in Google Docs.
- The local repo `protocol-verifier`. Start with `PHASE1_REPORT.md` for the quickest overview.
