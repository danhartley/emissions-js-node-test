import { node } from '@danhartley/emissions'
import { parseArgs, format } from './utils.js'
import { getLighthouseReport } from './lighthouse.js'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

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

  const { url, lh } = parseArgs({ args: process.argv })

  async function getReport(page, url) {    
    const options = {
      hostingOptions: {
        verbose: false,
        forceGreen: true,
      },
      compressionOptions: {
        br: 1,
        gzip: 9
      },
    }
  
    const {
      pageWeight,
      count,
      emissions,
      greenHosting,
      data,
    } = await node.getPageEmissions(page, url, options)
  
    console.log(`Report for ${url}`)
    console.log('Page weight: ', `${format(pageWeight / 1000)} Kbs`)
    console.log('Request count: ', count)
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

  if(lh) {
    const lhReport = await getLighthouseReport({
        lighthouse
      , chromeLauncher
      , url
    })

    const summary = lhReport.summary

    console.log('Lighthouse report:')
    console.log('Transfer size: ', `${format(summary.totalResourceTransferSize)} Kbs`)
    console.log('Total byte weight: ', `${format(summary.totalByteWeight)} Kbs`)
    console.log('Request count: ', `${summary.requestCount}`)
    console.log('DOM count: ', `${summary.DOMSize}`)
  }
})()
