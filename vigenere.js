function encrypt(plainText, keyPhrase) {
    if (!plainText || !keyPhrase) throw false;

    let key = keyPhrase.replace(/\s+/g, '');
    if (!/^[a-zA-Z]+$/.test(key)) throw false;

    let cipherText = "";
    let keyPos = 0, keyLen = key.length;

    for (let char of plainText) {
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

function decrypt(cipherText, keyPhrase) {
    if (!cipherText || !keyPhrase) throw false;

    let key = keyPhrase.replace(/\s+/g, '');
    if (!/^[a-zA-Z]+$/.test(key)) throw false;

    let plainText = "";
    let keyPos = 0, keyLen = key.length;

    for (let char of cipherText) {
        if (/[a-zA-Z]/.test(char)) {
            let shift = key[keyPos % keyLen].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

            if (char === char.toUpperCase()) {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'A'.charCodeAt(0) - shift + 26) % 26) + 'A'.charCodeAt(0));
            } else {
                plainText += String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) - shift + 26) % 26) + 'a'.charCodeAt(0));
            }
            keyPos++;
        } else {
            plainText += char;
        }
    }
    return plainText;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("encryptBtn").addEventListener("click", processEncryption);
    document.getElementById("decryptBtn").addEventListener("click", processDecryption);
});

// Encryption Handler
function processEncryption() {
    let plainText = document.getElementById("plaintext").value;
    let key = document.getElementById("key").value;
    let outputField = document.getElementById("output");
    let errorMessage = document.getElementById("error-message");

    try {
        outputField.value = encrypt(plainText, key);
        errorMessage.textContent = "";
    } catch (err) {
        errorMessage.textContent = "Error: Invalid input!!!";
        outputField.value = "";
    }
}

// Decryption Handler
function processDecryption() {
    let cipherText = document.getElementById("ciphertext").value;
    let key = document.getElementById("key").value;
    let outputField = document.getElementById("output");
    let errorMessage = document.getElementById("error-message");

    try {
        outputField.value = decrypt(cipherText, key);
        errorMessage.textContent = "";
    } catch (err) {
        errorMessage.textContent = "Error: Invalid input!!!";
        outputField.value = "";
    }
}


