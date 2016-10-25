# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.4.0"></a>
# [1.4.0](https://github.com/iskandersierra/rxstore/compare/v1.1.0...v1.4.0) (2016-10-25)


### Bug Fixes

* **actionCreator:** Renamed ActionInstance for ActionDescription ([601bbac](https://github.com/iskandersierra/rxstore/commit/601bbac))
* **author:** Updated author on package.json ([fcf4a15](https://github.com/iskandersierra/rxstore/commit/fcf4a15))
* **createEffects:** Removed, use extendWith instead ([8b734b1](https://github.com/iskandersierra/rxstore/commit/8b734b1))
* **createStore:** Dispatch INIT on store creation ([9d76fd1](https://github.com/iskandersierra/rxstore/commit/9d76fd1))
* **defineStore:** Was not included in index.ts ([53b0f44](https://github.com/iskandersierra/rxstore/commit/53b0f44))
* **extendWithActions:** Had the wrong result type ([c15bf92](https://github.com/iskandersierra/rxstore/commit/c15bf92))
* **interface:** Removed all default exports ([0fd8d42](https://github.com/iskandersierra/rxstore/commit/0fd8d42))
* **logEffects:** Removed log effects helpers ([d55cec9](https://github.com/iskandersierra/rxstore/commit/d55cec9))
* **startEffects:** Was trying to dispatch out of queue ([19022e2](https://github.com/iskandersierra/rxstore/commit/19022e2))
* **Store:** Added finish method to send a FINISH action ([1d59e54](https://github.com/iskandersierra/rxstore/commit/1d59e54))
* **tslint:** Fix some ts styling ([97e33d3](https://github.com/iskandersierra/rxstore/commit/97e33d3))


### Features

* **actionCreator:** actions are now also functions for creating instances ([05e5456](https://github.com/iskandersierra/rxstore/commit/05e5456))
* **createStore:** Added func applyMiddlewares ([8e78e5b](https://github.com/iskandersierra/rxstore/commit/8e78e5b))
* **defineStore:** Added to make easier store creation ([b41c361](https://github.com/iskandersierra/rxstore/commit/b41c361))
* **tunnelActions:** Now can receive a dispatch stream instead of just a dispatch ([8be6dde](https://github.com/iskandersierra/rxstore/commit/8be6dde))



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


