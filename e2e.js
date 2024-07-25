import { node, reports } from '@danhartley/emissions'
import { parseArgs, format, getLighthouseReport } from './utils.js'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

import puppeteer from 'puppeteer'

(async () => {
  let browser
  try {
    browser = await puppeteer.launch({
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
          br: 6,
          gzip: 5,
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

    if(url === undefined) throw new Error('Please provide a url in the command line arguments e.g. -u example.com')

    await getReport(page, url)

    if(lh) {
      const flags = {
        // accessibility, best-practices, performance, pwa, seo
        // default if none provided: performance
        // this flag will ovveride the default i.e. include performance in addition to other categories
        onlyCategories: ['performance', 'accessibility']
      }
      getLighthouseReport(reports, url, lighthouse, chromeLauncher, flags)
    }
  } catch(e) {
    console.log('\x1b[33m', e.message)
  } finally {
    await browser.close()
  }
})()
