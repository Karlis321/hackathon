"""List logo-looking image URLs on company homepages (to pick official logo files)."""
import re
import sys
import time
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MatricaPitch/1.0"

for site in sys.argv[1:]:
    print("==", site)
    try:
        req = urllib.request.Request(site, headers={"User-Agent": UA})
        html = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "replace")
    except Exception as e:
        print("   error:", e)
        continue
    found = []
    for m in re.finditer(r'(?:src|href|content|data-src)=["\']([^"\']+\.(?:svg|png)(?:\?[^"\']*)?)["\']', html, re.I):
        u = m.group(1)
        if "logo" in u.lower():
            found.append(urllib.parse.urljoin(site, u))
    for u in list(dict.fromkeys(found))[:6]:
        print("   ", u)
    if not found:
        print("    (no logo file found in HTML)")
    time.sleep(1)
