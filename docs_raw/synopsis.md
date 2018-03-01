## Synopsis 

[![Build status](https://ci.appveyor.com/api/projects/status/bdfpmn5gt2ffj626/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-document/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_document.svg?branch=master)](https://travis-ci.org/restarian/brace_document) [![Downloads](https://img.shields.io/npm/dm/brace_document.svg?svg=true)](https://npmjs.org/package/brace_document)

| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 

----
### Document pages

----

**Bonuses:**
* A beautiful showpiece of **fully asynchronous** non-blocking run-time program/script
* A versatile and idempotent API design runs safely from anywhere on the system
* Uses extensible design which incorporates the module system to create a plugin platform
* Operates as a program from the command line or an import script
* Uses AMD (*asynchronous module definition*), syntax
* Well commented, thoroughly unit tested and professional code
* Tested for Linux and/or Windows environments

**Caveats:**
* Only works with git repositories
* Requires nodejs version 6 or greater 

### What it is 
##### Brace document serves as a platform to generate/modify document pages. 
It creates and stores a structure object which is representative of the document pages hierarchy. It also creates a data object which contains the individual document content and meta data of all the documents. These objects (*structure and data*), are then passed to available plugins to be modified before returning back to be used with writing the new documents out.

### Idempotent 
##### The API can be safely used redundantly.
Lets face facts here: plugins may need to re-call API members in order to effectively contribute to the program. Never fear, the API is designed to be repeatedly called without concern of the program final outcome. 

### Versatility
##### All of the API members within the Brace document can be called any of the module API members to generate different results. 
For example: *document_parse.createStructure* can be called again in any of the plugin calls with the optional directory parameter to create a copy of the documents directory structure without altering the initial outcome expectations of the program run through.

### Brace document eats its own dog food.
##### The vast possibilities of a pragmatic platform are displayed right here.
The *package.json* scripts field contains a *make_docs* entry which processes these very documents. 

