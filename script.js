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

// RSS feed URLs for Daily Amazement channel
const youtubeRssUrls = [
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCZ0DFo8W800exk9sTR7kUMQ&max-results=10',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCZ0DFo8W800exk9sTR7kUMQ&orderby=published&max-results=10'
];

// Fallback videos in case RSS fails - expanded to ensure minimum 3 videos
const fallbackVideos = [
    '4FWwHKRkwoU',
    'Zs877UXy5_g',
    'e5BjiDxgUVU',
    'tU9v0w1x2y3',
    'zA1b2c3d4e5',
    'fG6h7i8j9k0'
];

function extractVideoId(url) {
    // Extract video ID from YouTube URL
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
    let allRssVideos = [];
    
    // Try multiple RSS feed URLs to get more videos
    for (const url of youtubeRssUrls) {
        const videos = await tryRssFeed(url);
        allRssVideos = allRssVideos.concat(videos);
        
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Remove duplicates and ensure minimum 3 videos
    const uniqueVideos = [...new Set(allRssVideos)];
    
    // Always return at least 3 videos
    if (uniqueVideos.length >= 3) {
        const featuredVideos = uniqueVideos.slice(0, 3);
        console.log(`Using ${featuredVideos.length} videos from RSS feed for featured section`);
        return featuredVideos;
    } else if (uniqueVideos.length > 0) {
        // If we have some RSS videos but less than 3, pad with fallback videos
        const neededVideos = 3 - uniqueVideos.length;
        const fallbackVideosToAdd = fallbackVideos.slice(0, neededVideos);
        const combinedVideos = [...uniqueVideos, ...fallbackVideosToAdd];
        console.log(`Using ${uniqueVideos.length} RSS videos + ${neededVideos} fallback videos for featured section`);
        return combinedVideos;
    } else {
        // If no RSS videos, use first 3 fallback videos
        console.log('Using fallback videos for featured section');
        return fallbackVideos.slice(0, 3);
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