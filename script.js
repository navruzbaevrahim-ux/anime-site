function showPage(id) {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('player').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

function openAnime(title, url) {
    const video = document.getElementById('main-video');
    document.getElementById('video-src').src = url;
    video.load();
    showPage('player');
}

