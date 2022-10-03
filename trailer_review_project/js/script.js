var genres_lookup = {} // TO BE GENERATED LATER
var api_key = new URLSearchParams(window.location.search).get("apikey");
var api_mode = "discover";
var api_pageNum = 1;
var api_query = "";
var api_sortBy = "popularity.desc";
var api_withGenres = ""
var api_outputLocationQuerySelector = ".movies";
var api_clearOutputLocationOnRefresh = true;
var api_fromDate = "";
var api_toDate = "";

function refreshAPI(){
    let p = $.param({
        "api_key": api_key,
        "page": api_pageNum,
        "sort_by": api_sortBy,
        "query": api_query,
        "with_genres": api_withGenres,
        "primary_release_date.gte": api_fromDate,
        "primary_release_date.lte": api_toDate
    })
    
    if (api_clearOutputLocationOnRefresh){
        $(api_outputLocationQuerySelector).html("")
    }

    $.ajax({url: `https://api.themoviedb.org/3/${api_mode}/movie?${p}`, async: false}).done(function(data) {
        if (api_mode == "search"){
            $(".resultTotal").css("display", "flex");
            $(".resultTitle").html(api_query);
            $(".resultAmount").html(data.total_results);
        }
        else if (api_mode == "discover"){
            $(".resultTotal").css("display", "none");
        }

        data.results.forEach(e=>{
            // console.log(e);
            create_movie_card(e, api_outputLocationQuerySelector)
            
        })
    });
}

$(".showMore").click(function(){
    api_pageNum += 1
    api_clearOutputLocationOnRefresh = false
    refreshAPI()
    api_clearOutputLocationOnRefresh = true
})

