class PasswordGenerator {
    constructor() {
        this.charset = {
            uppercaseLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercaseLetters: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+",
        }
    }

    generatePassword(passwordLength = 0, {
        uppercaseCheck = false,
        lowercaseCheck = false,
        numberCheck = false,
        symbolCheck = false,
    }) {
        this.passwordArray = [];
        this.availableCharacters = "";
        if (uppercaseCheck) this.addCharactersToPool(this.charset.uppercaseLetters);
        if (lowercaseCheck) this.addCharactersToPool(this.charset.lowercaseLetters);
        if (numberCheck) this.addCharactersToPool(this.charset.numbers);
        if (symbolCheck) this.addCharactersToPool(this.charset.symbols);

        this.addRemainingCharacters(passwordLength - this.passwordArray.length);

        return this.shufflePassword().join("");
        ;
    }

    addCharactersToPool(charset) {
        this.passwordArray.push(this.getRandomChar(charset));
        this.availableCharacters += charset;
    }

    addRemainingCharacters(length) {
        for (let i = 0; i < length; i++) {
            this.passwordArray.push(this.getRandomChar(this.availableCharacters));
        }
    }

    getRandomChar(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    shufflePassword() {
        return this.passwordArray.sort(() => Math.random() - 0.5);
    }

    calculatePasswordStrength(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const criteriaMet = [hasUpperCase, hasLowerCase, hasNumber, hasSymbol].filter(Boolean).length;

        if (password.length >= 12 && criteriaMet >= 3) return "strong";
        if (password.length >= 8 && criteriaMet >= 2) return "medium";
        if (password.length >= 8 && criteriaMet === 1) return "weak";
        return "too weak";
    }
}

export default PasswordGenerator