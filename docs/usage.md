# Brace Document
## Using the program script 

----
### Brace document
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/README.md)
* [Making a difference with Brace document??](https://github.com/restarian/brace_document/blob/master/docs/contributing.md)
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/code_of_conduct.md)
* **Using the program script**
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license.md)

----

```bash :> node ./bin/document.js [option] [directory]``` or if set up globally: ```document [option] [directory]```

This program requires a git repository to operate with. The project root is determined by asking git what the top level directory is. The command line program should be started from within a git repository as all paths will then be relative to the project root (top level). The process shell current working directory is used to find the git repositry when ran from the command line. This can be set to another value at run-time by passing in the desired working directory to the *findPath* member.

All document options are available via the command line script or by setting them directly to the document_parser script (except the *help*, *version* and *plugins* options). The names of the options have the hyphens replaced with underscores when setti them to the module itself.

#### Below is an example of how to set option data directly to the document_parse module:
```javascript
// Note: The bracket print module instance parameter is optional as it is also loaded automatically if not included.
var parser = document_parse([Bracket print])

// Notice that the hyphen was replaced with a underscore in all of these
parser.recursive = true
parser.sort = "depth" 
parser.reverse_sort = true
// This can be outside the project root as long as relative_docs dir is not.
parser.backup = ../../docs 
// The value set when the program is started from the command line will be set to the directory inputted as the manditory last parameter of the command.
// It is fine to use absolute paths when setting this value even though it is named with the word relative. This directory can be outside the project root as 
// long as the backup is set to a path within the project. The *project_root* value will be used if this is not set when calling the api programically. 
parser.relative_docs_dir = docs_raw
```

#### The full list of available options.
* -V, --version
	* output the version number
* -v, --verbose                     
	* Print any superfluous information from the run-time.
* -s, --sort <alphanumeric, depth>
	* alphanumeric: The links will be arranged for navigation links list in alphanumeric order. depth: All of the sub-directories and links will be arranged at the top of the directory list. Note: the structure will be presorted in alphanumeric regardless of the reverse-sort flag when the sort option is set to *depth*.
* -R, --reverse-sort                
	* Reverse the sorting operation specified via the --sort option.
* -p, --plugins
	* Print all of the available plugins 
* -b, --backup <directory>
	* This will create separate files and directories for the mutations and keep the originals intact. The directory path must be contained within the project repository so that proper links can be created relative to it.
* -h, --help
	* Output program usage information

**Important**: If the last parameter of the cli (or the *relative_docs_dir* property), is set to a path outside of the project root then the backup option must be set to a directory which is inside of the project root. It is necessary for at least one of these paths to be within the project so that urls can be created. A message is return at run-time to ensure it is always the case.

