# js-umd-lib-boilerplate
A javascript module/ plugin/ library/ component building boilerplate.

## Installation
```
npm install --save js-umd-lib-boilerplate
```

Usage:
```js
import * as myModule from '../dist/js-umd-lib-boilerplate';
myModule.Init();
```

### License
Licensed under the MIT license.

### Local Development
Steps | Command | Description
---|---|---
1 | npm run setup | Installs all dependencies `node_modules` etc., that are necessary for building the project.
2 | npm run dev | Builds the code in development mode, this compiles component code and also sandbox code. All source code is watched for changes and assets are re-built. Run this in a separate terminal instance.
3 | npm run sandbox | Compiles sandbox usage code for sandbox testing the library/ module. All source code is watched for changes and assets are re-built. Run this in a separate terminal instance.
4 | npm run serve | Boots a http server of the sandbox directory. Typically on http://localhost:8080. Run this in a separate terminal instance.
5 | npm run prettier | Optional & Opinionated pretti-fying of code.
6 | npm run lint | Optional & Opinionated linting and enforcing code legiblity.
7 | npm run dist | Generate library in ./dist directory.
8 | npm run publish | Publish library/ module. Refer Usage section.
