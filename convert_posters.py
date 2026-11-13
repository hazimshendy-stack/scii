import os
import json
import pymupdf  # PyMuPDF

pdf_dir = r"d:\Hazim\Projects\source code\public\forum_posters"
output_dir = r"d:\Hazim\Projects\source code\public\forum_posters_images"
os.makedirs(output_dir, exist_ok=True)

json_path = r"d:\Hazim\Projects\source code\src\data\forumPosters.json"
with open(json_path, "r", encoding="utf-8") as f:
    posters = json.load(f)

print(f"Found {len(posters)} posters in JSON.")

updated_posters = []

for idx, p in enumerate(posters):
    filename = p.get("filename")
    pdf_path = os.path.join(pdf_dir, filename)
    
    if not os.path.exists(pdf_path):
        print(f"[{idx+1}/{len(posters)}] File not found: {filename}")
        continue
    
    poster_id = f"poster-{idx}"
    try:
        doc = pymupdf.open(pdf_path)
        page_count = len(doc)
        pages_images = []
        
        # Render high-res pages (DPI ~ 150-180 for crisp reading)
        # zoom = 150 / 72 = 2.083
        matrix = pymupdf.Matrix(2.0, 2.0)
        thumb_matrix = pymupdf.Matrix(0.6, 0.6)
        
        thumb_rel_path = f"/forum_posters_images/{poster_id}-thumb.webp"
        thumb_abs_path = os.path.join(output_dir, f"{poster_id}-thumb.webp")
        
        for page_idx in range(page_count):
            page = doc[page_idx]
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            page_filename = f"{poster_id}-page-{page_idx+1}.webp"
            page_abs_path = os.path.join(output_dir, page_filename)
            # Save as webp via PIL
            from PIL import Image
            import io
            im = Image.open(io.BytesIO(pix.tobytes("png")))
            im.save(page_abs_path, "WEBP", quality=82, method=6)
            pages_images.append(f"/forum_posters_images/{page_filename}")
            
            # Save thumbnail from page 1
            if page_idx == 0:
                thumb_pix = page.get_pixmap(matrix=thumb_matrix, alpha=False)
                thumb_im = Image.open(io.BytesIO(thumb_pix.tobytes("png")))
                thumb_im.save(thumb_abs_path, "WEBP", quality=80, method=6)
        
        doc.close()
        
        updated_posters.append({
            "id": poster_id,
            "filename": filename,
            "title": p.get("title", filename.replace(".pdf", "")),
            "thumbnail": thumb_rel_path,
            "pages": pages_images,
            "pageCount": page_count
        })
        print(f"[{idx+1}/{len(posters)}] Converted '{filename[:40]}...' ({page_count} pages)")
    except Exception as e:
        print(f"[{idx+1}/{len(posters)}] Error converting '{filename}': {e}")

# Save updated JSON
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(updated_posters, f, ensure_ascii=False, indent=2)

print(f"Successfully converted and saved {len(updated_posters)} posters to {json_path}")