function open_trailer_and_reviewpage(movieData){
    $(".trailer-container").append($(`
        <div class="window-container">
            <div class="trailer-section"></div>
            <div class="review-section"></div>
        </div>
    `))


    console.log(movieData);

    $.ajax({url: `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${api_key}`, async: false}).done(function(data) {
        let trailer_url = null;

        console.log(data);
        data.results.forEach(e=>{
            if (e.type == "Trailer"){
                trailer_url = e.key;
            }
        })

        $(".trailer-container .trailer-section").append($(
            trailer_url == null ?
            '<img src="https://www.jbhwheelchair.com/wp-content/themes/jbh/newassets/images/novideo.png" alt="No trailer found">'
            +
            `<div class="description-container">
                <h1>${movieData.title}</h1>
                <p>${movieData.overview == "" ? 'No description available' : movieData.overview}</p>
            </div>`
            :
            `<iframe src="https://www.youtube.com/embed/${trailer_url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            
            +
        
            `<div class="description-container">
                <h1>${movieData.title}</h1>
                <p>${movieData.overview == "" ? 'No description available' : movieData.overview}</p>
            </div>`
        ))
    });


    $.ajax({url: `https://api.themoviedb.org/3/movie/${movieData.id}/reviews?api_key=${api_key}&language=en-US&page=1`, async: false}).done(function(data) {
        if (data.results.length != 0){

            $(".review-section").append($(`<p class="reviewCount">${data.results.length} REVIEWS</p>`))    

            data.results.forEach(e=>{
            console.log(e);
            
            let avatar_path = e.author_details.avatar_path;
            if (avatar_path != null && avatar_path.startsWith("/")){avatar_path=avatar_path.substring(1)}
            if (avatar_path == null || !avatar_path.startsWith('http')){
                avatar_path = "https://i.pinimg.com/474x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg"
            }

            $(".trailer-container .review-section").append($(`
                <div class="review-container">
                    <div class="top">
                        <img src="${avatar_path}" alt="" class="pfp">
                        <p class="auth-name">${e.author_details.username == "" ? "(No name given)": e.author_details.username}</p>
                    </div>
                    <div class="bottom">
                        <p class="reviewInfo">Created : ${e.created_at}</p>
                        <br>
                        <p class="text">${e.content}</p>
                        <br>
                        <p class="reviewInfo">Last updated : ${e.updated_at}</p>
                        <a class="reviewInfo" href="${e.url}">Read original review here</a>
                    </div>
                </div>
                <hr>
                `))
            })
            $(".trailer-container .review-section").find("hr:last").remove();
        
        }
        else{
            $(".trailer-container .review-section").append($(`
                <div class="review-container noReviews">
                    <div class="bottom">
                        <h2>No available reviews</h2>
                    </div>
                </div>
                `))
        }
        
    });

    $(".trailer-container").show();
    $("body").css("overflow", "hidden");
}

function create_movie_card(e, l){
    let desc = e.overview.length > 170 ? e.overview.slice(0,170) + " ..." : e.overview;
    desc = desc.length == 0 ? "No available description." : desc;
    let a = $(`
        <div class="movieCard">
            <div class="rating">${e.vote_average}</div>
            <div class="front">
                <img class="poster"
                    src="${e.poster_path == null ? './img/no-image.png' : "https://www.themoviedb.org/t/p/w440_and_h660_face"+e.poster_path}"
                    alt="Movie Poster">
                <h3 class="title">${e.title}</h3>
                <div class="releasDate">
                    <p class="date">${e.release_date}</p>
                </div>
            </div>
            <div class="back">
                <!-- 193 characters max for description -->
                <p class="desc">${desc}</p>
                <button class="btn" id="movieID${e.id}">See Trailer</button>
            </div>
            <div class="backgroundWrapper"></div>
        </div>
    `)

    $(l).append(a);

    $("#movieID"+e.id).click(function(e2){
        open_trailer_and_reviewpage(e)
    })
}


// Fetch the genre list and format it into "genres_lookup"
$.ajax({url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, async: false}).done(function(data) {
    data.genres.forEach(e=>{
        genres_lookup[e.id] = e.name;
        $(".generaContainer").append($(`<p class="genera" value="${e.id}">${e.name}</p>`))
    })
});

// run on load to get default discovery page
// refreshAPI()



$(".options.movie-button,.goToMovies").click(function() {
    api_mode='discover';
    api_withGenres='';
    api_pageNum = 1;
    api_fromDate = "";
    api_toDate = "";
    api_sortBy = "popularity.desc";
    $('dateStart').val("");
    $('dateEnd').val("");
    $('sortby').val("popularity.desc");
    // $('.search').val("");
    $('.topList').hide();
    $('.showMore').css('display', 'flex');
    $('#sortby').show();
    $(".menuBtn").removeAttr('id');
    $(".movie-button > .menuBtn").attr("id", "active");  
    refreshAPI();
});

$(".options.home-button").click(function() {
    $('.search').val("");
    $('.topList').show();
    $('.movies').empty();
    $('.showMore').hide();
    $('.resultTotal').hide();
    $('#sortby').hide();
});


$(".trailer-container").click(function(e) {
    if (e.target == $(".trailer-container")[0]){
        $("body").css("overflow", "");
        $(this).hide().html("");
    }
});

$(".menuBtn").click(function(e) {
    $(".menuBtn").removeAttr('id');
    $(this).attr("id", "active");    
});

$(".genera").click(function() {
    $('.movie-button > .menuBtn').click();
    api_mode = "discover";
    $('.search').val('');
    api_query = "";
    api_withGenres = $(this).attr('value');
    refreshAPI();
});

$('#sortby').change(function(e){
    api_sortBy = $(this).val();
    refreshAPI();
});

$('#dateStart').change(function(e){
    $('.movie-button > .menuBtn').click();
    api_fromDate = $(this).val();
    refreshAPI();
});

$('#dateEnd').change(function(e){
    $('.movie-button > .menuBtn').click();
    api_toDate = $(this).val();
    refreshAPI();
});

// refreshAPI();

$('.search').keyup(function(e){
    if(e.keyCode == 13)
    {
        // gotta make it switch to the movie tab when you search
        $('.movie-button > .menuBtn').click();
        $('#sortby').hide();
        api_query = $(this).val().trim()

        if (api_query == ""){
            api_mode = "discover";
            $('#sortby').show();
        }
        else{
            api_mode = "search"; 
        }
        console.log(api_query)
        api_pageNum = 1;
        refreshAPI()
    }
});

$("#filter").click(function() {
    if ($(".filterTab").css("display") == "flex"){
        $(".filterTab").css("display", "none");
    }
    else{
        $(".filterTab").css("display", "flex");
    }
    
});
$("html").click(function(e) {
    if (e.target.closest("#filter") == $("#filter")[0]) {return}
    if (e.target.closest(".filterTab") == null){
        $(".filterTab").css("display", "none");
    }
});