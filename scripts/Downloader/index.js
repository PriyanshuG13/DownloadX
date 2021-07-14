// const {PythonShell} = require('python-shell');
const path = require('path');

const Downloader = require('../scripts/Downloader/Downloader.js')

const dl = new Downloader()

let downIdx = 0;

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
});
window.onclick = function (event) {
    if (event.target !== selected) {
        optionsContainer.classList.remove("active");
    }
}
setTimeout(() => {
    const optionsList = optionsContainer.querySelectorAll(".option");
    optionsList.forEach((o, idx) => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
            document.getElementById("copyBoxManu").style.visibility = "visible";
            downIdx = idx;
        });
    });
}, 500)


const Table = document.getElementsByClassName("Table")[0];
const modal = document.getElementsByClassName("modal")[0];
const btn = document.getElementById("rightButton");
const span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function AnimeListFull() {
    const rows = dl.animedb['Downloader']
    // let animedb = []
    for (let i in rows) {
        row = rows[i]
        let message = ""
        for (let j in row) {
            if (j == 'EP')
                message += " EP-" + row[j] + " -> " + dl.incrementEP(row[j])
            else if (j != 'Provider' &&
                j != 'Quality' &&
                j != 'Air_Day' &&
                row[j] != 'N/A')
                message += " " + row[j]
        }
        let op = document.createElement('div');
        let label = document.createElement('label');
        let radio = document.createElement('input');
        op.className = "option";
        op.id = "option-" + (i + 1);
        optionsContainer.appendChild(op);
        radio.type = 'radio';
        radio.className = 'aniR'
        radio.id = 'aniR-' + (i + 1);
        label.id = 'ani-' + (i + 1);
        op.appendChild(radio);
        op.appendChild(label);
        label.innerHTML = message;
        radio.innerHTML = '';
    }
}

async function DownAnimeAuto() {
    document.getElementById("loader-1").style.display = "block";
    const rows = dl.animedb['Downloader']
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let autodl = []
    for (i in rows) {
        if (days[d.getDay()] == rows[i]['Air_Day']) {
            autodl.push(await dl.downloadFromDB(i))
        }
    }

    let autoCon = document.querySelector(".downAuto");

    if (autodl.length <= 0){
        let Text = document.createElement('div');
        Text.style.fontSize = "5vw"
        Text.style.fontFamily = "Cursive"
        Text.style.textAlign = "center"
        Text.style.color = "#FFFF"
        Text.append("NO NEW ANIME FOR TODAY")
        autoCon.appendChild(Text);
    } else {
        autodl.forEach((val, idx) => {
            let box = document.createElement('div');
            box.className = "copyBox";
            let input = document.createElement('input');
            input.type = "text";
            input.className = "copyText";
            input.id = 'copyT-' + (idx + 1);
            input.readOnly = true;
            input.value = val['key'];
            let button = document.createElement('button');
            button.className = "copyButton";
            if (val['magnet'] === -1) {
                button.disabled = true;
                input.style.backgroundColor = "red";
                button.style.backgroundColor = "red";
            } else {
                showUpdates()
                button.onclick = () => copyToClipboard(val['magnet']);
            }
            let icon = document.createElement('i');
            icon.className = "glyphicon glyphicon-magnet";
            icon.style = "color:black;";
            button.appendChild(icon);
            box.appendChild(input);
            box.appendChild(button);
            autoCon.appendChild(box);
        })
    }
    document.getElementById("weekDay").innerHTML = "(" + days[d.getDay()] + ")";
    document.getElementById("loader-1").style.display = "none";
}

async function DownAnimeManu() {
    document.getElementById("loader-2").style.display = "block";

    const manudl = await dl.downloadFromDB(downIdx)
    document.getElementsByClassName("inner-container-down")[0].style.display = "none";
    if (manudl['magnet'] === -1) {
        alert(manudl['key']);
        document.getElementById("loader-2").style.display = "none";
    } else {
        showUpdates()
        document.getElementsByClassName("inner-container-down")[0].style.display = "grid";
        document.getElementById("ManualOutput").style.display = "grid";
        document.getElementById("copyT").value = manudl['key'];
        document.getElementById("copyButtonManu").onclick = () => copyToClipboard(manudl['magnet']);
        document.getElementById("loader-2").style.display = "none";
    }
}

