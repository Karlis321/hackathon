"""Search Wikimedia Commons for company logos, politely (one request at a time)."""
import json
import sys
import time
import urllib.parse
import urllib.request

UA = "MatricaPitch/1.0 (Climathon 2026 hackathon; contact via RTU)"
API = "https://commons.wikimedia.org/w/api.php"


def search(q, limit=5):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": "6", "gsrlimit": str(limit), "gsrsearch": q,
        "prop": "imageinfo", "iiprop": "url|size|extmetadata",
        "iiextmetadatafilter": "LicenseShortName",
    }
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # rate limit or network hiccup
            time.sleep(5 * (attempt + 1))
    return {}


for q in sys.argv[1:]:
    d = search(q)
    print("==", q)
    for p in (d.get("query", {}).get("pages", {}) or {}).values():
        ii = p["imageinfo"][0]
        lic = ii.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "")
        print("   ", lic, "|", p["title"][:90])
    time.sleep(2)
