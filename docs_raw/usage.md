# Brace Document
## Using the program script 

----
### Brace document

----

```bash :> node ./bin/document.js [option] [directory]``` or if set up globally: ```document [option] [directory]```

This program requires a git repository to operate with. The project root is found by asking git where the top level is. The program can be ran anywhere within a git repository as all paths will be relative to the top level (project root). The process shell current working directory is used to find the git repositrywhen ran from the command line. This can be set to another value at run-time by passing in the desired working directory to the *findPath* member.

All document options are available via the command line script or by setting them directly to the document_parser script (except the *help*, *version* and *plugins* options). The names of the options have the hyphens replaced with underscores when setti them to the module itself.

#### Below is an example of how to set option data directly to the document_parse module:
```javascript
// Note: The bracket print module is optional.
var parser = document_parse([Bracket print])

// Notice that the hyphen was replaced with a underscore in all of these
parser.recursive = true
parser.sort = "depth" 
parser.reverse_sort = true
// This can be outside the project root as long as relative_docs dir is not.
parser.backup = ../../docs 
// This is the only non-optional parser option. The value when ran from the commond line is set to the directory inputted as the manditory last parameter.
// It is fine to use absolute paths when setting this value even though it is named with the word relative. This can be outside the project root as 
// long as the backup is set to a path within the project.
parser.relative_docs_dir = docs_raw
```

#### The full list of available options.
* -V, --version
	* output the version number
* -v, --verbose                     
	* Print any superfluous information from the run-time.
* -s, --sort <alphanumeric, depth>
	* alphanumeric: The links will be arranged for navigation links list in alphanumeric order. depth: All of the sub-directories and links will be arranged at the top of the directory list.
* -R, --reverse-sort                
	* Reverse the sorting operation specified via the --sort option.
* -p, --plugins
	* Print all of the available plugins 
* -b, --backup <directory>
	* This will create separate files and directories for the mutations and keep the originals intact. The directory path must be contained within the project repository so that proper links can be created relative to it.
* -h, --help
	* Output program usage information

**Important**: If the last parameter of the cli (or the *relative_docs_dir* property), is set to a path outside of the project root then the backup option must be set to a directory which is inside of the project root. It is necessary for at least one of these paths to be within the project so that urls can be created. A message is return at run-time to ensure it is always the case.

