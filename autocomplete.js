const createAutoComplete = ({ input, resultContainer, cardSlot }) => {

    input.value = '';

    const onInput = async (event) => {
        //send a request based on what user entered
        const movies = await fetchData(omdbUrl, event.target.value);
        console.log(movies);

        //clear last search results
        resultContainer.innerHTML = '';

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

            resultContainer.append(result);
        }

        //if there are no results for this request
        if (!movies.length) {
            const result = document.createElement('li');
            result.innerHTML = `<i class = "m-2" >No movies have matched your search... </i>`;
            resultContainer.append(result);
        }

    }

    const onClick = async (event) => {
        if (!input.value) {
            resultContainer.innerHTML = '';
            const notification = document.createElement('li');
            notification.innerHTML = `<i class = "m-2">Enter search terms above to begin...</i>`;
            resultContainer.append(notification);
        }

    }

    input.addEventListener('input', createLimitedCallFunction(onInput, 500));
    input.addEventListener('click', createLimitedCallFunction(onClick, 0));


    const onMovieSelect = async (movie) => {
        const movieDetails = await axios.get(omdbUrl, {
            params: {
                apikey: 'd9835cc5',
                i: movie.imdbID
            }
        });

        cardSlot.innerHTML = generateACard(movieDetails.data);
    }



    
}