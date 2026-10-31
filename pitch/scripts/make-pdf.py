"""Join the slide screenshots from export-pdf.mjs into matrica-pitch.pdf."""
import glob
from PIL import Image, JpegImagePlugin  # noqa: F401  (registers the JPEG writer the PDF plugin uses)

pages = [Image.open(p).convert("RGB") for p in sorted(glob.glob("pdf-pages/slide-*.png"))]
pages[0].save("matrica-pitch.pdf", save_all=True, append_images=pages[1:], resolution=144)
print(f"matrica-pitch.pdf: {len(pages)} pages")
