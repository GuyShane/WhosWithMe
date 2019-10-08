window.onload=function(){
    unlockInit();
    document.querySelector('#email').focus();

    function unlockInit(){
        var url=window.location.origin.replace('http:', 'ws:').replace('https:', 'wss:');
        return new Unlock({
            url: url,
            email: '#email',
            color: '#5755d9',
            submitOnEnter: true,
            whatsThis: true,
            onSend: function(){
                document.querySelector('#email').classList.remove('is-error');
                document.querySelector('#form-error').textContent='';
            },
            onMessage: function(data){
                if (data.success){
                    Cookies.set('_wwmat', data.token, {expires: 7});
                    window.location.reload();
                }
                else {
                    document.querySelector('#email').classList.add('is-error');
                    document.querySelector('#form-error').textContent=data.reason;
                }
            }
        });
    }
};
