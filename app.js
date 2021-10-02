
const fetchData = async (url, searchTerm) => {

    const params = {
        params: {
            apikey: 'd9835cc5',
            s : searchTerm
            // i: 'tt0848228'
        }
    }

    const response = await axios.get(url, params);
    //the way this omdb api is designed is that it returns code 200 even if no results have been found but it sends an Error property in that case, so its necessary to check if it's present 
    if(response.data.Error){
        return [];
    }

    return response.data.Search;
}

const omdbUrl = 'http://www.omdbapi.com/';


const onInput = async (event) => { 
    const movies = await fetchData(omdbUrl, event.target.value);
    console.log(movies);

    const container = document.querySelector("#resultList");
    for(let movie of movies){
        const result = document.createElement('li');
        
        result.innerHTML = `<a class="dropdown-item" href="#"><img src="${movie.Poster}" width="50px" height="50px"></img>${movie.Title}</a>`;

        container.append(result);

    }

}

const input = document.querySelector('input');
input.addEventListener('input', createLimitedCallFunction(onInput));

 console.log("Heya")