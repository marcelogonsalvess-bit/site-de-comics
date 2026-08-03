const menuItems = document.querySelectorAll(
    ".menu-item"
);

menuItems.forEach(item => {


    item.addEventListener(
        "click",
        () => {


            console.log(
                item.dataset.page
            );


        }
    );


});