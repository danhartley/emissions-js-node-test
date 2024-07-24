import { node } from '@danhartley/emissions'

import puppeteer from 'puppeteer'

(async () => {
  const browser = await puppeteer.launch({
      headless: false
  })

  const page = await browser.newPage()

  await page.setViewport({
    width: 1920, 
    height: 1080
  })

  const url = 'https://www.smashingmagazine.com'

  async function getReport(page, url) {    
    const options = {
      hostingOptions: {
        verbose: false,
        forceGreen: true,
      },
    }
  
    const {
      pageWeight,
      count,
      emissions,
      greenHosting,
      data,
    } = await node.getPageEmissions(page, url, options)

    const format = number => {
      return (number).toLocaleString('en-GB', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      });
    };
  
    console.log(`Report for ${url}`)
    console.log('Page weight: ', `${format(pageWeight / 1000)} Kbs`)
    console.log('Requests ', count)
    console.log('Emissions: ', `${format(emissions * 1000)} mg of CO2`)
    console.log(
      greenHosting ? 'Hosting: green hosting' : 'Hosting: not green hosting'
    )
  
    console.log('groupedByType')
    console.log(data?.groupedByType)
    console.log('totalUncachedBytes')
    console.log(data?.totalUncachedBytes)
    console.log('groupedByTypeBytes')
    console.log(data?.groupedByTypeBytes)
  }

  await getReport(page, url)

})()
