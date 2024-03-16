import validator from "validator";
import sanitizeHtml from "sanitize-html";

const inputValidator = (input) => {
    // Sanitize HTML input first
    const sanitizedInput = sanitizeHtml(input, {
        allowedTags: [], // Allow no tags
        allowedAttributes: {} // Allow no attributes
    });

    // Validate the sanitized input
    const validatedInput = validator.escape(sanitizedInput);

    return validatedInput
}

export default inputValidator;