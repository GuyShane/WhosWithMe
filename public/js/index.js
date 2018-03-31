window.onload=function(){
    var posts, unlocker, masonry;
    var authenticated=!document.querySelector('#unlock-form');

    getPosts()
        .then(function(data){
            removeLoader();
            posts=vueInit(data);
            masonry=masonryInit();
        });

    document.querySelector('#open-editor').addEventListener('click', showEditor);
    document.querySelector('#close-editor').addEventListener('click', closeEditor);

    if (!authenticated){
        unlocker=unlockInit();
    }
    else {
        postInit();
    }


    function removeLoader(){
        document.querySelector('#spinner').remove();
    }

    function showEditor(){
        document.querySelector('#post-editor').classList.add('active');
        document.querySelector('#post-text').focus();
    }

    function closeEditor(){
        document.querySelector('#post-editor').classList.remove('active');
    }

    function clearEditor(){
        document.querySelector('#add-post').classList.remove('loading');
        document.querySelector('#post-text').value='';
    }

    function postInit(){
        document.querySelector('#add-post').addEventListener('click', submit);
    }

    function masonryInit(){
        return new Masonry('#posts', {
            columnWidth: 450,
            itemSelector: '.post'
        });
    }

    function vueInit(data){
        return new Vue({
            el: '#posts',
            data: {
                posts: data
            },
            methods: {
                vote: function(e, id, wth){
                    var self=this;
                    e.target.classList.add('loading');
                    vote(id, wth)
                        .then(function(data){
                            for (var i=0; i<self.posts.length; i++){
                                if (self.posts[i]._id===data._id){
                                    e.target.classList.remove('loading');
                                    Vue.set(self.posts, i, data);
                                    break;
                                }
                            }
                        })
                        .catch(function(){
                            e.target.classList.remove('loading');
                        });
                }
            }
        });
    }

    function unlockInit(){
        return new Unlock({
            url: 'ws://localhost:3000',
            email: '#email',
            color: '#5755d9',
            onSend: function(){
                document.querySelector('#email').classList.remove('is-error');
                document.querySelector('#unlock-error').textContent='';
            },
            onMessage: function(data){
                if (data.success){
                    document.querySelector('#unlock-form').remove();
                    document.querySelector('#add-post').classList.remove('disabled');
                    Cookies.set('_auth', data.token);
                    postInit();
                }
                else {
                    document.querySelector('#email').classList.add('is-error');
                    document.querySelector('#unlock-error').textContent=data.reason;
                }
            }
        });
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
        return new Promise(function(resolve, reject){
            fetch('http://localhost:3000/api/vote', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': Cookies.get('_auth')
                },
                body: JSON.stringify({
                    id: id,
                    with: wth
                })
            })
                .then(function(response){
                    if (!response.ok){
                        return Promise.reject();
                    }
                    return response.json();
                })
                .then(function(data){
                    resolve(data);
                })
                .catch(function(err){
                    reject(err);
                });
        });
    }

    function submit(){
        document.querySelector('#add-post').classList.add('loading');
        var text=document.querySelector('#post-text').value;
        fetch('http://localhost:3000/api/post', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': Cookies.get('_auth')
            },
            body: JSON.stringify({
                text: text
            })
        })
            .then(function(response){
                if (!response.ok){
                    return Promise.reject();
                }
                return response.json();
            })
            .then(function(data){
                closeEditor();
                clearEditor();
                posts.posts.unshift(data);
                Vue.nextTick(function(){
                    masonry.destroy();
                    masonry=masonryInit();
                });
            });
    }
};
