window.onload=function(){
    document.getElementById("nextButton").addEventListener("click", smoothie)
    flashCards.innerHTML="Click to Start"
}
//global variable for keeping indices
let index=0;
let recipeCounter=0;
let flashCards= document.getElementById("flashCards");

//this function sorts through the recipe side of the smoothies
function smoothie() {
    document.getElementById("nextButton").removeEventListener("click", smoothie)
   document.getElementById("nextButton").addEventListener("click", ingredients)
   

    

    
    //STEP 1 (to create an AJAX request)
    //this object allows you to make requests and get back data.
    // In short, this is our data retriever (it calls API)
    let xhttp = new XMLHttpRequest();

    //STEP 2 (to create an AJAX request)
    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //changing the information into something js can
            //  understand
            menu = JSON.parse(xhttp.responseText);

          console.log("Before the image")
          //document.createElement("img").src = menu.jsonRecipe[0].image;
          document.getElementById("flashCards").innerHTML = menu.jsonRecipe[index].name;

        console.log("after the image")
         
         }
         if (index == menu.jsonRecipe.length){
            flashCards.innerHTML="Done!"
     }
    }

index++

  //STEP 3 (to create an AJAX request)
    //create a connection
    //open(http method, url)
    xhttp.open("GET", 'https://api.myjson.com/bins/m3zts');

    //STEP 4 (to create an 6AJAX request)
    //this brings the request process to retrieve information
    xhttp.send();
}


function ingredients() {
    document.getElementById("nextButton").removeEventListener("click", ingredients)
    document.getElementById("nextButton").addEventListener("click", smoothie)    

    
    //STEP 1 (to create an AJAX request)
    //this object allows you to make requests and get back data.
    // In short, this is our data retriever (it calls API)
    let xhttp = new XMLHttpRequest();

    //STEP 2 (to create an AJAX request)
    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //changing the information into something js can
            //  understand
            menu = JSON.parse(xhttp.responseText);
          console.log("Before the image")
          //document.createElement("img").src = menu.jsonRecipe[0].image;
          document.getElementById("flashCards").innerHTML = menu.jsonRecipe[recipeCounter].recipe;
            console.log("after the image")
            menu = JSON.parse(xhttp.responseText);
           
                 
            }
        
            
    }

recipeCounter++




  //STEP 3 (to create an AJAX request)
    //create a connection
    //open(http method, url)
    xhttp.open("GET", 'https://api.myjson.com/bins/m3zts');

    //STEP 4 (to create an AJAX request)
    //this brings the request process to retrieve information
    xhttp.send();
}

