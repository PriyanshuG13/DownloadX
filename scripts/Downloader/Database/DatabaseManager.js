const fs = require('fs');
const path = require('path');

class DatabaseManager {
    constructor() {
        this.mainkey = 'Downloader'
        this.animedb = {}
        this.animedbFilePath = path.join(__dirname, './Anime_Database.json')
        try {
            this.animedb = require(this.animedbFilePath);
        } catch (err) {
            this.animedb = {
                Downloader: []
            }
            const animedb = JSON.stringify(this.animedb, null, 4);
            fs.writeFile(this.animedbFilePath, animedb, function (err) {
                if (err) return;
            });
        }

        this.animedbEdited = this.animedb
    }

    insert(row) {
        const adbn = this.animedbEdited[this.mainkey]
        // row = row.split(",")
        row = {
            Provider: row[0],
            Anime_Name: row[1],
            Season: row[2],
            EP: row[3],
            Quality: row[4],
            Audio: row[5],
            Air_Day: row[6],
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
            if (adbn[i]['Commit']){
                delete adbn[i]['Commit']
                try {
                    adb[i] = adbn[i]
                } catch (err) {
                    adb.push(adbn[i])
                }
            }
        }
        const animedb = JSON.stringify(this.animedb, null, 4);
        fs.writeFile(this.animedbFilePath, animedb, function (err) {
            if (err) return;
        });
    }

    showJSON() {
        console.log(this.animedb)
    }

}

module.exports = DatabaseManager;

// dm = new DatabaseManager()
// dm.showJSON()
// dm.insert('[SubsPlease],Boku No Hero Academia,N/A,(1080p),(SUB),Saturday,100')
// dm.commit()
// dm.showJSON()
