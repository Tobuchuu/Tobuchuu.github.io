// Code from https://stackoverflow.com/a/39914235
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Variables
var isChanging = false; // Is true if currently changing content


// Returns to main page after user clicks the logo at top left
document.getElementsByClassName("logo")[0].onclick = function(){
    load_site(null,"load-content-container")
};




async function load_site(fn, location_id){
    // Checks if allready changing
    if (isChanging){return;}else{isChanging = true;} 

    let dest = document.getElementById(location_id);

    


    fetch((fn == null) ? "./start.html" : fn)
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }

            // Examine the text in the response
            response.text().then(function(data) {
                dest.innerHTML = "";
                dest.insertAdjacentHTML('beforeend',data)
            });
        }
    )
    .catch(
        function(err) {
        console.log('Fetch Error :-S', err);
    }
    );







    

    // dest.style.opacity = 0;
    // await sleep(500);

    
    // dest.appendChild(new_element);

    // await sleep(200);
    // dest.style.opacity = 100;

    isChanging = false;
}

Array.from(document.getElementsByClassName("dropdown-button")).forEach(i => {
    i.onclick = function(){
        load_site(i.getAttribute("document"),"load-content-container")
    };
});

load_site(null,"load-content-container")
