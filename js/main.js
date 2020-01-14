/*jshint esversion: 6 */

(() => {
  const getData = localStorage.getItem('data');
  if(getData === undefined || getData === null) {
    fetch('/json/data.json')
      .then(response => response.json())
      .then(json => {
        localStorage.setItem('data', JSON.stringify(json));
      });
  }
})();

window.addEventListener('hashchange', render);

function render() {
  const path = window.location.hash.split('/');
  const pageName = path[1];
  const itemId = path[2];

  switch (pageName) {
    case 'tests-list':
      renderTestsList();
      break;
    case 'test':
      renderTest(itemId);
      break;
    default:
      break;
  }
}

function renderTestsList() {
  const data = JSON.parse(localStorage.getItem('data'));

  const testsList = data.tests
    .map(item => {
      return `
      <li><div><a href="/#/test/${item.id}">${item.name}</a></div></li>
      `;
    })
    .join('');

  const testsListContainer = `
    <div>
      <ul>
        ${testsList}
      </ul>
    </div>
  `;

  document.querySelector('main').innerHTML = testsListContainer;
}

function renderTest(itemId) {
  const data = JSON.parse(localStorage.getItem('data'));
  const testObject = data.tests.find(item => item.id === itemId);

  const renderedTest = `
  <div>
    <p>${testObject.name}</p>
    <p>${testObject.desc}</p>
    <p><button onclick="startTest('${testObject.id}')">Start</button></p>
  </div>
  `;

  document.querySelector('main').innerHTML = renderedTest;
}

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
    <div class="test__progress">
      <!-- Progress bar -->
    </div>
    <div class="test__counter">
      1 of 15
    </div>
    <div class="test__timer">
      ${stringifyTime(testObject.time)}:00
    </div>
    <div class="question">

    </div>
  </section>
  `;

  document.querySelector('main').innerHTML = testTemplate;
  renderQuestion(questionsGenerator);
  startTimer();
}

function stringifyTime(time) {
  return Number(time) < 10 ? '0' + time : time;
}

function startTimer() {
  let timer = setInterval(() => {
    // get current timer time
    let newTime, seconds, minutes;
    let curTime = String(document.querySelector('.test__timer').innerHTML).split(':');
    minutes = Number(curTime[0]);
    seconds = Number(curTime[1]);
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

    document.querySelector('.test__timer').innerHTML = newTime;
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
      <button type="button" onclick="renderQuestion(questionsGenerator)">NEXT</button>
    </div>
  `;

  document.querySelector('.question').innerHTML = question;
}

function showResults() {
  // TODO: result window
  document.querySelector('main').innerHTML = 'results';
}
