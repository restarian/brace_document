## Using the program script from the command line

---
### Brace document

The program is ran by invoking the script *./bin/document.js* via nodejs and passing in the desired handling options. Below are some examples of this.
*:>* ```node path/to/bin/document.js [options]``` or if installed globally: ```brace_document [options]```

This program requires a git repository to operate with as the project root location. This is determined by asking git what the top level directory is. All paths will then be relative to that project root directory. The process shell current working directory is used to find the git repositry when ran from the command line. This can be set to another value at runtime by passing in the desired working directory to the *findPath* member or by setting the *projectLocation* option via the cli or the *module.option* object from an import.

#### All of the available plugins will have their option data appended to the CLI before it is parsed. 
This way the help menu will contain all of the usage and option data from all available plugins.
Note: the *--plugins* option will show all available plugins and exit the program early.

#### The full list of available options can be read using the *-h* flag within the CLI which will include all of the available plugins option data.
The command line script will exit early under certain circumstances: when the *-h* option is supplied, when the *--plugins* flag is supplied or if bad option parameters are passed in via the command line. All other commands will result in program execution.

**Important**: If the *input* parameter of from cli (*which is the documents base directory*), is set to a path outside of the project root, then the *backup* option must be set to a directory which is inside of the project root. It is necessary for at least one of these paths to be within the project so that urls can be created from the relative location. The program will exit early and a message is returned to ensure that this is always the case.

