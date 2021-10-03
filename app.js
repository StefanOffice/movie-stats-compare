const omdbUrl = 'http://www.omdbapi.com/';
const backupImgUrl = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'

const renderMovie = (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? backupImgUrl : movie.Poster;
    return `<a class="dropdown-item" href="#"><img src="${imgSrc}" width="50px" height="70px"></img>${movie.Title}</a>`;
}

const inputValue = (movie) => {
    return movie.Title;
}

const fetchData = async (searchTerm) => {

    const params = {
        params: {
            apikey: 'd9835cc5',
            s: searchTerm
            // i: 'tt0848228'
        }
    }

    const response = await axios.get(omdbUrl, params);
    //the way this omdb api is designed is that it returns code 200 even if no results have been found but it sends an Error property in that case, so its necessary to check if it's present 
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
}

const onMovieSelect = async (movie, cardSlot, side) => {
    const movieDetails = await axios.get(omdbUrl, {
        params: {
            apikey: 'd9835cc5',
            i: movie.imdbID
        }
    });

    const tutorial = document.querySelector("#tutorial");
    if (tutorial) tutorial.remove();

    cardSlot.innerHTML = generateACard(movieDetails.data);

    saveMovie(movieDetails.data, side);
    compareMovies();
}


let movie1;
let movie2;
const saveMovie = (movie, side) => {
    if (side === 'left') {
        movie1 = movie;
    } else {
        movie2 = movie;
    }
}

const compareMovies = () => {
    if (movie1 && movie2) {
        const leftSideStats = document.querySelectorAll(
            '#cardContainer1 li'
        );
        console.log(leftSideStats);
        const rightSideStats = document.querySelectorAll(
            '#cardContainer2 li'
        );
        console.log(rightSideStats);

        for(let i = 0; i < leftSideStats.length; i++){
            const rightItem = rightSideStats[i];
            const leftItem = leftSideStats[i]

            let winner;

            if(leftItem.dataset.skip){
                continue;
            }

            if (leftItem.dataset.value) {
                const leftScore = leftItem.dataset.value;
                const rightScore = rightItem.dataset.value;

                if (leftScore > rightScore) {
                    winner = leftItem;
                } else if (rightScore > leftScore) {
                    winner = rightItem;
                }

            } else {
                winner = compareStats(leftItem, rightItem, 'oscarwins');

                if (!winner) {
                    winner = compareStats(leftItem, rightItem, 'wins');
                }

                if (!winner) {
                    winner = compareStats(leftItem, rightItem, 'noms');
                }

            }

            let other = winner === leftItem ? rightItem : leftItem;

            if (winner) {
                setStatus(winner, 'win');
                setStatus(other, 'lose');
            } else {

                setStatus(leftItem, 'tie');
                setStatus(rightItem, 'tie');
            }




        }
    }
}

const compareStats = (item1, item2, stat) => {
    const i1data = item1.dataset;
    const i2data = item2.dataset;

    if(i1data[stat] && i1data[stat].trim().toLowerCase() === 'null'){
        i1data[stat] = 0;
    }
    
    if(i2data[stat] && i2data[stat].trim().toLowerCase() === 'null'){
        i2data[stat] = 0;
    }

    if (i1data[stat] && i2data[stat]) {
        if (i1data[stat] > i2data[stat]) {
            return item1;
        } else if (i1data[stat] < i2data[stat]) {
            return item2;
        } else {
            return null;
        }
    } else if (!i1data[stat] && !i2data[stat]) {
        return null;
    } else {
        if (i1data[stat]) {
            return item1;
        } else {
            return item2;
        }
    }

}

const setStatus = (item, status) => {
    if (status === 'win') {
        item.classList.remove('bg-warning');
        item.classList.remove('bg-danger');
        item.classList.add('bg-success');
    } else if (status === 'tie') {
        item.classList.add('bg-warning');
        item.classList.remove('bg-danger');
        item.classList.remove('bg-success');
    } else if (status === 'lose') {
        item.classList.remove('bg-warning');
        item.classList.add('bg-danger');
        item.classList.remove('bg-success');
    }
}

const getNumber = (regex, sentence) => {
    const results = sentence.match(regex);
    if (results) {
        return num = parseInt(results[0].replace(/\D/g, ''));
    } else {
        return null;
    }
}

const generateACard = (movieDetails) => {

    const boxOffice = parseInt(
        movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

    const metaScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

    const oscarWrgx = /[a-zA-Z]*(won)\s*\d*\s*(oscar)/gi;
    const oscarW = getNumber(oscarWrgx, movieDetails.Awards);

    const oscarNrgx = /[a-zA-Z]*(for)\s*\d*\s*(oscar)/gi;
    const oscarN = getNumber(oscarNrgx, movieDetails.Awards);

    const winsRgx = /[a-zA-Z]*\d*\s*(win)/gi;
    const wins = getNumber(winsRgx, movieDetails.Awards);

    const nomsRgx = /[a-zA-Z]*\d*\s*(nomination)/gi;
    const noms = getNumber(nomsRgx, movieDetails.Awards);

    return `<div class="card" style="width: 22rem;">
        <img src="${movieDetails.Poster}" class="card-img-top">
        <div class ="card-body">
        <h4 class ="card-title"><b>${movieDetails.Title}</b></h5>
        <p class ="card-text">${movieDetails.Plot}</p>
        </div>

        <ul class ="list-group list-group-flush">

        <li data-skip="true" class ="list-group-item">
        <b>Genre:</b>
        <p class ="card-text">${movieDetails.Genre}</p>
        </li>

        <li data-oscarwins=${oscarW} data-oscarnoms=${oscarN} data-wins=${wins} data-noms=${noms} class ="list-group-item">
        <b>Awards:</b>
        <p class ="card-text">${movieDetails.Awards}</p>
        </li>

        <li data-value=${boxOffice} class ="list-group-item">
        <b>Box Office:</b>
        <p class ="card-text">${movieDetails.BoxOffice}</p>
        </li>

        <li data-value=${metaScore} class ="list-group-item">
        <b>Metascore:</b>
        <p class ="card-text">${movieDetails.Metascore}</p>
        </li>

        <li data-value=${imdbRating} class ="list-group-item">
        <b>IMDB Rating:</b>
        <p class ="card-text">${movieDetails.imdbRating}</p>
        </li>

        <li data-value=${imdbVotes} class ="list-group-item">
        <b>IMDB Votes:</b>
        <p class ="card-text">${movieDetails.imdbVotes}</p>
        </li>

        </ul>
    </div>`
}


const commonOptions = {
    renderItem: renderMovie,
    inputValue,
    fetchData
}

const input1 = document.querySelector('#dropdownInput1');
const resultContainer1 = document.querySelector("#resultList1");
const cardSlot1 = document.querySelector('#cardContainer1');
createAutoComplete({
    input: input1,
    resultContainer: resultContainer1,
    cardSlot: cardSlot1,
    onItemSelect: (movie) => {
        onMovieSelect(movie, cardSlot1, 'left');
    },
    ...commonOptions
});

const input2 = document.querySelector('#dropdownInput2');
const resultContainer2 = document.querySelector("#resultList2");
const cardSlot2 = document.querySelector('#cardContainer2');
createAutoComplete({
    input: input2,
    resultContainer: resultContainer2,
    cardSlot: cardSlot2,
    onItemSelect: (movie) => {
        onMovieSelect(movie, cardSlot2, 'right');
    },
    ...commonOptions
});



