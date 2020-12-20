
var user_Name = "";
let emotes = [];
let current_url = "";
let popout_url = "";



//get user name from cookies
user_Name = getCookieValue("userName");
current_url = window.location.href;
get_stream_url_popup();

//waiting to get streamer name
waitForKeyElements('.n-as-fs12', () => {
    push_Streamer_name();
});


get_users_from_LS();

if(localStorage.getItem("url_BNTV") != null){
    current_url = localStorage.getItem("url_BNTV");
}
if(localStorage.getItem("popout_url_BNTV") != null){
    popout_url = localStorage.getItem("popout_url_BNTV");
}

//waiting for chatroom to make "dakchi zwin"
waitForKeyElements('.nimo-room__chatroom__chat-box__input', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'baaziz_divs_IS' ;
    block_to_insert.className = 'baaziz_divs_IS' ;
    block_to_insert.setAttribute('role', 'listbox');
    container_block = document.getElementsByClassName("n-fx-bs n-as-rnd")[0];
    insertBefore(block_to_insert,container_block);

    /*var block_to_insert1 ;
    var container_block1 ;
    block_to_insert1 = document.createElement('div');
    block_to_insert1.id = 'baaziz_divs_BNTV';
    block_to_insert1.addEventListener("click",function(e){

    });
    container_block1 = document.getElementsByClassName("nimo-chat-box__send-btn n-fx0")[0];
    insertBefore(block_to_insert1,container_block1);*/
    
    new Mentionify(
        document.getElementsByClassName('nimo-room__chatroom__chat-box__input')[0],
        document.getElementById('baaziz_divs_IS'),
        resolveFn,
        replaceFn,
        menuItemFn
    )

});

(async ()=> {
    'use strict';
    //data for emotes
    emotes = await getEmotes();
})();
//document.querySelector("a[href^='/user']").href
waitForKeyElements('.nimo-scrollbar', () => {

    get_users_from_LS();
    if(current_url != window.location.href && popout_url != window.location.href){

        current_url = window.location.href;
        localStorage.setItem("url_BNTV",current_url);
        users = [];
        get_stream_url_popup();
        push_Streamer_name();
    }
    //getting container of messages
    const targetNode = document.querySelector(".nimo-scrollbar")
    // Options for the observer
    const obsconfig = {
        childList: true,
    };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // watch for children elements in target
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && mutation.addedNodes[0].className === "nimo-room__chatroom__message-item") {
                let msg = mutation.addedNodes[0].querySelector("span.content.nimo-room__chatroom__message-item__content.n-as-break-word.c2").textContent;
                       
                get_users_from_LS();
                
                GIVE_Chaters();

                let res = replaceText(msg);
                let user = mutation.addedNodes[0].querySelector('span:nth-child(1)');
                mutation.addedNodes[0].innerHTML = user.outerHTML + res.join(" ");

                Show_Mention_Text();
                localStorage.setItem("On_chat_BNTV",JSON.stringify(users));
            }
        }
    }
    // linking observer with callback func
    const observer = new MutationObserver(callback);

    // start listening for changes on element 
    
    observer.observe(targetNode, obsconfig);
})

//window.open("")
//get streamer Id and get popout url
function get_stream_url_popup(){
    waitForKeyElements(".nimo-rm" ,() => {
        var strrr = "";
        strrr = document.querySelector("a[href^='/user']").href;
        popout_url = "https://www.nimo.tv/popout/chat/" + strrr.substr(25);
        localStorage.setItem("popout_url_BNTV",popout_url);
    });
}
// get streamer nick name and save it to localstorage
function push_Streamer_name(){
    var sn = document.getElementsByClassName('n-as-fs12')[0].textContent;
    if(!Is_IN_Coll("everyone")){
        users.push({username : "everyone" });
    }
    if(!Is_IN_Coll(sn)){
        users.push({username : sn });
    }
    localStorage.setItem("On_chat_BNTV",JSON.stringify(users));
}

// get user nickname from localstorage
function get_users_from_LS(){
    users = [];
    if(localStorage.getItem("On_chat_BNTV") != null){
        var ls = localStorage.getItem("On_chat_BNTV");
        users = JSON.parse(ls);
    }
}
//save members in chatroom
window.onbeforeunload = function (){
    if(popout_url != window.location.href){
        users = [];popout_url = ""; current_url = "";
        localStorage.setItem("On_chat_BNTV",JSON.stringify(users));
        localStorage.setItem("popout_url_BNTV",popout_url);
        localStorage.setItem("url_BNTV",current_url);
    }
}
//document.getElementsByClassName("nimo-room__chatroom__message-item")[1].remove();