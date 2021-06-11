function readTextFile(file, callback){
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
};

function combine_iframe_and_window_params(){
    let params = Object.assign({},
        Object.fromEntries(new URLSearchParams(window.location.search).entries()),
        Object.fromEntries(new URLSearchParams(window.frames.iframe.window.location.search).entries())
    );
    let url_parameters_to_add = "";
    
    Object.keys(params).forEach(key => {
        url_parameters_to_add += (url_parameters_to_add == "" ? "?" : "&") + 
            `${key}=${encodeURIComponent(params[key])}`;
    });

    return window.location.href.replace(window.location.search,"") + url_parameters_to_add;
};

function update_hash(){
    location.hash = ((location.hash == "#update1") ? "#update2" : "#update1");
};

function run_app_manager(bypass=null){
    // Open the apps.json file and fetch all the app list
    readTextFile("./apps.json", function(text){
        let app_list = JSON.parse(text);
        let url_parameters = Object.fromEntries(new URLSearchParams(window.location.search).entries());
        let specified_app = (bypass ? bypass : url_parameters.app);

        // If the app specified is actually in the list of apps:
        if (Object.keys(app_list).includes(specified_app)){

            // Checks if its a redirect or not
            while (app_list[specified_app].url.startsWith("redirect")){
                url_parameters = Object.fromEntries(
                    new URLSearchParams(
                        new URL(
                            `${window.location.origin}/${app_list[specified_app].url}`
                        ).search
                    )
                );
                
                if (specified_app == url_parameters.app){
                    specified_app == "error"
                }
                else{
                    specified_app = (url_parameters.app ? url_parameters.app : "error");
                }
            }

            // Then continues to work with the iframe:
            let app_url = new URL(`${window.location.origin}/${app_list[specified_app].url}`);
            let params = Object.assign({},
                url_parameters,
                Object.fromEntries(new URLSearchParams(app_url.search).entries())
            );

            // Takes all the URI parameters from the real URL and passes them to the iframe
            let url_parameters_to_add = "";
            Object.keys(params).forEach(key => {
                url_parameters_to_add += (url_parameters_to_add == "" ? "?" : "&") + 
                    `${key}=${encodeURIComponent(params[key])}`;
            });

            // Make iframe
            let iframe = document.createElement("iframe");
            iframe.id = specified_app;
            iframe.name = "iframe";
            iframe.title = specified_app;
            iframe.src = app_url.href.replace(app_url.search,"") + url_parameters_to_add + "&t=" + Math.round(Date.now() / 1000);
            iframe.onload = function(){
                let new_favicon = iframe.contentDocument.querySelector('head > link[rel="icon"]');
                let new_title = iframe.contentDocument.querySelector('head > title');
                
                // If the app has a favicon:
                if (new_favicon != undefined){
                    let og_favicon = document.querySelector('head > link[rel="icon"]');
                    og_favicon.href = new_favicon.href;
                    og_favicon.type = new_favicon.type;
                };

                // If the app has a title:
                if (new_title != undefined){
                    document.querySelector('head > title').innerHTML = new_title.innerHTML;
                };
            };

            document.body.appendChild(iframe);

            window.frames.iframe.window.addEventListener('hashchange', function(){
                if (window.frames.iframe.window.location.hash.startsWith("#update")){
                    window.history.pushState({}, null, combine_iframe_and_window_params());
                }
            }, false);
        }
        else if (bypass == null){
            document.querySelector(".main-container").style.display = "";
            
            let dest = document.querySelector(".app-list");

            Object.keys(app_list).forEach(i => {
                if (!app_list[i].include){return;};

                let new_div_container = document.createElement("div");
                let new_a = document.createElement("a");
                let new_h2_title = document.createElement("h2");
                let new_p_description = document.createElement("p");
                
                new_a.href = window.location.href.replace(window.location.search,"") + `?app=${i}`;
                new_h2_title.innerHTML = app_list[i].title;
                // new_h2_title.setAttribute("onclick",`run_app_manager('${i}');document.getElementById('${i}').scrollIntoView();`);
                new_p_description.innerHTML = app_list[i].description;
                
                new_a.appendChild(new_h2_title);
                new_div_container.appendChild(new_a);
                new_div_container.appendChild(new_p_description);

                dest.appendChild(new_div_container);
            });
        };
    });
};
