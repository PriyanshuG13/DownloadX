const Downloader = require('../scripts/Downloader/Downloader.js')

const dl = new Downloader()

let count = 1;
const Table = document.getElementsByClassName("Table")[0];

function AddRow() {
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
        aniliCol.style.textAlign = 'right';
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
        // rem.value = count-2
        // rem.onclick = () => {
        //     const rows = document.querySelectorAll(".tableRows");
        //     console.log(rem.value)
        //     rows[rem.value].remove()
        // }
        ico.className = 'glyphicon glyphicon-remove'
        ico.style.fontSize = "1vw"
        rem.appendChild(ico);
        row.appendChild(rem);
    }
}

function updateTable(){
    function getTableData() {
        const dataMat = new Array()
        try {
            const rows = document.querySelectorAll(".tableRows");
            for(let i in rows){
                const row = rows[i].querySelectorAll('input');
                const dataSet = new Array()
                for(let j in row){
                    const value = row[j].value
                    if(j != 0 && value != undefined)
                        dataSet.push(value)
                }
                dataMat.push(dataSet)
            }
        } catch(err){
            console.log(dataMat)
            return dataMat
        }
    }

    dl.refreshTable(getTableData())
    window.location.reload();
}