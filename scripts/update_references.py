import os

def replace_in_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")
    else:
        print(f"No changes for {path}")

# 1. partnersData.ts
replace_in_file('src/data/partnersData.ts', [
    ('creativa-hub-logo.png', 'creativa-hub-logo.webp'),
    ('Zewail City.jpg', 'Zewail City.webp'),
    ('Arab Society for Physics.jpg', 'Arab Society for Physics.webp'),
    ('57357.png', '57357.webp'),
    ('Holding Company for Water and Wastewater.jpg', 'Holding Company for Water and Wastewater.webp'),
    ('Misr El Kheir Foundation.png', 'Misr El Kheir Foundation.webp'),
    ('Dolphin Models.png', 'Dolphin Models.webp'),
    ('Pureté Pharmaceuticals.png', 'Pureté Pharmaceuticals.webp'),
    ('TICO.jpg', 'TICO.webp'),
    ('HULT Prize.jpg', 'HULT Prize.webp'),
    ('Women Entrepreneurship Network (WEN).jpg', 'Women Entrepreneurship Network (WEN).webp'),
    ('Green Panda Cosmetics.jpg', 'Green Panda Cosmetics.webp'),
    ('HALOUL SCIENCE CLUB.jpg', 'HALOUL SCIENCE CLUB.webp'),
    ('Breakin Point.jpg', 'Breakin Point.webp'),
    ('POB.png', 'POB.webp'),
])

# 2. seedData.ts
replace_in_file('src/data/seedData.ts', [
    ('/images/magazine/1.png', '/images/magazine/1.webp'),
    ('/podcast-thumbnails/ep-1.jpg', '/podcast-thumbnails/ep-1.webp'),
    ('/podcast-thumbnails/ep-2.jpg', '/podcast-thumbnails/ep-2.webp'),
    ('/podcast-thumbnails/ep-3.jpg', '/podcast-thumbnails/ep-3.webp'),
    ('/podcast-thumbnails/ep-4.png', '/podcast-thumbnails/ep-4.webp'),
    ('.jpg', '.webp'),
])

# 3. PodcastView.tsx
replace_in_file('src/views/PodcastView.tsx', [
    ('/images/podcast/scicast-logo.png', '/images/podcast/scicast-logo.webp'),
    ('/images/creativa-hub-logo.png', '/images/creativa-hub-logo.webp'),
])

# 4. Navbar.tsx
replace_in_file('src/components/layout/Navbar.tsx', [
    ('/images/logo.png', '/images/logo.webp'),
])

# 5. Footer.tsx
replace_in_file('src/components/layout/Footer.tsx', [
    ('/images/logo.png', '/images/logo.webp'),
])

# 6. index.html
replace_in_file('index.html', [
    ('type="image/png" href="%BASE_URL%images/logo.png"', 'type="image/webp" href="%BASE_URL%images/logo.webp"'),
    ('%BASE_URL%images/logo.png', '%BASE_URL%images/logo.webp'),
])

# 7. 404.html
replace_in_file('public/404.html', [
    ('type="image/png" href="/images/logo.png"', 'type="image/webp" href="/images/logo.webp"'),
    ('/images/logo.png', '/images/logo.webp'),
])

# 8. offline.html
replace_in_file('public/offline.html', [
    ('./images/logo.png', './images/logo.webp'),
    ('/images/logo.png', '/images/logo.webp'),
])

# 9. manifest.json
replace_in_file('public/manifest.json', [
    ('"src": "images/logo.png"', '"src": "images/logo.webp"'),
    ('"type": "image/png"', '"type": "image/webp"'),
])

# 10. sw.js
replace_in_file('public/sw.js', [
    ('images/logo.png', 'images/logo.webp'),
    ('images/scilogo.png', 'images/scilogo.webp'),
])
