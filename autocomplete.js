const createAutoComplete = ({ input, resultContainer, cardSlot, renderItem, onItemSelect, inputValue,  fetchData}) => {

    input.value = '';

    const onInput = async (event) => {
        //send a request based on what user entered
        const items = await fetchData(event.target.value);
        //clear last search results
        resultContainer.innerHTML = '';

        //populate the drop down list with results
        for (let item of items) {
            const result = document.createElement('li');

            result.innerHTML = renderItem(item);

            //if a user clicks on any specific item in the drop down list
            result.addEventListener('click', () => {
                input.value = inputValue(item);
                onItemSelect(item);
            })

            resultContainer.append(result);
        }

        //if there are no results for this request
        if (!items.length) {
            const notification = document.createElement('li');
            notification.innerHTML = `<i class = "m-2" >No results have matched your search... </i>`;
            resultContainer.append(notification);
        }

    }

    //if field is empty
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
}