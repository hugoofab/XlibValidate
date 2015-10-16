/**
 *	WRITEN BY HUGO FERREIRA
 *	http://webapp.house
 *	hugoofab@gmail.com
 *	10-2015
 * 
 *  ------------------------------------------------------------------------------------
 *  HOW TO USE:
 *  
 *  <script language="javascript" src="xlibvalidate.js"></script>
 *	var validateForm = new XlibValidate ( "YOUR-FORM-ID" );
 *
 *  ------------------------------------------------------------------------------------
 *  HOW TO VALIDATE A FIELD:
 *  
 *  <input type="text" xvalidate-rules="RULES" />
 *
 *  ------------------------------------------------------------------------------------
 *  HOW TO CUSTOMIZE A METHOD:
 *  
 *	validateForm.setFormState = function ( formState ) {
 *		if ( !formState ) {
 *			document.getElementById('my-div-error-message').style.display = "block";
 *		} else {
 *			document.getElementById('my-div-error-message').style.display = "none";
 *		}
 *	}
 *
 *	------------------------------------------------------------------------------------
 *	ATTRIBUTES SETTINGS:
 *	attributes can be combined as you used to do in html
 *	
 *	- xvalidate-rules 		every rule associated with field separated by space.
 *
 *  ------------------------------------------------------------------------------------
 * 	RULES YOU CAN USE IN YOUR FIELDS:
 * 	rules can be combined in group separated by a space
 *
 *  |=========================[ WORKING ]
 *  - not-empty 			field can't be empty. must be filled with any value.
 *  - number				just numbers (accept empty)
 *
 *  |=================[ BETA/INCOMPLETE ]
 *  - date 					date DD/MM/YYYY by default
 *  - min-check:N 			should check at least N. field must have a name identical to others to compare
 *
 *  |===============[ TO BE IMPLEMENTED ]
 *  - max-date
 *  - min-date
 *  - max-check:N 			should check up to N. field must have a name identical to others to compare
 *  - max-length:N 			max characters
 *  - min-length:N 			min characters
 *  - min-val:N 			min value (number)
 *  - max-val:N 			max value (number)
 *  - money
 *  - time
 *  - url
 *  - email
 *  - remote
 *  - customized
 *  - equal#element-id 		equals to... (used in password confirmation)
 *  - different#element-id 	different from...
 *  - lt#element-id 		less than...
 *  - gt#element-id 		greater than...
 *  
 */

