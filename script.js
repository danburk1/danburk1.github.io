const PHRASES = {
  "i order (masc.)":"ܛܵܠܒܹܢ","i will order (masc.)":"ܛܵܠܒܹܢ ܒܸܕ",
  "i order (fem.)":"ܛܵܠܒܵܢ","i will order (fem.)":"ܛܵܠܒܵܢ ܒܸܕ",
  "you order (masc.)":"ܛܵܠܒܹܬ","you will order (masc.)":"ܛܵܠܒܹܬ ܒܸܕ",
  "you order (fem.)":"ܛܵܠܒܵܬܝ","you will order (fem.)":"ܛܵܠܒܵܬܝ ܒܸܕ",
  "he orders":"ܛܵܠܹܒ","he will order":"ܛܵܠܹܒ ܒܸܕ",
  "she orders":"ܛܵܠܒܵܐ","she will order":"ܛܵܠܒܵܐ ܒܸܕ",
  "we order":"ܛܵܠܒܲܚ","we will order":"ܛܵܠܒܲܚ ܒܸܕ",
  "they order":"ܛܵܠܒܝܼ","they will order":"ܛܵܠܒܝܼ ܒܸܕ",
  "y'all order":"ܛܵܠܒܝܼܬܘܿܢ","y'all will order":"ܛܵܠܒܝܼܬܘܿܢ ܒܸܕ"
};

const PRONOUNS = {
  "i order (masc.)": "ܐܵܢܵܐ", "i will order (masc.)": "ܐܵܢܵܐ",
  "i order (fem.)": "ܐܵܢܵܐ", "i will order (fem.)": "ܐܵܢܵܐ",
  "you order (masc.)": "ܐܲܢ݇ܬ", "you will order (masc.)": "ܐܲܢ݇ܬ",
  "you order (fem.)": "ܐܲܢ݇ܬܝ", "you will order (fem.)": "ܐܲܢ݇ܬܝ",
  "he orders": "ܗ̇ܘ", "he will order": "ܗ̇ܘ",
  "she orders": "ܗ̇ܝ", "she will order": "ܗ̇ܝ",
  "we order": "ܐܲܚܢܲܢ", "we will order": "ܐܲܚܢܲܢ",
  "they order": "ܐܵܢܝܼ", "they will order": "ܐܵܢܝܼ",
  "y'all order": "ܐܲܚܬܘܿܢ", "y'all will order": "ܐܲܚܬܘܿܢ"
};

const FOODS_EN = ["potatoes","rice","beans","stew","kabobs","chicken","steak","lamb","fish","fries","water","fizzy drinks","yogurt drink","lemonade","orange juice","dolma","red rice","okra stew","yogurt","assyrian egg rolls","tea","coffee","hummus","baba ganosh","salad","pickles","meatballs"];
const FOODS_SY = ["ܟܸܪܬܘܿܦܹ̈ܐ","ܪܸܙܵܐ","ܚܲܒ̣ܨܹ̈ܐ","ܫܘܼܪܒ̣ܵܐ","ܟܵܒܵܒܹ̈ܐ","ܟܬܵܝܬܵܐ","ܒܸܣܪܵܐ","ܥܸܪܒܵܐ","ܢܘܼܢܵܐ","ܟܸܪܬܘܿܦܹ̈ܐ ܩܸܠܝܹ̈ܐ","ܡܝܼܵܐ","ܫܬܵܝܬܵܐ ܒܲܩܒܸܩܵܢܵܐ","ܕܲܘܹ̈ܐ","ܡܝܼܵܐ ܕܠܝܼܡܘܿܢܹ̈ܐ","ܡܝܼܵܐ ܕܦܘܼܪ̈ܬܩܵܠܹܐ","ܕܘܿܠܡܵܐ","ܪܸܙܵܐ ܣܡܘܿܩܵܐ","ܒܲܡܝܹ̈ܐ","ܡܲܣܬܵܐ","ܒܘܼܪܲܟ","ܟ̰ܵܐܝ","ܩܲܗܘܵܐ","ܚܲܪ̈ܛܡܵܢܹܐ ܓܪ̈ܝܼܣܹܐ","ܒܵܕܸܡܓ̰ܵܢܹ̈ܐ ܓܪ̈ܝܼܣܹܐ","ܣܲܠܵܛܵܐ","ܛܘܼܪ̈ܫܝܹܐ","ܟܸܦܬܹ̈ܐ"];

const TOTAL_QUESTIONS = 10;

let currentEnglishPhrase = "";
let currentEnglishFood = "";
let currentKey = "";
let questionCount = 0;
let questionsCorrect = 0;
let guesses = 3;
let startTime = 0;
let timerInterval = null;
let tabChangeCount = 0;
let answerHistory = [];

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function startAssessment() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('assessment-screen').style.display = 'flex';
  
  // Request fullscreen
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.log('Fullscreen request failed'));
  }
  
  // Start timer
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  
  // Setup visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  newRound();
}

