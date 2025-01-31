export const format = number => {
  return (number).toLocaleString('en-GB', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  })
}

export const parseArgs = ({args}) => {
  const argOptions = {
      verboseArgs: ['-v', '--verbose'],
      urlArgs: ['-u', '--url'],
      lighthouseArgs: ['-lh', '--lighthouse'],
  }

  const { verboseArgs, urlArgs, lighthouseArgs } = argOptions
  
  let url, verbose, lh = false

  const argLength = args.length
  
  for (let i = 0; i < argLength; i++) {
      const val = args[i]
      const nextArg = i + 1 < argLength ? args[i + 1] : null

      if (verboseArgs.includes(val)) {
          verbose = true
      }

      if (nextArg) {
          if (urlArgs.includes(val)) {
              url = nextArg.includes('http') ? nextArg : `https://${nextArg}`
          }
      }

      if(lighthouseArgs.includes(val)) {
        lh = true
      }      
  }

  return { url, verbose, lh }
}

export const getLighthouseReport = async (reports, url, lighthouse, chromeLauncher, flags) => {    
  const lhReport = await reports.lighthouse(
    url,
    lighthouse,
    chromeLauncher,
    flags,
  )

  const summary = lhReport.summary

  console.log('Lighthouse report:')
  console.log('Transfer size: ', `${format(summary.totalResourceTransferSize)} Kbs`)
  console.log('Total byte weight: ', `${format(summary.totalByteWeight)} Kbs`)
  console.log('Request count: ', `${summary.requestCount}`)
  console.log('DOM count: ', `${summary.DOMSize}`)
}
