import axios from "axios"
function clickViews(event){         
     var id=event.target.id;
     var views=parseInt(event.target.name)
     var addView=views+1;
     console.log(addView);
    axios.post('http://localhost:3231/users/updateViews',{id:id,views:addView})
    .then((res)=>{
        console.log(res);
    });
    }
export default clickViews;