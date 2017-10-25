[![](http://slack.xcomponent.com/badge.svg)](http://slack.xcomponent.com/)
[![](https://vsmarketplacebadge.apphb.com/version/xcomponent.xcomponent.svg)](https://marketplace.visualstudio.com/items?itemName=XComponent.xcomponent)
[![Build Status](https://travis-ci.org/xcomponent/vscode-xcomponent.svg?branch=master)](https://travis-ci.org/xcomponent/vscode-xcomponent)

# Visual Studio Code extension for [XComponent](http://www.xcomponent.com/)

XComponent is a platform to easily create, monitor and share **microservices**. To get more details about XComponent, go to [the resource center](https://github.com/xcomponent/xcomponent).

This extension makes it easy to work with [XComponent](http://www.xcomponent.com/) projects. It includes the following features:
* Component preview
* Composition preview
* Snippets
* Intellisense
* Build a xcomponent project
* Launch a websocket bridge
* Launch a xcomponent runtime
* XCSpy web application

More features yet to come...

## [Getting started](https://github.com/xcomponent/vscode-xcomponent/blob/master/extension/README.md)

## Development

First install:
* Node.js (newer than 8.0)
* Yarn
* serve (npm install -g serve)

To **run and develop** do the following:

* Run `yarn install`
* Run `yarn run compile`
* Open in Visual Studio Code (`code ./extension/.`)
* Press <kbd>F5</kbd> to debug

> If you want to install your gojs license, compile with the following command:
> `yarn run compile --define process.env.GOJS_KEY=\"my license key\"`

To **test** do the following: `yarn run test` or <kbd>F5</kbd> in VS Code with the "Launch Tests" debug configuration.

## Feedback & Contributing

 * This is a relatively **new** extension, _so_ there will likely still be a few "rough edges"\.
 * Please report any bugs, suggestions or documentation requests via the [Github issues](https://github.com/xcomponent/vscode-xcomponent/issues).
 * Feel free to submit [pull requests](https://github.com/xcomponent/vscode-xcomponent/pulls).
                
## License

[Apache License 2.0](https://raw.githubusercontent.com/xcomponent/vscode-xcomponent/master/LICENSE)