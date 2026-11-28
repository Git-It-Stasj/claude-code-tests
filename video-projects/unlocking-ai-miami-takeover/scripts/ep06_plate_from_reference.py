"""BBY TIGR plate artwork from the user's reference image (2026-11-28, IMG_8249): palms in the top corners,
FLORIDA, orange with leaves, BBY TIGR. Perspective-flattens the plate to 600x300, rounds the corners, lightly
sharpens and neutralises the warm cast (the shot tints it to the scene light per frame).
Writes assets/plates/BBY_TIGR_florida_plate.png (RGBA). The previous drawn version is kept as *_drawn_R01.png."""
import os, shutil
import cv2, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(ROOT, "assets/plates/reference/user_plate_reference_IMG_8249.png")
out = os.path.join(ROOT, "assets/plates/BBY_TIGR_florida_plate.png")
old = os.path.join(ROOT, "assets/plates/BBY_TIGR_florida_plate_drawn_R01.png")
if os.path.exists(out) and not os.path.exists(old):
    shutil.copy(out, old)
im = cv2.imread(src)
quad = np.float32([(336, 1151), (833, 1147), (830, 1420), (339, 1432)])   # plate corners in the reference
W, H = 600, 300
M = cv2.getPerspectiveTransform(quad, np.float32([(0, 0), (W, 0), (W, H), (0, H)]))
p = cv2.warpPerspective(im, M, (W, H), flags=cv2.INTER_CUBIC).astype(np.float32)
blur = cv2.GaussianBlur(p, (0, 0), 2.0)
p = np.clip(p * 1.6 - blur * 0.6, 0, 255)                                  # unsharp: crisper letters
paper = np.median(p[(p.max(2) > 200)].reshape(-1, 3), 0)
p = np.clip(p * (np.array([238, 242, 246], np.float32) / paper), 0, 255)  # neutral cream paper (BGR)
a = np.zeros((H, W), np.uint8)
cv2.rectangle(a, (14, 0), (W - 15, H - 1), 255, -1); cv2.rectangle(a, (0, 14), (W - 1, H - 15), 255, -1)
for cx, cy in ((14, 14), (W - 15, 14), (14, H - 15), (W - 15, H - 15)):
    cv2.circle(a, (cx, cy), 14, 255, -1, cv2.LINE_AA)
a = cv2.GaussianBlur(a, (3, 3), 0)
cv2.imwrite(out, np.dstack([p.astype(np.uint8), a]))
print(out, "paper colour was", np.round(paper).tolist())
