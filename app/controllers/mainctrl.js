angular.module('exampleApp')
	.controller('mainCtrl', function() {

    // Local storage Elements

    if (typeof(Storage) !== "undefined") {
        if (localStorage.countArticles) {
            localStorage.countArticles = Number(localStorage.countArticles);
        } else {
            localStorage.countArticles = 0;
        }

        if (localStorage.countSticks) {
            localStorage.countSticks = Number(localStorage.countSticks);
        } else {
            localStorage.countSticks = 0;
        }
    };

    if (typeof(Storage) !== "undefined") {
        if (localStorage.sticksContainer) {
            localStorage.sticksContainer = String(localStorage.sticksContainer);
        } else {
            localStorage.sticksContainer = document.getElementById("cont").innerHTML;
        }
    }

    // Global variables

    var targetElementId = null,
        sticksArea = document.getElementById("cont"),
        whereToDrop = sticksArea,
        whereToDelete = document.getElementById("trashBin"),
        wherefieldAdd = document.getElementById('addNewField'),
        containerNode = document.getElementById('cont'),
        confirmButton = document.getElementById('confirmButton'),
        dropClassName = "sticks__article droptarget",
        getArticle,
        editText;

    containerNode.innerHTML = localStorage.sticksContainer;

/* Events fired on the drag target */

    document.addEventListener("dragstart", handleDragStart);
    
    // When finished dragging reset e.g. the opacity
    document.addEventListener("dragend", handleDragEnd);

/* Events fired on the drop target */

    // When the draggable element enters the droptarget, change the DIVS's border style
    sticksArea.addEventListener("dragenter", handleDragEnter);

    // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
    sticksArea.addEventListener("dragover", handleDragOver);
    whereToDelete.addEventListener("dragover", handleDragOver);

    // When the draggable element leaves the droptarget, reset the DIVS's border style
    sticksArea.addEventListener("dragleave", handleDragLeave);

    // On drop handler
    sticksArea.addEventListener("drop", handleDrop);
    // On delete handler
    whereToDelete.addEventListener("drop", handleDeleteDrop);

    // On add handler
    wherefieldAdd.addEventListener('click', handleFieldAdd);

// Functions for all event handlers

    // get the node of a dragged element
    function getData(event){return event.dataTransfer.getData("Text");}

// Functions for event handlers

    function handleDeleteDrop(event){
        event.preventDefault();
        var draggedNodeParent = document.getElementById(getData(event)).parentNode,
            imgToRemove = draggedNodeParent.children[2],
            textToRemove = draggedNodeParent.children[3];
        if (draggedNodeParent.id.includes('article')) {
            draggedNodeParent.removeChild(imgToRemove);
            draggedNodeParent.removeChild(textToRemove);
            draggedNodeParent.id = "";
        }
        localStorage.sticksContainer = containerNode.innerHTML;
    }

    function handleDragStart(event){
        targetElementId = event.target.id;

        if (targetElementId == "yellow || green") {
            event.dataTransfer.setData("text", targetElementId);
        } else {
            event.dataTransfer.setData("text/plain", targetElementId);
        }

        var readOnlyApply = document.querySelectorAll('.stickText');
        [].forEach.call(readOnlyApply, function(text) {
            text.readOnly = "true";
            text.className = "stickText stickText--editCursor";
            text.parentNode.children[1].setAttribute('src', 'assets/img/pengreen.png');
        });
        
        // Change the opacity of the draggable element
        event.target.style.opacity = "0.4";        
    }

    function handleDragEnd(event){
        event.target.style.opacity = "1";
    }

    function handleDragEnter(event){
        if ( event.target.className === dropClassName && event.target.id === "") {
            event.target.style.border = "0.5vw dotted green";
        }
    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDragLeave(event){
        if ( event.target.className === dropClassName) {
            event.target.style.border = "";
        };
    }

    function handleDrop(event){
        event.preventDefault();
        var data = getData(event);
        if (data === "") {return ""};
        var draggedNode = document.getElementById(data),
            draggedNodeParent = draggedNode.parentNode,
            targetElement = event.target;

        //it selects the article of a target regardless article or its child's been targeted.
        var articleSelect = articleSelectFn(event);

        if (articleSelect === undefined) {return ""};

        articleSelect.style.border = "";
        articleSelect.style.paddingBottom = "30%";

        // It checks if a new element is being adding
        if (data === "yellow" || data === "green") {

            // if target area is empty it adds a new stick if not adds to the empty field
            if (targetElement.id === "" && targetElement.className !=="stickText" && targetElement.className !== "sticks" && targetElement.className !== "ng-scope") {
                addNewStick(event, targetElement);
            } else {
                /* this function triggers when target area for a new stick is not empty 
                and a new article will be created*/
                getArticle = articleNotEmpty();

                //it appends a exitcross and editPencil if it is required
                exitCrossAppend();

                //Check if has space to add then add new stick/stick on a new space
                addNewStick(event, getArticle);
                }
        // Here are events for existing notes manipulation
        } else {
            draggedNode.style.opacity = "1"
            // This behaviour assures that only img has been dragged
            preventError = data.match(/newId/);
            // it checks if the img has been droped to the node functional elements
            if (draggedNode.parentNode.id.includes('article') && targetElement.className !== "sticks__removeField" && targetElement.className !== "sticks__pen") {
                var detectElement = targetElement.childNodes.length > 1 ? "has children" : "no children";
                var allContent = draggedNodeParent.innerHTML,
                    oldId = draggedNodeParent.id;
                    valueText = draggedNode.textContent;

                    // Dont do anything if drop on the same element
                    if (draggedNode.id === targetElement.id || draggedNode.parentNode.id === targetElement.parentNode.id){
                    // This replaces existing nodes
                    } else {

                        // Changing parentDragged id
                        draggedNodeParent.id = articleSelect.id;
                        articleSelect.id = oldId;

                        // Copy of the second note
                        var copy = articleSelect.innerHTML;

                        draggedNodeParent.innerHTML = copy;

                        // into new implementation
                        articleSelect.innerHTML = allContent;

                        //event listeners update

                        // textarea keyUp
                        var typingEvent = document.querySelectorAll('.stickText');
                        [].forEach.call(typingEvent, function(area) {
                          area.addEventListener('keyup', textAreaKeyUp);
                        });

                        // edit pen
                        var editText = document.querySelectorAll('.sticks__pen');
                        [].forEach.call(editText, function(text) {
                          text.addEventListener('click', textEdition);
                        });

                        // remove bin
                        var removeBin = document.querySelectorAll('.sticks__removeField');
                        [].forEach.call(removeBin, function(bin) {
                          bin.addEventListener('click', removeThis);
                        });
                        localStorage.sticksContainer = containerNode.innerHTML;
                    }
            }
        }
    }

// Functions for specific features

    // adding a new Field

    function handleFieldAdd(){
        var newArticle = document.createElement('article');
        newArticle.className = "sticks__article droptarget";

        var newRemoveImg = document.createElement('img');
        newRemoveImg.setAttribute('src', 'assets/img/removecross.png');
        newRemoveImg.className = "sticks__removeField";

        var pencilToEdit = document.createElement('img');
        pencilToEdit.setAttribute('src', 'assets/img/pengreen.png');
        pencilToEdit.className = "sticks__pen";

        newArticle.appendChild(newRemoveImg);
        newArticle.appendChild(pencilToEdit);
        containerNode.appendChild(newArticle);

        containerNode.lastChild.children[1].addEventListener('click', textEdition);
        containerNode.lastChild.children[0].addEventListener('click', removeThis);

        localStorage.sticksContainer = containerNode.innerHTML;

    };

    //New stick to add
    function addNewStick(event, articleItem){
        var nodeCopy = document.getElementById(getData(event)).cloneNode(true);
        nodeCopy.id = "newId" + localStorage.countSticks;
        articleItem.appendChild(nodeCopy);

        var newNoteImg = document.getElementById('newId' + localStorage.countSticks);
        newNoteImg.className = "sticks__img";
        newNoteImg.style.opacity = "1";

        var stickyNoteText = document.createElement("textArea");
        stickyNoteText.id = "textArea" + localStorage.countArticles;
        stickyNoteText.className = "stickText stickText--editCursor";
        stickyNoteText.setAttribute('readOnly', '');
        stickyNoteText.setAttribute('draggable', 'true');
        stickyNoteText.setAttribute('placeholder', 'Note here!');
        stickyNoteText.setAttribute('maxlength', '100');
        stickyNoteText.setAttribute('data-value', '');
        stickyNoteText.addEventListener('keyup', textAreaKeyUp);
        stickyNoteText.innerHTML = stickyNoteText.getAttribute('data-value');

        articleItem.appendChild(stickyNoteText);

        newNoteImg.parentNode.id = "article" + localStorage.countArticles;

        localStorage.countSticks++;
        localStorage.countArticles++;

        localStorage.sticksContainer = containerNode.innerHTML;
    }

    // Select the article regardless if article or its child has been targeted
    function articleSelectFn(event){
        if (event.target.parentNode.id !== "") {
        var parentId = event.target.parentNode.id,
            parentIdLetters = parentId.match(/[a-z]+/g).join();
        switch(parentIdLetters){
            // if a stick has been selected
            case "article":
                var articleSelect = event.target.parentNode;
                break;
            // if stick area has been selected
            case "cont":
                var articleSelect = event.target;
                break;
        }
        return articleSelect;            
        };
    }

    // article not empty - add a new stick to the first empty article
    function articleNotEmpty(){
        var firstChildNode = containerNode.firstChild,
            getArticle = firstChildNode;
        if (getArticle.id !== "") {
            while(getArticle.id !== "" && getArticle !== null){
                getArticle = getArticle.nextSibling;
                if (getArticle === null) {
                    var newArticle = document.createElement('article');
                    newArticle.className = "sticks__article droptarget";
                    containerNode.appendChild(newArticle);
                    getArticle = containerNode.lastChild;
                };
            };
        }
        return getArticle;
    };

    // append a cross to the first empty article
    function exitCrossAppend(){
        if (getArticle.innerHTML === "") {
            var newRemoveImg = document.createElement('img');
            newRemoveImg.setAttribute('src', 'assets/img/removecross.png');
            newRemoveImg.className = "sticks__removeField";
            
            var pencilToEdit = document.createElement('img');
            pencilToEdit.setAttribute('src', 'assets/img/pengreen.png');
            pencilToEdit.className = "sticks__pen";

            getArticle.appendChild(newRemoveImg);
            getArticle.appendChild(pencilToEdit);

            containerNode.lastChild.children[0].addEventListener('click', removeThis);
            containerNode.lastChild.children[1].addEventListener('click', textEdition);
        };
    };

// Event Handlers and its functions for smaller/repetitive aplication's elements

    // For remove Bins

    var removeBin = document.querySelectorAll('.sticks__removeField');
    [].forEach.call(removeBin, function(bin) {
      bin.addEventListener('click', removeThis);
    });

    function removeThis(event){
        this.parentNode.id = "nodeToRemove";
        var thisArticle = document.getElementById('nodeToRemove');
        containerNode.removeChild(nodeToRemove); 
        localStorage.sticksContainer = containerNode.innerHTML;  
    }

    // For textAreas

    var editText = document.querySelectorAll('.sticks__pen');
    [].forEach.call(editText, function(text) {
      text.addEventListener('click', textEdition);
    });

    function textEdition(event){
        if (event.target.parentNode.children.length > 2) {
            var getThisArea = this.parentNode.children[3];

            var getTextArea = getThisArea.readOnly;
            getTextArea === true ? getThisArea.focus() : "";
            getThisArea.readOnly = (getTextArea === true ? false : true );
            getTextArea === true ? getThisArea.draggable = false : getThisArea.draggable = true;
            getTextArea === true ? getThisArea.className = "stickText" : getThisArea.className = "stickText stickText--outline";

            var changeCursor = getThisArea.className;
            getThisArea.className = (changeCursor === "stickText" ? "stickText stickText--outline" : "stickText stickText--editCursor" );
            
            var penIcon = event.target.src;
            event.target.src = (event.target.src.includes('green')? 'assets/img/pen.png' : 'assets/img/pengreen.png');
            
            localStorage.sticksContainer = containerNode.innerHTML;
        }
    }

    // For textareas events'es keyup 

    var typingEvent = document.querySelectorAll('.stickText');

        // Keyup
        [].forEach.call(typingEvent, function(area) {
          area.addEventListener('keyup', textAreaKeyUp);
        });

        function textAreaKeyUp(event){
        this.setAttribute('data-value', this.value);
        this.innerHTML=this.getAttribute('data-value');
        }

        // make all textareas draggable when clicked somewhere outside active textarea
        document.addEventListener('click', makeTextDraggable);
        function makeTextDraggable(event){
                for(var i = 0, y = containerNode.children.length; i < y; i++){
                if (containerNode.children[i].children[3] !== undefined) {
                    containerNode.children[i].children[3].draggable = true;
                };
            }
        }
});