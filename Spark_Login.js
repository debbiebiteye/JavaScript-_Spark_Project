
function getJSON() {
    let user = document.getElementById('username').value;
    let psw = document.getElementById('password').value;

    //STEP 1 (to create an AJAX request)
    //this object allows you to make requests and get back data.
    // In short, this is our data retriever (it calls API)
    let xhttp = new XMLHttpRequest();

    //STEP 2 (to create an AJAX request)
    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //changing the information into something js can
            //  understand
            jsonAccount = JSON.parse(xhttp.responseText);

            if(user==jsonAccount[1].username&&psw==jsonAccount[1].password){
                window.open("Spark_Index.html");
            }
            else alert("wrong password or username");
         }
    }



  //STEP 3 (to create an AJAX request)
    //create a connection
    //open(http method, url)
    xhttp.open("GET", 'https://api.myjson.com/bins/12syuw');

    //STEP 4 (to create an AJAX request)
    //this brings the request process to retrieve information
    xhttp.send();
}