function handleVisibilityChange() {
  if (document.hidden && questionCount < TOTAL_QUESTIONS) {
    tabChangeCount++;
    const indicator = document.getElementById('warning-indicator');
    indicator.style.display = 'block';
    setTimeout(() => {
      indicator.style.display = 'none';
    }, 3000);
    console.log(`Tab change detected. Count: ${tabChangeCount}`);
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  document.getElementById('timer').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function newRound() {
  if (questionCount >= TOTAL_QUESTIONS) {
    showResults();
    return;
  }

  guesses = 3;
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-btn').style.display = 'block';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';

  const phraseKeys = Object.keys(PHRASES);
  const phraseIndex = Math.floor(Math.random() * phraseKeys.length);
  const foodIndex = Math.floor(Math.random() * FOODS_EN.length);

  currentKey = phraseKeys[phraseIndex];
  const phraseAssyrian = PHRASES[currentKey];
  const pronounAssyrian = PRONOUNS[currentKey] || "";

  currentEnglishPhrase = currentKey.replace(/\(.*?\)/g, "").trim();
  currentEnglishFood = FOODS_EN[foodIndex];
  const foodAssyrian = FOODS_SY[foodIndex];

  const currentAssyrianSentence = pronounAssyrian + " " + phraseAssyrian + " " + foodAssyrian;

  document.getElementById('assyrian-text').textContent = currentAssyrianSentence;
  document.getElementById('answer-input').value = "";
  document.getElementById('answer-input').focus();

  questionCount++;
  const percent = (questionCount / TOTAL_QUESTIONS) * 100;
  document.getElementById('progress-bar').style.width = percent + "%";
  document.getElementById('question-number').textContent = `Question ${questionCount} of ${TOTAL_QUESTIONS}`;
}

function submitAnswer() {
  const userInput = normalize(document.getElementById('answer-input').value);
  const correctAnswer = normalize(currentEnglishPhrase + currentEnglishFood);
  const feedbackEl = document.getElementById('feedback');
  const assyrianText = document.getElementById('assyrian-text').textContent;

  if (userInput === correctAnswer) {
    questionsCorrect++;
    feedbackEl.textContent = "✓ Correct!";
    feedbackEl.className = 'feedback correct';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
    
    // Save to history
    answerHistory.push({
      assyrian: assyrianText,
      correct: currentEnglishPhrase + " " + currentEnglishFood,
      userAnswer: document.getElementById('answer-input').value,
      isCorrect: true
    });
  } else {
    guesses--;
    if (guesses > 0) {
      feedbackEl.textContent = `✗ Incorrect. ${guesses} attempt${guesses > 1 ? 's' : ''} remaining.`;
      feedbackEl.className = 'feedback incorrect';
    } else {
      feedbackEl.textContent = `✗ Incorrect. Moving to next question.`;
      feedbackEl.className = 'feedback incorrect';
      document.getElementById('submit-btn').style.display = 'none';
      document.getElementById('next-btn').style.display = 'block';
      
      // Save to history
      answerHistory.push({
        assyrian: assyrianText,
        correct: currentEnglishPhrase + " " + currentEnglishFood,
        userAnswer: document.getElementById('answer-input').value,
        isCorrect: false
      });
    }
  }
}

function showResults() {
  clearInterval(timerInterval);
  document.getElementById('assessment-screen').style.display = 'none';
  document.getElementById('results-screen').style.display = 'flex';
  
  const score = Math.round((questionsCorrect / TOTAL_QUESTIONS) * 100);
  document.getElementById('score-display').textContent = `${score}%`;
  document.getElementById('correct-count').textContent = questionsCorrect;
  document.getElementById('time-elapsed').textContent = document.getElementById('timer').textContent;
  document.getElementById('tab-changes').textContent = tabChangeCount;
  
  if (tabChangeCount > 0) {
    document.getElementById('warning-log').style.display = 'block';
  }
  
  // Display answer review
  const reviewContainer = document.getElementById('answer-review');
  reviewContainer.innerHTML = '<h3>Answer Review</h3>';
  
  answerHistory.forEach((item, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;
    reviewItem.innerHTML = `
      <div class="review-question">${item.assyrian}</div>
      <div class="review-answer">
        <strong>Correct answer:</strong> ${item.correct}<br>
        ${!item.isCorrect ? `<strong>Your answer:</strong> ${item.userAnswer || '(no answer)'}` : ''}
      </div>
    `;
    reviewContainer.appendChild(reviewItem);
  });
  
  // Exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => console.log('Exit fullscreen failed'));
  }
}

document.getElementById('start-btn').addEventListener('click', startAssessment);
document.getElementById('submit-btn').addEventListener('click', submitAnswer);
document.getElementById('next-btn').addEventListener('click', newRound);

document.getElementById('answer-input').addEventListener('keypress', e => {
  if (e.key === 'Enter' && !document.getElementById('submit-btn').disabled) {
    if (document.getElementById('submit-btn').style.display !== 'none') {
      submitAnswer();
    } else {
      newRound();
    }
  }
});
