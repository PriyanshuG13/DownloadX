import DatabaseManager from './Database/DatabaseManager'
import copy from 'copy-to-clipboard';

export default class Downloader extends DatabaseManager {
    constructor(delay = 60) {
        super();
        this.URL = "https://nyaa.iss.one/?f=0&c=0_0&q="
        this.delay = delay
    }

    downloadFromDB(n) {
        url = this.URL
        // row = list(self.animedb['Downloader'][n].values())
        ep = this.incrementEP(row[3])
        for (let j = 0; j < 6; j++) {
            if (row[j] == 'N/A')
                continue
            else if (j == 3)
                url += ep + '+'
            else
                url += row[j] + '+'
        }
        console.log(row[1] + "EP-" + row[3] + "->" + ep)
        try {
            this.downloader(url)
            console.log("COPIED TO CLIPBOARD\nUPDATED EPISODE IN DATABASE")
            this.update(n, "EP", ep)
            return this.delay
        } catch (err) {
            console.log("NOT YET AVAILABLE")
            return 1
        }
    }

    downloadFromInput(name, ep) {
        url = this.URL + "+"
        url += name + "+" + ep
        ep = this.incrementEP(row[3])
        try {
            this.downloader(url)
            console.log("DOWNLOADING EP-" + ep)
            return this.delay
        } catch (err) {
            console.log("NOT YET AVAILABLE")
            return 1
        }
    }

    incrementEP(ep) {
        let ep = (Number(ep) + 1).toString()
        if (Number(ep) < 10) {
            ep = "0" + ep
        }
        return ep
    }

    downloader(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url)

        const [el] = await page.$x('/html/body/div[1]/div[1]/table/tbody/tr[1]/td[3]/a[2]')
        const link = await el.getProperty('href')
        const magnet = await link.jsonValue()

        copy(magnet)
        console.log(magnet)
        // this.openClient(magnet)
        browser.close();
        return magnet
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
    //     console.log("Commit?? : ")
    //     if (input().upper() == 'Y'){
    //         this.commit()
    //         console.log("COMMITED UPDATES")
    //     }
    // }
}
