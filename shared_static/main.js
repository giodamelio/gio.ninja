document.addEventListener("DOMContentLoaded", function(){
    // Loop throught the url argument inputs and resize them 
    // to match the size of their placeholder plus a bit of padding
    var input = document.querySelectorAll("input.arg");
    for(var i = 0; i < input.length; i++){
        input[i].setAttribute("size", input[i].getAttribute("placeholder").length + 5);
    }
});

