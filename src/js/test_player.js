/*jshint esversion: 6 */
function randomizeArray(itemsArray) {
  let tempArray = itemsArray.slice();
  let randomIndex = Math.floor(Math.random() * tempArray.length);
  let currentIndex = tempArray.length - 1;
  while(currentIndex >= 0) {
    let tempObject = tempArray[randomIndex];
    tempArray[randomIndex] = tempArray[currentIndex];
    tempArray[currentIndex] = tempObject;
    randomIndex = Math.floor(Math.random() * tempArray.length);
    currentIndex--;
  }
  return tempArray;
}

function startTest(itemId) {
  const data = JSON.parse(localStorage.getItem('data'));
  const testObject = data.tests.find(item => item.id === itemId);
  const testQuestions = randomizeArray(testObject.question_ids.map(item => {
    return data.questions.find(elem => elem.id === item);
  }));
  questionsGenerator = createGenerator(testQuestions);

  const testTemplate = `
  <section class="test">
    <div class="test__close">
      <img src="/res/img/close.png">
    </div>
    <div class="test__progress">
      <!-- Progress bar -->
    </div>
    <div class="test__counter">
      <span class="test__counter-quest"></span>
      /
      <span class="test__counter-total">${testQuestions.length}</span>
    </div>
    <div class="test__timer">
      ${stringifyTime(testObject.time)}:00
    </div>
    <div class="test__timer-hidden">
      00:00
    </div>
    <div class="question">

    </div>
  </section>
  `;

  document.querySelector('main').innerHTML = testTemplate;
  document.querySelector('.test__close').addEventListener('click', () => {
    window.location.reload();
  });

  storeTempTest(testObject.id);
  renderQuestion(questionsGenerator);
  startTimer();
}

function storeTempTest(testId) {
  localStorage.removeItem('tempTest');
  tempTestObject = {
    userId: getUser(),
    testId: testId,
    time: '0',
    questions: [],
    score: '0'
  };
  localStorage.setItem('tempTest', JSON.stringify(tempTestObject));
}

function stringifyTime(time) {
  return Number(time) < 10 ? '0' + time : time;
}

function startTimer() {
  let timer = setInterval(() => {
    // get current timer time
    try {
      let newTime, newHiddenTime, seconds, minutes;
      let curTime = String(document.querySelector('.test__timer').innerHTML).split(':');
      let hiddenTime = String(document.querySelector('.test__timer-hidden').innerHTML).split(':');
      minutes = Number(curTime[0]);
      seconds = Number(curTime[1]);
      hiddenMinutes = Number(hiddenTime[0]);
      hiddenSeconds = Number(hiddenTime[1]);
      // stop timer if time runs out
      if(minutes <= 0 && seconds <= 0) {
        clearInterval(timer);
        showResults();
        return;
      }
      // subtract one second
      if(seconds == 0) {
        seconds = 59;
        minutes--;
      } else {
        seconds--;
      }
      newTime = stringifyTime(minutes) + ':' + stringifyTime(seconds);

      //add for hidden
      if(hiddenSeconds == 59) {
        hiddenSeconds = 0;
        hiddenMinutes++;
      } else {
        hiddenSeconds++;
      }
      newHiddenTime = stringifyTime(hiddenMinutes) + ':' + stringifyTime(hiddenSeconds);

      document.querySelector('.test__timer').innerHTML = newTime;
      document.querySelector('.test__timer-hidden').innerHTML = newHiddenTime;
    } catch (e) {
      clearInterval(timer);
    }
  }, 1000);
}

function createGenerator(itemsArray) {
  return (function*() {
    for(i = 0; i < itemsArray.length; i++) {
      yield itemsArray[i];
    }
  })();
}

function renderQuestion(qGen) {
  const questionObject = qGen.next();
  if(questionObject.done) {
    showResults();
    return;
  }
  let questionAnswers = questionObject.value.incorrect_answers.slice();
  questionAnswers.push(questionObject.value.correct_answer);
  questionAnswers = randomizeArray(questionAnswers);
  const question = `
    <div class="question__text">
      ${questionObject.value.question}
    </div>
    <div class="question__answers">
      ${questionAnswers.map((item, index) => {
        return `
        <div>
          <div>
            <input type="radio" id="answer-${index+1}" name="radio-answers" value="">
            <label for="answer-${index+1}">
              <div><div></div></div>
              <div class="question__answers-text">${item}</div>
            </label>
          </div>
        </div>
        `;
      }).join('')}
    <div class="question__buttons">
      <button type="button" onclick="disableAnswers(); storeAnswer('${questionObject.value.id}');">SUBMIT</button>
    </div>
  `;

  document.querySelector('.question').innerHTML = question;
  updateCounter();
}

