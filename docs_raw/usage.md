# Brace Document
## Command line/program options 

----
### Brace document

----

```bash :> node ./bin/document.js [option] [directory]```

All document options are available via the commond line script or by setting them directly to the document_parser script (except the *help* and *version* cli option). The names of the options have the hyphens replaced with underscores when setti them to the module itself.

#### Below is an example of how to set option data directly to the document_parse module:
```javascript
// the Bracket print module is optional.
var document = document_parse([Bracket print])

// Notice that the hyphen was replaced with a underscore in all of these
parser.recursive = true
```

#### The full list of available options.
* -V, --version
	* output the version number
* -u, --url <string>
	* This is the url of the repository server. The default is to either use the git remote origin url of the current project.
* -v, --verbose                     
	* Print any superfluous information from the run-time.
* -s, --sort <alphanumeric, depth>
	* alphanumeric: The links will be arranged for navigation links list in alphanumeric order. depth: All of the sub-directories and links will be arranged at the top of the directory list.
* -R, --reverse-sort                
	* Reverse the sorting operation specified via the --sort option.
* -h, --help
	* Output program usage information
