const text = document.getElementById("text");
let originalText = text.innerText;
let newText = ""
for (i = 0; i < originalText.length; i++)
{
    newText += `<span data-num="${i}" data-name="span">${originalText[i]}</span>`
}
text.innerHTML = newText
const div = document.getElementById("text_div");

const player = document.getElementById('player');

const start = document.getElementById("start");


let recorder;
let started = false;
let chunks = [];

start.addEventListener("click", (() => {
    if (started) {
        start.innerText = "Start Recording";
        start.style.backgroundColor = "#FFFFFF"
        started = false;
        recorder.stop();
    }
    else {
        start.innerText = "Stop Recording";
        start.style.backgroundColor = "#FF0000"
        started = true;
        chunks = [];
        recorder.start();
    }
}));

const handleSuccess = function(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
        if(recorder.state == 'inactive'){
            let blob = new Blob(chunks, {type: "audio/mpeg" });
            let url = URL.createObjectURL(blob);
            player.src = url;
            //sendData(blob)
        };
    };
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
.then(handleSuccess);



let firstClick = true;
document.addEventListener("click", function(evt){
    //player.play();
    if (evt.target.dataset.name === "span")
    {
        player.play();
        if (firstClick)
        {
            setTimeout(function(){
                player.currentTime = (evt.target.dataset.num  / originalText.length)* player.duration;
            } , 500)
            
        }
        else
        {
            player.currentTime = (evt.target.dataset.num  / originalText.length)* player.duration;
        }
        firstClick = false;
    }
})

setInterval(function(){
    const sectionPlayed = Math.round((player.currentTime / player.duration) * originalText.length)
    for (i=0; i < originalText.length; i++)
    {
        if (i < sectionPlayed)
        {
            text.children[i].classList.add("color")
        }
        else
        {
            text.children[i].classList.remove("color")
        }
    }
}, 100);

const submit = document.getElementById("submit");
const textarea = document.getElementById("input");

submit.addEventListener("click", function() {
    originalText = textarea.value
    textarea.value = ""

    let newText = ""
    for (i = 0; i < originalText.length; i++)
    {
        newText += `<span data-num="${i}" data-name="span">${originalText[i]}</span>`
    }
    text.innerHTML = newText
})

