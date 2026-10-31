"""Download original files from Wikimedia Commons with retries: get_commons.py out_dir 'File title=out_name' ..."""
import sys
import time
import urllib.parse
import urllib.request

UA = "MatricaPitch/1.0 (Climathon 2026 hackathon)"
out = sys.argv[1]
for pair in sys.argv[2:]:
    title, name = pair.split("=", 1)
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title)
    for attempt in range(5):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()
            if data[:15].lower().startswith(b"<!doctype html"):
                raise RuntimeError("got an HTML page (rate limited)")
            open(f"{out}/{name}", "wb").write(data)
            print(name, len(data))
            break
        except Exception as e:
            print("  retry", name, e)
            time.sleep(8 * (attempt + 1))
    time.sleep(4)
