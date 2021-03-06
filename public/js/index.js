window.onload=function(){
    var posts, unlocker, masonry;
    var page=1;
    var apiUrl=window.location.origin+'/api/';
    var authenticated=!document.querySelector('#unlock-form');

    getPosts(0)
        .then(function(data){
            removeLoader();
            posts=vueInit(data);
            masonry=masonryInit();
            loadMoreInit();
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
        document.querySelector('#load-more').classList.remove('d-none');
    }

    function showEditor(){
        document.querySelector('#post-editor').classList.add('active');
        var email=document.querySelector('#email');
        if (email){
            email.focus();
        }
        else {
            document.querySelector('#post-text').focus();
        }
    }

    function closeEditor(){
        document.querySelector('#post-editor').classList.remove('active');
    }

    function clearEditor(){
        document.querySelector('#add-post').classList.remove('loading');
        document.querySelector('#post-text').value='';
    }

    function toast(msg){
        var container=document.querySelector('#notification');
        if (!container.classList.contains('d-none')){
            return;
        }
        container.textContent=msg;
        container.classList.remove('d-none');
        setTimeout(function(){
            container.classList.add('d-none');
        }, 2000);
    }

    function postInit(){
        document.querySelector('#add-post').addEventListener('click', submit);
    }

    function loadMoreInit(){
        document.querySelector('#load-more').addEventListener('click', loadMore);;
    }

    function masonryInit(){
        return new Masonry('#posts', {
            fitWidth: true,
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
                    if (!authenticated){
                        toast('Log in to vote and post');
                        return;
                    }
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
        var url=window.location.origin.replace('http', 'ws');
        Unlock.init({
            url: url,
            email: '#email',
            color: '#5755d9',
            submitOnEnter: true,
            whatsThis: true,
            onMessage: function(data){
                if (data.success){
                    document.querySelector('#unlock-form').remove();
                    document.querySelector('#add-post').classList.remove('disabled');
                    Cookies.set('_wwmat', data.token, {expires: 7});
                    authenticated=true;
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
            fetch(apiUrl+'posts', {
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

    function loadMore(){
        document.querySelector('#load-more').classList.add('loading');
        fetch(apiUrl+'posts?page='+page, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                document.querySelector('#load-more').classList.remove('loading');
                if (data.length===0){
                    return;
                }
                page+=1;
                for (var i=0; i<data.length; i++){
                    posts.posts.push(data[i]);
                }
                Vue.nextTick(function(){
                    masonry.destroy();
                    masonry=masonryInit();
                });
            });
    }

    function vote(id, wth){
        return new Promise(function(resolve, reject){
            fetch(apiUrl+'vote', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': Cookies.get('_wwmat')
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
        fetch(apiUrl+'post', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': Cookies.get('_wwmat')
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
            })
            .catch(function(){
                clearEditor();
                document.querySelector('#post-text').focus();
            });
    }
};
