angular.module('exampleApp')
	.controller('mainCtrl', function() {

/* Events fired on the drag target */

document.addEventListener("dragstart", handleDragStart);
// Behavoiur during the drag event
document.addEventListener("drag", handleDrag);
// When finished dragging reset e.g. the opacity
document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "1";
});

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

    var vm = this;
    vm.notes = [{},{},{}];
    this.countSticks = 0;
    this.countArticles = 0;
    vm.temporary = "";
    var dragSrcEl = null;

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

    function handleDragEnter(event){
        if ( event.target.className == "sticks__article droptarget ng-scope" || event.target.className == "n-sticks__article droptarget" ) {
            event.target.style.border = "3px dotted red";
        }    
    }

    function handleDragOver(event){
        event.preventDefault();   
    }

    function handleDragLeave(event){
        if ( event.target.className == "sticks__article droptarget ng-scope" || event.target.className == "n-sticks__article droptarget"  ) {
            event.target.style.border = "";
        }
    }

    function handleDrop(event){
        event.preventDefault();
        if ( event.target.className == "sticks__article droptarget ng-scope" || event.target.className == "n-sticks__article droptarget"  ) {
            event.target.style.border = "";
            var data = event.dataTransfer.getData("Text");  
            var data2 = event.dataTransfer.getData("text/html");
            var effectType = data === "yellow" || data === "green" ? "copy" : "move";
            // if the same element
            if (event.target.id !== "" && dragSrcEl == event.target.childNodes[1].id){
                    // Don't do anything if the element is the same
                    console.log('You have dragged on the same element');
            } else {
                if (effectType === "copy") {
                    // If a new stick is put make copy
                    event.dataTransfer.dropEffect = effectType;
                    var nodeCopy = document.getElementById(data).cloneNode(true);
                    nodeCopy.id = "newId" + vm.countSticks; /* We cannot use the same ID */
                    event.target.appendChild(nodeCopy);
                    var d1 = document.getElementById('newId' + vm.countSticks);
                    d1.className = "sticks__img";
                    d1.style.opacity = "1";

                    var features = document.createElement("div");
                    var nodeText = document.createTextNode("This is new stick nr: " + vm.countSticks);
                    features.appendChild(nodeText);

                    event.target.appendChild(features);

                    d1.parentNode.id = "article" + vm.countArticles;

                    vm.countSticks++;
                    vm.countArticles++;
                    console.log(d1);
                } else {
                     event.dataTransfer.dropEffect = effectType;
                     document.getElementById(data).style.opacity = "1";

                    // old content
                    var allContent = document.getElementById(data).parentNode.innerHTML;
                    var oldId = document.getElementById(data).parentNode.id;

                    if (event.target.id !== "" && dragSrcEl != this) {
                        // switch dragged elements places
                        console.log('Zastąpiono: ' + event.target.innerHTML);

                        document.getElementById(data).parentNode.id = "article" + (vm.countArticles - 1);
                        event.target.id = oldId;
                        // Copy of the new
                        var copy = event.target.innerHTML;

                        document.getElementById(data).parentNode.innerHTML = copy;

                        // into new implementation
                        event.target.innerHTML = allContent;

                        // into old implementation

                    } else {

                        //the old one
                            document.getElementById(data).parentNode.id = "";
                            document.getElementById(data).parentNode.innerHTML = "";

                            // the new one
                            event.target.innerHTML = allContent;
                            event.target.id = "article" + (vm.countArticles - 1);

                            // the old one
                            console.log("tekst: " + document.getElementById(data).parentNode.innerHTML);
                    }

                }
            } 
            console.log(event.dataTransfer.dropEffect);
        } 
    }


});

