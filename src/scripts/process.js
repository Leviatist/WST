const progressBar = document.querySelector('.progress-bar');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
});