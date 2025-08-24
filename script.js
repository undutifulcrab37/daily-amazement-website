// Function to create a YouTube video embed
function createVideoEmbed(videoId) {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-wrapper';
    
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    videoWrapper.appendChild(iframe);
    return videoWrapper;
}

// Function to add a video to the container
function addVideo(videoId) {
    const videoContainer = document.getElementById('video-container');
    const videoEmbed = createVideoEmbed(videoId);
    videoContainer.appendChild(videoEmbed);
}

// Function to update the winner's name
function updateWinnerName(name) {
    const winnerElement = document.getElementById('winner-name');
    winnerElement.textContent = name;
}

// Daily Amazement channel configuration
const CHANNEL_ID = 'UCZ0DFo8W800exk9sTR7kUMQ';
// TODO: Replace with your actual YouTube Data API key from Google Cloud Console
// Get one free at: https://console.cloud.google.com/apis/credentials
const YOUTUBE_API_KEY = 'AIzaSyCd_W_kuZjiNTftq7DIVjMTfsqiBZs1T2I'; // Updated with your real API key

// RSS feed URLs for Daily Amazement channel (backup method)
const youtubeRssUrls = [
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCZ0DFo8W800exk9sTR7kUMQ',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCZ0DFo8W800exk9sTR7kUMQ&orderby=published'
];

// Fallback videos in case all methods fail - expanded to ensure minimum 3 videos
const fallbackVideos = [
    '4FWwHKRkwoU',
    'Zs877UXy5_g',
    'e5BjiDxgUVU',
    'dQw4w9WgXcQ',
    'kJQP7kiw5Fk',
    'y6120QOlsfU'
];

function extractVideoId(url) {
    // Extract video ID from YouTube URL
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function loadVideosFromYouTubeAPI() {
    try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=6&type=video`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.log('YouTube API request failed:', response.status);
            return [];
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            console.log('No videos found from YouTube API');
            return [];
        }

        const videos = data.items.map(item => item.id.videoId);
        console.log(`✅ YouTube API loaded ${videos.length} videos for home page`);
        return videos;
    } catch (error) {
        console.log('YouTube API failed:', error.message);
        return [];
    }
}

function parseRssFeed(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = xmlDoc.querySelectorAll('entry');
    
    const videos = [];
    entries.forEach(entry => {
        const link = entry.querySelector('link')?.getAttribute('href') || '';
        const videoId = extractVideoId(link);
        
        if (videoId) {
            videos.push(videoId);
        }
    });
    
    return videos;
}

async function tryRssFeed(url) {
    try {
        // Try multiple CORS proxies to increase success rate
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        for (const proxy of proxies) {
            try {
                const response = await fetch(proxy + encodeURIComponent(url), {
                    timeout: 5000
                });
                
                if (response.ok) {
                    const xmlText = await response.text();
                    const videos = parseRssFeed(xmlText);
                    if (videos.length > 0) {
                        console.log(`Successfully loaded ${videos.length} videos from RSS feed for featured section`);
                        return videos;
                    }
                }
            } catch (error) {
                console.log(`Proxy ${proxy} failed for featured videos, trying next...`);
                continue;
            }
        }
        
        return [];
    } catch (error) {
        console.log('All RSS feed attempts failed for featured videos:', error);
        return [];
    }
}

async function loadFeaturedVideos() {
    console.log('🔄 Loading featured videos using multiple methods...');
    
    // Method 1: Try YouTube Data API first (most reliable)
    let videos = await loadVideosFromYouTubeAPI();
    if (videos.length >= 3) {
        const featuredVideos = videos.slice(0, 3);
        console.log(`✅ YouTube API provided ${featuredVideos.length} videos for home page featured section`);
        return featuredVideos;
    }
    
    // Method 2: Try RSS feeds as backup
    console.log('📡 YouTube API insufficient, trying RSS feeds...');
    let allRssVideos = [];
    
    for (const url of youtubeRssUrls) {
        const rssVideos = await tryRssFeed(url);
        allRssVideos = allRssVideos.concat(rssVideos);
        
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Combine API and RSS videos, remove duplicates
    const allVideos = [...videos, ...allRssVideos];
    const uniqueVideos = [...new Set(allVideos)];
    
    // Method 3: Supplement with fallback videos if needed
    if (uniqueVideos.length >= 3) {
        const featuredVideos = uniqueVideos.slice(0, 3);
        console.log(`✅ Using ${featuredVideos.length} videos from API/RSS for featured section`);
        return featuredVideos;
    } else if (uniqueVideos.length > 0) {
        // Supplement with fallback videos if needed
        const neededVideos = 3 - uniqueVideos.length;
        const supplementVideos = fallbackVideos.slice(0, neededVideos);
        const featuredVideos = [...uniqueVideos, ...supplementVideos];
        console.log(`✅ Using ${uniqueVideos.length} real videos + ${supplementVideos.length} fallback videos for featured section`);
        return featuredVideos;
    } else {
        // Use fallback videos only
        const featuredVideos = fallbackVideos.slice(0, 3);
        console.log(`⚠️ Using ${featuredVideos.length} fallback videos for featured section`);
        return featuredVideos;
    }
}

// Load featured videos when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const featuredVideos = await loadFeaturedVideos();
        
        // Clear existing videos
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = '';
        
        // Add each featured video
        featuredVideos.forEach(videoId => addVideo(videoId));
        
    } catch (error) {
        console.error('Error loading featured videos, using fallback:', error);
        
        // Use fallback videos
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = '';
        
        // Use only first 3 fallback videos to meet minimum requirement
        fallbackVideos.slice(0, 3).forEach(videoId => addVideo(videoId));
    }
});

// Example usage:
// To add a video, call: addVideo('YOUR_VIDEO_ID')
// To update winner's name, call: updateWinnerName('New Winner Name') 