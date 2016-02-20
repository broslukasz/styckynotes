angular.module('exampleApp')
	.controller('mainCtrl', function() {

    var vm = this;
    vm.notes = [{},{},{}];
    vm.countSticks = 0;
    vm.countArticles = 0;
    var dragSrcEl = null;

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
        dragSrcEl = event.target.id;

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
            event.target.style.border = "3px dotted red";
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
            draggedNode = document.getElementById(data);  

        //This behaviour if a new or existing note is dropped on a ampty drop container
        if ( event.target.className === dropClassName) {
            event.target.style.border = "";
            preventError = data.match(/newId/);
            var effectType = data === "yellow" || data ==="green" ? "copy" : "move";
            
            // if a note is dropped on the same element
            if (event.target.id !== "" && dragSrcEl == event.target.childNodes[1].id){
                    // Don't do anything if the element is the same
                    console.log('You have dragged on the same element');
            // if a note is dropped on the other
            } else {
                // if a new note is to be added
                if (effectType === "copy" && event.target.children.length === 0) {
                    // Make a new copy if a new stick to be added
                    var nodeCopy = draggedNode.cloneNode(true);
                    nodeCopy.id = "newId" + vm.countSticks; /* We cannot use the same ID */
                    event.target.appendChild(nodeCopy);
                    var newNoteImg = document.getElementById('newId' + vm.countSticks);
                    newNoteImg.className = "sticks__img";
                    newNoteImg.style.opacity = "1";

                    var stickyNoteText = document.createElement("div");
                    var nodeText = document.createTextNode("This is new stick nr: " + vm.countSticks);
                    stickyNoteText.appendChild(nodeText);
                    stickyNoteText.className = "stickOptions";

                    event.target.appendChild(stickyNoteText);

                    newNoteImg.parentNode.id = "article" + vm.countArticles;

                    vm.countSticks++;
                    vm.countArticles++;
                    console.log(newNoteImg);

                } else if(preventError === null || preventError[0] !== "newId"){
                    console.log('This message appears whan drop area is draggd instead of photo');
                }

                // the existing note is moved or replaced.
                else {
                    draggedNode.style.opacity = "1";

                    // old content Grab
                    var allContent = draggedNode.parentNode.innerHTML;
                    var oldId = draggedNode.parentNode.id;

                    // if required to switch dragged element place
                    if (event.target.id !== "" && dragSrcEl != this) {
                        
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
            } 
            console.log(event.dataTransfer.dropEffect);

        // This is when a new note or existing is dropped on any existing note
        } else if(event.target.className === "sticks__img"){
            // this is the behavoiur when replacing sticks dragging on IMG
            console.log('najechałeś na obrazek');
            event.target.style.border = "";
            // if the same element
            var hasElement = event.target.id.match(/newId/);
            if (event.target.id === dragSrcEl){
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

                    if (event.target.id !== "" && dragSrcEl != this) {
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
            console.log(event.dataTransfer.dropEffect);
        } else {
            var data = event.dataTransfer.getData("Text");
            var draggedNode = document.getElementById(data); 
            draggedNode.parentNode.id = "";            
            draggedNode.parentNode.innerHTML = "";
        }
    }


});

