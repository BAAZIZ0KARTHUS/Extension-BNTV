
var user_Name = "";
let emotes = [];
let current_url = "";
let popout_url = "";
var showmenu = false;


//get user name from cookies
user_Name = getCookieValue("userName");
current_url = window.location.href;
get_stream_url_popup();

//waiting to get streamer name
waitForKeyElements('.n-as-fs12', () => {
    push_Streamer_name();
});
//get users from local storage
get_users_from_LS();

if(localStorage.getItem("url_BNTV") != null){
    current_url = localStorage.getItem("url_BNTV");
}
if(localStorage.getItem("popout_url_BNTV") != null){
    popout_url = localStorage.getItem("popout_url_BNTV");
}

(async ()=> {
    'use strict';
    //data for emotes
    emotes = await getEmotes();
})();

//waiting for chatroom to Add Mention event for chat and emotes
waitForKeyElements('.nimo-room__chatroom__chat-box__input', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'baaziz_divs_IS' ;
    block_to_insert.className = 'baaziz_divs_IS';
    block_to_insert.setAttribute('role', 'listbox');
    container_block = document.getElementsByClassName("n-fx-bs n-as-rnd")[0];
    insertBefore(block_to_insert,container_block);
    
    //mention
    new Mentionify(
        document.getElementsByClassName('nimo-room__chatroom__chat-box__input')[0],
        document.getElementById('baaziz_divs_IS'),
        resolveFn,
        replaceFn,
        menuItemFn
    );

    //mention emotes
    var nEmotes = [];
    for(let i=0;i<emotes.length;i++){
        nEmotes.push({Emid:emotes[i].Emid,word:emotes[i].word.substr(1),url:emotes[i].url});
    }
    Mention_Emote(nEmotes,'nimo-room__chatroom__chat-box__input',20);

});

waitForKeyElements('.nimo-chat-box__send-btn', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'BNTV_Settings' ;
    block_to_insert.className = 'BNTV_Settings' ;
    block_to_insert.innerHTML = `<span data-toggle="tooltip" title="BNTV Settings">BNTV</span>`;
    container_block = document.getElementsByClassName("nimo-chat-box__send-btn")[0];
    insertBefore(block_to_insert,container_block);
    $('[data-toggle="tooltip"]').tooltip();
    //add event click to show Settings Menu
    document.getElementById('BNTV_Settings').addEventListener("click", function(){
        if(showmenu){
            document.getElementById('BNTV_Settings_MENU').style.display = "none";
            showmenu = false;
        }else{
            document.getElementById('BNTV_Settings_MENU').style.display = "block";
            showmenu=true;
        }
    });

});
//adding menu to hide chat and leader board or to clear chat room
waitForKeyElements('.nimo-room__main', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'BNTV_Settings_MENU' ;
    block_to_insert.className = 'BNTV_Settings_MENU' ;
    block_to_insert.style.display = "none"
    block_to_insert.innerHTML = '<div class="BNTV_ITEM_H"><span class="BNTV_T">BNTV Settings</span><div id="BNTV_MENU_hide">Close</div></div>'+
    '<div class="BNTV_Settings_MENU_ITEM">'+
    '<span class="BNTV_T">Hide chat</span>'+
        '<label class="switch">'+
            '<input id="BNTV_CB" type="checkbox">'+
            '<span class="slider round"></span>'+
        '</label>'+
    '</div>'+
    '<div class="BNTV_Settings_MENU_ITEM">'+
    '<span class="BNTV_T">Hide leader board</span>'+
        '<label class="switch" >'+
            '<input id="BNTV_CB2" type="checkbox">'+
            '<span class="slider round"></span>'+
        '</label>'+
    '</div>'+
    '<div class="BNTV_Settings_MENU_ITEM">'+
    '<span class="BNTV_T">Hide shop content</span>'+
        '<label class="switch" >'+
            '<input id="BNTV_CB3" type="checkbox">'+
            '<span class="slider round"></span>'+
        '</label>'+
    '</div>'+
    '<div class="BNTV_Settings_MENU_ITEM">'+
        '<span class="BNTV_T">Clear chat room</span>'+
        '<input id="BNTV_ButtonC" type="button" value="Clear">'+
    '</div>';
    container_block = document.getElementsByClassName("nimo-room__main")[0];
    insertBefore(block_to_insert,container_block);
    //add events click to inputs
    document.getElementById('BNTV_CB').addEventListener("click", function(){hideDivF('BNTV_CB','MessageList'); });
    document.getElementById('BNTV_CB2').addEventListener("click", function(){hideDivF('BNTV_CB2','nimo-room__rank'); });
    document.getElementById('BNTV_CB3').addEventListener("click", function(){hideDivF('BNTV_CB3','nimo-room__gift-shop'); });
    document.getElementById('BNTV_MENU_hide').addEventListener("click", function(){ document.getElementById('BNTV_Settings_MENU').style.display = "none";showmenu = false;});
    document.getElementById('BNTV_ButtonC').addEventListener("click", function(){ ClearChatRoom()});

});
/**/

//waiting for scroll-bar so we can get people in chatroom and changing keywords with emotes
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


waitForKeyElements(".BNTV_Emote" ,() => {
    $('[data-toggle="tooltip"]').tooltip();
});