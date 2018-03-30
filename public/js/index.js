window.onload=function(){
    let posts;

    getPosts()
        .then(function(data){
            removeLoader();
            posts=vueInit(data);
        });

    function getPosts(){
        return new Promise(function(resolve){
            fetch('http://localhost:3000/api/posts', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    resolve(data);
                });
        });
    }

    function removeLoader(){
        document.querySelector('#spinner').remove();
    }

    function vueInit(data){
        return new Vue({
            el: '#posts',
            data: {
                posts: data
            }
        });
    }
};
