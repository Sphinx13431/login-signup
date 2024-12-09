function validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected regex
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Email Validation
    if (values.name === "") {
        error.name= "Name should not be empty";
    } // Fixed key from `name` to `email`
    else{
        error.name = "";
    }
    
    if (values.email === "") {
        error.email = "Email should not be empty"; // Fixed key from `name` to `email`
    } else if (!email_pattern.test(values.email)) {
        error.email = "Invalid email format";
    } else {
        error.email = "";
    }

    // Password Validation
    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a digit.";
    } else {
        error.password = "";
    }

    return error;
}

export default validation;
