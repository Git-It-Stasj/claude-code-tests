"""EP06 S01 drive rig, step 1: upscale SH01_R02 to 1080x1920 and cut a Ferrari+Noelle mask (grabCut + wheel discs)."""
import cv2, numpy as np
D="episodes/06-walter-website/08-s01-drive/"
src="episodes/06-walter-website/02-approved-storyboard/touchup/EP06_SH01_R02.png"
im=cv2.imread(src); im=cv2.resize(im,(1080,1920),interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(D+"plate_full.png",im)
s=1080/941
WHEELS=[(225,1210),(722,1210)]  # rear, front wheel centres at 1080x1920
x0,y0,x1,y1=[int(v*s) for v in (58,900,834,1116)]
m=np.zeros(im.shape[:2],np.uint8); bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
cv2.grabCut(im,m,(x0,y0,x1-x0,y1-y0),bg,fg,8,cv2.GC_INIT_WITH_RECT)
mask=np.where((m==1)|(m==3),255,0).astype(np.uint8)
for c in WHEELS: cv2.circle(mask,c,70,255,-1)
cv2.imwrite(D+"car_mask.png",mask)
vis=im.copy(); vis[mask==0]=(vis[mask==0]*0.25).astype(np.uint8)
cv2.imwrite(D+"car_mask_vis.jpg",vis[y0-40:y1+60, :])
print(x0,y0,x1,y1)
