// ==UserScript==
// @name         Kahoot AntiBot
// @namespace    http://tampermonkey.net/
// @version      2.8.10
// @description  Remove all bots from a kahoot game.
// @author       theusaf
// @match        *://play.kahoot.it/*
// @exclude      *://play.kahoot.it/v2/assets/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

if(window.fireLoaded || (window.parent && window.parent.page)){
  throw "[ANTIBOT] - page is loaded";
}
if(window.localStorage.extraCheck){
  console.log("[ANTIBOT] - Detected PIN Checker");
}
if(window.localStorage.kahootThemeScript){
  console.log("[ANTIBOT] - Detected KonoSuba Theme");
}
document.write("[ANTIBOT] - Patching Kahoot. Please wait. If this screen stays blank for long periods of time, please force reload or clear your cache.");
window.url = window.location.href;
window.page = new XMLHttpRequest();
window.page.open("GET",window.url);
window.page.send();
window.page.onload = ()=>{
  let scriptURL = window.page.response.match(/><\/script><script\ .*?vendors.*?><\/script>/mg)[0].substr(9).split("src=\"")[1].split("\"")[0];
  let script2 = window.page.response.match(/\/v2\/assets\/js\/main.*?(?=")/mg)[0];
  let originalPage = window.page.response.replace(/><\/script><script\ .*?vendors.*?><\/script>/mg,"></script>");
  originalPage = originalPage.replace(/\/v2\/assets\/js\/main.*?(?=")/mg,"data:text/javascript,");
  let script = new XMLHttpRequest();
  script.open("GET","https://play.kahoot.it/"+scriptURL);
  script.send();
  script.onload = ()=>{
    const patchedScriptRegex = /\.onMessage=function\([a-z],[a-z]\)\{/mg;
    const letter1 = script.response.match(patchedScriptRegex)[0].match(/[a-z](?=,)/g)[0];
    const letter2 = script.response.match(patchedScriptRegex)[0].match(/[a-z](?=\))/g)[0];
    let patchedScript = script.response.replace(script.response.match(patchedScriptRegex)[0],`.onMessage=function(${letter1},${letter2}){window.globalMessageListener(${letter1},${letter2});`);
    const code = ()=>{
      const windw = window.parent;
      window.windw = windw;
      // create watermark
      const container = document.createElement("div");
      container.id = "antibotwtr";
      const waterMark = document.createElement("p");
      waterMark.innerHTML = "v2.8.10 @theusaf";
      const botText = document.createElement("p");
      botText.innerHTML = "0";
      botText.id = "killcount";
      const menu = document.createElement("details");
      menu.innerHTML = `<summary>config</summary>
      <!-- Timeout -->
      <input type="checkbox" id="antibot.config.timeout"></input>
      <label id="antibot.config.timeoutlbl" onclick="windw.specialData.config.timeout = !windw.specialData.config.timeout;if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.timeout = windw.specialData.config.timeout;windw.localStorage.antibotConfig = JSON.stringify(a);" for="antibot.config.timeout" title="Blocks answers that are sent before 0.5 seconds after the question starts">Min Answer Timeout</label>
      <!-- Random Names -->
      <input type="checkbox" id="antibot.config.looksRandom" checked="checked"></input>
      <label id="antibot.config.lookrandlbl" onclick="windw.specialData.config.looksRandom = !windw.specialData.config.looksRandom;if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.looksRandom = windw.specialData.config.looksRandom;windw.localStorage.antibotConfig = JSON.stringify(a);" for="antibot.config.looksRandom" title="Blocks names that seem 'random', such as 'OmEGaboOt'">Block Random Names</label>
      <!-- Blocking Format 1 -->
      <input type="checkbox" id="antibot.config.blockformat1" checked="checked"></input>
      <label id="antibot.config.blockformat1lbl" onclick="windw.specialData.config.banFormat1 = !windw.specialData.config.banFormat1;if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.banFormat1 = windw.specialData.config.banFormat1;windw.localStorage.antibotConfig = JSON.stringify(a);" for="antibot.config.blockformat1" title="Blocks names using the format [First][random char][Last]">Block format First[._-,etc]Last</label>
      <!-- Additional Question Time -->
      <label for="antibot.config.teamtimeout" title="Add extra seconds to the question.">Additional Question Time</label>
      <input type="number" step="1" value="0" id="antibot.config.teamtimeout" onchange="windw.specialData.config.additionalQuestionTime = Number(document.getElementById('antibot.config.teamtimeout').value);if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.teamtime = windw.specialData.config.additionalQuestionTime;windw.localStorage.antibotConfig = JSON.stringify(a);">;
      <!-- Percent -->
      <label for="antibot.config.percent" title="Specify the match percentage.">Match Percent</label>
      <input type="number" step="0.1" value="0.6" id="antibot.config.percent" onchange="windw.specialData.config.percent = Number(document.getElementById('antibot.config.percent').value);if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.percent = windw.specialData.config.percent;windw.localStorage.antibotConfig = JSON.stringify(a);">
      <!-- DDOS -->
      <label for="antibot.config.ddos" title="Specify the number of bots/minute to lock the game. Set it to 0 to disable.">Auto Lock Threshold</label>
      <input type="number" step="1" value="0" id="antibot.config.ddos" onchange="windw.specialData.config.ddos = Number(document.getElementById('antibot.config.ddos').value);if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.ddos = windw.specialData.config.ddos;windw.localStorage.antibotConfig = JSON.stringify(a);">
      <!-- Toggling Streak Bonus -->
      <input type="checkbox" id="antibot.config.streakBonus" onchange="windw.specialData.config.streakBonus = Number(document.getElementById('antibot.config.streakBonus').checked ? 1 : 2);if(!windw.localStorage.antibotConfig){windw.localStorage.antibotConfig = JSON.stringify({});}const a = JSON.parse(windw.localStorage.antibotConfig);a.streakBonus = windw.specialData.config.streakBonus;localStorage.antibotConfig = JSON.stringify(a);alert('When modifying this option, reload the page for it to take effect')">
      <label for="antibot.config.streakBonus" title="Toggle the Streak Bonus.">Toggle Streak Bonus</label>`;
      const styles = document.createElement("style");
      styles.type = "text/css";
      styles.innerHTML = `#antibotwtr{
        position: fixed;
        bottom: 100px;
        right: 100px;
        font-size: 1rem;
        opacity: 0.4;
        transition: opacity 0.4s;
        z-index: 5000;
      }
      #antibotwtr:hover{
        opacity: 1;
      }
      #antibotwtr p{
        display: inline-block;
      }
      #killcount{
        margin-left: 0.25rem;
        background: black;
        border-radius: 0.5rem;
        color: white;
      }
      #antibotwtr details{
        background: grey;
      }
      #antibotwtr input[type="checkbox"]{
        display: none;
      }
      #antibotwtr label{
        color: red;
        display: block;
      }
      #antibotwtr input:checked+label{
        color: green;
      }`;
      container.append(waterMark,botText,menu);
      setTimeout(function(){
        if(document.body.innerText.split("\n").length < 8){ // assume broken. (just the water mark)
          const temp = document.createElement("template");
          temp.innerHTML = `<div id="antibot-broken-page" style="color: red; position: fixed; left: 0; top: 0; font-size: 1.25rem;line-height:1.75rem">
            <h2>[ANTIBOT] - Detected broken page. This message may appear due to slow internet. It will dissapear once the page loads. If the page doesn't load, try one of the following:</h2>
            <hr/>
            <h2>Reload the page</h2>
            <h2>Go back to <a href="https://create.kahoot.it/details/${location.search.split("quizId=")[1].split("&")[0]}">the kahoot launch screen</a>.</h2><br/>
            <h2>Clear the cache of this page and then reload.</h2><br/>
            <h2>Disable Kahoot AntiBot, reload the page, then re-enable Kahoot Antibot and reload the page again</h2>
          </div>`;
          document.body.append(temp.content.cloneNode(true));
          const RemoveBroke = setInterval(()=>{
            if(document.body.innerText.split("\n").length >= 20){
              clearInterval(RemoveBroke);
              document.getElementById("antibot-broken-page").outerHTML = "";
            }
          },1000);
        }
      },2000);
      document.body.append(container,styles);
      windw.isUsingNamerator = false;
      windw.cachedUsernames = [];
      windw.confirmedPlayers = [];
      windw.cachedData = {};
      windw.loggedPlayers = {};
      windw.specialData = {
        startTime: 0,
        lastFakeLogin: 0,
        lastFakeUserID: 0,
        lastFakeUserName: "",
        config:{
          timeout: false,
          looksRandom: true,
          banFormat1: true,
          additionalQuestionTime: null,
          percent: 0.6,
          streakBonus: 2,
          ddos: 0
        },
      };
      // loading localStorage info
      if(windw.localStorage.antibotConfig){
        const a = JSON.parse(windw.localStorage.antibotConfig);
        if(a.timeout){
          const t = document.getElementById("antibot.config.timeoutlbl");
          if(t){
            t.click();
          }
        }
        if(!a.looksRandom){
          const t = document.getElementById("antibot.config.lookrandlbl");
          if(t){
            t.click();
          }
        }
        if(a.teamtime){
          document.getElementById("antibot.config.teamtimeout").value = Number(a.teamtime);
          windw.specialData.config.additionalQuestionTime = Number(a.teamtime);
        }
        if(a.percent){
          document.getElementById("antibot.config.percent").value = Number(a.percent);
          windw.specialData.config.percent = Number(a.percent);
        }
        if(!a.banFormat1){
          document.getElementById("antibot.config.blockformat1").checked = false;
          windw.specialData.config.banFormat1 = false;
        }
        if(a.streakBonus == 1){
          document.getElementById("antibot.config.streakBonus").checked = true;
          windw.specialData.config.streakBonus = 1;
        }
        if(a.ddos){
          document.getElementById("antibot.config.ddos").value = +a.ddos;
          windw.specialData.config.ddos = +a.ddos;
        }
      }
      var messageId = 0;
      var clientId = null;
      var pin = null;
      // for names like KaHOotSmaSH
      function looksRandom(name){
        // Assumes player names have either all caps, no caps, or up to 3 capital letters
        return !/(^(([^A-Z\n]*)?[A-Z]?([^A-Z\n]*)?){0,3}$)|^([A-Z]*)$/.test(name);
      }
      // for names like AmazingRobot32
      // also matches other somewhat suspicious names
      function isFakeValid(name){
        return /^([A-Z][a-z]+){2}\d{1,2}$/.test(name) || /^[A-Z][^A-Z]+?(\d[a-z]+\d*?)$/.test(name);
      }
      function similarity(s1, s2) {
        // remove numbers from name if name is not only a number
        if(isNaN(s1) && typeof(s1) != "object" && !windw.isUsingNamerator){
          s1 = s1.replace(/[0-9]/mg,"");
        }
        if(isNaN(s2) && typeof(s2) != "object" && !windw.isUsingNamerator){
          s2 = s2.replace(/[0-9]/mg,"");
        }
        if(!s2){
          return 0;
        }
        // if is a number of the same length
        if(s1){
          if(!isNaN(s2) && !isNaN(s1) && s1.length == s2.length){
            return 1;
          }
        }
        // apply namerator rules
        if(windw.isUsingNamerator){
          if(!/^([A-Z][a-z]+){2,3}$/.test(s2)){
            return -1;
          }
        }
        if(!s1){
          return;
        }
        // ignore case
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        var longer = s1;
        var shorter = s2;
        // begin math to determine similarity
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
          return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
      }
      function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
          var lastValue = i;
          for (var j = 0; j <= s2.length; j++) {
            if (i == 0){
              costs[j] = j;
            }
            else {
              if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1)){
                  newValue = Math.min(Math.min(newValue,lastValue),costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
              }
            }
          }
          if (i > 0){
            costs[s2.length] = lastValue;
          }
        }
        return costs[s2.length];
      }
      function setup(){
        var launch_button =document.querySelectorAll("[data-functional-selector=\"launch-button\"]")[0];
        if(launch_button){
          console.warn("[ANTIBOT] - launch button found!");
        }else{
          setTimeout(setup,1000);
        }
      }
      setup();
      function clickName(name){
        const names = document.querySelectorAll("[data-functional-selector=player-name]");
        names.forEach(o=>{
          if(o.innerText == name){
            return o.click();
          }
        });
      }
      function createKickPacket(id){
        messageId++;
        return [{
          channel: "/service/player",
          clientId: clientId,
          id: String(Number(messageId)),
          data: {
            cid: String(id),
            content: JSON.stringify({
              kickCode: 1,
              quizType: "quiz"
            }),
            gameid: pin,
            host: "play.kahoot.it",
            id: 10,
            type: "message"
          },
          ext: {}
        }];
      }
      function determineEvil(player,socket){
        if(windw.cachedUsernames.length == 0){
          if(similarity(null,player.name) == -1){
            var packet = createKickPacket(player.cid);
            socket.send(JSON.stringify(packet));
            console.warn(`[ANTIBOT] - Bot ${player.name} has been banished`);
            const c = document.getElementById("killcount");
            if(c){
              c.innerHTML = Number(c.innerHTML) + 1;
            }
            delete windw.cachedData[player.cid];
            throw "[ANTIBOT] - Bot banned. Dont add";
          }
          windw.cachedUsernames.push({name: player.name, id:player.cid, time: 10, banned: false});
          windw.loggedPlayers[player.cid] = true;
        }else{
          var removed = false;
          if(similarity(null,player.name) == -1){
            removed = true;
            var packet1 = createKickPacket(player.cid);
            socket.send(JSON.stringify(packet1));
            console.warn(`[ANTIBOT] - Bot ${player.name} has been banished`);
            const c = document.getElementById("killcount");
            if(c){
              c.innerHTML = Number(c.innerHTML) + 1;
            }
            delete windw.cachedData[player.cid];
            throw "[ANTIBOT] - Bot banned. Dont add";
          }
          for(var i in windw.cachedUsernames){
            if(windw.confirmedPlayers.includes(windw.cachedUsernames[i].name)){
              continue;
            }
            if(similarity(windw.cachedUsernames[i].name,player.name) >= windw.specialData.config.percent){
              removed = true;
              let packet1 = createKickPacket(player.cid);
              socket.send(JSON.stringify(packet1));
              if(!windw.cachedUsernames[i].banned){
                var packet2 =createKickPacket(windw.cachedUsernames[i].id);
                windw.cachedUsernames[i].banned = true;
                socket.send(JSON.stringify(packet2));
                clickName(windw.cachedUsernames[i].name);
                const c = document.getElementById("killcount");
                if(c){
                  c.innerHTML = Number(c.innerHTML) + 1;
                }
              }
              windw.cachedUsernames[i].time = 10;
              console.warn(`[ANTIBOT] - Bots ${player.name} and ${windw.cachedUsernames[i].name} have been banished`);
              const c = document.getElementById("killcount");
              if(c){
                c.innerHTML = Number(c.innerHTML) + 1;
              }
              delete windw.cachedData[player.cid];
              delete windw.cachedData[windw.cachedUsernames[i].id];
              throw "[ANTIBOT] - Bot banned. Dont add";
            }
          }
          if(!removed){
            windw.cachedUsernames.push({name: player.name,id: player.cid, time: 10, banned: false});
            windw.loggedPlayers[player.cid] = true;
          }
        }
      }
      function specialBotDetector(type,data,socket){
        switch (type) {
          case 'joined':
          // if looks random
          if(windw.specialData.config.looksRandom){
            if(looksRandom(data.name)){
              const packet = createKickPacket(data.cid);
              socket.send(JSON.stringify(packet));
              const c = document.getElementById("killcount");
              if(c){
                c.innerHTML = Number(c.innerHTML) + 1;
              }
              windw.cachedUsernames.forEach(o=>{
                if(o.id == data.cid){
                  o.banned = true;
                  o.time = 10;
                  return;
                }
              });
              throw `[ANTIBOT] - Bot ${data.name} banned; name too random.`;
            }
          }
          // if ban format 1 is enabled
          if(windw.specialData.config.banFormat1){
            if(/[a-z0-9]+[^a-z0-9\s][a-z0-9]+/gi.test(data.name)){
              const packet = createKickPacket(data.cid);
              socket.send(JSON.stringify(packet));
              const c = document.getElementById("killcount");
              if(c){
                c.innerHTML = Number(c.innerHTML) + 1;
              }
              windw.cachedUsernames.forEach(o=>{
                if(o.id == data.cid){
                  o.banned = true;
                  o.time = 10;
                  return;
                }
              });
              throw `[ANTIBOT] - Bot ${data.name} banned; Name matches format [F][R][L].`;
            }
          }
          if(!windw.cachedData[data.cid] && !isNaN(data.cid) && Object.keys(data).length <= 5 && data.name.length < 16){ //if the id has not been cached yet or is an invalid id, and they are not a bot :p
            windw.cachedData[data.cid] = {
              tries: 0,
              loginTime: Date.now()
            };
          }else{
            if(windw.cachedData[data.cid]){ // now allowing reconnection
              return;
            }
            const packet = createKickPacket(data.cid);
            socket.send(JSON.stringify(packet));
            console.warn(`[ANTIBOT] - Bot ${data.name} has been banished - invalid packet/name`);
            windw.cachedUsernames.forEach(o=>{
              if(o.id == data.cid){
                o.banned = true;
                o.time = 10;
                return;
              }
            });
            const c = document.getElementById("killcount");
            if(c){
              c.innerHTML = Number(c.innerHTML) + 1;
            }
            delete windw.cachedData[data.cid];
            throw "[ANTIBOT] - Bot banned. Dont add";
          }
          if(!windw.isUsingNamerator){
            if(isFakeValid(data.name)){
              if(Date.now() - windw.specialData.lastFakeLogin < 5000){
                if(windw.cachedData[windw.specialData.lastFakeUserID]){ // to get the first guy
                  const packet = createKickPacket(windw.specialData.lastFakeUserID);
                  socket.send(JSON.stringify(packet));
                  clickName(windw.specialData.lastFakeUserName);
                  delete windw.cachedData[windw.specialData.lastFakeUserID]; windw.cachedUsernames.forEach(o=>{
                    if(o.id == windw.specialData.lastFakeUserID){
                      o.banned = true;
                      o.time = 10;
                      return;
                    }
                  });
                }
                const packet = createKickPacket(data.cid);
                socket.send(JSON.stringify(packet));
                delete windw.cachedData[data.cid];
                windw.cachedUsernames.forEach(o=>{
                  if(o.id == data.cid){
                    o.banned = true;
                    return;
                  }
                });
                const c = document.getElementById("killcount");
                if(c){
                  c.innerHTML = Number(c.innerHTML) + 1;
                }
                windw.specialData.lastFakeLogin = Date.now();
                windw.specialData.lastFakeUserID = data.cid;
                windw.specialData.lastFakeUserName = data.name;
                throw `[ANTIBOT] - Banned bot ${data.name}; their name is suspicious, likely a bot.`;
              }
              windw.specialData.lastFakeLogin = Date.now();
              windw.specialData.lastFakeUserID = data.cid;
              windw.specialData.lastFakeUserName = data.name;
            }
          }
          break;
        }
      }
      function teamBotDetector(team,cid,socket){
        kick = false;
        if(team.length == 0 || team.indexOf("") != -1 || team.indexOf("Player 1") != -1){
          kick = true;
        }
        if(kick){
          const packet = createKickPacket(cid);
          socket.send(JSON.stringify(packet));
          const c = document.getElementById("killcount");
          if(c){
            c.innerHTML = Number(c.innerHTML) + 1;
          }
          let name = "";
          delete windw.cachedData[cid];
          windw.cachedUsernames.forEach(o=>{
            name = o.name;
            if(o.id == cid){
              o.banned = true;
              o.time = 10;
              return;
            }
          });
          throw `[ANTIBOT] - Bot ${name} banned; invalid team members.`;
        }
      }
      var timer = setInterval(function(){
        for(let i in windw.cachedUsernames){
          if(windw.cachedUsernames[i].time <= 0 && !windw.cachedUsernames[i].banned && !windw.confirmedPlayers.includes(windw.cachedUsernames[i].name)){
            windw.confirmedPlayers.push(windw.cachedUsernames[i].name);
            continue;
          }
          if(windw.cachedUsernames[i].time <= -20){
            windw.cachedUsernames.splice(i,1);
            continue;
          }
          windw.cachedUsernames[i].time--;
        }
      },1000);
      const TFATimer = setInterval(()=>{
        for(let i in windw.cachedData){
          windw.cachedData[i].tries = 0;
        }
      },10000);
      windw.sendHandler = function(data){
        data = JSON.parse(data)[0];
        if(data.data){
          if(!data.data.id){
            return;
          }
          switch (data.data.id) {
            case 2:
              windw.specialData.startTime = Date.now();
              break;
          }
        }
      }
      let ExtraCheck2 = function(){};
      try{
        if(windw.localStorage.extraCheck2){
          ExtraCheck2 = new Function("return " + windw.localStorage.extraCheck2)();
        }
      }catch(e){}
      let oldamount = 0;
      let locked = false;
      setInterval(()=>{
        const c = document.getElementById("killcount");
        if(c){
          oldamount = +c.innerHTML;
        }
      },20e3);
      window.globalMessageListener = function(e,t){
        try{ExtraCheck2(e,t);}catch(e){}
        windw.e = e;
        if(!windw.e.webSocket.oldSend){
          windw.e.webSocket.oldSend = windw.e.webSocket.send;
          windw.e.webSocket.send = function(data){
            windw.sendHandler(data);
            windw.e.webSocket.oldSend(data);
          }
        }
        // check DDOS
        const c = document.getElementById("killcount");
        if(c && !locked){
          if(!!(+windw.specialData.config.ddos) && (+c.innerHTML - oldamount) > (+windw.specialData.config.ddos/3)){
            locked = true;
            const oldpin = pin;
            // LOCK THE GAME!
            setTimeout(()=>{
              e.webSocket.send(JSON.stringify([{
                channel: "/service/player",
                clientId,
                data: {
                  gameid: oldpin,
                  type: "lock"
                },
                ext: {},
                id: ++messageId
              }]));
            },1e3);
            console.log("[ANTIBOT] - Detected bot spam. Locking game for 1 minute.");
            setTimeout(()=>{
              locked = false;
              // UNLOCK GAME
              console.log("[ANTIBOT] - Unlocking game.");
              e.webSocket.send(JSON.stringify([{
                channel: "/service/player",
                clientId,
                data: {
                  gameid: oldpin,
                  type: "unlock"
                },
                ext: {},
                id: ++messageId
              }]));
            },60e3);
          }
        }
        /*console.log(e); from testing: e[.webSocket] is the websocket*/
        var data = JSON.parse(t.data)[0];
        /*console.log(data);*/
        messageId = data.id ? data.id : messageId;
        /*if the message is the first message, which contains important clientid data*/
        if(data.id == 1){
          clientId = data.clientId;
        }
        try{
          pin = pin ? pin : Number(document.querySelector("[data-functional-selector=\"game-pin\"]").innerText);
          if(Number(document.querySelector("[data-functional-selector=\"game-pin\"]").innerText) != pin){
            pin = Number(document.querySelector("[data-functional-selector=\"game-pin\"]").innerText);
          }
        }catch(err){}
        /*if the message is a player join message*/
        if(data.data ? data.data.type == "joined" : false){
          console.warn("[ANTIBOT] - determining evil...");
          determineEvil(data.data,e.webSocket);
          specialBotDetector(data.data.type,data.data,e.webSocket);
        }else
        /*if the message is a player leave message*/
        if(data.data ? data.data.type == "left" : false){
        }else
        if(data.data ? data.data.id == 45 : false){
          // if player answers
          if(Date.now() - windw.specialData.startTime < 500 && windw.specialData.config.timeout){
            throw "[ANTIBOT] - Answer was too quick!";
          }
          // if player just recently joined (within 1 second)
          if(windw.cachedData[data.data.cid] && Date.now() - windw.cachedData[data.data.cid].loginTime < 1000){
            const packet = createKickPacket(data.data.cid);
            windw.e.webSocket.send(JSON.stringify(packet));
            const c = document.getElementById("killcount");
            if(c){
              c.innerHTML = Number(c.innerHTML) + 1;
            }
            delete windw.cachedData[data.data.cid];
            throw `[ANTIBOT] - Bot with id ${data.data.cid} banned. Answered too quickly after joining.`;
          }
        }else
        if(data.data ? data.data.id == 50 : false){
          windw.cachedData[data.data.cid].tries++;
          if(windw.cachedData[data.data.cid].tries > 3){
            const kicker = createKickPacket(data.data.cid);
            e.webSocket.send(JSON.stringify(kicker));
            const name = windw.cachedUsernames.filter(o=>{return o.id == data.data.cid}).length ? windw.cachedUsernames.filter(o=>{return o.id == data.data.cid})[0].name : "bot";
            console.warn(`[ANTIBOT] - Bot ${name} banished. Seen spamming 2FA`);
            windw.cachedUsernames.forEach(o=>{
              if(o.id == windw.specialData.lastFakeUserID){
                o.banned = true;
                o.time = 10;
                return;
              }
            });
            delete windw.cachedData[data.data.cid];
            const c = document.getElementById("killcount");
            if(c){
              c.innerHTML = Number(c.innerHTML) + 1;
            }
          }
        }else if (data.data && data.data.id == 18) {
          teamBotDetector(JSON.parse(data.data.content),data.data.cid,e.webSocket);
        }
      };
    };
    let mainScript = new XMLHttpRequest();
    mainScript.open("GET","https://play.kahoot.it/"+script2);
    mainScript.send();
    mainScript.onload = ()=>{
      let sc = mainScript.response;
      const nr = /=[a-z]\.namerator/gm;
      const letter = sc.match(nr)[0].match(/[a-z](?=\.)/g)[0];
      sc = sc.replace(sc.match(nr)[0],`=(()=>{console.log(${letter}.namerator);windw.isUsingNamerator = ${letter}.namerator;return ${letter}.namerator})()`);
      const cqtr = /currentQuestionTimer:[a-z]\.payload\.questionTime/gm;
      const letter2 = sc.match(cqtr)[0].match(/[a-z](?=\.payload)/g)[0];
      sc = sc.replace(sc.match(cqtr)[0],`currentQuestionTimer:${letter2}.payload.questionTime + (()=>{return (windw.specialData.config.additionalQuestionTime * 1000) || 0})()`);
      const nsr = /[a-zA-Z]{2}\.NoStreakPoints/gm;
      const letter3 = sc.match(nsr)[0].match(/[a-zA-Z]{2}(?=\.)/g)[0];
      sc = sc.replace(sc.match(nsr)[0],`windw.specialData.config.streakBonus || 2`); // yes = 1, no = 2
      let changed = originalPage.split("</body>");
      changed = `${changed[0]}<script>${patchedScript}</script><script>${sc}</script><script>try{(${window.localStorage.kahootThemeScript})();}catch(err){}try{(${window.localStorage.extraCheck})();}catch(err){}window.setupAntibot = ${code.toString()};window.parent.fireLoaded = window.fireLoaded = true;window.setupAntibot();</script></body>${changed[1]}`;
      console.log("[ANTIBOT] - loaded");
      document.open();
      document.write("<style>body{margin:0;}iframe{border:0;width:100%;height:100%;}</style><iframe src=\"about:blank\"></iframe>");
      document.close();
      window.stop();
      const doc = document.querySelector("iframe");
      doc.contentDocument.write(changed);
      document.title = doc.contentDocument.title;
    };
  };
};
