//
// Compile subs projects!
const ProjectWrapper = require('tsc-compile-projects')
const Events = require('tsc-compile-projects/src/events').Event
const devMode = false
const projects = [
    {
        'name': 'models',
        'projectDir': './packages/models',
        'watchMode': devMode,
        'installPackage': true,
        'autoUpdatePackage': false,
        'args': []
    },
    {
        'name': 'rest',
        'projectDir': './packages/rest',
        'watchMode': devMode,
        'installPackage': true,
        'autoUpdatePackage': false,
        'args': []
    },
    {
        'name': 'utils',
        'projectDir': './packages/utils',
        'watchMode': devMode,
        'installPackage': true,
        'autoUpdatePackage': false,
        'args': []
    },
    {
        'name': 'websocket',
        'projectDir': './packages/websocket',
        'watchMode': devMode,
        'installPackage': true,
        'autoUpdatePackage': false,
        'args': []
    },
    {
        'name': 'base',
        'projectDir': './packages/base',
        'watchMode': devMode,
        'provider': 'yarn',
        'installPackage': true,
        'autoUpdatePackage': false,
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
            "hotReload": devMode,
            "command": [],
            "lowCpuUsage": true,
            "targets": projects
        })

        building.then((buildBase) => {
            buildBase.on('endCompile', () => {
                console.log(`\n\n\n\n  >  :@uranusjs/typescript has been compiled successfully!`)
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