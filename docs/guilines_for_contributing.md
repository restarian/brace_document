## Making a difference with Brace Document

---
### Document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* **Guilines for contributing**
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_information.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [Creating additional plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

### Unit Testing:

It would be nice to know that the unit tests are also working remotely. This project uses [Appveyor](https://www.appveyor.com) and [TravisCI](https://travis-ci.org) which are free for open source projects.

Unit tests are the nuts and bolts of javascript engineering. The entire API has corresponding unit tests and it needs to stay that way. It is not terrible important if you have your own style of unit tests however it is convenient to copy/paste another testing file and add the specific tests. Also, comments are completely optional in the unit tests and serve for your reminder only. 

**The rule of thumb: the unit tests themselves are important to a project, not the looks and design.**

### Only some ES6 features are used: 

**Below is a list if things you should **NOT** use from ES6:**

* The range operator *[ ...Array(10) ]*
	* tends not to work in older environments which still support ES6
	* is accomplished otherwise with minimal coding 
* The classes methodology is not used within this project. E.g. built-ins such as: *class*, *super* and *extends*.

### Always exit the program with a unique exit code integer:
**It is easier to unit test API calls which exit with a specific code.**

### IDE - If the project comes with special files which aid editors:

**None of the content in the *developers* directory should be required to load the project.* It is there to keep things like: bookmarks, command history, page marks, search history, work station environment settings, etc..**

* It is acceptable to allow your IDE to alter these files.
	* If you want your IDE config files to stay the same, then they must be created separately and kept locally.
	* Please do not smash all of the content in the project developers config files. The point is to create a better code base for the project.
	* It may be smart to have a special name for you IDE config file but keep in mind that it might be changed.
	* Development config files for your specific IDE, platform, etc.. should be placed in the *developers* directory of the project root.

Note: Older commits contain your config files if they get changed in a way you do not like.

### Syntactical practices:

**Program how you feel most comfortable. Things like hyphens, underscores, double quotes, single quotes, camel case and pluralization are all available for a good reason.**

Only a few rules are needed otherwise.

* Please use tabs for indentation.
* API qualifiers designed for the end-user should be in camel case syntax. This is pretty too. 


### Source code commenting:

**Commments make the the source code cozy and human freindly.**

* Add many comments for the code you write.
* Keep in mind that it may also be copy and pasted into a documentation file.
* The commenting of API methods is the bare minimum. At least two lines of comments should go directly beneath all API methods.
* All non-API member commenting should be placed directly above the code it references.
* It is annoying to work with comments which are placed on the same line as source code. E.g. var maker // This property is global


### Some tips you might want to consider anyways:

**These is just for informaitve purposes and is not expected for this project.**

* Pluralization is confusing. All things are more than one in programming.
* Capitalization makes some variables feel more important than others. This is exactly how "the man" wants you to be, tisk, tisk..
