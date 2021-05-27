//#region Libraries/Code from somewhere else
// Code from https://stackoverflow.com/a/39914235
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
//#endregion Libraries/Code from somewhere else
//#region Global variables
var uri_parameters = new URLSearchParams(window.location.search);

var loaded_pages_cache = {};
var load_document_default_file_name = "default.html";
var load_document_default_dest = document.getElementById('loader-here');

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

function after_load_document(){
    Array.from(document.getElementsByClassName("txt-container")[0].getElementsByTagName("img")).forEach(i => {
        if (i.getAttribute("source") != null){
            i.onclick = function(){
                window.open(i.getAttribute("source"));
            };
            i.title = "Click the image to go to the source";
        };
    });

    // Array.from(document.getElementsByClassName("txt-container")[0].getElementsByClassName("ancher-me")).forEach(i => {
    //     if (i.id == ""){i.id = i.innerHTML;}

    //     let ancher = document.createElement("a");
    //     ancher.text = "¶";
    //     ancher.classList.add("ancher");
    //     ancher.href = `#${i.id}`;
    //     i.appendChild(ancher);
    // });
}


// If `fn` is null, then it will try to load a default template ("default.html")
// If `ignore_same_page` is true, then it will load the page, even if the last reported loaded page is the same as the current request.
async function load_document(fn, dest, ignore_same_page=false){
    if (fn == load_document_default_file_name){fn = null;}
    if (dest == undefined || dest == null){dest = load_document_default_dest;}

    let replacement_html = null;

    // Step 1: Check if it should load in the first place.
    if (dest.getAttribute("loaded") == `${fn}`){

        if (!ignore_same_page){
            console.log("Same page, ignoring request");
            return;
        }
        console.log("Was same page, but ignore_same_page is true")
    }

    // Step 2: Check cache.
    if (`${fn}` in loaded_pages_cache){
        
        console.log("Using cache!");
        replacement_html = loaded_pages_cache[`${fn}`];
    }
    
    // Step 3: Make a new request
    if (replacement_html == null){

        let response = await fetch((fn == null) ? load_document_default_file_name : fn)

        if (response.status === 200){
            let data = await response.text()
            replacement_html = data;
        }
        
    }

    // Final step: Switch out data
    if (replacement_html != null){
        // Replace content
        dest.innerHTML = replacement_html;

        // Fix classes and "loaded" property
        if (dest.getAttribute("loaded") != null){
            dest.classList.remove(`document-${dest.getAttribute("loaded")}`)
        }
        dest.classList.add(`document-${fn}`)
        dest.setAttribute("loaded", `${fn}`);

        // Save to cache
        loaded_pages_cache[`${fn}`] = replacement_html;

        // Update URL
        history.pushState({}, null, (fn == null) ? window.location.pathname : `?d=${fn}`);

        Array.from(dest.getElementsByClassName("run-after-load")).forEach(i => {
            eval(i.innerHTML);
        });

        return 0;
    }
    
    return -1;
};

//#endregion Functions and events
//#region INIT
[
    {
        "header": "Culture",
        "content": [
            {
                "label": "Food",
                "document": "./content/sanna/food.html"
            },
            {
                "label": "Religion",
                "document": "./content/sanna/religion.html"
            },
            {
                "label": "option 1",
                "document": "text.html"
            },
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
    //     load_document(ii['document'], null, true)
    // });

    create_dropdown_block(i);
});

load_document(uri_parameters.get("d"), null, true)

//#endregion INIT
//#region EVENTS

// Returns to main page after user clicks the logo at top left
document.getElementsByClassName("logo")[0].onclick = function(){
    load_document(null);
};

// Easter egg 1
document.querySelectorAll('p.easter-egg-1')[0].onclick = async function(){
    let a = document.createElement("img");
    a.src = "https://tinyurl.com/2cvt85n8";
    a.classList.add("easter-egg-1");
    document.body.appendChild(a);
};

/* Sets onclick events for all drop down buttons */
Array.from(document.getElementsByClassName("dropdown-button")).forEach(i => {
    i.onclick = function(){
        load_document(i.getAttribute("document"))
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
