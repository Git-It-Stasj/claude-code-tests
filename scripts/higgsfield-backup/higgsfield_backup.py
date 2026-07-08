#!/usr/bin/env python3
"""
Batch-download all Higgsfield-generated assets listed in manifest.json into
organized, date-sorted folders, before cancelling a Higgsfield subscription.

Usage:
    python3 higgsfield_backup.py [--out ./higgsfield-backup] [--manifest ./manifest.json]

Output layout:
    <out>/
      videos/<YYYY-MM-DD>/<model>/<filename>.mp4
      images/<YYYY-MM-DD>/<model>/<filename>.png
      audio/<YYYY-MM-DD>/<model>/<filename>.wav
      manifest.json          (copy of the manifest used)
      download_report.json   (per-file outcome: ok / skipped / failed)

Re-running is safe: files that already exist with a matching size are skipped,
so the script can be interrupted and resumed.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

TYPE_FOLDERS = {
    "video": "videos",
    "image": "images",
    "audio": "audio",
    "3d": "models_3d",
}

MAX_RETRIES = 4
RETRY_BACKOFF_SECONDS = 2


def load_manifest(path):
    with open(path, "r") as f:
        return json.load(f)


def download_one(url, dest_path):
    tmp_path = dest_path + ".part"
    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "higgsfield-backup/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp, open(tmp_path, "wb") as out:
                while True:
                    chunk = resp.read(1024 * 1024)
                    if not chunk:
                        break
                    out.write(chunk)
            os.replace(tmp_path, dest_path)
            return True, None
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError) as e:
            last_error = str(e)
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_BACKOFF_SECONDS * attempt)
    return False, last_error


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default="./higgsfield-backup", help="Output directory root")
    parser.add_argument(
        "--manifest",
        default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "manifest.json"),
        help="Path to manifest.json",
    )
    args = parser.parse_args()

    manifest = load_manifest(args.manifest)
    os.makedirs(args.out, exist_ok=True)

    report = []
    ok_count = 0
    skip_count = 0
    fail_count = 0

    for i, item in enumerate(manifest, start=1):
        asset_type = item["type"]
        type_folder = TYPE_FOLDERS.get(asset_type, "other")
        dest_dir = os.path.join(args.out, type_folder, item["date"], item["model"])
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, item["filename"])

        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
            skip_count += 1
            report.append({"id": item["id"], "path": dest_path, "status": "skipped_exists"})
            print(f"[{i}/{len(manifest)}] SKIP  {dest_path}")
            continue

        ok, error = download_one(item["url"], dest_path)
        if ok:
            ok_count += 1
            report.append({"id": item["id"], "path": dest_path, "status": "ok"})
            print(f"[{i}/{len(manifest)}] OK    {dest_path}")
        else:
            fail_count += 1
            report.append({"id": item["id"], "path": dest_path, "status": "failed", "error": error})
            print(f"[{i}/{len(manifest)}] FAIL  {dest_path} ({error})")

    with open(os.path.join(args.out, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    with open(os.path.join(args.out, "download_report.json"), "w") as f:
        json.dump(report, f, indent=2)

    print("\n--- Summary ---")
    print(f"Total assets:      {len(manifest)}")
    print(f"Downloaded now:    {ok_count}")
    print(f"Already present:   {skip_count}")
    print(f"Failed:            {fail_count}")
    if fail_count:
        print("Re-run the script to retry failed downloads.")
        sys.exit(1)


if __name__ == "__main__":
    main()
