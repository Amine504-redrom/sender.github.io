var form = document.querySelector(".field")
var input = document.querySelector("input")
var button = document.querySelector(".field button")


var url = "http://localhost:3000/"

const data = async ()=>{
    const response = await fetch(`${url}664f42fcef350a6dcc675116`)
    const data = await response.json()
    for(let i=0;i<data.length;i++){
        var table = document.querySelector(".table")
        var tb = document.createElement("div")
        var p = document.createElement("p")
        tb.classList.add("tb")
        p.innerHTML = data[i]
        tb.appendChild(p)
        table.appendChild(tb)
    }
    
}

data()

let msg;
button.addEventListener("click",(e)=>{
    e.preventDefault()
    msg = {message : input.value}
    add()
})


const add = async ()=>{
    fetch(`${url}664f42fcef350a6dcc675116`, {
        method: 'PUT', // Specify the request method
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(msg) // Convert the data to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(responseData => {
        console.log('Success'); // Handle the response data
    })
    .catch(error => {
        console.error('Error:', error); // Handle errors
    });
}


const start = async()=>{
    await window.open("https://www.instagram.com/")
    const ele = document.querySelector("i span")
    ele.innerHTML = "chat start"
    ele.style.color = "green"
    const response = await fetch(`${url}start/664f42fcef350a6dcc675116`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        }
    }).then(()=>{console.log("chat starting....")}).catch(
        (err)=>document.write("<h1 style='color:red'>Something is wrong</h1>")
    )
    
}

const stop = async ()=>{
    const ele = document.querySelector("i span")
    ele.innerHTML = "chat off"
    ele.style.color = "red"
    await fetch(`${url}stop`).then(()=>{console.log("Session Closed!")}).catch((err)=>{err})
}