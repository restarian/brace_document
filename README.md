# Brace Document 
## Synopsis 

[![Build status](https://ci.appveyor.com/api/projects/status/bdfpmn5gt2ffj626/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-document/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_document.svg?branch=master)](https://travis-ci.org/restarian/brace_document) [![Downloads](https://img.shields.io/npm/dm/brace_document.svg?svg=true)](https://npmjs.org/package/brace_document)

| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 

----
### Document pages
* **Synopsis**
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/code_of_conduct.md)
* [Making a difference with brace document ](https://github.com/restarian/brace_document/blob/master/docs/contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license.md)
  * [Project specification data](https://github.com/restarian/brace_document/blob/master/docs/specification/specification.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins.md)
  * [Creating plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_plugins.md)
* Using brace document
  * [Using the program script](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/module_import_usage.md)

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

Brace document serves as a platform to generate/modify document pages. It creates and stores a structure object which is representative of the document pages hierarchy. It also creates a data object which contains the individual document meta data and text content of all of the found documents. The structure and data objects are then passed to any available plugins found to be further modified.

### Idempotent versatility
All of the commands within the Brace document API are idempotent so that any of the plugins can call any of the module API members to generate different results. For example: the *document_parse.createStructure* ALI member can be called again in any of the plugins using the optional directory argument to create another a copy of the documents directory structure.

