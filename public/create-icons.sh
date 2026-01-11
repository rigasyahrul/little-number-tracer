#!/bin/bash
# Create simple placeholder icons using ImageMagick
cd "$(dirname "$0")"

# Create 192x192 icon
convert -size 192x192 xc:'#FEF6E4' -fill '#F4D35E' -draw "circle 96,96 96,40" pwa-192x192.png

# Create 512x512 icon
convert -size 512x512 xc:'#FEF6E4' -fill '#F4D35E' -draw "circle 256,256 256,100" pwa-512x512.png

echo "Icons created: pwa-192x192.png pwa-512x512.png"
