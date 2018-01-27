if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function() {
	
	return {

		alphanumeric: function(a,b) {

			var alpha_check = function(s1, s2) {

				var ch1, ch2 

				if ( typeof s1 === "object" ) 
					ch1 = Object.keys(s1)[0]	
				else
					ch1 = s1.charAt(0)

				if ( typeof s2 === "object" ) 
					ch2 = Object.keys(s2)[0]	
				else
					ch2 = s2.charAt(0)

				if ( ch1 < ch2 )
					return -1
				else if ( ch1 > ch2 )
					return 1
				else if ( !ch1.length || !ch2.length )
					return 0
				else //if ( ch1 === ch2 )
					return alpha_check(s1.substr(1), s2.substr(1))
			}

			return alpha_check(a,b)

		},
		reverse_alphanumeric: function(a,b) {

			var alpha_check = function(s1, s2) {

				var ch1, ch2 

				if ( typeof s1 === "object" ) 
					ch1 = Object.keys(s1)[0]	
				else
					ch1 = s1.charAt(0)

				if ( typeof s2 === "object" ) 
					ch2 = Object.keys(s2)[0]	
				else
					ch2 = s2.charAt(0)

				if ( ch1 > ch2 )
					return -1
				else if ( ch1 < ch2 )
					return 1
				else if ( !ch1.length || !ch2.length )
					return 0
				else //if ( ch1 === ch2 )
					return alpha_check(s1.substr(1), s2.substr(1))
			}

			return alpha_check(a,b)
		},
		depth: function(a,b) {

			if ( typeof a === "object" )
				return -1
			else 
				return 0 
		},
		reverse_depth: function(a,b) {


			if ( typeof a === "object" )
				return 1
			else 
				return 0 
				
		}
	}

})
