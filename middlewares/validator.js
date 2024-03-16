import validator from "validator";
import sanitizeHtml from "sanitize-html";

let inputValidator = (input) => {
    try{
        // Sanitize HTML input first
        let sanitizedInput = sanitizeHtml(input, {
            allowedTags: [], // Allow no tags
            allowedAttributes: {} // Allow no attributes
        });
        
        // Validate the sanitized input
        let validatedInput = validator.escape(sanitizedInput);
        
        return validatedInput
    } catch(e) {
        // For debugging
        console.error("Error in inputValidator: ", error);
        
        // Throwing an error to be handled by the calling function
        throw new Error("Input validation failed");
    }
}

export default inputValidator;