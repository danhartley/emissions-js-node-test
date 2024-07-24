export const format = number => {
  return (number).toLocaleString('en-GB', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  })
}

export const parseArgs = ({args}) => {
  const argOptions = {
      verboseArgs: ['-v', '--verbose']
    , urlArgs: ['-u', '--url']
  }

  const { verboseArgs, urlArgs } = argOptions
  
  let url, verbose = false

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
  }

  return { url, verbose }
}
