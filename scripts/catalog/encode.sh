#!/usr/bin/env bash
# Turns the raw captures into catalog media: public/catalog/<slug>.webp
# (640×360 poster) and <slug>.mp4 (640×360, 24 fps, H.264, no audio).
# Needs ffmpeg and ImageMagick. See docs/catalog-media.md.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
RAW="$HERE/raw"
OUT="$HERE/../../public/catalog"
mkdir -p "$OUT"

# video <slug> <job> <start s> <duration s>
video() {
  ffmpeg -v error -y -ss "$3" -i "$(ls "$RAW/v-$2"/*.webm | head -1)" -t "$4" -an \
    -vf "scale=640:360:force_original_aspect_ratio=decrease:flags=lanczos,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x1b1d1a,fps=24,format=yuv420p" \
    -c:v libx264 -preset slow -crf 30 -profile:v main -movflags +faststart "$OUT/$1.mp4"
}

# poster <slug> <png>
poster() {
  convert "$2" -resize 640x360^ -gravity north -extent 640x360 -quality 78 "$OUT/$1.webp"
}

# slideshow <slug> <png...> — for notebooks: charts on white, slow zoom.
slideshow() {
  local slug=$1; shift; local i=0 tmp; tmp="$(mktemp -d)"
  for f in "$@"; do
    convert "$f" -resize 600x330 -background white -gravity center -extent 640x360 "$tmp/$i.png"; i=$((i + 1))
  done
  ffmpeg -v error -y -framerate 1/2.2 -i "$tmp/%d.png" \
    -vf "fps=24,format=yuv420p,zoompan=z='min(zoom+0.0008,1.06)':d=1:s=640x360:fps=24" \
    -c:v libx264 -crf 30 -preset slow -movflags +faststart "$OUT/$slug.mp4"
  convert "$tmp/0.png" -quality 80 "$OUT/$slug.webp"
  rm -rf "$tmp"
}

case "${1:-all}" in
  all)
    video arriba arriba 0.8 8
    video arriba-jump jump 3.0 9;  poster arriba-jump "$RAW/jump.png"
    video nexus nexus 1.6 9;       poster nexus "$RAW/nexus2.png"
    for pair in cnab:cnab-400 csvval:csv-validator sql:sql-playground curso:sql-course editor:web-editor \
                dns:dns-checker massa:test-data base64:base64 caixa:case-converter amigo:secret-friend cartao:profile-card; do
      video "${pair##*:}" "${pair%%:*}" 0.6 7
      poster "${pair##*:}" "$RAW/${pair%%:*}.png"
    done
    ;;
  *) "$@" ;;
esac
