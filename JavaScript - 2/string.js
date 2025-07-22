//validate email using string methods 

let emailInput = "  Example123@gmail.com   ";

let validEmail = emailInput.trim();
// "Example123@gmail.com"

validEmail = validEmail.toLowerCase();
// "example123@gmail.com"

// Remove spaces added before or after "@"
validEmail = validEmail.replace(/\s*@\s*/g, "@");

if (!validEmail.endsWith(".com")) {
  validEmail += ".com";
}

//remove multiple dots
validEmail = validEmail.replace(/\.{2,}/g, ".");


console.log("Valid Email: ", validEmail);
