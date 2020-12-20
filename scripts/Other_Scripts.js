
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
      "https://gist.githubusercontent.com/BAAZIZ0KARTHUS/27bb73edf853b10cab4ecbf86b1d52e6/raw/666da022953720092b7c708e90aa9d16820e3500/gistfile1.json"
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

    for (let i = 0; i < emotes.length; i++) {
        if (msg.includes(emotes[i].word)) {
            msg = msg.replaceAll(emotes[i].word, `<div class="nimo-room__chatroom__message-item__custom-emoticon-container" style="background: none;"><span class="nimo-image nimo-room__chatroom__message-item__custom-emoticon"><img src="${emotes[i].url}"/></span></div>`)
        }
    }
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

// if someone mention your name , it will be shown with red color
const Show_Mention_Text = () => {

    var chat_disc = document.getElementsByClassName('nimo-room__chatroom__message-item__content');
    
    for(let i = 0; i< chat_disc.length; i++){
        var ch = "@" + user_Name;
        if(chat_disc[i].textContent.search(ch) != -1 || chat_disc[i].textContent.search("@everyone") != -1){
            chat_disc[i].style.backgroundColor = 'red'
            chat_disc[i].style.color = 'black'

            chat_disc[0].style.backgroundColor = 'transparent'
            chat_disc[0].style.color = 'hsla(0,0%,100%,.4)'
        }
    }
}

// get the names who is in chat
const GIVE_Chaters = () =>{


    var chaters = document.getElementsByClassName('nm-message-nickname');

    for(let i = 0; i< chaters.length; i++){
        //check every one in chat
        if(chaters[i].textContent != user_Name && !Is_IN_Coll(chaters[i].textContent) && chaters[i].textContent != "System Message"){
            users.push({username : chaters[i].textContent });
        }
    }

}

// this function check array to add new object
const Is_IN_Coll = (name) =>{

    for(let i = 0; i< users.length; i++){
        if (users[i].username == name){
            return true;
        }
    }
    return false;
}

