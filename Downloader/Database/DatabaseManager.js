const fs = require('fs');
const path = require('path');

export default class DatabaseManager {
    constructor() {
        this.mainkey = 'Downloader'
        this.animedb = {}
        // this.curPath = pathlib.Path(__file__).parent.absolute()
        // this.animedbFilePath = f'{str(self.curPath)}/Anime_Database.json'
        try {
            this.animedb = require('./Anime_Database.json');
        } catch (err) {
            this.animedb = {
                Downloader: []
            }
            const animedb = JSON.stringify(this.animedb, null, 4);
            fs.writeFile('./Anime_Database.json', animedb, function (err) {
                if (err) return;
            });
        }

        this.animedbEdited = this.animedb
    }

    insert(row) {
        const adbn = this.animedbEdited[this.mainkey]
        row = row.split(",")
        row = {
            Provider: row[0],
            Anime_Name: row[1],
            Season: row[2],
            EP: row[6],
            Quality: row[3],
            Audio: row[4],
            Air_Day: row[5],
            Commit: true
        }
        adbn.push(row)
    }

    delete(rowNo) {
        const adbn = this.animedbEdited[this.mainkey]
        adbn.splice(rowNo, 1)
        adbn[rowNo].Commit = true
    }

    update(rowNo, column, value) {
        const adbn = this.animedbEdited[this.mainkey]
        adbn[rowNo][column] = value
        adbn[rowNo].Commit = true
    }

    commit() {
        let j = 0
        const adbn = this.animedbEdited[this.mainkey]
        const adb = this.animedb[this.mainkey]
        for (let i in adbn) {
            try {
                if (adbn[i]['Commit'])
                    delete adbn[i]['Commit']
                try {
                    adb[i] = adbn[i]
                } catch (err) {
                    adb.push(adbn[i])
                }
                j += 1
            } catch (err) {
                console.log(err)
            }
        }
        const animedb = JSON.stringify(this.animedb, null, 4);
        fs.writeFile('./Anime_Database.json', animedb, function (err) {
            if (err) return;
        });
    }

    show() {
        console.log(this.animedb)
    }

}

// dm = new DatabaseManager()
// dm.show()
// dm.insert('[SubsPlease],Boku No Hero Academia,N/A,(1080p),(SUB),Saturday,100')
// dm.commit()
// dm.show()
