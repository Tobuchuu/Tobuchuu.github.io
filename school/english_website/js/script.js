//#region Libraries/Code from somewhere else
// Code from https://stackoverflow.com/a/39914235
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
//#endregion Libraries/Code from somewhere else
//#region Global variables
var uri_parameters = new URLSearchParams(window.location.search);
var loaded_page = "";
//#endregion Global variables
//#region Functions

function create_dropdown_block(input){

    // Create temporary elements
    let div_dropdown_block = document.createElement("div");
    let div_dropdown_header = document.createElement("div");
    let div_dropdown_content = document.createElement("div");
    let p_dropdown_header = document.createElement("p");
    
    // Add classes
    div_dropdown_block.classList.add("dropdown-block");
    div_dropdown_header.classList.add("dropdown-header");
    div_dropdown_content.classList.add("dropdown-content");

    // Add header text
    p_dropdown_header.innerHTML = input['header'];
    div_dropdown_header.appendChild(p_dropdown_header);

    // Add drop down content buttons
    for (let i = 0; i < input["content"].length; i++){
        let this_button = input["content"][i];
        let div_dropdown_button = document.createElement("div");
        let p_dropdown_button = document.createElement("p");

        // Add button text
        p_dropdown_button.innerHTML = this_button["label"];

        // Add button order, document and class
        div_dropdown_button.style = `--order: ${i+1};`;
        div_dropdown_button.classList.add("dropdown-button");
        if (this_button["document"] != null){
            div_dropdown_button.setAttribute("document", this_button["document"]);
        };

        // Append child
        div_dropdown_button.appendChild(p_dropdown_button);
        div_dropdown_content.appendChild(div_dropdown_button);
    };

    // Append child
    div_dropdown_block.appendChild(div_dropdown_header);
    div_dropdown_block.appendChild(div_dropdown_content);
    input['dest'].appendChild(div_dropdown_block);

    return div_dropdown_block;
};

async function load_site(fn, location_id, ignore_same_page=false){
    if(loaded_page == fn && !ignore_same_page){
        console.log("Same page, ignoring request");
        return;
    }
    else{
        loaded_page = fn;
    }
    
    let dest = document.getElementById(location_id);
    
    // Code from https://stackoverflow.com/a/53550663
    fetch((fn == null) ? "start.html" : fn)
    .then(
        function(response){
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                return;
            }

            // Examine the text in the response
            response.text().then(function(data){
                if (location_id != null){
                    dest.innerHTML = "";
                    dest.insertAdjacentHTML('beforeend',data)
                    history.pushState({}, null, (fn == null) ? window.location.pathname : `?d=${fn}`);
                }
            });
        }
    )
    .catch(
        function(err){
            console.log('Fetch Error :-S', err);
        }
    );
};

//#endregion Functions and events
//#region INIT
[
    {
        "header": "Culture",
        "content": [
            {
                "label": "option 1",
                "document": "text.html"
            },
            {
                "label": "Food",
                "document": "./content/sanna/food.html"
            }
        ],
        'dest': document.getElementsByClassName("navigation-items")[0]
    },
    {
        "header": "Sights",
        "content": [
            {
                "label": "Places to visit",
                "document": "./content/isak/places_to_visit.html"
            }
        ],
        'dest': document.getElementsByClassName("navigation-items")[0]
    }
]
.forEach(i => {
    /* Load everything at once */
    // i['content'].forEach(ii =>{
    //     load_site(ii['document'], null, true)
    // });

    create_dropdown_block(i);
});

load_site(uri_parameters.get("d"), "load-content-container", true)

//#endregion INIT
//#region EVENTS

// Returns to main page after user clicks the logo at top left
document.getElementsByClassName("logo")[0].onclick = function(){
    load_site(null,"load-content-container")
};

// Easter egg 1
document.querySelectorAll('p.easter-egg-1')[0].onclick = async function(){
    let a = document.createElement("img")
    a.src = "https://tinyurl.com/2cvt85n8";
    a.classList.add("easter-egg-1")
    document.body.appendChild(a)
};

/* Sets onclick events for all drop down buttons */
Array.from(document.getElementsByClassName("dropdown-button")).forEach(i => {
    i.onclick = function(){
        load_site(i.getAttribute("document"), "load-content-container")
    };
});

//#endregion EVENTS



//#region Lantern Code
function spawn_latern(){
    let dest = document.getElementsByClassName("lantern-holder")[0];
    let lantern = document.createElement("img");

    lantern.src = "https://freesvg.org/img/paper_lantern2.png";
    lantern.classList.add("lantern");
    lantern.style.top = document.getElementsByClassName("body-container")[0].offsetHeight + "px";

    dest.appendChild(lantern);
}
function update_lanterns(){
    Array.from(document.getElementsByClassName("lantern")).forEach(current_lantern => {
        current_lantern.style.top = `${parseFloat(current_lantern.style.top, 10) - 1}px`;
        let a = parseInt(current_lantern.style.top)
        let b = parseInt(current_lantern.offsetHeight)

        // console.log(a,b, b-a,(a*-1)-b)

        if (a + b < 0){
            current_lantern.remove()
        }
    });
}

// Code from https://stackoverflow.com/a/5638797
// var t=setInterval(spawn_latern,1000);
// var y=setInterval(update_lanterns,10);
//#endregion
