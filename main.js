import PasswordGenerator from "./password-generator.js";

const password = document.getElementById("password");
const copyBtn = document.getElementById("copy-password-btn");
const charLength = document.getElementById("char-length-value");
const slider = document.getElementById("slider");
const uppercaseCheck = document.getElementById("uppercase-checkbox");
const lowercaseCheck = document.getElementById("lowercase-checkbox");
const numberCheck = document.getElementById("number-checkbox");
const symbolCheck = document.getElementById("symbol-checkbox");
const strengthStatus = document.getElementById("strength-status");
const generateBtn = document.getElementById("generate-btn");
const bars = document.querySelectorAll(".bars div");

const status = {
    statusMessage: document.querySelector("#status"),
    /**
     * Show a success statusMessage message
     * @param {string} [message="success"] - the message to show in the statusMessage
     * @returns {void}
     */
    success(message = "success") {
        this.statusMessage.style.color = "#A4FFAF";
        this.statusMessage.textContent = message;

        setTimeout(() => {
            this.statusMessage.textContent = "";
        }, 2000);
    },
    /**
     * Show an error statusMessage message
     * @param {string} [message="something went wrong"] - the message to show in the statusMessage
     * @returns {void}
     */
    error(message = "something went wrong") {
        this.statusMessage.style.color = "#F64A4A";
        this.statusMessage.textContent = message;
        password.value = "";
        updateStrengthStatus("", "");

        setTimeout(() => {
            this.statusMessage.textContent = "";
        }, 2000);
    },
};

function updateSliderBackground() {
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;
    const percentage = ((value - min) / (max - min)) * 100;

    charLength.textContent = slider.value;

    slider.style.background = `linear-gradient(to right, #A4FFAF ${percentage}%, #18171F ${percentage}%)`;
}

/**
 * Copy the generated password to the clipboard
 * @returns {void}
 */
const copyPassword = () => {
    if (!password.value.trim()) return status.error("no password provided");
    navigator.clipboard.writeText(password.value);
    status.success("copied");
};

const passwordGenerator = new PasswordGenerator();

function updateStrengthStatus(className, strength) {
    bars.forEach((bar) => (bar.className = className));
    strengthStatus.textContent = strength;
}

const handleGeneratePassword = () => {
    let selectedOptions = 0;
    const passwordLength = Number(slider.value);

    if (passwordLength === 0) return status.error("no password length provided");

    uppercaseCheck.checked && selectedOptions++;
    lowercaseCheck.checked && selectedOptions++;
    numberCheck.checked && selectedOptions++;
    symbolCheck.checked && selectedOptions++;

    if (selectedOptions > passwordLength)
        return status.error("not enough characters");

    if (selectedOptions === 0) return status.error("select at least one option");

    const generatedPassword = passwordGenerator.generatePassword(passwordLength, {
        uppercaseCheck: uppercaseCheck.checked,
        lowercaseCheck: lowercaseCheck.checked,
        numberCheck: numberCheck.checked,
        symbolCheck: symbolCheck.checked,
    });

    password.value = generatedPassword;

    const passwordStrength =
        passwordGenerator.calculatePasswordStrength(generatedPassword);

    if (passwordStrength === "strong") {
        updateStrengthStatus("strong-password", passwordStrength);
    } else if (passwordLength >= 8 && selectedOptions >= 2) {
        updateStrengthStatus("medium-password", passwordStrength);
        bars[3].className = "";
    } else if (passwordLength >= 8 && selectedOptions === 1) {
        updateStrengthStatus("", passwordStrength);
        bars[0].className = "weak-password";
        bars[1].className = "weak-password";
    } else {
        updateStrengthStatus("", passwordStrength);
        bars[0].className = "very-weak-password";
    }
};

// event handlers
copyBtn.addEventListener("click", copyPassword);
slider.addEventListener("input", updateSliderBackground);
generateBtn.addEventListener("click", handleGeneratePassword);
