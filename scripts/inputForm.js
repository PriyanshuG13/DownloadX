const Downloader = require('../scripts/Downloader/Downloader.js')

const dl = new Downloader()

let count = 1;
const addRowBtn = document.getElementById("addRow");
const Table = document.getElementsByClassName("Table")[0];
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
    const rem = document.createElement('button');
    const i = document.createElement('i');
    rem.class = 'remove'
    i.className = 'glyphicon glyphicon-remove'
    i.style.fontSize = "1vw"
    rem.appendChild(i);
    row.appendChild(rem);
}

function showTable() {

    function addRow(val){
        const aniliCol = document.createElement('input');
        aniliCol.value = val;
        return aniliCol
    }

    const rows = dl.animedb['Downloader']
    for (let i in rows) { 
        const row = document.createElement('div');
        row.className = 'tableRows';
        Table.appendChild(row);
        const aniliCol = addRow(count++)
        aniliCol.style.backgroundColor = 'orangered';
        aniliCol.style.borderColor = 'red';
        aniliCol.readOnly = true;
        row.appendChild(aniliCol);
        for (let j in rows[i]) {
            const aniliCol = addRow(rows[i][j])
            if (j === 'EP' || rows[i][j] === 'N/A') {
                aniliCol.style.textAlign = 'right';
            }
            row.appendChild(aniliCol);
        }
        const rem = document.createElement('button');
        const ico = document.createElement('i');
        rem.class = 'remove'
        // rem.value = sno-1
        // rem.onclick = () => {
        //     dl.delete(rem.value)
        // }
        ico.className = 'glyphicon glyphicon-remove'
        ico.style.fontSize = "1vw"
        rem.appendChild(ico);
        row.appendChild(rem);
    }
}