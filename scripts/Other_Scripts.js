
function waitForKeyElements (
    selectorTxt,    /* Required: The selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach(function(element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (element);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    element.dataset.found = 'alreadyFound';
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj  = waitForKeyElements.controlObj  ||  {};
    var controlKey  = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


const getEmotes= async () => {
    const data = await fetch(
        "https://gist.githubusercontent.com/BAAZIZ0KARTHUS/27bb73edf853b10cab4ecbf86b1d52e6/raw/3248552d0ccc7697df0e57b1eece66a40f083257/gistfile1.json"
    );
    const json = await data.json();
    return json;
};

function insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);
}

const getCookieValue = (a) => {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}


//function for replacing emotes keywords with emotes
const replaceText = (text) => {

    let msg = text.replaceAll(" ", "|")
    
    msg = msg.split("|")
    msg = msg.filter(function (el) {
        return el != "";
    });
    for (let i = 0; i < msg.length; i++) {
        if (!msg[i].startsWith('<div class')) {
            msg[i] = `<span class="content nimo-room__chatroom__message-item__content n-as-break-word c2"><span class="n-as-vtm">${msg[i]}</span></span>`
        }
    }
    return msg
}

const showEmotes = () => {

    var chat_b = document.getElementsByClassName('nimo-room__chatroom__message-item');
    if(chat_b.length > 1){
        for(let j = 1; j < chat_b.length; j++){
    
            var chat_disc = chat_b[j].querySelectorAll('.nimo-room__chatroom__message-item__content');
    
            for (let i = 0; i < emotes.length; i++) {

                for(let k = 0; k< chat_disc.length; k++){

                    var s = "" + emotes[i].word.substr(0,(emotes[i].word.length - 1)) + "";
                    var s1 = "" + emotes[i].word;
                    if(chat_disc[k].textContent.search(emotes[i].word) != -1){
                        chat_disc[k].innerHTML = chat_disc[k].innerHTML.replaceAll(emotes[i].word, `<div class="nimo-room__chatroom__message-item__custom-emoticon-container BNTV_Emote" style="background: none;"><span class="nimo-image nimo-room__chatroom__message-item__custom-emoticon"><img alt="${s1} " src="${emotes[i].url}"/><div class="BNTV_Emotetooltiptext">BNTV<br>${s}</div></span></div>`);
                    }
                }
            }
        }
    }
}



// if someone mention your name , it will be shown with red color
const showMentionText = () => {

    var chat_b = document.getElementsByClassName('nimo-room__chatroom__message-item');
    if(chat_b.length > 1){
        for(let j = 1; j < chat_b.length; j++){
    
            var chat_disc = chat_b[j].querySelectorAll('.nimo-room__chatroom__message-item__content');
    
            for(let i = 0; i< chat_disc.length; i++){
                var ch = "@" + user_Name;
                if(chat_disc[i].textContent.search(ch) != -1 || chat_disc[i].textContent.search("@everyone") != -1){
                    chat_disc[i].style.backgroundColor = 'red'
                    chat_disc[i].style.color = 'black'
    
                    chat_b[j].style.backgroundColor = '#30006b'
                }
            }
        }
    }
}

// get names from chat room
const getChat = () =>{


    var chaters = document.getElementsByClassName('nm-message-nickname');

    for(let i = 0; i< chaters.length; i++){
        //check every one in chat
        if(chaters[i].textContent != user_Name && !isINColl(chaters[i].textContent) && chaters[i].textContent != "System Message"){
            users.push({username : chaters[i].textContent });
        }
    }

}

// this function check array to add new object
const isINColl = (name) =>{

    for(let i = 0; i< users.length; i++){
        if (users[i].username == name){
            return true;
        }
    }
    return false;
}

//hide or show element using checkbox
function hideDivF(cb, classn) 
{
    var checkBox = document.getElementById(cb);
    var x = document.getElementsByClassName(classn)[0];
    if (checkBox.checked == true)
    {
      x.style.display = "none";
    } 
    else 
    {
      if(classn == 'nimo-room__gift-shop'){
        x.style.display = "flex";
      }else{
        x.style.display = "block";
      }
    }
}

// get user nickname from localstorage
function getUsersFromLS(){
    users = [];
    if(localStorage.getItem("On_chat_BNTV") != null){
        var ls = localStorage.getItem("On_chat_BNTV");
        users = JSON.parse(ls);
    }
}
//clear chat room
function clearChatRoom(){
    var ncr = document.getElementsByClassName('nimo-room__chatroom__message-item');
    if(ncr.length > 1){
        for(var i = 1; i<ncr.length; i++){
            ncr[i].style.display = "none";
        }
    }
}

//get streamer Id and get popout url
function getStreamUrlPopup(){
    waitForKeyElements(".nimo-rm" ,() => {
        var strrr = "";
        strrr = document.querySelector("a[href^='/user']").href;
        popout_url = "https://www.nimo.tv/popout/chat/" + strrr.substr(25);
        localStorage.setItem("popout_url_BNTV",popout_url);
    });
}

// get streamer nick name and save it to localstorage
function pushStreamerName(){
    var sn = document.getElementsByClassName('n-as-fs12')[0].textContent;
    if(!isINColl("everyone")){
        users.push({username : "everyone" });
    }
    if(!isINColl(sn)){
        users.push({username : sn });
    }
    localStorage.setItem("On_chat_BNTV",JSON.stringify(users));
}
