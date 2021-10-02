
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
const input1 = document.querySelector('#dropdownInput1');
const resultContainer1 = document.querySelector("#resultList1");
const cardSlot1 = document.querySelector('#cardContainer1');
createAutoComplete({input:input1, 
    resultContainer:resultContainer1,
    cardSlot:cardSlot1});

const input2 = document.querySelector('#dropdownInput2');
const resultContainer2 = document.querySelector("#resultList2");
const cardSlot2 = document.querySelector('#cardContainer2');
createAutoComplete({input:input2, 
    resultContainer:resultContainer2,
    cardSlot:cardSlot2});


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

console.log("Heiy")