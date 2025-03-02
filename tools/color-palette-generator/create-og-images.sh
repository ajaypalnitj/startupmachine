#!/bin/bash

# Create a directory for OpenGraph and Twitter card images if it doesn't exist
mkdir -p og-images

# Use ImageMagick to create a visually appealing OG image
# This is a simplified example - you may want to customize this
# Install ImageMagick first if not installed: brew install imagemagick

# Create background 
convert -size 1200x630 \
  gradient:#4F46E5:#FF6B6B \
  -font Arial-Bold \
  -pointsize 60 \
  -gravity center \
  -annotate 0 "Color Palette Generator" \
  -pointsize 32 \
  -annotate +0+80 "Extract colors from any image" \
  -fill white \
  og-image.jpg

# Copy for Twitter
cp og-image.jpg twitter-card.jpg

echo "OpenGraph and Twitter card images created successfully"
echo "Remember to optimize these images further with a graphic design tool" 