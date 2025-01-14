
// სიტყვები რომელიც უნდა გამოიცნოს იუზერმა.
const words = [
  "hangman",
  "developer",
  "programming",
  "algorithm",
  "netflix",
  "javascript",
  "coding",
  "junior",
  "react"
];

// დავხატოთ ჰენგმენი ეტაპობრივად.
const drawFunctions = [
  (ctx) => {
    ctx.beginPath();
    ctx.arc(100, 50, 20, 0, Math.PI * 2);
    ctx.stroke();
  }, // თავი
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 70);
    ctx.lineTo(100, 150);
    ctx.stroke();
  }, // ტანი
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 90);
    ctx.lineTo(70, 120);
    ctx.stroke();
  }, // მარცხენა ხელი
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 90);
    ctx.lineTo(130, 120);
    ctx.stroke();
  }, // მარჯვენა ხელი
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(70, 200);
    ctx.stroke();
  }, // მარცხენა ფეხი
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(130, 200);
    ctx.stroke();
  }, // მარჯვენა ფეხი
];

// ფუნქცია რომელიც ამოარჩევს რენდომ სიტყვას, ჩამოთვლილთაგან რომელიმეს.
function pickRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// ფუნქცია რომლითაც დავიწყებთ თამაშს.
function startGame() {
  const word = pickRandomWord();
  const wordArray = word.split("");
  let guessedWord = Array(word.length).fill("_");
  let attempts = 6; // მივანიჭებ შეცდომის დაშვების რაოდენობას.
  let guessedLetters = [];

  const wordDisplay = document.getElementById("word-display"); 
  const attemptsDisplay = document.getElementById("attempts-display");
  const guessedLettersDisplay = document.getElementById("guessed-letters-display");
  const inputField = document.getElementById("letter-input");
  const feedback = document.getElementById("feedback");
  const canvas = document.getElementById("hangman-canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height); // გავასუფთავოდ კანვა ახალი პარტიისთვის და დავხატოთ საკიდი.
  ctx.beginPath();
  ctx.moveTo(10, 290);
  ctx.lineTo(190, 290);
  ctx.moveTo(50, 290);
  ctx.lineTo(50, 10);
  ctx.lineTo(100, 10);
  ctx.lineTo(100, 30);
  ctx.stroke();

  wordDisplay.textContent = guessedWord.join(" ");
  attemptsDisplay.textContent = `Attempts left: ${attempts}`;
  guessedLettersDisplay.textContent = "Guessed letters: None yet.";
  feedback.textContent = "";

  function handleGuess() {  // ამ ფუნქციით ვიღებთ იუზერის მიერ შეყვანილ მნიშვნელობას და გადაგვყავს ლოუვერ ქეისში.
    const guess = inputField.value.toLowerCase();
    inputField.value = ""; // ვასუფთავებთ ადგილს რომ თავიდან შეიყვანოს ახალი მნიშვნელობა. 

    if (!guess || guess.length !== 1 || !/[a-z]/.test(guess)) {  // თუ ინფუთი არის ცარიელი, ან 1ზე მეტია შეყვანილი მნიშვნელობა ან ა-დან ზ-მდე არ არის
      feedback.textContent =
        "Invalid input. Please guess a single letter."; // გამოგვაქვს ეს ტექსტი იუზერისთვის და ვუბრუნდებით საწყისს რომ თავიდან შეიყვანოს მნიშვნელობა.
      return;
    }

    if (guessedLetters.includes(guess)) {  // თუ შეყვანილი მნიშვნელობა განმეორდება ამ შემთხვევაში გამოგვაქვს ეს ტექსტი.
      feedback.textContent =
        "You already guessed that letter. Try again.";
      return;
    }

    guessedLetters.push(guess); // ახალ მნიშვნელობას ამატებს უკვე შექმნილ მასივს.
    guessedLettersDisplay.textContent = `Guessed letters: ${guessedLetters.join(", ")}`; // ვიზუალურად გამოგვაქვს იუზერისთვის აწ უკვე შეყვანილი მნიშვნელობები.


    if (wordArray.includes(guess)) {  // ვამოწმებთ თუ შეყვანილი მნიშვნელობა არის სიტყვაში ერთერთი.
      feedback.textContent = "Good guess!";
      wordArray.forEach((letter, index) => { //გადავყვებით ფორიჩით თითოეულ ინდექსზე მდგომ ასოს და შევადარებთ ახალ მნიშვნელობას
        if (letter === guess) {
          guessedWord[index] = guess; // და თუ რომელიმეს დაემთხვა მაშინ მის ინდექსს მივანიჭებს ამ მნიშვნელობას.
        }
      });
      wordDisplay.textContent = guessedWord.join(" "); // დაამდეითებს ვიზუალურად ცარიელ ადგილებს სიტყვაში იუზერისთვის.

    } else {
      feedback.textContent = "Wrong guess."; // თუ შეეშალა მაშინ გამოვიტანთ ამ ტექსტს
      drawFunctions[6 - attempts](ctx); // ვხატავთ ინდექს 6დან კაცუნას
      attempts--; // აკლებს იმდენს რამდენი შეცდომას დაუშვა იუზერმა
      attemptsDisplay.textContent = `Attempts left: ${attempts}`;  // ვიზუალურად გამოიტანს ეკრანზე თუ რამდენი ცდა დარჩა იუზერს.
    }

    if (!guessedWord.includes("_")) {   // თუ ცარიელი ტირეები აღარ დარჩა ვამოწმებთ და ვულოცავთ იუზერს გამარჯვებას.
      feedback.textContent = `Congratulations! You guessed the word: ${word}`;
      inputField.disabled = true;  // შესავსებ ველს ვაუქმებთ რომ იუზერმა ვეღარ შეძლოს მნიშვნელობის ჩაწერა.
      document.getElementById("guess-button").disabled = true; // ასევე ვაქრობთ ღილაკს
    } else if (attempts === 0) { // ასევე ვამოწმებთ თუ აღარ დარჩა ცდები და გამოვიტანთ შემდეგ ტექსტს
      feedback.textContent = `Game over! The word was: ${word}`;
      inputField.disabled = true; // წაგების შემთხვევაში ასევე ვაუქმებთ შესავსებ ველს და ღილაკს.
      document.getElementById("guess-button").disabled = true;
    }
  }

  document.getElementById("guess-button").onclick = handleGuess; // გესს ღილაკს მივანიჭებს ჰენდლგესს ფუნქციას და მასზე დაჭერისას გამოიძახებს.
  inputField.disabled = false; // გავააქტიურებთ შესავსებ ველს
  document.getElementById("guess-button").disabled = false; // გავააქტიურებთ ღილაკს
}

document.addEventListener("DOMContentLoaded", () => startGame());  // როცა გვერდი ჩაიტვირთება მასზე გაწერილი გვაქვს ედლისენერ ფუნქცია და ეგრევე გაეშვება თამაში.