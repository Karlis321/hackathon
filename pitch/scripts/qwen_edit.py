"""Make photorealistic 'after' images with Qwen-Image-Edit (Hugging Face demo Qwen/Qwen-Image-Edit by default).

Usage (from pitch/): HF_HOME=../.hf python scripts/qwen_edit.py <input.jpg> <output.jpg> <prompt-key> [seed] [space]
Prompts follow the Qwen Image cookbook pattern: change only the target, preserve everything else.
"""
import shutil
import sys

from gradio_client import Client, handle_file
from huggingface_hub import get_token
from PIL import Image

PROMPTS = {
    "substation": (
        "In front of the two transformers, build a tall protective screen: five tall weathered grey precast concrete "
        "poles, each about 4 metres high, standing in a row on the concrete apron about two metres in front of the "
        "transformers. Between the poles, a dense, clearly visible net made of thick black insulated electrical cables "
        "runs straight horizontally and vertically in a tight square grid, covering the whole front of the transformers "
        "up to the top of the poles, tied together at every crossing. A thick black cable runs along the top of the "
        "poles. At the bottom, a low wall of crushed grey concrete rubble. The transformers are seen through the black "
        "cable net. Photorealistic, natural light matching the photo, correct perspective and shadows. "
        "Keep the transformers, green steel gantries, sky, grass and camera angle unchanged."
    ),
    "storm": (
        "Show this street protected from the storm: replace the broken leaning wooden utility poles with straight, "
        "upright grey precast concrete poles, and stretch a protective net made of black insulated electrical cables "
        "in a square grid about 10 cm apart above and alongside the power lines between the poles. The fallen tree "
        "branches lie on top of the net, caught by it, and the power lines underneath are intact, taut and not touching "
        "the ground. Photorealistic, same overcast light. Preserve the parked cars, houses, trees, autumn colours, road "
        "and camera angle exactly. Avoid cartoon style, text, people."
    ),
}


def main():
    src, out, key = sys.argv[1], sys.argv[2], sys.argv[3]
    seed = int(sys.argv[4]) if len(sys.argv) > 4 else 42
    im = Image.open(src).convert("RGB")
    im.thumbnail((1024, 1024))
    small = out + ".input.jpg"
    im.save(small, quality=92)
    space = sys.argv[5] if len(sys.argv) > 5 else "Qwen/Qwen-Image-Edit"
    # the login saved by `hf auth login` (HF_HOME) gives the account's GPU quota
    client = Client(space, hf_token=get_token(), verbose=False)
    fast = "Fast" in space  # 8-step Lightning version needs guidance 1.0
    result, used_seed = client.predict(
        handle_file(small), PROMPTS[key], seed, False, 1.0 if fast else 4.0, 8 if fast else 30, False, api_name="/infer"
    )
    path = result["path"] if isinstance(result, dict) else result
    shutil.copy(path, out)
    print(out, Image.open(out).size, "seed", used_seed)


if __name__ == "__main__":
    main()
