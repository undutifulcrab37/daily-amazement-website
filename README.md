# Wippas Website

A modern website featuring YouTube videos, winner announcements, and prize displays.

## Features

- Display of most recent winner
- Prize showcase (Air Jordan shoes)
- Embedded YouTube videos
- Responsive design for all devices

## How to Use

1. Open `index.html` in a web browser to view the website
2. To add YouTube videos:
   - Open `script.js`
   - Use the `addVideo()` function with your YouTube video ID
   - Example: `addVideo('dQw4w9WgXcQ')`
3. To update the winner's name:
   - Use the `updateWinnerName()` function
   - Example: `updateWinnerName('John Smith')`

## YouTube Video IDs

To get a YouTube video ID:
1. Go to your YouTube video
2. The ID is the part after `v=` in the URL
3. For example, in `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`

## Customization

- Edit `styles.css` to modify the website's appearance
- Update the Air Jordan image URL in `index.html` to change the prize image
- Modify the layout in `index.html` to change the structure 