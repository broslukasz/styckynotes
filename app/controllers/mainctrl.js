angular.module('exampleApp')
	.controller('mainCtrl', function() {

    var vm = this,
        countSticks = 0,
        countArticles = 0,
        targetElementId = null,
        sticksArea = document.getElementById("cont"),
        whereToDrop = sticksArea,
        whereToDelete = document.getElementById("trashBin"),
        wherefieldAdd = document.getElementById('addNewField'),
        containerNode = document.getElementById('cont'),
        dropClassName = "sticks__article droptarget",
        getArticle;
    var editText;

/* Events fired on the drag target */


document.addEventListener("dragstart", handleDragStart);
// Behavoiur during the drag event
document.addEventListener("drag", handleDrag);
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
    // get the details of target element
    function targetElement(event){return this.event.target};

// Functions for specific features

    //New stick to add
    function addNewStick(event, articleItem){
        var nodeCopy = document.getElementById(getData(event)).cloneNode(true);
        nodeCopy.id = "newId" + countSticks;
        articleItem.appendChild(nodeCopy);
        var newNoteImg = document.getElementById('newId' + countSticks);
        newNoteImg.className = "sticks__img";
        newNoteImg.style.opacity = "1";

        var stickyNoteText = document.createElement("textarea");
        stickyNoteText.setAttribute('disabled', 'disabled');
        stickyNoteText.setAttribute('draggable', 'true');
        stickyNoteText.id = "textArea" + countArticles;
        stickyNoteText.innerHTML = "To jest notatka nr: "+countArticles+"";
        stickyNoteText.className = "stickText";

        articleItem.appendChild(stickyNoteText);

        articleItem.addEventListener('dbclick', textAreaFn);

        countSticks++;
        countArticles++;
    }

    // Select the article regardless if article or its child has been targeted
    function articleSelectFn(event){
        var parentId = targetElement(event).parentNode.id,
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
    }

    // article not empty - add a new stick to the first empty article
    function articleNotEmpty(){
        var firstChildNode = containerNode.firstChild,
            getArticle = firstChildNode;
        if (getArticle.id !== "") {
            while(getArticle.id !== "" && getArticle !== null){
                getArticle = getArticle.nextSibling;
                if (getArticle === null) {
                    console.log('Nie ma miejsca');
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
            getArticle.appendChild(newRemoveImg);
            containerNode.lastChild.children[0].addEventListener('click', removeThis);
        };
    };

    // appent cross when this function is used
    function exitCrossAppend2(whereToAdd){
        var newRemoveImg = document.createElement('img');
        newRemoveImg.setAttribute('src', 'assets/img/removecross.png');
        newRemoveImg.className = "sticks__removeField";
        whereToAdd.appendChild(newRemoveImg);
        whereToAdd.children[0].addEventListener('click', removeThis);
    };

// Functions of event handlers

    function handleDeleteDrop(event){
        event.preventDefault();
        var draggedNodeParent = document.getElementById(getData(event)).parentNode,
            imgToRemove = draggedNodeParent.children[1],
            textToRemove = draggedNodeParent.children[2];
        if (draggedNodeParent.id.includes('article')) {
            draggedNodeParent.removeChild(imgToRemove);
            draggedNodeParent.removeChild(textToRemove);
            draggedNodeParent.id = "";
        }
    }

    function handleDragStart(event){
        // The dataTransfer.setData() method sets the data type and the value of the dragged data
        targetElementId = targetElement(event).id;

        if (targetElementId == "yellow || green") {
            event.dataTransfer.setData("text", targetElementId);
        } else {
            event.dataTransfer.setData("text/plain", targetElementId);
            console.log("To jest: " + event.target.innerHTML)
        }
        
        // Change the opacity of the draggable element
        event.target.style.opacity = "0.4";        
    }

    function handleDrag(event){

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
        if (event.target.parentNode.className === dropClassName) {
            event.target.parentNode.style.border = "0.5vw dotted blue";
        };
    }

    function handleDragLeave(event){
        if ( event.target.className === dropClassName) {
            event.target.style.border = "";
        };
    }

    function handleDelete(){

    }

    function handleDrop(event){
        event.preventDefault();
        var data = getData(event);
        var draggedNode = document.getElementById(data),
            draggedNodeParent = draggedNode.parentNode,
            targetElement = event.target;

        //it selects the article of a target regardless article or its child's been targeted.
        var articleSelect = articleSelectFn(event);

        articleSelect.style.border = "";
        articleSelect.style.paddingBottom = "30%";

        // It checks if a new element is being adding
        if (data === "yellow" || data === "green") {
            console.log("Dodano nowyy element");

            // if target area is empty it adds a new stick if not adds to the empty field
            if (targetElement.id === "" && targetElement.className !=="stickText" && targetElement.className !== "sticks" && targetElement.className !== "ng-scope") {
                addNewStick(event, targetElement);
            } else {
                // The infrmation that the target area is not empty
                console.log("element jest pełny");
                /* this function triggers when target area for a new stick is not empty 
                and creats a new article*/
                getArticle = articleNotEmpty();

                //it appends a exitcross if it is required
                exitCrossAppend();

                //Check if has space to add then add new stick/stick on a new space
                addNewStick(event, getArticle);
                }

        // Here are events for existing notes manipulation
        } else {
            console.log("zmieniono stary element");
            draggedNode.style.opacity = "1"
            // This behaviour assures that only img has been dragged
            preventError = data.match(/newId/);
            // it checks if the img has beedraggedNoden dragged
            if (draggedNode.parentNode.id.includes('article') && targetElement.className !== "sticks__removeField") {
                console.log('złapano obrazek!');
                var detectElement = targetElement.childNodes.length > 1 ? "has children" : "no children";
                var allContent = draggedNodeParent.innerHTML,
                    oldId = draggedNodeParent.id;

                 // This behaviour to move the content
                if (detectElement === "no children" && (targetElement.className !== "sticks__img" && targetElement.className !== "stickText") ) {
                    console.log("Dragged to no children area");

                    //the old one
                    draggedNodeParent.id = "";
                    draggedNodeParent.innerHTML = "";
                    
                    // adding bin to the old one (whereToAddAtribbute)
                    exitCrossAppend2(draggedNodeParent);

                    // the new one
                    targetElement.innerHTML = allContent;
                    targetElement.id = oldId;

                    targetElement.children[0].addEventListener('click', removeThis);

                // This behaviour to Replace the content
                } else if (detectElement === "has children" || detectElement === "no children") {

                    // Dont do anything if drop on the same element
                    if (draggedNode.id === targetElement.id || draggedNode.parentNode.id === targetElement.parentNode.id){
                        console.log("element is the same!");
                    } else {

                        console.log('parent ID jeśli obszar: ' + event.target.parentNode.id);

                        // Changing parentDragged id
                        draggedNodeParent.id = articleSelect.id;
                        articleSelect.id = oldId;

                        // Copy of the second note
                        var copy = articleSelect.innerHTML;

                        draggedNodeParent.innerHTML = copy;

                        // into new implementation
                        articleSelect.innerHTML = allContent;

                        // into old implementation
                        console.log("Dragged to CHILDREN area and will be replaced");

                        var removeBin = document.querySelectorAll('.sticks__removeField');
                        [].forEach.call(removeBin, function(bin) {
                          bin.addEventListener('click', removeThis);
                        });
                    }
                }
            }

}}

    function textAreaFn(){
        console.log('doubleclicked!: ' + event.target.id);
        if (event.target.id.includes('textArea')) {
            event.target.removeAttribute('disabled');;
        };
    }

    function handleFieldAdd(){
        var thisButton = wherefieldAdd;
        var newArticle = document.createElement('article');
        newArticle.className = "sticks__article droptarget";
        var newRemoveImg = document.createElement('img');
        newRemoveImg.setAttribute('src', 'assets/img/removecross.png');
        newRemoveImg.className = "sticks__removeField";
        newArticle.appendChild(newRemoveImg);
        containerNode.appendChild(newArticle);
        removeBin = document.querySelectorAll('.sticks__removeField');
        [].forEach.call(removeBin, function(bin) {
          bin.addEventListener('click', removeThis);
        });
    };

var removeBin = document.querySelectorAll('.sticks__removeField');
[].forEach.call(removeBin, function(bin) {
  bin.addEventListener('click', removeThis);
});

function removeThis(event){
    this.parentNode.id = "nodeToRemove";
    var thisArticle = document.getElementById('nodeToRemove');
    containerNode.removeChild(nodeToRemove);   
}

});

