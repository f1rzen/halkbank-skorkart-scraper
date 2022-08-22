// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer'
import fs from 'fs'
import csvToJson from 'convert-csv-to-json';
import chalk from 'chalk';
(async () => {
    
    let inputDataName = "./hisseisimleri.csv"
    const json = csvToJson.fieldDelimiter(',').getJsonFromCsv(inputDataName)  

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  for(let i =0; i<json.length; i++){

    await console.log(chalk.blue(`${json[i].Hisse}`) + ` için veriler içeri aktarılıyor  ${i+1}/${json.length}`)
    await page.goto(`https://www.halkyatirim.com.tr/skorkart/${json[i].Hisse}`);
    await page.waitForSelector('#TBLTEMELANALIZ > tbody > tr > td')

    const myValueLink = (await page.$$('#TBLTEMELANALIZ > tbody > tr > td.dt-right, #TBLPIYASADEGER> tbody > tr > td.dt-right, #TBLFIYATPERFORMANSI > tbody > tr > td.dt-right'))
    const myKeyLink = (await page.$$('#TBLTEMELANALIZ > tbody > tr > td.dt-left, #TBLPIYASADEGER> tbody > tr > td.dt-left, #TBLFIYATPERFORMANSI > tbody > tr > td.dt-left'))

    
    var keys = ["Hisse"]
    var values = [`${json[i].Hisse}`]

    
    for(let i=0; i<myKeyLink.length; i++){
        const innerText = await page.evaluate((el) => el.innerText, myKeyLink[i])       
        await keys.push(innerText)
      }
    
    for(let i=0; i<myValueLink.length; i++){
        const innerText = await page.evaluate((el) => el.innerText, myValueLink[i])       
        await values.push(innerText)
      }

    
    var jsonParse = {}



    
      for (let i=0; i<keys.length; i++){
        jsonParse[keys[i]] = values[i];
      }
    
      // const outputData = await page.evaluate("jsonParse");
    
   
    
   await fs.appendFile('./blank.json', "\n" + JSON.stringify(jsonParse), function (err) {
    if (err) throw err;
   
  });




}
  
    await browser.close();
  
  })();
