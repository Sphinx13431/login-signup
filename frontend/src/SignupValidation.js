function validation(values) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!values.name) {
        errors.name = "Name is required";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Password must be at least 8 characters long and include uppercase, lowercase, and numbers";
    }

    return errors;
}

export default validation;
