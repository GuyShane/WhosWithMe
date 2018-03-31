window.onload=function(){
    var posts;

    getPosts()
        .then(function(data){
            removeLoader();
            posts=vueInit(data);
        });

    document.querySelector('#open-editor').addEventListener('click', showEditor);
    document.querySelector('#close-editor').addEventListener('click', closeEditor);

    var unlocker=new Unlock({
        url: 'ws://localhost:3000',
        email: '#email',
        color: '#5755d9',
        onMessage: function(data){
            if (data.success){
                document.querySelector('#unlock-form').remove();
                document.querySelector('#add-post').classList.remove('disabled');
                Cookies.set('_auth', data.token);
            }
            else {
                document.querySelector('#email').classList.add('is-error');
                document.querySelector('#unlock-error').textContent=data.reason;
            }
        }
    });

    function showEditor(){
        document.querySelector('#post-editor').classList.add('active');
    }

    function closeEditor(){
        document.querySelector('#post-editor').classList.remove('active');
    }

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

    function vote(id, wth){
        return new Promise(function(resolve){
            fetch('http://localhost:3000/api/vote', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    with: wth
                })
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
            },
            methods: {
                vote: function(id, wth){
                    vote(id, wth);
                }
            }
        });
    }
};
