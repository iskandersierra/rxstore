# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/iskandersierra/rxstore/compare/v1.0.0...v1.1.0) (2016-10-20)


### Features

* **actionCreator:** Added for making easier defining custom actions ([e9dee8c](https://github.com/iskandersierra/rxstore/commit/e9dee8c))
* **reassign:** Added utility functions reassign and reassignif ([fcaef79](https://github.com/iskandersierra/rxstore/commit/fcaef79))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/iskandersierra/rxstore/compare/v0.1.0...v1.0.0) (2016-10-20)


### Bug Fixes

* **config:** Added rxjs 5 as devDep as well ([70758e4](https://github.com/iskandersierra/rxstore/commit/70758e4))
* **config:** rxjs 5.0 as peer dependency ([ac283dd](https://github.com/iskandersierra/rxstore/commit/ac283dd))
* **consoleLogUpdatesEffect:** Has been removed ([99c3eab](https://github.com/iskandersierra/rxstore/commit/99c3eab))
* **createStore:** Now can add many effects and extenders to store options ([168f638](https://github.com/iskandersierra/rxstore/commit/168f638))
* **effects:** Effects cannot be cancelled explicitly ([dfd061c](https://github.com/iskandersierra/rxstore/commit/dfd061c))
* **store:** Removed getState ([02679dd](https://github.com/iskandersierra/rxstore/commit/02679dd))


### Features

* **createStore:** Added easy action tunneling ([43e12f4](https://github.com/iskandersierra/rxstore/commit/43e12f4))
* **createStore:** Adding store middlewares ([f6a96ae](https://github.com/iskandersierra/rxstore/commit/f6a96ae))
* **createStore:** Now can receive an effects function ([c553d0f](https://github.com/iskandersierra/rxstore/commit/c553d0f))


### BREAKING CHANGES

* createStore: createStore no longer accepts options, but just a collection of middlewares



<a name="0.1.0"></a>
# 0.1.0 (2016-10-18)


### Bug Fixes

* **config:** Let on webpack.config ([a5b8a0a](https://github.com/iskandersierra/rxstore/commit/a5b8a0a))


### Features

* **createStore:** Adding code and tests ([df83696](https://github.com/iskandersierra/rxstore/commit/df83696))


