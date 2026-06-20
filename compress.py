import glob, re, base64, io, os
try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

print("Pillow installed:", has_pil)

for f in glob.glob('*.svg'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        data = file.read()
    
    match = re.search(r'data:image/(png|jpeg);base64,([A-Za-z0-9+/=]+)', data)
    if match:
        img_data = base64.b64decode(match.group(2))
        base_name = os.path.splitext(f)[0]
        
        if has_pil:
            try:
                img = Image.open(io.BytesIO(img_data))
                out_name = base_name + '.webp'
                img.save(out_name, 'WEBP', lossless=True, quality=80)
                print(f"Converted {f} to {out_name} ({os.path.getsize(out_name) // 1024} KB)")
            except Exception as e:
                print(f"Failed to convert {f}: {e}")
        else:
            out_name = base_name + '.png'
            with open(out_name, 'wb') as out_file:
                out_file.write(img_data)
            print(f"Extracted {f} to {out_name} ({os.path.getsize(out_name) // 1024} KB)")
