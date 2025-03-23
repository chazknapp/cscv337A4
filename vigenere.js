// This waits for the entire HTML page to load before adding event listeners.
// If you try to access elements too early, they may not exist yet.
document.addEventListener("DOMContentLoaded", function () {
    const encryptButton = document.getElementById("encryptBtn");
    const decryptButton = document.getElementById("decryptBtn");

    // If the Encrypt button exists, add a click event to trigger encryption
    if (encryptButton) {
        encryptButton.addEventListener("click", processEncryption);
    } else {
        console.error("Error: Encrypt button (id='encryptBtn') NOT found.");
    }

    // Same for the Decrypt button
    if (decryptButton) {
        decryptButton.addEventListener("click", processDecryption);
    } else {
        console.error("Error: Decrypt button (id='decryptBtn') NOT found.");
    }
});


// This function ensures the user’s input is usable.
// It throws errors that can be caught and displayed nicely.
function validateInput(text, key) {
    if (!text || !key) {
        // If either the input text or the key is empty, it’s invalid
        throw new Error("Cannot leave empty.");
    }

    // Remove all spaces from the key — spaces are ignored in Vigenère cipher keys
    key = key.replace(/\s+/g, '');

    // Only allow letters in the key. This will reject numbers and symbols.
    if (!/^[a-zA-Z]+$/.test(key)) {
        throw new Error("You must only put in letters.");
    }

    return key; // Return the cleaned and verified key
}


// This is the main ENCRYPTION function.
// It shifts each character in the message based on the corresponding character in the key.
function encrypt(plainText, keyPhrase) {
    // Step 1: This validates input and removes spaces from the key.
    // This is critical for passing all "Invalid Input" QUnit tests (e.g. null key, empty key, invalid characters).
    let key = validateInput(plainText, keyPhrase);

    let cipherText = "";
    let keyPos = 0;
    let keyLen = key.length;

    for (let i = 0; i < plainText.length; i++) {
        let char = plainText[i];

        // Only encrypt letters (skip punctuation and whitespace)
        // This logic is why the tests that include punctuation (like commas) and spaces pass.
        if (/[a-zA-Z]/.test(char)) {
            // Convert current key character to a shift value between 0 and 25
            let shift = key[keyPos % keyLen].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

            if (char === char.toUpperCase()) {
                // Uppercase letter encryption — preserves case
                // This matches what the QUnit test expects with uppercase ciphertext letters
                cipherText += String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) + 'A'.charCodeAt(0));
            } else {
                // Lowercase letter encryption — also preserves case
                // Test cases with mixed-case input validate this behavior
                cipherText += String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26) + 'a'.charCodeAt(0));
            }

            // Move to next key character (repeats if shorter than plaintext)
            // This matches the behavior described in the Vigenère algorithm and expected by QUnit
            keyPos++;
        } else {
            // Keep non-letters unchanged (spaces, punctuation)
            // This ensures tests like “Encryption - plaintext with punctuation” pass
            cipherText += char;
        }
    }

    return cipherText;
}


// This is the main DECRYPTION function.
// It reverses the encryption logic using the same key.
function decrypt(cipherText, keyPhrase) {
    let key = validateInput(cipherText, keyPhrase); // Validate and clean the key
    let plainText = "";
    let keyPos = 0;
    let keyLen = key.length;

    for (let i = 0; i < cipherText.length; i++) {
        let char = cipherText[i];

        if (/[a-zA-Z]/.test(char)) {
            // Convert the current key letter to a number between 0–25
            let shift = key[keyPos % keyLen].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
            shift = -shift + 26; // Reversing the shift for decryption

            if (char === char.toUpperCase()) {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) + 'A'.charCodeAt(0));
            } else {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26) + 'a'.charCodeAt(0));
            }

            keyPos++;
        } else {
            plainText += char; // Preserve punctuation and spacing
        }
    }

    return plainText;
}


// This function handles the Encrypt button click.
// It grabs values from the form, runs the encrypt function, and updates the output box.
function processEncryption() {
    let plainText = document.getElementById("plaintext").value;
    let key = document.getElementById("key1").value;
    let outputField = document.getElementById("output");
    let errorMessage = document.getElementById("error-message");

    try {
        outputField.value = encrypt(plainText, key); // Run the encryption
        errorMessage.textContent = ""; // Clear any previous errors
    } catch (err) {
        // If input validation fails, show a message instead of crashing
        errorMessage.textContent = `Error: ${err.message}`;
        outputField.value = "";
    }
}


// This function handles the Decrypt button click — similar to the one above
function processDecryption() {
    let cipherText = document.getElementById("ciphertext").value;
    let key = document.getElementById("key2").value;
    let outputField = document.getElementById("output");
    let errorMessage = document.getElementById("error-message");

    try {
        outputField.value = decrypt(cipherText, key);
        errorMessage.textContent = "";
    } catch (err) {
        errorMessage.textContent = `Error: ${err.message}`;
        outputField.value = "";
    }
}
