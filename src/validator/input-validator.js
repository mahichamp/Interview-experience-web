class InputValidator {


    // REQUIRED validation
    validateRequired(value){
        const errors = []
        if(value === null || value === ""){
            errors.push("Field is Required")
        }
        return errors
    }


    // Email Verification
    validateEmail(value){

        const errors = []
        // eslint-disable-next-line
        const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
        const result = validEmailRegex.test(value)
        if(!result || result == null || result === [] || result.length < 0 ){
            errors.push("Invalid Email")
        }
        return errors
    }

    //Validate password
    valdatePassword(value, options){

        const errors = []
        let minLimit = 8
        let maxLimit = 10

        if(options){
           if(options.max)
                maxLimit = options.max
            if(options.min)
                minLimit = options.min 
        }

        if(value.length < minLimit)
        errors.push("Password too short")
        if(value.length > maxLimit)
        errors.push("Password should not exceed "+maxLimit+" characters")
        return errors
    }

}

module.exports = InputValidator