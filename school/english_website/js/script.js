//#region Libraries/Code from somewhere else

// Code from https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Code from https://stackoverflow.com/a/39914235
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Code from https://www.geeksforgeeks.org/scroll-to-the-top-of-the-page-using-javascript-jquery/#:~:text=function%20scrollToTop,0%2C%200
function scrollToTop(){
    // Code from https://stackoverflow.com/a/24191692
    document.getElementById("top").scrollIntoView();

    // Code from https://stackoverflow.com/a/14623413
    document.body.scrollTop = 0;
}

// Code from https://www.w3schools.com/howto/howto_js_fullscreen.asp#:~:text=fullscreen%20document
var elem = document.documentElement;
/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }
  
  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
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
}


// If `fn` is null, then it will try to load a default template ("default.html")
// If `ignore_same_page` is true, then it will load the page, even if the last reported loaded page is the same as the current request.
async function load_document(fn, dest, ignore_same_page=false){
    let replacement_html = null;
    let load_to_top = false;

    if (fn != null && fn.slice(-1) == "#"){
        fn = fn.slice(0, -1);
        load_to_top = true;
    }
    if (fn == load_document_default_file_name || fn == "null"){fn = null;}
    if (dest == undefined || dest == null){dest = load_document_default_dest;}

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
        history.pushState(
            {},
            null,
            
            (fn == null) ? window.location.pathname : `?d=${fn}`
        );

        if (load_to_top){
            scrollToTop()
        }

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
            }
        ],
        'dest': document.getElementsByClassName("navigation-items")[0]
    },
    {
        "header": "Traditions",
        "content": [
            {
                "label": "Festivals",
                "document": "./content/aleksandar/festivals.html"
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

    // Code from https://stackoverflow.com/a/4236294
    a.addEventListener('contextmenu', function(ev){
        ev.preventDefault();
        return false;
    }, false);

    document.body.appendChild(a);

    openFullscreen()
};

/* Sets onclick events for all drop down buttons */
Array.from(document.getElementsByClassName("dropdown-button")).forEach(i => {
    i.onclick = function(){
        load_document(i.getAttribute("document"))
    };
});

//#endregion EVENTS