var XlibValidate = function ( formId ) {

	var $this          = this;
	var $private       = {}

	$this.form         = document.getElementById(formId);
	$this.formIsValid  = true ;
	$this.formMessage  = "";

	$this.settings = {
		'stopOnFirstError' : true,
		'localization'        : 'pt',
		'dateFormat'         : 'dd/mm/yyyy'
		// 'decimal separator'
		// 'thousand separator'
	}

	$this.defaultMessages = {
		'en':{
			'not-empty'	  : "Please fill" ,
			'number'      : "Please type just numbers" ,
			'date'        : "Please type a valid date" ,
			'min-check'   : "Please select at least %1 options" ,
			'max-check'   : "Please select up to %1 options" ,
			'past-date'   : "Please select a past date" ,
			'future-date' : "Please select a future date"
		},
		'pt':{
			'not-empty'	  : "Favor preencher" ,
			'number'      : "Digite apenas números" ,
			'date'        : "Favor digite uma data válida" ,
			'min-check'   : "Favor selecione no mínimo %1 opção" ,
			'min-checks'   : "Favor selecione no mínimo %1 opções" ,
			'max-check'   : "Favor selecione no máximo %1 opção" ,
			'max-checks'   : "Favor selecione no máximo %1 opções" ,
			'past-date'   : "Favor selecione uma data passada" ,
			'future-date' : "Favor selecione uma data futura"
		}
	}


	$this.validateForm = function () {
		
		$this.formMessage = "";
		$this.formIsValid = true ;

		for ( var i = 0 ; i < $this.form.elements.length ; i++ ) {
			if ( $this.form.elements[i].hasAttribute ( 'xvalidate-rules' ) ) {
				$this.validateField ( $this.form.elements[i] )
				if ( !$this.formIsValid && $this.settings.stopOnFirstError ) break;
			}
		}		
		
		$this.setFormState ( $this.formIsValid , $this.formMessage )

		return $this.formIsValid;

	}

	/**
	 * check field rules and apply required validation methods
	 * @param  {[type]} field [description]
	 * @return {[type]}       [description]
	 */
	$this.validateField = function ( field ) {
		
		var rules = field.getAttribute('xvalidate-rules');
		var rules = $private.trimSpaces ( rules );
		rulesList = rules.split(' ');

		for ( var rule in rulesList ) {
			if ( rulesList[rule] === "not-empty" ) {
				$this.validateEmpty(field)
			} else if ( rulesList[rule] === "number" ) {
				$this.validateNumber(field)
			} else if ( rulesList[rule] === "date" ) {
				$this.validateDate(field)
			// } else if ( rulesList[rule] === "past-date" ) {
			// 	$this.validatePastDate(field)
			// } else if ( rulesList[rule] === "future-date" ) {
			// 	$this.validateFutureDate(field)
			} else if ( /^min-check:[\d]+/.test(rulesList[rule]) ) {
				$this.validateMinCheck(field,rulesList[rule])
			} else if ( /^max-check:[\d]+/.test(rulesList[rule]) ) {
				$this.validateMaxCheck(field,rulesList[rule])
			}
			if ( !$this.formIsValid && $this.settings.stopOnFirstError ) return;
		}

	}

	$private.setError = function ( field , message ) {
		$this.formIsValid = false ;
		$this.setError(field,message);
		if ( $this.formMessage === "" ) $this.formMessage = message;
		return false ;
	}

	$private.removeError = function ( field ) {
		$this.removeError(field)
		return true ;
	}

	$private.trimSpaces = function ( input ) {
		if ( typeof input === "undefined" ) input = ""
		input = input.replace(/^\s+|\s+$/g,'');
		return input ;
	}

	$this.validateEmpty = function ( field ) {
		if ( $private.trimSpaces(field.value) === "" ) {
			return $private.setError ( field , $this.defaultMessages[$this.settings.localization]['not-empty'] );
		} else {
			return $private.removeError ( field )
		}
	}

	$this.validateNumber = function ( field ) {
		if ( /[^\d]+/.test ( $private.trimSpaces(field.value) ) ) {
			return $private.setError ( field , $this.defaultMessages[$this.settings.localization]['number'] );
		} else {
			return $private.removeError ( field );
		}
	}

	$this.validateDate = function ( field ) {

		field.value = $private.trimSpaces ( field.value );

		try {
			if ( field.value !== "" && !/^\d\d\/\d\d\/\d\d\d\d$/.test(field.value) ) throw "invalid date format"
			var splitDate = field.value.split('/');
			if ( splitDate[0] > 31 ) throw "invalid date"
			if ( splitDate[1] > 12 ) throw "invalid month"
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
			$this.removeError(field)
			return true;
		} catch ( e ) {
			console.log(e)
			$this.formIsValid = false ;
			$this.setError(field)
			if ( $this.formMessage === "" ) $this.formMessage = $this.defaultMessages[$this.settings.localization]['date'];
			return false;
		}

	}

	$this.validateMinCheck = function ( field , rule ) {

		var fieldName   = field.getAttribute('name');
		var fieldList   = [];
		var minSelected = parseInt(rule.replace(/(min-check:)(\d+)/,"$2"),10);
		var selected = 0 ;

		for ( var i = 0 ; i < $this.form.elements.length ; i++ ) {
			if ( $this.form.elements[i].getAttribute('name') === fieldName ) {
				if ( $this.form.elements[i].checked ) selected++ ;
			}
		}

		if ( selected >= minSelected ) {
			$private.removeError(field);
		} else {
			if ( minSelected > 1 ) {
				var errorMessage = $this.defaultMessages[$this.settings.localization]['min-checks'];
			} else {
				var errorMessage = $this.defaultMessages[$this.settings.localization]['min-check'];
			}
			errorMessage = errorMessage.replace(/%1/,minSelected);
			$private.setError(field,errorMessage);
		}

	}
	
	$this.validateMaxCheck = function ( field , rule ) {
				
		// TO BE IMPLEMENTED
		// TO BE IMPLEMENTED
		// TO BE IMPLEMENTED
	}

	$this.validatePastDate = function ( field ) {
		if ( !$this.validateDate(field) ) {
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
		}
	}

	$this.validateFutureDate = function ( field ) {
		if ( !$this.validateDate(field) ) {
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
			// TO BE IMPLEMENTED
		}
	}



	/**
	 * Set a field as error
	 * @param {[type]} field [description]
	 */
	$this.setError = function ( field , message ) {
		// if you don't live without jquery, you can use $(field)
		field.setAttribute('originalBorderColor',field.style.borderColor);
		field.style.borderColor = "#FF0000";
	}

	/**
	 * remove error from a field
	 * @param  {[type]} field [description]
	 * @return {[type]}       [description]
	 */
	$this.removeError = function ( field ) {
		var originalBorderColor = field.getAttribute('originalBorderColor');
		if ( !originalBorderColor ) {
			originalBorderColor = 'inherit';
		}
		field.style.borderColor = originalBorderColor;
	}

	/**
	 * change form state, is just for do a task that shoud be done just one time even you have many fields with error
	 * @param {[type]} formState [description]
	 */
	$this.setFormState = function ( formState ) {
		if ( !formState ) {
			alert("Favor verifique os dados digitados");
		}
	}

	document.getElementById(formId).onsubmit = $this.validateForm;

}
