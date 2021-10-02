
const fetchData = async (url, searchTerm) => {

    const params = {
        params: {
            apikey: 'd9835cc5',
            s : searchTerm
            // i: 'tt0848228'
        }
    }

    const response = await axios.get(url, params);
    console.log(response.data);
}

const omdbUrl = 'http://www.omdbapi.com/';


const onInput = (event) => { fetchData(omdbUrl, event.target.value); }

const input = document.querySelector('input');
input.addEventListener('input', createLimitedCallFunction(onInput));

 console.log("Heya")