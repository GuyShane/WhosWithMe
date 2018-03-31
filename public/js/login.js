window.onload=function(){
    unlockInit();
    document.querySelector('#email').focus();

    function unlockInit(){
        return new Unlock({
            url: 'ws://localhost:3000',
            email: '#email',
            color: '#5755d9',
            onSend: function(){
                document.querySelector('#email').classList.remove('is-error');
                document.querySelector('#form-error').textContent='';
            },
            onMessage: function(data){
                if (data.success){
                    Cookies.set('_auth', data.token);
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
