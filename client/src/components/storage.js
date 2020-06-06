export function getFromStorage(key){
    try{
        var returned_obj = JSON.parse(localStorage.getItem(key));
        console.log("hello set");
        return returned_obj;
    }catch(err){
        console.log('hey i am error');
        return null;

    }
}

export function setInStorage(key,ob){
    if(!key){
        console.error('Error:key is missing');
    }
    try{
        console.log('hey i am here');
        console.log(key);
        console.log(JSON.stringify(ob));
        window.localStorage.setItem(key,JSON.stringify(ob));
        console.log(localStorage);
    }catch(err){
        console.error(err);
    }
}