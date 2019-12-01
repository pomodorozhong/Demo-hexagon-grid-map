# [Demo for hexagon grid map]

This is a Demo for hexagon grid map which will be used in the "Bewitch" project.

## To Build

### Build Requirement

* tsc
* browserify
* (optional) watchify

### Build Process

#### Recommended way

1. `tsc -w`
2. `watchify ./ts-built/main.js -o ./build/bundle.js`

#### The other way

1. `tsc ./src/<every_ts_file> --outDir ./ts-built/`
2. `browserify ./ts-built/main.js -o ./build/bundle.js`
