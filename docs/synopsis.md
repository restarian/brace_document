## Synopsis

[![Build status](https://ci.appveyor.com/api/projects/status/bdfpmn5gt2ffj626/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-document/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_document.svg?branch=master)](https://travis-ci.org/restarian/brace_document) [![Downloads](https://img.shields.io/npm/dm/brace_document.svg?svg=true)](https://npmjs.org/package/brace_document)

| **The [Brace Suite]** | **[Ubuntu on Windows]**   |
|:---------------------:|:-------------------------:|
| ![Brace logo]         | ![Ubuntu on Windows logo] |         |

[Brace Suite]: https://github.com/restarian/restarian/tree/master/brace/
[Ubuntu on Windows]: https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6?activetab=pivot%3aoverviewtab 

[Ubuntu on Windows logo]: https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png
[Brace logo]: https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png

---
### Brace document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* **Synopsis**
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and accociated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_callback_and_accociated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

**Bonuses:**
* A beautiful showpiece of **fully asynchronous** non-blocking system program 
* A versatile and idempotent API design runs safely from anywhere on the system
* Uses extensible design which incorporates the module system to create a plugin platform
* Operates as a program from the command line or an import script
* Uses AMD (*asynchronous module definition*), syntax
* Well commented, thoroughly unit tested and professionally engineered
* Tested for Linux and/or Windows environments

**Caveats:**
* Only works with git repositories
* Requires nodejs version 6 or greater 

### What it is 
##### Brace document serves as a platform to generate/modify document pages without using special syntax. 
It does this by creating a structure object which is representative of the document pages hierarchy. It also creates a data object which contains the individual document page content and meta data. These objects (*structure* and *data*), are then passed to available plugins to be modified before returning back to be used with writing out the new document pages.

### Idempotent 
##### The API can be safely used redundantly.
Lets face facts here: plugins may need to re-call API members in order to effectively contribute to the program. Never fear, the API is designed to be repeatedly called without concern of the program final outcome. 

### Versatility
##### All of the API members within the Brace document can be called any of the module API members to generate different results. 
For example: *document_parse.createStructure* can be called again in any of the plugin calls with the optional directory parameter to create a copy of the documents directory structure without altering the initial outcome expectations of the program run through.

### Brace document eats its own dog food.
##### The vast possibilities of a pragmatic platform are displayed right here.
The *package.json* scripts field contains a *make_docs* entry which processes these very documents. Simply use *npm run make_docs -- -v** after any modifications are made within the *docs_raw* directory.

