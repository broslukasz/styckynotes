angular.module('exampleApp')
	.controller('mainCtrl', function() {

    var vm = this;
    vm.notes = ["0","1","2"];
    vm.countSticks = 0;
    vm.countArticles = 0;
    var targetElementID = null;

/* Events fired on the drag target */


document.addEventListener("dragstart", handleDragStart);
// Behavoiur during the drag event
document.addEventListener("drag", handleDrag);
// When finished dragging reset e.g. the opacity
document.addEventListener("dragend", handleDragEnd);

/* Events fired on the drop target */

// When the draggable element enters the droptarget, change the DIVS's border style
document.addEventListener("dragenter", handleDragEnter);

// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", handleDragOver);

// When the draggable element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", handleDragLeave);

// On drop handler
document.addEventListener("drop", handleDrop);


// Functions


    function handleDragStart(event){
        // The dataTransfer.setData() method sets the data type and the value of the dragged data
        targetElementID = event.target.id;

        if (event.target.id == "yellow || green") {
            event.dataTransfer.setData("text", event.target.id);
            event.dataTransfer.effectAllowed = "copy";
        } else {
            event.dataTransfer.setData("text/plain", event.target.id);
            event.dataTransfer.effectAllowed = "move";
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
        if ( event.target.className == dropClassName) {
            event.target.style.border = "0.5vw dotted red";
        }
    }

    function handleDragOver(event){
        event.preventDefault();  
    }

    function handleDragLeave(event){
        if ( event.target.className == "sticks__article droptarget ng-scope") {
            event.target.style.border = "";
        }
    }

    var dropClassName = "sticks__article droptarget ng-scope";

    function handleDrop(event){
        event.preventDefault();
        var data = event.dataTransfer.getData("Text"),
            draggedNode = document.getElementById(data),
            targetEvent = event.target; 

        //those elements checks if target element is article or its child
        var targetSelect,
            parentId = targetEvent.parentNode.id,
            parentIdLetters = parentId.match(/[a-z]+/g).join();
        console.log('Szukam pustego!');
        switch(parentIdLetters){
            // jeśli zostanie zaznaczona karteczka
            case "article":
                var targetSelect = event.target.parentNode
                break;
            // jesli zostanie zaznaczony obszar
            case "cont":
                var targetSelect = event.target
                break;
        }

        event.target.style.border = "";
        targetSelect.style.paddingBottom = "30%";

        // It checks if a new element is being adding
        if (data === "yellow" || data === "green") {
            console.log("Dodano nowyy element");

            //element to add a new content
            function addNewStick(articleItem){
                var nodeCopy = draggedNode.cloneNode(true);
                nodeCopy.id = "newId" + vm.countSticks;
                articleItem.appendChild(nodeCopy);
                var newNoteImg = document.getElementById('newId' + vm.countSticks);
                newNoteImg.className = "sticks__img";
                newNoteImg.style.opacity = "1";

                var stickyNoteText = document.createElement("div");
                var nodeText = document.createTextNode("This is new stick nr: " + vm.countSticks);
                stickyNoteText.appendChild(nodeText);
                stickyNoteText.className = "stickOptions";

                articleItem.appendChild(stickyNoteText);

                newNoteImg.parentNode.id = "article" + vm.countArticles;

                vm.countSticks++;
                vm.countArticles++;
            }

            // it checks if target area is empty and adds a new stick
            if (targetEvent.id === "" && targetEvent.className !=="stickOptions" && targetEvent.className !== "sticks" && targetEvent.className !== "ng-scope") {
                addNewStick(targetEvent);
            } else {
                // The infrmation that the target area is not empty
                console.log("element jest pełny");
                var getArticle = targetSelect;
                var containerNode = document.getElementById(targetSelect.parentNode.id);
                var firstChildNode = containerNode.firstChild;
                getArticle = firstChildNode;
                if (getArticle.id !== "") {
                    while(getArticle.id !== "" && getArticle !== null){
                        getArticle = getArticle.nextSibling;
                        if (getArticle === null) {
                            console.log('Nie ma miejsca');
                            var newDiv = document.createElement('article');
                            var newDivClass = newDiv.className = "sticks__article droptarget"
                            containerNode.appendChild(newDiv);
                            getArticle = containerNode.lastChild;
                        };
                    };
                }

                //Check if has space to add then add new stick/stick on a new space
                addNewStick(getArticle);
            }

        // Here are events for existing notes manipulation
        } else {
            console.log("zmieniono stary element");
            draggedNode.style.opacity = "1"
            // This behaviour assures that only img has been dragged
            preventError = data.match(/newId/);
            // it checks if the img has been dragged
            if (draggedNode.id.includes('newId')) {
                console.log('złapano obrazek');
                console.log('id chwyconego obrazka: ' + draggedNode.id);
                console.log('id chwyconego artykułu: ' + draggedNode.parentNode.id);
                var allContent = draggedNode.parentNode.innerHTML;
                var decectElement = targetEvent.childNodes.length > 1 ? "has children" : "no children";
                var allContent = draggedNode.parentNode.innerHTML,
                    oldId = draggedNode.parentNode.id;

                 // This behaviour to move the content
                if (decectElement === "no children" && (targetEvent.className !== "sticks__img" && targetEvent.className !== "stickOptions") ) {

                    //the old one
                    draggedNode.parentNode.id = "";
                    draggedNode.parentNode.innerHTML = "";

                    // the new one
                    event.target.innerHTML = allContent;
                    event.target.id = oldId;

                    // the old one
                    console.log("Dragged to no children area");

                // This behaviour to Replace the content
                } else if (decectElement === "has children" || decectElement === "no children") {

                    // Dont do anything if drop on the same element
                    if (draggedNode.id === targetEvent.id || draggedNode.parentNode.id === targetEvent.parentNode.id){
                        console.log("element is the same!");
                    } else {

                        console.log('id docelowego obrazka: ' + targetSelect.id);
                        console.log('id docelowego artykułu: ' + targetSelect.id);
                        console.log('parent ID jeśli obszar: ' + event.target.parentNode.id);

                        // draggedNode = document.getElementById(data),

                        // Changin parent node id of source
                        draggedNode.parentNode.id = targetSelect.id;
                        targetSelect.id = oldId;

                        // Copy of the second note
                        var copy = targetSelect.innerHTML;

                        draggedNode.parentNode.innerHTML = copy;

                        // into new implementation
                        targetSelect.innerHTML = allContent;

                        // into old implementation
                        console.log("Dragged to CHILDREN area and will be replaced")

                                                        /*
                                console.log('Zastąpiono: ' + event.target.innerHTML);

                                draggedNode.parentNode.id = "article" + (vm.countArticles - 1);
                                event.target.parentNode.id = oldId;
                                // Copy of the new
                                var copy = event.target.parentNode.innerHTML;

                                draggedNode.parentNode.innerHTML = copy;

                                // into new implementation
                                event.target.parentNode.innerHTML = allContent;

                                // into old implementation */
                    }
                }
            }

/*

            // This prevents when dragging on the same element or unexpected drag area
            if (targetEvent.className === draggedNode.className || (preventError[0] !== "newId")){
                // Don't do anything if the element is the same
                console.log('The element has been dragged on the same place');
            } else {
                // The behaviour if element is dropped on the drop area
                if ( targetEvent.className === dropClassName){
                    draggedNode.style.opacity = "1";

                    // old content Grab
                    var allContent = draggedNode.parentNode.innerHTML;
                    var oldId = draggedNode.parentNode.id;

                    // if required to switch dragged element place
                    if (event.target.id !== "" && targetElementID != this) {
                        
                        console.log('Zastąpiono: ' + event.target.innerHTML);

                        draggedNode.parentNode.id = "article" + (vm.countArticles - 1);
                        event.target.id = oldId;

                        // Copy of the second note
                        var copy = event.target.innerHTML;

                        draggedNode.parentNode.innerHTML = copy;

                        // into new implementation
                        event.target.innerHTML = allContent;

                        // into old implementation

                    // if ht 
                    } else {

                        //the old one
                            draggedNode.parentNode.id = "";
                            draggedNode.parentNode.innerHTML = "";

                            // the new one
                            event.target.innerHTML = allContent;
                            event.target.id = "article" + (vm.countArticles - 1);

                            // the old one
                            console.log("tekst: " + document.getElementById(data).parentNode.innerHTML);
                    }

                }
             
            

                // The behaviour if element is dropped on the IMG    
                } if (event.target.className === "sticks__img"){
                    console.log('najechałeś na obrazek');
                    event.target.style.border = "";
                    // if the same element
                    var hasElement = event.target.id.match(/newId/);
                    if (event.target.id === targetElementID){
                            // Don't do anything if the element is the same
                            console.log('You have dragged on the same element');

                    // If a new note is dragged on the existing element
                    } else if (hasElement = "newId" && (data === "yellow" || data ==="green")){
                        console.log('you cannot create on the same element');
                    } else {
                       
                            event.dataTransfer.dropEffect = effectType;
                            draggedNode.style.opacity = "1";

                            // old content
                            var allContent = draggedNode.parentNode.innerHTML;
                            var oldId = draggedNode.parentNode.id;

                            if (event.target.id !== "" && targetElementID != this) {
                                // switch dragged elements places
                                console.log('Zastąpiono: ' + event.target.innerHTML);

                                draggedNode.parentNode.id = "article" + (vm.countArticles - 1);
                                event.target.parentNode.id = oldId;
                                // Copy of the new
                                var copy = event.target.parentNode.innerHTML;

                                draggedNode.parentNode.innerHTML = copy;

                                // into new implementation
                                event.target.parentNode.innerHTML = allContent;

                                // into old implementation

                            } else {

                                //the old one
                                    draggedNode.parentNode.id = "";
                                    draggedNode.parentNode.innerHTML = "";

                                    // the new one
                                    event.target.innerHTML = allContent;
                                    event.target.id = "article" + (vm.countArticles - 1);

                                    // the old one
                                    console.log("tekst: " + document.getElementById(data).parentNode.innerHTML);
                            }

                        
                    }
                        }
                    }
                
     */       
         /*else {
            var data = event.dataTransfer.getData("Text");
            var draggedNode = document.getElementById(data); 
            draggedNode.parentNode.id = "";            
            draggedNode.parentNode.innerHTML = "";
        } */
}}


});

