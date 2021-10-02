
const fetchData = async (url, searchTerm) => {

    const params = {
        params: {
            apikey: 'd9835cc5',
            s: searchTerm
            // i: 'tt0848228'
        }
    }

    const response = await axios.get(url, params);
    //the way this omdb api is designed is that it returns code 200 even if no results have been found but it sends an Error property in that case, so its necessary to check if it's present 
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
}

const omdbUrl = 'http://www.omdbapi.com/';
const input = document.querySelector('#dropdownInput1');
input.value = '';

const onInput = async (event) => {
    //send a request based on what user entered
    const movies = await fetchData(omdbUrl, event.target.value);
    console.log(movies);

    const container = document.querySelector("#resultList1");
    //clear last search results
    container.innerHTML = '';

    //populate the drop down list with results
    for (let movie of movies) {
        const result = document.createElement('li');

        if (movie.Poster === 'N/A') {
            movie.Poster = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
        }

        result.innerHTML = `<a class="dropdown-item" href="#"><img src="${movie.Poster}" width="50px" height="70px"></img>${movie.Title}</a>`;

        //if a user clicks on any specific item in the drop down list
        result.addEventListener('click', () => {
            input.value = movie.Title;
            onMovieSelect(movie);
        })

        container.append(result);
    }

    //if there are no results for this request
    if (!movies.length) {
        const result = document.createElement('li');
        result.innerHTML = `<i class = "m-2" >No movies have matched your search... </i>`;
        container.append(result);
    }

}

//if the user clicks on the empty input
const onClick = async (event) => {
    const container = document.querySelector("#resultList1");

    if (!input.value) {
        container.innerHTML = '';
        const notification = document.createElement('li');
        notification.innerHTML = `<i class = "m-2">Enter search terms above to begin...</i>`;
        container.append(notification);
    }

}

const onMovieSelect = async (movie) => {
    const movieDetails = await axios.get(omdbUrl, {
        params: {
            apikey: 'd9835cc5',
            i: movie.imdbID
        }
    });

    const cardSlot = document.querySelector('#cardContainer1');
    cardSlot.innerHTML = generateACard(movieDetails.data);
}

const generateACard = (movieDetails) => {

    return `<div class="card" style="width: 18rem;">
        <img src="${movieDetails.Poster}" class="card-img-top">
        <div class ="card-body">
        <h4 class ="card-title"><b>${movieDetails.Title}</b></h5>
        <p class ="card-text">${movieDetails.Plot}</p>
        </div>

        <ul class ="list-group list-group-flush">

        <li class ="list-group-item">
        <b>Genre:</b>
        <p class ="card-text">${movieDetails.Genre}</p>
        </li>

        <li class ="list-group-item">
        <b>Awards:</b>
        <p class ="card-text">${movieDetails.Awards}</p>
        </li>

        <li class ="list-group-item">
        <b>Box Office:</b>
        <p class ="card-text">${movieDetails.BoxOffice}</p>
        </li>

        <li class ="list-group-item">
        <b>Metascore:</b>
        <p class ="card-text">${movieDetails.Metascore}</p>
        </li>

        <li class ="list-group-item">
        <b>IMDB Rating:</b>
        <p class ="card-text">${movieDetails.imdbRating}</p>
        </li>

        <li class ="list-group-item">
        <b>IMDB Votes:</b>
        <p class ="card-text">${movieDetails.imdbVotes}</p>
        </li>

        </ul>
    </div>`

}




input.addEventListener('input', createLimitedCallFunction(onInput, 500));
input.addEventListener('click', createLimitedCallFunction(onClick, 0));

console.log("Hey")