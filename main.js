// You can use this JavaScript to add smooth scrolling if you want more control
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress");

    function animateProgressBars() {
        progressBars.forEach((bar) => {
            const width = bar.getAttribute("data-width");
            bar.style.width = width; 
        });
    }

    // Trigger animation when scrolling to the About section
    const skillsSection = document.getElementById("about");
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                animateProgressBars();
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(skillsSection);
});