async function DownAnimeNew() {
    document.getElementById("loader-2").style.display = "block";

    const name = document.getElementById("nameNew").value;
    const ep = document.getElementById("EPNew").value;
    let checkEP = true
    let newdlArr = []

    while (checkEP) {
        newdl = await dl.downloadFromInput(name, ep++)
        if (newdl['magnet'] == -1) {
            alert(newdl['key'] + "\nNot Available!!");
            checkEP = false
            return
        } else newdlArr.push(newdl)
    }

    document.getElementsByClassName("inner-container-down")[0].style.display = "grid";
    document.getElementById("NewOutput").style.display = "grid";

    newdlArr.forEach((val, idx) => {
        let newOut = document.getElementById("NewOutput");
        let box = document.createElement('div');
        box.className = "copyBox";
        let input = document.createElement('input');
        input.type = "text";
        input.className = "copyText";
        input.id = 'copyT-' + (idx + 1);
        input.readOnly = true;
        input.value = val['key'];
        let button = document.createElement('button');
        button.className = "copyButton";
        button.onclick = () => copyToClipboard(val['magnet']);
        let icon = document.createElement('i');
        icon.className = "glyphicon glyphicon-magnet";
        icon.style = "color:black;";
        button.appendChild(icon);
        box.appendChild(input);
        box.appendChild(button);
        newOut.appendChild(box);
    })
    document.getElementById("loader-2").style.display = "none";
}

function showUpdates(){
    const rows = dl.animedbEdited['Downloader']
    try{
        const rows = document.querySelectorAll('.tableRows')
        rows.forEach((row) => {
            row.remove()
        })
    } catch(err){
        console.log(err)
    }
    
    let sno = 0
    for (let i in rows) {
        let data = rows[i]
        ++sno
        if (data['Commit']){
            console.log(data)
            const row = document.createElement('div');
            row.className = 'tableRows';
            Table.appendChild(row);
            for(let j in data){
                if (j === 'Provider' || j === 'Anime_Name' || j === 'EP') {
                    const aniliCol = document.createElement('input');
                    aniliCol.readOnly = true;
                    if (j !== 'Provider') {
                        aniliCol.value = data[j];
                    } else {
                        aniliCol.value = sno;
                        aniliCol.id = 'index'
                        aniliCol.style.backgroundColor = 'orangered';
                        aniliCol.style.borderColor = 'red';
                    } 
                    if (j === 'EP')
                        aniliCol.style.textAlign = 'right';
                    row.appendChild(aniliCol);
                }
            }
            const button = document.createElement('button');
            const i = document.createElement('i');
            button.class = 'remove'
            button.value = sno-1
            button.onclick = () => {
                delete dl.animedbEdited.Downloader[button.value].Commit
                showUpdates()
            }
            i.className = 'glyphicon glyphicon-remove'
            i.style.fontSize = "1vw"
            button.appendChild(i);
            row.appendChild(button);
        }
    }
}

function commitToDB(){
    if (confirm("Are you Sure you want to commit the changes.")) {
        dl.commit()
        alert("Commit Successful....");
        showUpdates()
        window.location.reload();
    } else {
        alert("Commit was Unsuccessful....");
    }
}

function insertDB(){
    const insertAnime = document.querySelectorAll(".upAniDB input")
    let row = []

    insertAnime.forEach((a) => {
        row.push(a.value)
    })

    dl.insert(row)
    showUpdates()
}

function copyToClipboard(magnet) {
    if (!navigator.clipboard) {
        alert("X_X_X_X_X COPY FAILED X_X_X_X_X");
        return;
    }
    navigator.clipboard.writeText(magnet);
    alert("Magnet Link Copied to Clipboard....");
}
