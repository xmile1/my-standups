#!/usr/bin/env node

const { addStandupUpdate, generateStandupForSlack, generateDoneForTimesheet } = require('./packages/standUp')
const { getDate } = require('./packages/util')

const getCliArgs = () => {
  const args = {}
  let lastArg = ''
  process.argv.forEach((arg, index) => {
    if (index > 1) {
      if (index % 2 === 0) {
        if (arg.startsWith('-')) {
          args[arg.slice(1)] = true
          lastArg = arg.slice(1)
        }
      } else {
        args[lastArg] = arg
        lastArg = ''
      }
    }
  })
  return args
}

const start = () => {
  const args = getCliArgs()
  switch (args.p) {
    case 'did': {
      const date = args.d ? getDate(args.d) : undefined
      return addStandupUpdate(args.m, args.b, args.t, date)
    }
    case 'standup': {
      const date = args.d ? getDate(args.d) : undefined
      return generateStandupForSlack(date)
    }
    case 'timesheet': {
      const date = args.d ? getDate(args.d) : undefined
      return generateDoneForTimesheet(date)
    }
  }
}

start()
