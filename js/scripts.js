$.fn.toEm = function(settings){
    settings = jQuery.extend({
        scope: 'body'
    }, settings);
    var that = parseInt(this[0],10),
        scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
        scopeVal = scopeTest.height();
    scopeTest.remove();
    return (that / scopeVal).toFixed(8);
};

$.fn.toPx = function(settings){
    settings = jQuery.extend({
        scope: 'body'
    }, settings);
    var that = parseFloat(this[0]),
        scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
        scopeVal = scopeTest.height();
    scopeTest.remove();
    return Math.round(that * scopeVal);
};

function generate_project_section_html(
    project_name,
    project_display_name,
    project_date,
    project_desc,
    built_using_arr,
    website_link,
    github_link,
    img_src
){
    website_link = website_link == null ? "" : `<a href="${website_link}" target="_blank" class="website-link">Visit Website</a>`;
    project_date = project_date == null ? "" : `<p class="date">${project_date}</p>`;
    return $(`
        <div class="section" id="project_${project_name}">
            <div class="textarea">
                <div class="title-section">
                    <h1 class="title">${project_display_name}</h1>
                    ${project_date}
                </div>
                <p class="desc">${project_desc}</p>
                
                <p class="project-tools">Built using: ${built_using_arr.join(', ')}</p>
                <div class="project-links">
                    ${website_link}
                    <a href="${github_link}" target="_blank" class="github-link">View Code</a>
                </div>
            </div>
            <img src="${img_src}" alt="" class="side-img">
        </div>
    `);
}

function update_background_navbar_scroll(){
    Array.from($('.bg')).forEach(e=>{
        $(e).css("top", ($($(e).attr('target')).position().top - $(window).scrollTop()) + "px");
    })
}

$(document).ready(function() {
    update_background_navbar_scroll();

    $(window).scroll(function() {
        update_background_navbar_scroll();
        
        // Get how far down the page is scrolled and convert into EM format
        let ems_scrolled = Math.min($($(document).scrollTop()).toEm(), 3);

        // Make sure the value is in the range 0-3.
        ems_scrolled = isNaN(ems_scrolled) || ems_scrolled < 0 ? 0 : ems_scrolled;

        $(".nav").css("top", `calc(3em - ${ems_scrolled}em)`)
    });
});