const Downloader = require('../Downloader/Downloader.js')

const dl = new Downloader()

const modal = document.getElementById("myModal");
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

const addRowBtn = document.getElementById("addRow");
const Table = document.getElementsByClassName("Table")[0];
let count = 1;

addRowBtn.onclick = () => {
    const row = document.createElement('div');
    row.className = 'tableRows';
    Table.appendChild(row);
    const sno = document.createElement('input');
    sno.readOnly = true;
    sno.value = count++;
    sno.style.backgroundColor = 'orangered';
    sno.style.borderColor = 'red';
    row.appendChild(sno);
    const prov = document.createElement('input');
    row.appendChild(prov);
    const name = document.createElement('input');
    row.appendChild(name);
    const seas = document.createElement('input');
    row.appendChild(seas);
    const ep = document.createElement('input');
    ep.type = "number";
    row.appendChild(ep);
    const qual = document.createElement('input');
    row.appendChild(qual);
    const aud = document.createElement('input');
    row.appendChild(aud);
    const air = document.createElement('input');
    row.appendChild(air);
}

function showTable() {
    const rows = dl.animedb['Downloader']
    for (let i in rows) { 
        const row = document.createElement('div');
        row.className = 'tableRows';
        Table.appendChild(row);
        const aniliCol = addRow(count++)
        aniliCol.style.backgroundColor = 'orangered';
        aniliCol.style.borderColor = 'red';
        row.appendChild(aniliCol);
        for (let j in rows[i]) {
            const aniliCol = addRow(rows[i][j])
            if (j === 'EP' || rows[i][j] === 'N/A') {
                aniliCol.style.textAlign = 'right';
            }
            row.appendChild(aniliCol);
        }
    }
}

function addRow(val){
    const aniliCol = document.createElement('input');
    aniliCol.readOnly = true;
    aniliCol.value = val;
    return aniliCol
}

showTable()

// function insertDB() {
//     const {PythonShell} = require('python-shell');
//     const path = require('path');
//     let row = []

//     const options = {
//         scriptPath: path.join(__dirname, '../pyPro/'),
//         args: ["insertDB", row]
//     }

//     const aniList = new PythonShell('AnimeDB.py', options);

//     aniList.on('message', function (message) {
//         console.log(message)
//     })
// }

// insertDB()
