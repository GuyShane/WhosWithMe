window.onload=function(){
    fetch('http://localhost:3000/api/posts', {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            console.log(data);
        });
};
