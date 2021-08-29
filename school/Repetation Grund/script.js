function update_carosels() {
    Array.from(document.getElementsByClassName("image-carousel")).forEach(e => {
        let w = e.offsetWidth;
        let h = e.offsetHeight;

        e.querySelector(".image-list").children.forEach(img_e => {
            img_e.style.width = w + "px";
            img_e.style.height = h + "px";
        })

        goto_img(null, e.id)
    });
}

window.onresize = update_carosels;

function goto_img(x, id){
    let img_carousel = document.getElementById(id)
    let image_list = img_carousel.querySelector("div.image-list")
    let img_count = img_carousel.getAttribute("selected_image")

    if (img_count == null){
        img_count = 0;
    }
    else{
        img_count = parseInt(img_count)
    }
    
    if (x == "next"){
        img_count += 1;
    }
    else if (x == "prev"){
        img_count -= 1;
    }
    else if (x == null){
        // pass
    }
    else{
        img_count = x
    }

    if (img_count > image_list.children.length - 1){
        img_count = 0;
    }
    if (img_count < 0){
        img_count = image_list.children.length - 1;
    }

    image_list.style.transform = `translateX(-${image_list.offsetWidth * img_count}px)`
    img_carousel.setAttribute("selected_image", img_count)
}

window.onload = function(){
    update_carosels()
}