# XComponent

XComponent is a platform to easily create, monitor and share **microservices**. To get more details about XComponent, go to [the resource center](https://github.com/xcomponent/xcomponent).

This extension makes it easy to work with [XComponent](http://www.xcomponent.com/) projects. It includes the following features:
* Component preview
* Composition preview
* Snippets
* Intellisense
* XCSpy web application

More features yet to come...

## Requirements

If you want to start XCSpy web from visual studio code, you need to install nodejs and serve locally.

* serve (npm install -g serve)

## VS Code XComponent Snippets

Following below the available snippets
---

| Command         | Description |
| :----------     | :---------- |
| `xcstate`       | Create a state |
| `xctriggeredmethod`  | Create a triggered method |
| `xctransition`  | Create a standard transition |
| `xctimeouttransition`  | Create a timeout transition |
| `xcxtransition`  | Create a X transition |
| `xcstatemachine`  | Create a state machine |
| `xctriggerable`  | Create a triggerable transversal transition |
| `xcinternal`  | Create an internal transition |

## Component Edit

### Add a new state

Use the `xcstate` snippet in a cxml file. The intellisense helps you fill in the state attributes. 

![add a new state](https://raw.githubusercontent.com/xcomponent/vscode-xcomponent/master/extension/images/create_state.gif)

### Graphical preview

To display a component *.cxml file, use the *"XComponent: Preview Component"* command.

![component preview](https://raw.githubusercontent.com/xcomponent/vscode-xcomponent/master/extension/images/cxml_preview.gif)

## Composition Edit

### Graphical preview

To display a composition *.xcml file, use the *"XComponent: Preview Composition"* command.

## Project build

To build a xcomponent project, use the *"XComponent: Build project"* command.
Don't forget to specify xcbuild.exe path in vscode settings. Otherwise, xcbuild.exe specified in the environnement path will be used.
Also, don't forget to specify mono facades path in vscode settings when working on linux or macOs environnement.

## XCSpy Web

To start the XCSpy web application, use the *"XComponent: Launch Spy Web" command.

## Feedback & Contributing

 * This is a relatively **new** extension, _so_ there will likely still be a few "rough edges"\.
 * Please report any bugs, suggestions or documentation requests via the [Github issues](https://github.com/xcomponent/vscode-xcomponent/issues).
 * Feel free to submit [pull requests](https://github.com/xcomponent/vscode-xcomponent/pulls).

 ## Source

[GitHub](https://github.com/xcomponent/vscode-xcomponent)
                
## License

[Apache License 2.0](https://raw.githubusercontent.com/xcomponent/vscode-xcomponent/master/LICENSE)


