## Using the program script from the command line

----
### Brace document
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package specification](https://github.com/restarian/brace_document/blob/master/docs/specification/package_specification.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [Creating additional plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins.md)
* Using brace document
  * **Command line usage**
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

----

The program is ran by invoking the script *./bin/document.js* via nodejs and passing in the desired handling options. Below are some examples of this.
*:>* ```node path/to/bin/document.js [options]``` or if installed globally: ```brace_document [options]```

Note: *the *bin/script_entry.js file is used to create the docs for this program.* It is invoked like the following: *:>* ```npm run make_document -- [options]```

This program requires a git repository to operate with as the project root location. This is determined by asking git what the top level directory is. All paths will then be relative to that project root directory. The process shell current working directory is used to find the git repositry when ran from the command line. This can be set to another value at runtime by passing in the desired working directory to the *findPath* member or by setting the *projectLocation* option via the cli or the *module.option* object from an import.

#### All of the available plugins will have their option data appended to the CLI before it is parsed. 
This way the help menu will contain all of the usage and option data from all available plugins.
Note: *the --plugins option will show all available plugins and exit.*

#### The full list of available options can be read using the *-h* flag within the CLI which will include all of the available plugins option data.
The command line script will exit early under certain circumstances: when the *-h* option is supplied, when the *--plugins* flag is supplied or if bad option parameters are passed in via the command line. All other commands will result in program execution.

**Important**: If the *input* parameter of from cli (*which is the documents base directory*), is set to a path outside of the project root, then the *backup* option must be set to a directory which is inside of the project root. It is necessary for at least one of these paths to be within the project so that urls can be created from the relative location. The program will exit early and a message is returned to ensure that this is always the case.

