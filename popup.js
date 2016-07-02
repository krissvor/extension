var loaded = {allLists: [{listName:"skole", links: [{url: "http://instabart.no/"}]},
                          {listName:"noe annet", links: [{url: "https://www.youtube.com/"}]}
                          ]};

var selectedList = loaded.allLists[0];
var selectedListIndex = 0;

load();
displayLists();

document.getElementById("submitName").addEventListener("click", function(){
  var listName = document.getElementById("newListName").value;
  console.log(listName);
});

function loadComplete(newLoad) {
  console.log(newLoad);
  if (newLoad != {}) {
    loaded = newLoad;
  }
}

function displayLists(){
  url = loaded.url;
  var list = "";
  var listHolder = document.getElementById("listHolder");
  var listContent = listHolder.innerHTML;
  for(var i = 0; i<loaded.allLists.length; i++){
    var listElement = "<li><a class='listOfLists moveRight' onClick>" + loaded.allLists[i].listName + "</a></li>";
    console.log(listElement);0
    listContent += listElement;
  }
  listHolder.innerHTML = listContent;
}

document.getElementsByClassName("listOfLists")

function test(){
  console.log("onclick funker");
}

function displayList(){
  url = loaded.url;
  var list = "";
  var listHolder = document.getElementById("listHolder");
  for(var i = 0; i<selectedList.links.length; i++){
    var content = selectedList.links[i].url;
    var node = document.createElement("LI");
    var link = document.createElement("A");
    link.setAttribute("href", content);
    link.setAttribute("class", "slideLeft");
    link.appendChild(document.createTextNode(content))
    node.appendChild(link);
    listHolder.appendChild(node);
  }
}

function addThis(hurl){
  console.log(loaded);
  var contains = false
  if(loaded != {}){
    for(var i = 0; i<selectedList.links.length; i++) {
      console.log(selectedList.listName);
      if(selectedList.links[i].url == hurl){
        contains = true
        break;
      }
    }
  }
  if(contains == false){
    selectedList.links.push({url: hurl});
  }
  save();
}


document.getElementById("addThisTab").addEventListener("click", function(){
  getCurrentTabUrl();
});

document.getElementById("skole").addEventListener("click", function(){

  // chrome.storage.sync.get(url, function(result){
  //   console.log(result)
  // }

  chrome.storage.sync.get("skole" ,function (result) {
    // console.log(result);
    // console.log(result.skole.skole1[1]);

    for (var i = 0; i <= result.skole.skole1.length; i++) {
      chrome.tabs.create(result.skole.skole1[i]);
    }
  })
});

function save(){
  console.log(loaded);
  loaded.allLists.splice(selectedListIndex,1,selectedList);
  chrome.storage.sync.set(loaded);
  console.log("saved");
}



document.getElementById("save").addEventListener("click", function(){
  chrome.storage.sync.set(loaded);
  // chrome.storage.sync.set({url: "http://instabart.no/"});
  // chrome.storage.sync.set({url2: "http://instabart.no/"});
  console.log("saved");
});

document.getElementById("load").addEventListener("click", load());

function load(){

  // chrome.storage.sync.get("url", function(result){
  //   console.log(result)
  // });
  chrome.storage.sync.get(function(result) {
    // console.log("Load ");
    // console.log(result);
    loadComplete(result);
  });
};



document.getElementById("clear").addEventListener("click", function(){
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
    document.getElementById("listHolder").innerHTML = "";

    console.log("Storage cleared");
  });
});




function getCurrentTabUrl() {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    addThis(url);
  });



  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

