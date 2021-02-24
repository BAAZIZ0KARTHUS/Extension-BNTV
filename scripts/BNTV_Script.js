
var user_Name = "";
var emotes = [];
let current_url = "";
let popout_url = "";
var showmenu = false;

var event_class = "nimo-iframe__wrap";//document.getElementsByClassName("nimo-iframe__wrap")[0].remove();


//get user name from cookies
user_Name = getCookieValue("userName");
current_url = window.location.href;
getStreamUrlPopup();

//waiting to get streamer name
waitForKeyElements('.n-as-fs12', () => {
    pushStreamerName();
});
//get users from local storage
getUsersFromLS();

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
    insertBefore_Item(block_to_insert,container_block);
    
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
        nEmotes.push({Emid:emotes[i].Emid,word:emotes[i].word.substr(1)+" ",url:emotes[i].url});
    }
    mentionEmote(nEmotes,'nimo-room__chatroom__chat-box__input',20);
    

});

waitForKeyElements('.nimo-chat-box__send-btn', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'BNTV_Settings' ;
    block_to_insert.className = 'BNTV_Settings BNTV_Emote' ;
    block_to_insert.innerHTML = `BNTV<span  class="BNTV_Emotetooltiptext">BNTV Settings</span>`;
    container_block = document.getElementsByClassName("nimo-chat-box__send-btn")[0];
    insertBefore_Item(block_to_insert,container_block);
    //$('[data-toggle="tooltip"]').tooltip();
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
waitForKeyElements('.nimo-room__rank', () => {
    var block_to_insert ;
    var container_block ;
    block_to_insert = document.createElement('div');
    block_to_insert.id = 'BNTV_Settings_MENU';
    block_to_insert.className = 'BNTV_Settings_MENU';
    block_to_insert.style.display = "none";
    block_to_insert.innerHTML = '<div class="BNTV_ITEM_H"><div class="BNTV_T">BNTV Settings</div><div id="BNTV_MENU_hide">Close</div></div>'+
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
        '<span class="BNTV_T">Hide current event</span>'+
        '<label class="switch" >'+
            '<input id="BNTV_CB4" type="checkbox">'+
            '<span class="slider round"></span>'+
        '</label>'+
    '</div>'+
    '<div class="BNTV_Settings_MENU_ITEM">'+
        '<span class="BNTV_T">Clear chat room</span>'+
        '<input id="BNTV_ButtonC" type="button" value="Clear">'+
    '</div>';
    container_block = document.getElementsByClassName("nimo-room__rank")[0];
    insertBefore_Item(block_to_insert,container_block);
    //add events click to inputs
    document.getElementById('BNTV_CB').addEventListener("click", function(){hideDivF('BNTV_CB','MessageList'); });
    document.getElementById('BNTV_CB2').addEventListener("click", function(){hideDivF('BNTV_CB2','nimo-room__rank'); });
    document.getElementById('BNTV_CB3').addEventListener("click", function(){hideDivF('BNTV_CB3','nimo-room__gift-shop'); });
    document.getElementById('BNTV_CB4').addEventListener("click", function(){hideDivF('BNTV_CB4',event_class); });
    document.getElementById('BNTV_MENU_hide').addEventListener("click", function(){ document.getElementById('BNTV_Settings_MENU').style.display = "none";showmenu = false;});
    document.getElementById('BNTV_ButtonC').addEventListener("click", function(){ clearChatRoom()});

});
/**/

//waiting for scroll-bar so we can get people in chatroom and changing keywords with emotes
waitForKeyElements('.nimo-scrollbar', () => {

    getUsersFromLS();
    if(current_url != window.location.href && popout_url != window.location.href){

        current_url = window.location.href;
        localStorage.setItem("url_BNTV",current_url);
        users = [];
        getStreamUrlPopup();
        pushStreamerName();
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
                let msg = mutation.addedNodes[0].querySelector(".nimo-room__chatroom__message-item__content").textContent;
                let msg1 = mutation.addedNodes[0];
                
                getUsersFromLS();
                getChat();


                let res = replaceText(msg);
                let user = mutation.addedNodes[0].querySelector('span:nth-child(1)');
                mutation.addedNodes[0].innerHTML = user.outerHTML + res.join(" ");
                showEmotes(msg1);
                showMentionText(msg1);

                localStorage.setItem("On_chat_BNTV",JSON.stringify(users));
            }
        }
    }
    // linking observer with callback func
    const observer = new MutationObserver(callback);

    // start listening for changes on element 
    
    observer.observe(targetNode, obsconfig);
})



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

