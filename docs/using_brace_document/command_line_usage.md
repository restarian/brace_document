# Brace Document
## Using the program script 

----
### Brace document
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/README.md)
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/code_of_conduct.md)
* [Making a difference with brace document ](https://github.com/restarian/brace_document/blob/master/docs/contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license.md)
  * [Project specification data](https://github.com/restarian/brace_document/blob/master/docs/specification/specification.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins.md)
  * [Creating plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_plugins.md)
* Using brace document
  * **Using the program script**
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/module_import_usage.md)

----

**bash :>** ```node path/to/document.js [option] [directory]``` or if installed globally: ```make_document [option] [directory]``` or if in the brace_document directory ```npm run make_document -- [option]```

This program requires a git repository to operate with as the project root location. This is determined by asking git what the top level directory is. All paths will then be relative to that project root directory. The process shell current working directory is used to find the git repositry when ran from the command line. This can be set to another value at run-time by passing in the desired working directory to the *findPath* member or by setting the *projectRoot* option via the cli or the *module.option* object.

#### All of the available plugins will have their option data appended to the CLI before it is parsed. 

#### The full list of available options can be read using the *-h* flag within the CLI which will include all of the available plugins option data.
The command line script will exit early under certain circumstances: when the *-h* option is supplied and when the *--plugins* flag is supplied. All other commands will result in program execution.

**Important**: If the last parameter of the cli (which is the documents base directory), is set to a path outside of the project root then the *backup* option must be set to a directory which is inside of the project root. It is necessary for at least one of these paths to be within the project so that urls can be created. The program will exit early and a message is returned to ensure that this is always the case.
