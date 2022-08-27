console.clear()
//
// Compile subs projects!
const ProjectWrapper = require('tsc-compile-projects')
const Events = require('tsc-compile-projects/src/events').Event
const devMode = true
const projects = [
  {
    'name': 'base',
    'projectDir': './packages/base',
    'watchMode': devMode,
    'args': []
  },
  {
    'name': 'models',
    'projectDir': './packages/models',
    'watchMode': devMode,
    'args': []
  },
  {
    'name': 'rest',
    'projectDir': './packages/rest',
    'watchMode': devMode,
    'args': []
  },
  {
    'name': 'utils',
    'projectDir': './packages/utils',
    'watchMode': devMode,
    'args': []
  },
  {
    'name': 'websocket',
    'projectDir': './packages/websocket',
    'watchMode': devMode,
    'args': []
  }
]

console.log('Starting for compile packages!')
if (devMode) {
  console.log(`Loading ${projects.length} packages...`)
} else {
  console.log(`Compiling ${projects.length} packages...`)
}

class Wrapper {
  static runner() {
    const building = ProjectWrapper.initializeDefault({
      hotReload: devMode,
      command: [],
      lowCpuUsage: false,
      targets: projects
    })

    building.then((buildBase) => {
      buildBase.on('endCompile', () => {
        console.log(`\n\n\n\n  >  :@uranusjs/typescript has been compiled successfully!`)
      })
      process.stdin.on('data', (msg) => {
        const message = msg.toString('utf-8')
        if (message.startsWith(':clear')) {
          console.clear()
        }
        if (message.startsWith(':usage')) {
          console.log(process.cpuUsage())
          console.log(process.resourceUsage())
          console.log(process.memoryUsage())
        }

        if (message.startsWith(':projectWrapperSrc')) {
          console.log(buildBase)
        }
       })

      buildBase.interpreter.on('debugData', ({ eventName, interpreter, parse }) => {
        switch (eventName) {
          case Events.STARTING_COMPILATION:
            console.log(` > Typescript  ::Compiling -> ${interpreter.projectName}`)
            break
          case Events.ERROR_TS:
            console.log(`  | Typescript::${interpreter.projectName} > Error -> ${parse.metadata.messageOriginal}`)
            break
          default:

            break
        }
      })
    })
  }
}


// Building projects!
Wrapper.runner()