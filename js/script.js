const slider = document.querySelector(".slider");

document.querySelector(".next").onclick = () => {

    slider.scrollBy({

        left: 600,

        behavior: "smooth"

    });

}

document.querySelector(".prev").onclick = () => {

    slider.scrollBy({

        left: -600,

        behavior: "smooth"

    });

}






