const DatabaseManager = require('./Database/DatabaseManager.js')
const puppeteer = require("puppeteer");

class Downloader extends DatabaseManager {
    constructor(delay = 60) {
        super();
        this.URL = "https://nyaa.iss.one/?f=0&c=0_0&q="
    }

    async downloadFromDB(n) {
        let url = this.URL
        const row = this.animedb['Downloader'][n]
        // row = list(self.animedb['Downloader'][n].values())
        let ep = this.incrementEP(row['EP'])
        for (let i in row) {
            if (row[i] == 'N/A' || i == 'Air_Day')
                continue
            else if (i == 'EP')
                url += ep + '+'
            else
                url += row[i] + '+'
        }
        const key = row['Anime_Name'] + " " + row['Audio'] + " EP-" + row['EP'] + " -> " + ep
        console.log(key)
        const magnet = await this.downloader(url)
        if (magnet != 1) {
            console.log("COPIED TO CLIPBOARD\nUPDATED EPISODE IN DATABASE")
            this.update(n, "EP", ep)
            return {key: key, magnet: magnet}
        } else {
            return {key: key + "No New Episode available!", magnet: -1}
        }
    }

    async downloadFromInput(name, ep) {
        let url = this.URL + "+"
        url += name + "+" + ep
        ep = this.incrementEP(row[3])
        const magnet = await this.downloader(url)
        if (magnet != 1) {
            const key = name + " DOWNLOADING EP-" + ep
            console.log("DOWNLOADING EP-" + ep)
            return {key: key, magnet: magnet}
        } else return {key: key, magnet: -1}

    }

    incrementEP(ep) {
        ep = (Number(ep) + 1).toString()
        if (Number(ep) < 10) {
            ep = "0" + ep
        }
        return ep
    }

    async downloader(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url)
        try {
            const [el] = await page.$x('/html/body/div[1]/div[1]/table/tbody/tr[1]/td[3]/a[2]')
            const link = await el.getProperty('href')
            const magnet = await link.jsonValue()
            return magnet
        } catch (err) {
            console.log("NOT YET AVAILABLE")
            return 1
        } finally {
            browser.close();
        }

    }

    // openClient(link){
    //     try:
    //     subprocess.run(f'open -a "Free Download Manager" {link[1]["href"]}', shell=True, check=True)
    //     except:
    //         self.fancyPrint("Try Installing Free Download Manager", 'mini')
    //     print("It also Backs Up as a Torrent Client")
    //     download = "https://nyaa.iss.one/" + link[0]["href"]
    //     webbrowser.open(download, new=2)
    // }

    // commitToDB(){
    //     this.commit()
    // }
}

module.exports = Downloader;

// downloader = new Downloader()
// downloader.downloadFromDB(3)
