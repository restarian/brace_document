# Brace Document 
## Synopsis 

[![Build status](https://ci.appveyor.com/api/projects/status/bdfpmn5gt2ffj626/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-document/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_document.svg?branch=master)](https://travis-ci.org/restarian/brace_document) [![Downloads](https://img.shields.io/npm/dm/brace_document.svg?svg=true)](https://npmjs.org/package/brace_document)

| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 

----
### Document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guilines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guilines_for_contributing.md)
* **Synopsis**
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
* The plugin system
  ,  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/specification/the_plugin_system/allocating_plugins_on_the_system.md)
  ,  * [Creating additional plugins](https://github.com/restarian/brace_document/blob/master/docs/specification/the_plugin_system/creating_additional_plugins.md)
* Using brace document
  ,  ,  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/specification/the_plugin_system/using_brace_document/command_line_usage.md)
  ,  ,  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/specification/the_plugin_system/using_brace_document/using_the_module_directly.md)

----

**Author: Robert Steckroth, _Bust0ut_ [<RobertSteckroth@gmail.com>](mailto:robertsteckroth@gmail.com)**

**License: MIT**

**Bonuses:**
* A beautiful showpiece of fully asynchronous non-blocking run-time program/script.
* A versatile and idempotent API design runs safely from anywhere on the system.
* Uses a extensible design which incorporates the commonjs system to create a plugin platform.
* Operates as a system program from the command line or an import module script.
* Uses AMD (asynchronous module definition), syntax.
* Tested in Linux and/or Windows environments.
* Well commented, thoroughly unit tested and professional code

**Caveats:**
* Only works with git repositories.

### What it is 
Brace document serves as a platform to generate/modify document pages. It creates and stores a structure object which is representative of the document pages hierarchy. It also creates a data object which contains the individual document content and meta data of all the documents. These structure and data objects are then passed to the available plugins which are found in the system to be further modified before written back to a directory.

### Idempotent versatility
All of the commands within the Brace document API are idempotent so that any of the plugins can call any of the module API members to generate different results. For example: the *document_parse.createStructure* ALI member can be called again in any of the plugins using the optional directory parameter to create another a copy of the documents directory structure. 

### Brace Document helped create its own documents!
The *package.json* scripts entry *make_document* contains the command call configuration which creates these very documentations. Go and visit the specifications pages which contains a markdown generated page of the *package.json* file that was **generated by this program**.

### The possibilities are endless..
