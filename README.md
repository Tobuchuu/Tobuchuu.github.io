# Tobuchuu.github.io
This is where I dump my projects

## Trailer Review Project : [Github Page](https://tobuchuu.github.io/trailer_review_project/index.html?apikey=)
### Guide
> You will have to add your own API key to the `apikey` parameter in the url to use the website properly, 
you can get one for free from [TMDB](https://www.themoviedb.org/documentation/api#:~:text=How%20do%20I%20apply%20for%20an%20API%20key%3F).

1. Make an account first
2. Go in `settings`, there will be a left sidebar where you can find `API`
3. Request an API key
4. Fill in the details (the API is free)
5. When you get the API key, you can then paste it into the [Trailer Review Project](https://tobuchuu.github.io/trailer_review_project/index.html?apikey=)
url
6. Make sure that it's apikey=`your API key`
7. Reload the page

### Overview  
The main project is about making a website that shows trailers and reviews, while the targeted audience would preferably be anyone 
looking for a good movie to watch.
**Functional requirements** for the website is that it has to load in movies from data fetched by an API. That data is used to generate cards containing 
an image for the movies which is their poster as well as their title, rating, description and a button to display a new div on top of the page with more 
information about the movie. That information would be the selected movie's title and description with trailer and reviews added to it. 
The body underneath the container with the new information will have it's overflow locked as long as the container is visible on the page and to 
close it, you'll have to click with the curser outside of the container. That will remove the content of the container which stops the trailer to 
continue playing. The website also has to have a search bar to search for a specific movie where it will show all related movies to what is searched 
and append it to the page. Filtering by genres and sorting is a must. 

On the home page there has to be a container that changes between random popular movies with a list of the top 10 movies beside the container. 
When the curser hovers over the container, it must stop changing movies and start playing a part of a trailer that belongs to the current movie 
that got hovered. Lastly, the movie cards have to indicate that they are clickable by being animated on hover.

#### Functional requirements
- [x] Fetch movies and load them
- [x] Popup window with trailer and reviews on click
- [x] Usable searchbar
- [x] Filter by genres
- [ ] Filter by dates
- [x] Sorting
- [ ] Home page movie randomizer
- [ ] Top 10 List
- [x] Animation on hover
- [ ] About page

#### None-Functional requirements
- [ ] Loading screen
- [x] Easy to add new movies
- [x] Short load time
- [ ] Adapted for mobil 

Credit to [TMDB](https://www.themoviedb.org/) for their API
