"""PUT a local file to a Higgsfield presigned upload URL (from media_upload), then call media_confirm.

Usage: python3 scripts/hf_put.py <file> <content-type> <upload_url>
Prints "<file> <http_status>"; 200 means ready to confirm.
"""
import subprocess, sys

f, ct, url = sys.argv[1:4]
r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "PUT",
                    "-H", "Content-Type: " + ct, "-H", "If-None-Match: *", "--data-binary", "@" + f, url],
                   capture_output=True, text=True)
print(f, r.stdout)
sys.exit(0 if r.stdout == "200" else 1)
