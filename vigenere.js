// Script must run only after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    const encryptButton = document.getElementById("encryptBtn");
    const decryptButton = document.getElementById("decryptBtn");

    if (encryptButton) {
        encryptButton.addEventListener("click", processEncryption);
    } else {
        console.error("Error: Encrypt button (id='encryptBtn') NOT found.");
    }

    if (decryptButton) {
        decryptButton.addEventListener("click", processDecryption);
    } else {
        console.error("Error: Decrypt button (id='decryptBtn') NOT found.");
    }
});

// Helper / directions function 
function validateInput(text, key) {
    if (!text || !key) throw new Error("Cannot leave empty.");
    key = key.replace(/\s+/g, '');
    if (!/^[a-zA-Z]+$/.test(key)) throw new Error("You must only put in letters.");
    return key;
}

// Encryption function
function encrypt(plainText, keyPhrase) {
    let key = validateInput(plainText, keyPhrase);
    let cipherText = "";
    let keyPos = 0, keyLen = key.length;

    for (let i = 0; i < plainText.length; i++) {
        let char = plainText[i];

        if (/[a-zA-Z]/.test(char)) {
            let shift = key[keyPos % keyLen].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

            if (char === char.toUpperCase()) {
                cipherText += String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) + 'A'.charCodeAt(0));
            } else {
                cipherText += String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26) + 'a'.charCodeAt(0));
            }
            keyPos++;
        } else {
            cipherText += char;
        }
    }
    return cipherText;
}

// Decryption function
function decrypt(cipherText, keyPhrase) {
    let key = validateInput(cipherText, keyPhrase);
    let plainText = "";
    let keyPos = 0, keyLen = key.length;

    for (let i = 0; i < cipherText.length; i++) {
        let char = cipherText[i];

        if (/[a-zA-Z]/.test(char)) {
            let shift = key[keyPos % keyLen].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
            shift = -shift + 26;

            if (char === char.toUpperCase()) {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) + 'A'.charCodeAt(0));
            } else {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26) + 'a'.charCodeAt(0));
            }
            keyPos++;
        } else {
            plainText += char;
        }
    }
    return plainText;
}

// Encryption Handler
function processEncryption() {
    let plainText = document.getElementById("plaintext").value;
    let key = document.getElementById("key1").value;
    let outputField = document.getElementById("output");
    let errorMessage = document.getElementById("error-message");

    try {
        outputField.value = encrypt(plainText, key);
        errorMessage.textContent = "";
    } catch (err) {
        errorMessage.textContent = `Error: ${err.message}`;
        outputField.value = "";
    }
}

// Decryption Handler
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


