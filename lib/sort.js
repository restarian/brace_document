if (typeof define !== 'function') { var define = require('amdefine')(module) }

var path = require("path")

define([], function() {
	// This module returns function which are compliant with the Array.prototype.sort method. It works on the structure object array created in
	// the document_parse.aquire_structure member. The array.sort method is called independently for every directory array in the structure as well
	// making it necessary for the functions to also handle objects which then contain an array and so on. Each function needs to have a counter-part
	// which sorts in reverse with "reverse_" prepended to it.
	
	return {

		alphanumeric: function(a, b) {

			var alpha_check = function(s1, s2) {

				var ch1, ch2, s1a, s2a

				if ( typeof s1 === "object" )
					s1a = Object.keys(s1)[0]
				else
					s1a = path.basename(s1)

				if ( typeof s2 === "object" )
					s2a = Object.keys(s2)[0]
				else
					s2a = path.basename(s2)
				
				ch1 = s1a.charAt(0)
				ch2 = s2a.charAt(0)

				if ( ch1 > ch2 )
					return 1
				else if ( ch1 < ch2 )
					return -1
				else if ( !ch1.length || !ch2.length )
					return 0
				else //if ( ch1 === ch2 )
					return alpha_check(s1a.substr(1), s2a.substr(1))
			}

			return alpha_check(a,b)
		},
		reverse_alphanumeric: function(a, b) {

			var alpha_check = function(s1, s2) {

				var ch1, ch2, s1a, s2a

				if ( typeof s1 === "object" )
					s1a = Object.keys(s1)[0]
				else
					s1a = path.basename(s1)

				if ( typeof s2 === "object" )
					s2a = Object.keys(s2)[0]
				else
					s2a = path.basename(s2)
				
				ch1 = s1a.charAt(0)
				ch2 = s2a.charAt(0)

				if ( ch1 > ch2 )
					return -1
				else if ( ch1 < ch2 )
					return 1
				else if ( !ch1.length || !ch2.length )
					return 0
				else //if ( ch1 === ch2 )
					return alpha_check(s1a.substr(1), s2a.substr(1))
			}

			return alpha_check(a,b)
		},
		depth: function(a, b) {

			if ( typeof a === "object" && typeof b === "object" )
				return 0
			else if ( typeof a === "object" && typeof b === "string" )
				return 1
			else if ( typeof b === "object" && typeof a === "string" )
				return -1
			else 
				return 0 
		},
		reverse_depth: function(a, b) {

			if ( typeof a === "object" && typeof b === "object" )
				return 0
			else if ( typeof a === "object" && typeof b === "string" )
				return -1
			else if ( typeof b === "object" && typeof a === "string" )
				return 1
			else 
				return 0 
		}
	}

})
