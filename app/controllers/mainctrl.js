angular.module('exampleApp')
	.controller('mainCtrl', function() {

    var vm = this;
    vm.notes = ["0","1","2"];
    vm.countSticks = 0;
    vm.countArticles = 0;
    var targetElementID = null;
    var whereToEnter = document.getElementById("cont");
    var whereToDelete = document.getElementById("trashBin");

/* Events fired on the drag target */


document.addEventListener("dragstart", handleDragStart);
// Behavoiur during the drag event
document.addEventListener("drag", handleDrag);
// When finished dragging reset e.g. the opacity
document.addEventListener("dragend", handleDragEnd);

/* Events fired on the drop target */

var whereToDrop = document.getElementById("cont");
// When the draggable element enters the droptarget, change the DIVS's border style
whereToDrop.addEventListener("dragenter", handleDragEnter);

// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", handleDragOver);

// When the draggable element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", handleDragLeave);

// On drop handler
whereToEnter.addEventListener("drop", handleDrop);

// On delete handler

whereToDelete.addEventListener("drop", handleDeleteDrop);


// Functions

    function handleDeleteDrop(event){
        event.preventDefault();
        var data = event.dataTransfer.getData("Text"),
            draggedNode = document.getElementById(data),
            draggedNodeParent = draggedNode.parentNode;
        draggedNode.parentNode.innerHTML = "";

        // adding remove field img
        var newRemoveImg = document.createElement('img');
        newRemoveImg.setAttribute('src', 'assets/img/trashbin.png');
        newRemoveImg.className = "sticks__removeField";
        draggedNodeParent.appendChild(newRemoveImg);
        removeBin = document.querySelectorAll('.sticks__removeField');
        [].forEach.call(removeBin, function(bin) {
            bin.addEventListener('click', removeThis);
         });

        draggedNodeParent.id = "";
    }


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
        if ( event.target.className === dropClassName) {
            event.target.style.border = "0.5vw dotted red";
        }
    }

    function handleDragOver(event){
        event.preventDefault();  
    }

    function handleDragLeave(event){
        if ( event.target.className === dropClassName && event.target.id !== "0") {
            event.target.style.border = "";
        };
    }

    function handleDelete(){

    }

    var dropClassName = "sticks__article droptarget";

    function handleDrop(event){
        event.preventDefault();
        var data = event.dataTransfer.getData("Text"),
            draggedNode = document.getElementById(data),
            targetEvent = event.target; 

        //those elements checks if target element is article or its child
        var targetSelect,
            parentId = targetEvent.parentNode.id,
            parentIdLetters = parentId.match(/[a-z]+/g).join();
        switch(parentIdLetters){
            // if a stick has been selected
            case "article":
                var targetSelect = event.target.parentNode
                break;
            // if stick area has been selected
            case "cont":
                var targetSelect = event.target
                break;
        }

        targetSelect.style.border = "";
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

            // if target area is empty it adds a new stick if not adds to the empty field
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

                var newRemoveImg = document.createElement('img');
                newRemoveImg.setAttribute('src', 'assets/img/trashbin.png');
                newRemoveImg.className = "sticks__removeField";
                getArticle.appendChild(newRemoveImg);
                removeBin = document.querySelectorAll('.sticks__removeField');
                [].forEach.call(removeBin, function(bin) {
                    bin.addEventListener('click', removeThis);
                 });
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

                    var draggedNodeParent = draggedNode.parentNode;
                    //the old one
                    draggedNode.parentNode.id = "";
                    draggedNode.parentNode.innerHTML = "";
                    // adding bin to the old one
                    var newRemoveImg = document.createElement('img');
                    newRemoveImg.setAttribute('src', 'assets/img/trashbin.png');
                    newRemoveImg.className = "sticks__removeField";
                    draggedNodeParent.appendChild(newRemoveImg);
                    removeBin = document.querySelectorAll('.sticks__removeField');
                    [].forEach.call(removeBin, function(bin) {
                        bin.addEventListener('click', removeThis);
                     });

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
                        console.log("Dragged to CHILDREN area and will be replaced");

                        var removeBin = document.querySelectorAll('.sticks__removeField');
                        [].forEach.call(removeBin, function(bin) {
                          bin.addEventListener('click', removeThis);
                        });
                    }
                }
            }

}}

var plusButton = document.getElementById('addNewField');
plusButton.addEventListener('click', function(){
    var thisButton = plusButton;
    var containerNode = document.getElementById('cont');
    var newArticle = document.createElement('article');
    newArticle.className = "sticks__article droptarget";
    var newRemoveImg = document.createElement('img');
    newRemoveImg.setAttribute('src', 'assets/img/trashbin.png');
    newRemoveImg.className = "sticks__removeField";
    newArticle.appendChild(newRemoveImg);
    containerNode.appendChild(newArticle);
    removeBin = document.querySelectorAll('.sticks__removeField');
    [].forEach.call(removeBin, function(bin) {
      bin.addEventListener('click', removeThis);
    });
})

var removeBin = document.querySelectorAll('.sticks__removeField');
[].forEach.call(removeBin, function(bin) {
  bin.addEventListener('click', removeThis);
});

function removeThis(event){
    var containerNode = document.getElementById('cont');
    this.parentNode.id = "nodeToRemove";
    var thisArticle = document.getElementById('nodeToRemove');
    containerNode.removeChild(nodeToRemove);   
}

});

