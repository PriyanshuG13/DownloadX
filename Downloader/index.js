const {PythonShell} = require('python-shell');
const path = require('path');
let downIdx = 0;
let commitAnime = [];

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const Table = document.getElementsByClassName("Table")[0];


selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
    const copyBoxManu = document.getElementById("copyBoxManu");
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
            downIdx = idx + 1;
        });
    });
}, 500)

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
    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["aniListFull"]
    }

    let anili = [];
    const aniList = new PythonShell('DownloadAnime.py', options);

    aniList.on('message', function (message) {
        let i;
        let ele = "";
        for (i in message) {
            if (message[i] === "|") {
                anili.push(ele);
                ele = "";
            } else {
                ele += message[i];
            }
        }

        anili.forEach((a, idx) => {
            let op = document.createElement('div');
            let label = document.createElement('label');
            let radio = document.createElement('input');
            op.className = "option";
            op.id = "option-" + (idx + 1);
            optionsContainer.appendChild(op);
            radio.type = 'radio';
            radio.className = 'aniR'
            radio.id = 'aniR-' + (idx + 1);
            label.id = 'ani-' + (idx + 1);
            op.appendChild(radio);
            op.appendChild(label);
            label.innerHTML = a;
            radio.innerHTML = '';
        })
    })
}

function DownAnimeAuto() {
    document.getElementById("loader-1").style.display = "block";

    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["DownloadAnimeAuto"]
    }

    let anili = [];
    const aniList = new PythonShell('DownloadAnime.py', options);

    aniList.on('message', function (message) {
        let i;
        let ele = "";
        for (i in message) {
            if (message[i] === "|") {
                anili.push(ele);
                ele = "";
            } else {
                ele += message[i];
            }
        }

        const mag = anili.filter((a, i) => {
            return (i % 2 !== 0);
        });
        anili = anili.filter((a, i) => {
            return (i % 2 === 0);
        });

        anili.forEach((a, idx) => {
            let autoCon = document.querySelector(".downAuto");
            let box = document.createElement('div');
            box.className = "copyBox";
            let input = document.createElement('input');
            input.type = "text";
            input.className = "copyText";
            input.id = 'copyT-' + (idx + 1);
            input.readOnly = true;
            input.value = a;
            let button = document.createElement('button');
            button.className = "copyButton";
            if (mag[idx] === "") {
                button.disabled = true;
                input.style.backgroundColor = "red";
                button.style.backgroundColor = "red";
            } else {
                button.onclick = () => copyToClipboard(mag[idx]);
            }
            let icon = document.createElement('i');
            icon.className = "glyphicon glyphicon-magnet";
            icon.style = "color:black;";
            button.appendChild(icon);
            box.appendChild(input);
            box.appendChild(button);
            autoCon.appendChild(box);
        })
        const d = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        document.getElementById("weekDay").innerHTML = "(" + days[d.getDay()] + ")";
        document.getElementById("loader-1").style.display = "none";
    })
}

function DownAnimeManu() {
    document.getElementById("loader-2").style.display = "block";

    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["DownloadAnimeManu", downIdx]
    }

    const aniList = new PythonShell('DownloadAnime.py', options);

    aniList.on('message', function (message) {
        let aniName = "";
        let mag = "";
        let magBool = true;
        let i;
        for (i in message) {
            if (message[i] !== "|" && magBool) {
                aniName += message[i];
            } else if (message[i] === "|") {
                magBool = false;
                continue;
            } else {
                mag += message[i]
            }
        }
        document.getElementsByClassName("inner-container-down")[0].style.display = "none";
        if (aniName === 'No New Episode available!') {
            alert("No New Episode available!");
            document.getElementById("loader-2").style.display = "none";
        } else {
            document.getElementsByClassName("inner-container-down")[0].style.display = "grid";
            document.getElementById("ManualOutput").style.display = "grid";
            document.getElementById("copyT").value = aniName;
            document.getElementById("copyButtonManu").onclick = () => copyToClipboard(mag, downIdx);
            document.getElementById("loader-2").style.display = "none";
        }
    })
}

