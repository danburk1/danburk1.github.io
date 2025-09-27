const PHRASES = {
  "i order (masc.)":"ܛܵܠܒܹܢ","i will order (masc.)":"ܛܵܠܒܹܢ ܒܸܕ",
  "i order (fem.)":"ܛܵܠܒܵܢ","i will order (fem.)":"ܛܵܠܒܵܢ ܒܸܕ",
  "you order (masc.)":"ܛܵܠܒܹܬ","you will order (masc.)":"ܛܵܠܒܹܬ ܒܸܕ",
  "you order (fem.)":"ܛܵܠܒܵܬܝ","you will order (fem.)":"ܛܵܠܒܵܬܝ ܒܸܕ",
  "he orders":"ܛܵܠܹܒ","he will order":"ܛܵܠܹܒ ܒܸܕ",
  "she orders":"ܛܵܠܒܵܐ","she will order":"ܛܵܠܒܵܐ ܒܸܕ",
  "we order":"ܛܵܠܒܲܚ","we will order":"ܛܵܠܒܲܚ ܒܸܕ",
  "they order":"ܛܵܠܒܝܼ","they will order":"ܛܵܠܒܝܼ ܒܸܕ",
  "y’all order":"ܛܵܠܒܝܼܬܘܿܢ","y’all will order":"ܛܵܠܒܝܼܬܘܿܢ ܒܸܕ"
};

const PRONOUNS = {
  "i order (masc.)": "ܐܵܢܵܐ",
  "i will order (masc.)": "ܐܵܢܵܐ",
  "i order (fem.)": "ܐܵܢܵܐ",
  "i will order (fem.)": "ܐܵܢܵܐ",
  "you order (masc.)": "ܐܲܢ݇ܬ",
  "you will order (masc.)": "ܐܲܢ݇ܬ",
  "you order (fem.)": "ܐܲܢ݇ܬܝ",
  "you will order (fem.)": "ܐܲܢ݇ܬܝ",
  "he orders": "ܗ̇ܘ",
  "he will order": "ܗ̇ܘ",
  "she orders": "ܗ̇ܝ",
  "she will order": "ܗ̇ܝ",
  "we order": "ܐܲܚܢܲܢ",
  "we will order": "ܐܲܚܢܲܢ",
  "they order": "ܐܵܢܝܼ",
  "they will order": "ܐܵܢܝܼ",
  "y’all order": "ܐܲܚܬܘܿܢ",
  "y’all will order": "ܐܲܚܬܘܿܢ"
};

const FOODS_EN = ["potatoes","rice","beans","stew","kabobs","chicken","steak","lamb","fish","fries","water","fizzy drinks","yogurt drink","lemonade","orange juice","dolma","red rice","okra stew","yogurt","assyrian egg rolls","tea","coffee","hummus","baba ganosh","salad","pickles","meatballs"];
const FOODS_SY = ["ܟܸܪܬܘܿܦܹ̈ܐ","ܪܸܙܵܐ","ܚܲܒ̣ܨܹ̈ܐ","ܫܘܼܪܒ̣ܵܐ","ܟܵܒܵܒܹ̈ܐ","ܟܬܵܝܬܵܐ","ܒܸܣܪܵܐ","ܥܸܪܒܵܐ","ܢܘܼܢܵܐ","ܟܸܪܬܘܿܦܹ̈ܐ ܩܸܠܝܹ̈ܐ","ܡܝܼܵܐ","ܫܬܵܝܬܵܐ ܒܲܩܒܸܩܵܢܵܐ","ܕܲܘܹ̈ܐ","ܡܝܼܵܐ ܕܠܝܼܡܘܿܢܹ̈ܐ","ܡܝܼܵܐ ܕܦܘܼܪ̈ܬܩܵܠܹܐ","ܕܘܿܠܡܵܐ","ܪܸܙܵܐ ܣܡܘܿܩܵܐ","ܒܲܡܝܹ̈ܐ","ܡܲܣܬܵܐ","ܒܘܼܪܲܟ","ܟ̰ܵܐܝ","ܩܲܗܘܵܐ","ܚܲܪ̈ܛܡܵܢܹܐ ܓܪ̈ܝܼܣܹܐ","ܒܵܕܸܡܓ̰ܵܢܹ̈ܐ ܓܪ̈ܝܼܣܹܐ","ܣܲܠܵܛܵܐ","ܛܘܼܪ̈ܫܝܹܐ","ܟܸܦܬܹ̈ܐ"];

const TOTAL_QUESTIONS = 10;

let currentEnglishPhrase = "";
let currentEnglishFood = "";
let currentAssyrianSentence = "";
let currentKey = "";

let questionCount = 0;
let questionsCorrect = 0;
let guesses = 3;

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function newRound() {
  if (questionCount >= TOTAL_QUESTIONS) {
    // Game over
    document.getElementsById("assyrian").id = "winscreen";
    document.getElementById("assyrian").textContent = "🎉 Game Over! Thanks for playing. " + ((questionsCorrect / TOTAL_QUESTIONS) * 100.0).toFixed(2);
    document.getElementById("answer").disabled = true;
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("feedback").textContent = "";
    return;
  }

  guesses = 3;
  document.getElementById("submitBtn").disabled = false;

  // Pick random phrase key and food index
  const phraseKeys = Object.keys(PHRASES);
  const phraseIndex = Math.floor(Math.random() * phraseKeys.length);
  const foodIndex = Math.floor(Math.random() * FOODS_EN.length);

  currentKey = phraseKeys[phraseIndex];
  const phraseAssyrian = PHRASES[currentKey];
  const pronounAssyrian = PRONOUNS[currentKey] || "";

  currentEnglishPhrase = currentKey.replace(/\(.*?\)/g, "").trim(); // Remove gender notes
  currentEnglishFood = FOODS_EN[foodIndex];
  const foodAssyrian = FOODS_SY[foodIndex];

  // Build Assyrian sentence: pronoun + phrase + food
  currentAssyrianSentence = pronounAssyrian + " " + phraseAssyrian + " " + foodAssyrian;

  document.getElementById("assyrian").textContent = currentAssyrianSentence;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";

  // Update progress bar and text
  questionCount++;
  const percent = (questionCount / TOTAL_QUESTIONS) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent = `${questionCount} / ${TOTAL_QUESTIONS}`;
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const userInput = normalize(document.getElementById("answer").value);
  const correctAnswer = normalize(currentEnglishPhrase + currentEnglishFood);

  if (userInput === correctAnswer) {
    questionsCorrect++;
    document.getElementById("feedback").textContent = "Correct! 🎉";
    document.getElementById("submitBtn").disabled = true;
    setTimeout(newRound, 1200);
  } else {
    guesses--;
    document.getElementById("feedback").textContent = "Try again! (" + guesses + " chances left)";
    if (guesses < 0){
        document.getElementById("feedback").textContent = "Correct answer was: " + (currentEnglishPhrase + currentEnglishFood);
        document.getElementById("submitBtn").disabled = true;
       setTimeout(newRound,1500);        
    }
  }
});

document.getElementById("answer").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    document.getElementById("submitBtn").click();
  }
});

newRound();