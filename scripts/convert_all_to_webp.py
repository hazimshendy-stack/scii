import os
import sys
from PIL import Image

PUBLIC_DIR = os.path.abspath("public")

# Quality & sizing settings
LOGOS = {"logo", "scilogo", "creativa-hub-logo", "scicast-logo"}

def optimize_and_convert(img_path):
    rel_path = os.path.relpath(img_path, PUBLIC_DIR)
    dir_name = os.path.dirname(rel_path)
    base_name = os.path.splitext(os.path.basename(rel_path))[0]
    ext = os.path.splitext(rel_path)[1].lower()

    if ext not in [".jpg", ".jpeg", ".png", ".bmp"]:
        return None

    webp_path = os.path.splitext(img_path)[0] + ".webp"
    orig_size = os.path.getsize(img_path)

    with Image.open(img_path) as im:
        orig_w, orig_h = im.size
        target_w, target_h = orig_w, orig_h

        # Downscale oversized poster pages for web (2200px max height is crisp on 4K)
        if "forum_posters_images" in dir_name:
            if "thumb" in base_name:
                max_dim = 600
            else:
                max_dim = 2200
            if max(orig_w, orig_h) > max_dim:
                ratio = max_dim / max(orig_w, orig_h)
                target_w = int(orig_w * ratio)
                target_h = int(orig_h * ratio)
        # Downscale giant partner logos (e.g. Dolphin Models was 3150x3150!)
        elif "partners" in dir_name:
            max_dim = 800
            if max(orig_w, orig_h) > max_dim:
                ratio = max_dim / max(orig_w, orig_h)
                target_w = int(orig_w * ratio)
                target_h = int(orig_h * ratio)

        if (target_w, target_h) != (orig_w, orig_h):
            im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)

        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        
        if has_alpha:
            im = im.convert("RGBA")
            quality = 90
        else:
            im = im.convert("RGB")
            quality = 82

        im.save(webp_path, "WEBP", quality=quality, method=6)

    new_size = os.path.getsize(webp_path)
    return {
        "orig_path": img_path,
        "webp_path": webp_path,
        "orig_size": orig_size,
        "new_size": new_size,
        "orig_dim": (orig_w, orig_h),
        "new_dim": (target_w, target_h)
    }

def main():
    conversions = []
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in [".jpg", ".jpeg", ".png", ".bmp"]:
                full_path = os.path.join(root, f)
                res = optimize_and_convert(full_path)
                if res:
                    conversions.append(res)
                    rel_orig = os.path.relpath(res['orig_path'], PUBLIC_DIR)
                    rel_new = os.path.relpath(res['webp_path'], PUBLIC_DIR)
                    saved_pct = (1 - res['new_size'] / res['orig_size']) * 100
                    print(f"Converted {rel_orig} -> {rel_new} | {res['orig_size']/1024:.1f}KB -> {res['new_size']/1024:.1f}KB ({saved_pct:.1f}% saved)")

    total_orig = sum(c['orig_size'] for c in conversions)
    total_new = sum(c['new_size'] for c in conversions)
    print("\n" + "="*60)
    print(f"Total images converted: {len(conversions)}")
    print(f"Original total size: {total_orig / (1024*1024):.2f} MB")
    print(f"New WebP total size: {total_new / (1024*1024):.2f} MB")
    print(f"Total space saved: {(total_orig - total_new) / (1024*1024):.2f} MB ({(1 - total_new/total_orig)*100:.1f}% reduction)")
    print("="*60)

    # Now remove the old files
    for c in conversions:
        if os.path.exists(c['orig_path']) and c['orig_path'] != c['webp_path']:
            os.remove(c['orig_path'])
    print("Successfully removed all obsolete JPG/PNG original files from public/!")

if __name__ == "__main__":
    main()
