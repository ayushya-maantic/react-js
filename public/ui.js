const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");

function showWelcomeMessage(username) {
    var p = forge.pki.publicKeyFromPem(`-----BEGIN RSA PUBLIC KEY-----
    MIICCgKCAgEA2yYbAUmYJUL2KfBRHVgk8yAYKUnyFBW9FcZzAZCdC9yVu0yd27/P
    Z/sHvNp8ns6TPN/VdsfdFpnb9oS8t+SahE345aALvWBMWcZTEJQWoh5SPL+7LTq2
    s9xB98aVLwxxdFVy08+VmsURf/A7lheLyhJChWaH3oOWOLf+uSQaYzBaGsFfSV+j
    DLXysriH7AoF/yCkagpqt599e9qzzn6KBNNSw/IhGRkIqEuNFYBU4wC3ZwUFql+4
    ZTPkAp6b9q/qQH3wU3jkuts9WBAmKd+L0aJQsPhd6Spw3SC04dLKZm1EDoHWCYEX
    P3LUGqtC+CCpEdppB68a/oKkr8gtsturBvZuP9Cey53hKLiZN6bQOjVn5NBsPErj
    ZaL+t6IYSB1SInpCnuNMY5MB2JlRBECha88dom75cgI/LOxANktzrX67NlIUg7Tj
    wMcKQtUqSJ+ukWuODHXaxS/IsrvMY0bsCXJN5GrqE9iptP4W70H6lPVzqjmZJEFU
    SPGoG5fQwxFOMinVHNgbm6heEaln+Lfevt7yzgoPnmPeG7wBc1Zy5ZvqBepgujpf
    XF9Zv2oFXUmjpBO+kDWIbHQdu0as8pVq+o1S8vBoSZiJG/maEcUyWUfPCaqGar0S
    gOZVf+/S2uBzEMclgbyKZc41YkJ94vyeyzcK5Q3syOaQbZq3EFxHtfUCAwEAAQ==
    -----END RSA PUBLIC KEY-----`)
    var ciphertext = forge.util.encode64(p.encrypt(username))
    
    // var encrypt = new JSEncrypt();
    // encrypt.setPublicKey(pubkey);
    // var encrypted = encrypt.encrypt(username);
    document.cookie = "accesskey="+ciphertext;
    welcomeDiv.innerHTML = `Welcome ${username}`;
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";
    
    loader()
}

