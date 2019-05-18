# express with async await

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Requirements](#requirements)
  - [Building dependencies](#building-dependencies)
- [Launch](#launch)
- [Routes](#routes)
  - [Promise style](#promise-style)
  - [Async/await style](#asyncawait-style)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- [node](http://nodejs.org/download/) >= 12.2.0
- [yarn](https://yarnpkg.com/lang/en/) >= 1.16.0

### Building dependencies

```sh
yarn install
```

## Launch

```sh
yarn start
```

for dev:

```sh
yarn dev
```

## Routes

Any promise/await have an identical output

### Promise style

- http://localhost:3000/promise/sync
- http://localhost:3000/promise/sync-error
- http://localhost:3000/promise/async/valid-param
- http://localhost:3000/promise/async/invalid-param
- http://localhost:3000/promise/custom-error/valid-param
- http://localhost:3000/promise/custom-error/invalid-param
- http://localhost:3000/promise/wrapper/valid-param
- http://localhost:3000/promise/wrapper/invalid-param

Those will kill the server

- http://localhost:3000/promise/not-wrapped/valid-param
- http://localhost:3000/promise/not-wrapped/invalid-param

### Async/await style

- http://localhost:3000/await/sync
- http://localhost:3000/await/sync-error
- http://localhost:3000/await/async/valid-param
- http://localhost:3000/await/async/invalid-param
- http://localhost:3000/await/custom-error/valid-param
- http://localhost:3000/await/custom-error/invalid-param
- http://localhost:3000/await/wrapper/valid-param
- http://localhost:3000/await/wrapper/invalid-param

Those will always fail

- http://localhost:3000/await/validation/valid-param
- http://localhost:3000/await/faulty-json/valid-param

Those will kill the server

- http://localhost:3000/await/not-wrapped/valid-param
- http://localhost:3000/await/not-wrapped/invalid-param
