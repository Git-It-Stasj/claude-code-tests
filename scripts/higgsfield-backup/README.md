# Higgsfield asset backup

`manifest.json` is a snapshot of every completed Higgsfield generation on this
account, pulled fresh via the Higgsfield MCP `show_generations` tool (fully
paginated, not the old ~90-asset count). Each entry has the asset's id, type,
model, CDN URL, creation timestamp, and derived date/filename.

Run `higgsfield_backup.py` to download every asset from CloudFront into
organized, date-sorted folders before cancelling the subscription:

```bash
python3 higgsfield_backup.py --out ./higgsfield-backup
```

Output layout:

```
higgsfield-backup/
  videos/<YYYY-MM-DD>/<model>/<file>.mp4
  images/<YYYY-MM-DD>/<model>/<file>.png
  audio/<YYYY-MM-DD>/<model>/<file>.wav
  manifest.json
  download_report.json
```

Safe to re-run: existing files are skipped, so an interrupted run can resume.
