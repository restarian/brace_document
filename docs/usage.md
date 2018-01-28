# Brace Navlink
### Program usage

----
### Brace navlink
* [Synopsis ](https://github.com/restarian/brace_navlink/blob/master/docs/README.md)
* **Program usage**
* Development
  * [The todo sheet ](https://github.com/restarian/brace_navlink/blob/master/docs/development/todo.md)
* Specification
  * [License information](https://github.com/restarian/brace_navlink/blob/master/docs/specification/license.md)

----

```bash :> node ./bin/navlink.js [option] [directory]```

All navlink options are available via the commond line script or by setting them directly to the document_parser script (except the *help* and *version* cli option). The names of the options have the hyphens replaced with underscores when setti them to the module itself.

#### Below is an example of how to set option data directly to the document_parse module:
```javascript
var parser = document_parse([Bracket print])

// Notice that the hyphen was replaced with a underscore in all of these
parser.title = "Navlinks"
parser.force_title = true
parser.recursive = ture
parser.sort = "depth"
parser.reverse_sort = true 
```

#### The full list of available options.
* -V, --version
	* output the version number
* -u, --url <string>
	* This is the url of the repository server. The default is to either use the git remote origin url of the current project.
* -t, --title <string>
	* The title of the navlink heading to use when one is not found. This is also used when the force title flag is set.
* -f, --force-title                 
	* The title found in the current page markdown will be used if this is not set. All of the navlink titles will be replaced with the value of the title option if it is set.
* -v, --verbose                     
	* Print any superfluous information from the run-time.
* -r, --recursive                   
	* Descend into all sub-directories to find markdown files.
* -b, --backup <directory>
	* This will create separate files and directories for the mutations and keep the originals intact. The directory path must be contained within the project repository so that proper links can be created relative to it.
* -s, --sort <alphanumeric, depth>
	* alphanumeric: The links will be arranged for navigation links list in alphanumeric order. depth: All of the sub-directories and links will be arranged at the top of the directory list.
* -R, --reverse-sort                
	* Reverse the sorting operation specified via the --sort option.
* -h, --help
	* Output program usage information
