// //used to have to do this
// let timeoutId;
// const onInput = (event) => { 
// 
//     if(timeoutId){
//         clearTimeout(timeoutId);
//     }
//     
//     timeoutId = setTimeout(() => {
//         fetchData(omdbUrl, event.target.value);
//     }, 1000)
// }


//but now making it reusable
const createLimitedCallFunction = (callback, delay = 1000) => {
    //to prevent request being sent for each key typed by user
    let timeoutId;
    return (...args) => {
         //if user types another key before the request is sent, 
        //cancel that and start a new timer
        if(timeoutId) clearTimeout(timeoutId);
        //set timeout before sending a request to the api
        timeoutId = setTimeout(()=>{
            callback.apply(null, args);
        }, delay);
    }
}