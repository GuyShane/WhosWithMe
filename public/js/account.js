window.onload=function(){
    logoutInit();
    masonryInit();

    function logoutInit(){
        document.querySelector('#logout').addEventListener('click', function(){
            Cookies.remove('_wwmat');
            window.location.href='/';
        });
    }

    function masonryInit(){
        return new Masonry('#posts', {
            fitWidth: true,
            itemSelector: '.post'
        });
    }
};
