# Brace Document
## Using the program from the command line

---
### Brace Document help pages
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributor_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and associated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_callback_and_associated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * **Command line usage**
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

The program is ran from the command line by invoking the script *./bin/document.js* via nodejs and passing in the desired handling options.

Below are three examples invoking Brace Document via the command line:

```:> npm run brace_document [options]```

or

```:> node path/to/brace_document/bin/document.js [options]```

or if installed globally with a system path entry to the npm bin --global path:

```:> brace_document [options]```

Note: The *package.json* scripts field contains a *make_docs* entry which processes these very documents. Simply use *npm run make_docs* after any modifications are made within the *docs_raw* directory.

The program exits with code **0** after a successful run through. A code value **1** is returned when a bad option is specified while using a commander instance or the document.js bin script.

#### This program requires a git repository to operate with as the project location.
This is determined by asking git what its top level directory is. All paths used within the platform will then be relative to that project location directory. The shell process working directory is used as the default value when locating a git repository to establish a project location. It can be set to another value at run-time by passing in the desired project location to the *findPath* API member or by setting the *projectLocation* option via the cli or to a imported module as option data.

### All of the available plugins will have its option data appended to the CLI before it is parsed.
This is how the help menu contains all of the usage and option data from all available plugins before any of them are called.
Note: the *--plugins* option will show all available plugins and exit the program early.

### The full list of available options can be read using the *-h* flag
The outputted help screen will include all the option data found in all the available plugins.

### The command line script will exit early under certain circumstances
When the *-h* option is supplied, when the *--plugins* flag is supplied or if bad option parameters are passed in via the command line. All other commands will result in full program execution.

**Important**: If the *input* option value  (*which is the documents base directory*), is set to a path outside of the project location, then the *backup* option must be set to a directory which is inside of the project location. It is necessary for at least one of these paths to be within the project so that urls can be created from the relative location. The program will exit early and a message is returned to ensure that this is always the case.
