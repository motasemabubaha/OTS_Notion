#!/bin/bash
# build pptx -> pdf -> preview jpgs
set -e
cd "$(dirname "$0")"
node deck.js
SK=/root/.claude/skills/synced/271a35e8-033a-413c-ada0-049b610d15a7_26a27a0f-e3aa-4561-8b97-13284740b29e/pptx
timeout 400 python3 $SK/scripts/office/soffice.py --headless --convert-to pdf --outdir "$PWD" "$PWD/PEHT_Module02_Building_the_Practice_Lab.pptx" >/dev/null 2>&1
rm -rf r && mkdir r && pdftoppm -jpeg -r ${DPI:-72} PEHT_Module02_Building_the_Practice_Lab.pdf r/s
ls r | wc -l