function updateCounter() {
  const currentCount = document.querySelector('.test__counter-quest');
  const totalCount = document.querySelector('.test__counter-total');
  if(currentCount.innerHTML === '') {
    currentCount.innerHTML = '1';
  } else {
    currentCount.innerHTML = Number(currentCount.innerHTML) + 1;
  }
  newProgress = Math.floor((Number(currentCount.innerHTML)/Number(totalCount.innerHTML))*100);
  document.querySelector('.test__progress').style.width = newProgress + '%';
}

function disableAnswers() {
  if(!isChecked()) {
    return;
  }
  const radios = document.querySelectorAll('input[name="radio-answers"]');
  radios.forEach((elem) => {
    elem.disabled = true;
  });
}

function storeAnswer(questionId) {
  if(!isChecked()) {
    return;
  }
  const userAnswer = document.querySelector('input[name="radio-answers"]:checked + label > .question__answers-text');
  let tempTestObject = JSON.parse(localStorage.getItem('tempTest'));
  tempTestObject.questions.push({
    question_id: questionId,
    userAnswer: userAnswer.innerText
  });
  localStorage.setItem('tempTest', JSON.stringify(tempTestObject));

  const data = JSON.parse(localStorage.getItem('data'));
  const questionObject = data.questions.find((item) => item.id === questionId);
  if(questionObject != undefined) {
    console.log(questionObject.correct_answer);
    console.log(userAnswer.innerHTML);
    if(questionObject.correct_answer == userAnswer.innerText) {
      userAnswer.classList.add('question__answers-text--correct');
    } else {
      userAnswer.classList.add('question__answers-text--wrong');
      const allAnswers = document.querySelectorAll('input[name="radio-answers"] + label > .question__answers-text');
      allAnswers.forEach((item) => {
        if(questionObject.correct_answer == item.innerText) {
          item.classList.add('question__answers-text--correct');
        }
      });
    }
  }

  showNextBtn();
}

function isChecked() {
   return document.querySelector('input[name="radio-answers"]:checked') != null;
}

function storeTestInDb() {
  const data = JSON.parse(localStorage.getItem('data'));
  const tempTestObject = JSON.parse(localStorage.getItem('tempTest'));

  const correctAnswers = tempTestObject.questions.filter((item) => {
    const question = data.questions.find((elem) => elem.id === item.question_id);
    return item.userAnswer == question.correct_answer;
  });
  const testObject = data.tests.find((item) => item.id === tempTestObject.testId);
  const testDate = new Date();

  tempTestObject.score = Math.floor((correctAnswers.length / testObject.question_ids.length) * 100);
  tempTestObject.time = document.querySelector('.test__timer-hidden').innerText;
  tempTestObject.date = testDate.toString();
  data.passedTests.push(tempTestObject);
  localStorage.setItem('data', JSON.stringify(data));
  return tempTestObject;
}

function showNextBtn() {
  const nextBtn = `
    <button type="button" onclick="renderQuestion(questionsGenerator);">
      NEXT
    </button>
  `;
  document.querySelector('.question__buttons').innerHTML = nextBtn;
}

function showResults() {
  const testResult = storeTestInDb();
  const data = JSON.parse(localStorage.getItem('data'));
  const testObject = data.tests.find((item) => item.id === testResult.testId);
  const correctAnswers = testResult.questions.filter((item) => {
    const question = data.questions.find((elem) => elem.id === item.question_id);
    return item.userAnswer == question.correct_answer;
  });
  const resultString = `
    <section>
      <div class="result-container">
        <div class="result-header">
          <h1>Result</h1>
        </div>
        <div class="results">
          <div class="results__elem">
            <div class="results__text">
              Your score
            </div>
            <div class="results__round results__round--score">
              ${testResult.score}%
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Total question count
            </div>
            <div class="results__round">
              ${testObject.question_ids.length}
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Questions passed
            </div>
            <div class="results__round">
              ${testResult.questions.length}
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Correct answers
            </div>
            <div class="results__round">
              ${correctAnswers.length}
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Test time
            </div>
            <div class="results__round">
              ${testResult.time}
            </div>
          </div>
        </div>
        <div>
          <a href="" onclick="navigate('/alltests')">
            <button class="purple-btn results-btn">Take another test</button>
          </a>
        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = resultString;
  localStorage.removeItem('tempTest');
}

function renderTest() {
  const searchParams = new URLSearchParams(window.location.search);
  const itemId = searchParams.get('id');
  const data = JSON.parse(localStorage.getItem('data'));
  const testObject = data.tests.find(item => item.id === itemId);
  const user = getUser();

  let startInfo = `<button class="purple-btn" onclick="startTest('${testObject.id}')">Start</button>`;
  if(user == null || user == undefined) {
    startInfo = `Please log in to start test`;
  }

  const renderedTest = `
  <section>
    <div class="test-container">
      <div>
        <h1>${testObject.name}</h1>
      </div>
      <div>
        <h2>Description</h2>
        <p>${testObject.desc}</p>
      </div>
      <div class="test-start">
        ${startInfo}
      </div>
    </div>
  </section>
  `;

  document.querySelector('main').innerHTML = renderedTest;
}
