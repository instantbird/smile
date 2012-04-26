Components.utils.import("resource:///modules/imServices.jsm");

let smile = {
  _smileyThemePref: "messenger.options.emoticonsTheme",

  handleEvent: function(event) {
    this.updateUI();
    Services.prefs.addObserver(this._smileyThemePref, this, false);
    window.removeEventListener("load", this);
  },
  observe: function() {
    this.updateUI();
  },

  updateUI: function() {
    this.createPanelContents();
    let anchor = document.getElementById("emoticonAnchor");

    // TODO: Maybe make sure that there are emoticons in the current theme.
    if (Services.prefs.getCharPref(this._smileyThemePref) == "none") {
      anchor.setAttribute("disabled","true");
    } else {
      anchor.removeAttribute("disabled");
    }
  },
  createPanelContents: function smile_creatPanelContents() {
    Components.utils.import("resource:///modules/imSmileys.jsm"); 

    let smileyList = getSmileyList();
    let panel = document.getElementById("emoticonPanel");

    /* Calculate ideal dimensions of grid (x * y) based on number of smileys. 
        Start from a square, try to get a grid with filled rows and columns;
        if that fails, take a square and let a few fields empty at the end.
        More columns are preferred over more rows.
     */
    if(!smileyList || smileyList.length == 0)
      return;

    let columnCount = 0, rowCount = 0;
    // Stop before 1, we don't want a single row of 1 x N smilies.
    for(let i = Math.floor(Math.sqrt(smileyList.length)); i > 1; i--) {
      if (smileyList.length % i == 0) {
        rowCount = i;
        columnCount = smileyList.length / rowCount;
        break;
      }
    }
    // Fallback as described above.
    if(columnCount == 0) {
      columnCount = Math.ceil(Math.sqrt(smileyList.length));
      rowCount    = Math.ceil(smileyList.length / columnCount);
    }

    // Make dimensions of our table known.
    let columns = document.getElementById("emoticonPanelColumns");
    // Empty columns list first.
    while (columns.firstChild)
      columns.removeChild(columns.firstChild);

    // Fill columns with new values.
    for(let i = 0; i < columnCount; i++){
      let column = document.createElement("column");
      column.setAttribute("flex", "1");
      columns.appendChild(column);
    }

    // Create content.
    let rows = document.getElementById("emoticonPanelRows");
    // Empty rows.
    while (rows.firstChild)
      rows.removeChild(rows.firstChild);

    // Fill rows with new values.
    let i = 0;
    for (let y = 0; y < rowCount; y++) {
      let newRow = document.createElement("row");
      for(let x = 0; x < columnCount && i < smileyList.length; x++) {
        let s = smileyList[i];
        // Just take the first text representation that is there.
        let textCode = s.textCodes[0];
        let newSmiley = document.createElement("image");
        newSmiley.setAttribute("src", s.src);
        newSmiley.setAttribute("style", "padding: 1px");
        newSmiley.setAttribute("tooltiptext", textCode);
        newSmiley.onclick = function() { smile.paste(textCode); panel.hidePopup(); };
        newSmiley.classList.add("smileItem");
        newRow.appendChild(newSmiley);
        i++;
      }
      rows.appendChild(newRow);
    }
  },

  openPanel: function smile_openPanel() {
    let anchor = document.getElementById("emoticonAnchor");
    let panel  = document.getElementById("emoticonPanel");
    // Move popup anchor eight pixels (half width of the emoticon) to the right
    //panel.openPopup(anchor, "before_start", 8, 0, false, false, null);
    if (!anchor.hasAttribute("disabled"))
      panel.openPopup(anchor, "after_start", 8, 0, false, false, null);
  },

  paste: function smile_paste(aText) {
   window.getBrowser().selectedConversation.focus();
   let command = "cmd_insertText";
   let controller = document.commandDispatcher.getControllerForCommand(command);
   if (controller && controller.isCommandEnabled(command)) {
       controller = controller.QueryInterface(Components.interfaces.nsICommandController);
       let params = Components.classes["@mozilla.org/embedcomp/command-params;1"];
       params = params.createInstance(Components.interfaces.nsICommandParams);
       params.setStringValue("state_data", aText);
       controller.doCommandWithParams(command, params);
     }
   }
};

window.addEventListener("load", smile);
