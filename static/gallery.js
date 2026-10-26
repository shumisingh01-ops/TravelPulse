
const gallery = document.getElementById("destinationTrack");

const previousButton = document.getElementById("galleryPrev");
const nextButton = document.getElementById("galleryNext");

if (gallery && previousButton && nextButton) {

    function moveGallery(direction) {

        const card = gallery.querySelector(".popular-card");

        if (!card) return;

        const distance = card.getBoundingClientRect().width + 22;

        gallery.scrollBy({
            left: distance * direction,
            behavior: "smooth"
        });

    }

    previousButton.addEventListener("click", function () {
        moveGallery(-1);
    });

    nextButton.addEventListener("click", function () {
        moveGallery(1);
    });

}
