// const {PythonShell} = require('python-shell');
const path = require('path');

const Downloader = require('./Downloader.js')

const dl = new Downloader()

let downIdx = 0;

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
    // const copyBoxManu = document.getElementById("copyBoxManu");
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
    const rows = dl.animedb
    // let animedb = []
    for (let i in rows) {
        row = rows[i]
        let message = ""
        for (let j in row) {
            if (j == 'EP')
                message += "EP-" + row[j]
            else if (j != 'Provider' &&
                j != 'Quality' &&
                row[j] != 'None')
                message += row[j]
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
    const rows = dl.animedb
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let autodl = []
    for (i in rows) {
        if (days[d.getDay()] == rows[i]['Air_Day']) {
            autodl.push(await dl.downloadFromDB(i))
        }
    }
    autodl.forEach((val, idx) => {
        let autoCon = document.querySelector(".downAuto");
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
            // button.onclick = () => copyToClipboard(val['magnet']);
        }
        let icon = document.createElement('i');
        icon.className = "glyphicon glyphicon-magnet";
        icon.style = "color:black;";
        button.appendChild(icon);
        box.appendChild(input);
        box.appendChild(button);
        autoCon.appendChild(box);
    })
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
        document.getElementsByClassName("inner-container-down")[0].style.display = "grid";
        document.getElementById("ManualOutput").style.display = "grid";
        document.getElementById("copyT").value = manudl['key'];
        // document.getElementById("copyButtonManu").onclick = () => copyToClipboard(manudl['magnet'], downIdx);
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
        // button.onclick = () => copyToClipboard(val['magnet']);
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

// function showUpdates() {
//     const options = {
//         scriptPath: path.join(__dirname, '../pyPro/'),
//         args: ["showUpdates"]
//     }

//     let anili = [];
//     const aniList = new PythonShell('DownloadAnime.py', options);

//     aniList.on('message', function (message) {
//         let i;
//         // let j=1;
//         let ele = [];
//         let m = "";
//         for (i in message) {
//             if (message[i] === "|") {
//                 ele.push(m);
//                 m = "";
//             } else if (message[i] === "$") {
//                 anili.push(ele);
//                 ele = [];
//             } else {
//                 m += message[i];
//             }
//         }

//         anili.forEach((aniliRow) => {
//             const row = document.createElement('div');
//             row.className = 'tableRows';
//             Table.appendChild(row);
//             aniliRow.forEach((a, idx) => {
//                 if (idx === 0 || idx === 2 || idx === 4) {
//                     const aniliCol = document.createElement('input');
//                     aniliCol.readOnly = true;
//                     aniliCol.value = a;
//                     if (idx === 0) {
//                         aniliCol.id = 'index'
//                         aniliCol.style.backgroundColor = 'orangered';
//                         aniliCol.style.borderColor = 'red';
//                     }
//                     if (idx === 4) {
//                         aniliCol.style.textAlign = 'right';
//                     }
//                     row.appendChild(aniliCol);
//                 }
//             })
//             const button = document.createElement('button');
//             const i = document.createElement('i');
//             button.class = 'remove'
//             i.className = 'glyphicon glyphicon-check'
//             i.style.fontSize = "1vw"
//             button.appendChild(i);
//             row.appendChild(button);
//         })
//     })
// }

// showUpdates()

// function copyToClipboard(magnet, sno) {
//     const options = {
//         scriptPath: path.join(__dirname, '../pyPro/'),
//         args: [magnet]
//     }

//     if (magnet !== "") {
//         new PythonShell('copyToClipboard.py', options);
//         if (confirm("Magnet Link Copied to Clipboard....\nDo want to commit the changes.") && sno != '') {
//             commitUpdates(sno);
//             alert("Commit Successful....");
//         }
//     } else {
//         alert("Nothing to copy.....");
//     }
// }

// function insertDB() {
//     const upAniInput = document.querySelectorAll(".upAniDB input")
//     let upAnili = []

//     upAniInput.forEach((a) => {
//         upAnili.push(a.value)
//     })

//     const options = {
//         scriptPath: path.join(__dirname, '../pyPro/'),
//         args: ["insertDB", upAnili]
//     }

//     const aniList = new PythonShell('AnimeDB.py', options);

//     aniList.on()
//     alert("Inserted Successfully....")
// }

// function commitUpdates(sno) {
//     alert(sno)
//     const options = {
//         scriptPath: path.join(__dirname, '../pyPro/'),
//         args: ["commitChanges", sno]
//     }
//     const py = new PythonShell('AnimeDB.py', options);

//     py.on('message', function (message) {
//         alert(sno)
//     })
// }