function DownAnimeNew() {
    document.getElementById("loader-2").style.display = "block";

    const name = document.getElementById("nameNew").value;
    const ep = document.getElementById("EPNew").value;

    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["DownloadAnimeNew", name, ep]
    }

    let anili = [];
    const aniList = new PythonShell('DownloadAnime.py', options);

    aniList.on('message', function (message) {
        let i;
        let ele = "";
        for (i in message) {
            if (message[i] === "|") {
                anili.push(ele);
                ele = "";
            } else {
                ele += message[i];
            }
        }

        const mag = anili.filter((a, i) => {
            return (i % 2 !== 0);
        });
        anili = anili.filter((a, i) => {
            return (i % 2 === 0);
        });

        if (anili[0] === 'Nothing Available') {
            alert("Nothing Available");
        } else {
            document.getElementsByClassName("inner-container-down")[0].style.display = "grid";
            document.getElementById("NewOutput").style.display = "grid";
        }

        anili.pop()

        anili.forEach((a, idx) => {
            let newOut = document.getElementById("NewOutput");
            let box = document.createElement('div');
            box.className = "copyBox";
            let input = document.createElement('input');
            input.type = "text";
            input.className = "copyText";
            input.id = 'copyT-' + (idx + 1);
            input.readOnly = true;
            input.value = a;
            let button = document.createElement('button');
            button.className = "copyButton";
            button.onclick = () => copyToClipboard(mag[idx]);
            let icon = document.createElement('i');
            icon.className = "glyphicon glyphicon-magnet";
            icon.style = "color:black;";
            button.appendChild(icon);
            box.appendChild(input);
            box.appendChild(button);
            newOut.appendChild(box);
        })
        document.getElementById("loader-2").style.display = "none";
    })
}

function showUpdates() {
    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["showUpdates"]
    }

    let anili = [];
    const aniList = new PythonShell('DownloadAnime.py', options);

    aniList.on('message', function (message) {
        let i;
        // let j=1;
        let ele = [];
        let m = "";
        for (i in message) {
            if (message[i] === "|") {
                ele.push(m);
                m = "";
            } else if (message[i] === "$") {
                anili.push(ele);
                ele = [];
            } else {
                m += message[i];
            }
        }

        anili.forEach((aniliRow) => {
            const row = document.createElement('div');
            row.className = 'tableRows';
            Table.appendChild(row);
            aniliRow.forEach((a, idx) => {
                if (idx === 0 || idx === 2 || idx === 4) {
                    const aniliCol = document.createElement('input');
                    aniliCol.readOnly = true;
                    aniliCol.value = a;
                    if (idx === 0) {
                        aniliCol.id = 'index'
                        aniliCol.style.backgroundColor = 'orangered';
                        aniliCol.style.borderColor = 'red';
                    }
                    if (idx === 4) {
                        aniliCol.style.textAlign = 'right';
                    }
                    row.appendChild(aniliCol);
                }
            })
            const button = document.createElement('button');
            const i = document.createElement('i');
            button.class = 'remove'
            i.className = 'glyphicon glyphicon-check'
            i.style.fontSize = "1vw"
            button.appendChild(i);
            row.appendChild(button);
        })
    })
}

showUpdates()

function copyToClipboard(magnet, sno) {
    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: [magnet]
    }

    if (magnet !== "") {
        new PythonShell('copyToClipboard.py', options);
        if (confirm("Magnet Link Copied to Clipboard....\nDo want to commit the changes.") && sno != '') {
            commitUpdates(sno);
            alert("Commit Successful....");
        }
    } else {
        alert("Nothing to copy.....");
    }
}

function insertDB() {
    const upAniInput = document.querySelectorAll(".upAniDB input")
    let upAnili = []

    upAniInput.forEach((a) => {
        upAnili.push(a.value)
    })

    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["insertDB", upAnili]
    }

    const aniList = new PythonShell('AnimeDB.py', options);

    aniList.on()
    alert("Inserted Successfully....")
}

function commitUpdates(sno) {
    alert(sno)
    const options = {
        scriptPath: path.join(__dirname, '../pyPro/'),
        args: ["commitChanges", sno]
    }
    const py = new PythonShell('AnimeDB.py', options);

    py.on('message', function (message) {
        alert(sno)
    })
}
