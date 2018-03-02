## Making a difference with Brace document

---
### Brace document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* **Guidelines for contributing**
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and accociated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_callback_and_accociated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

*revision 3*

### Unit testing:

It is nice to know that the unit tests are also working remotely. This project uses [Appveyor](https://www.appveyor.com) and [TravisCI](https://travis-ci.org) which are free for open source projects. Any tests which fail the remote testing process will be considered invalid.

Unit tests are the nuts and bolts of javascript engineering. The entire API of this program has corresponding unit tests and it needs to stay that way. It is not terribly important if you have your own style of unit tests however. It is convenient to copy/paste another testing file and replace the tests with the new ones specific to the target. Also, comments are completely optional in the unit tests and serve for reminders only. 

If you do not like the way a test file is written/designed: simply create a new test. It is no big deal to have redundant tests in a project.
**The rule of thumb: unit tests themselves are important to a project, not the looks and design of them.**

### Only some ES6 features are used: 
ECMA revision six has some nice features and some which are better left other programs. The list if things you should **NOT** use from ES6 is short however.

* The range operator *[ ...Array(10) ]*
	* tends not to work in older environments which still support ES6
	* is accomplished otherwise with minimal coding 
* The *class* methodology is not used within this project. E.g. built-ins such as: *class*, *super* and *extends*.

### Always exit the program with a unique exit code integer:
It is easier to unit test API calls which exit with a specific code. 

### IDE - If the project comes with special files which aid editors:
Any config files use with your/a specific IDE, platform, etc.., should be placed in the *developers* directory of the project root (*the project root is the top level of repository*). 
**None of the content in the *developers* directory should be required to load the project.** It is there to keep things like: bookmarks, command history, page marks, search history, work station environment settings, etc..

* It is acceptable to alter (*or allow your IDE to alter*), any of the file within.
	* **Please do not needlessly smash content in the project *developers* directory. The point is to create a more convenient repository for the project.**
	* If you want your config files to remain unchanged, then they must be created separately and kept locally.
	* It may be smart to have a special name for you config files but keep in mind that they still may be changed.

Note: *older repository commits will contain the older config files if they get changed in a way you do not like and want the old ones back.*
Note: *it is fine to store developers data in the *git stash* holding place as well.* 

### Syntactical practices:
Program how you feel most comfortable. Things like hyphens, underscores, double quotes, single quotes, camel case and pluralization are all available in javascript for a good reason.

Only a few rules are needed otherwise.
* Please use only tabs for indentation (not the equivalent in spaces).
* API qualifiers designed for the end-user should be in camel case syntax.  

### Source code commenting:
Comments make the source code cozy and human friendly.

* Add many comments for/to the code you write.
* Keep in mind that comments may also be copy and pasted into a documentation file.
* The commenting of API methods is the bare minimum. At least one comment line should go directly beneath all API methods/members.
* All non-API member commenting should be placed directly above the code it references.
* It is annoying to work with comments which are placed on the same line as source code. *E.g. var maker // This property is global*

### Some tips you might want to consider anyways:
These is just for informative purposes and is not expected for this project.

* Qualifier pluralization is confusing. All things are more than one in programming.
* Capitalization makes some properties feel more important than others. This is exactly how "the man" wants you to think, tisk, tisk..
