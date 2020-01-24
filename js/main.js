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

window.addEventListener('load', render);
window.addEventListener('hashchange', render);

function render() {
  renderHeader();
  const path = window.location.hash;
  const pageName = path.split('/')[1];
  const itemId = path.split('/')[2];

  switch (pageName) {
    case 'tests-list':
      renderTestsList();
      break;
    case 'test':
      renderTest(itemId);
      break;
    case 'stats':
      renderStats();
      break;
    case 'auth':
      renderAuth();
      break;
    case 'register':
      renderRegister();
      break;
    case 'stats':
      renderStats();
      break;
    default:
      renderMain();
      break;
  }
}

function renderHeader() {
  let authInfo = '';
  const user = getUser();
  let menuItems = '';
  if(user === undefined || user === null) {
    authInfo = `
      <a href="/#/auth">
        <button class="login-btn">Log in</button>
      </a>
      <a href="/#/register">
        <button class="signup-btn">Sign up</button>
      </a>
    `;
  } else {
    authInfo = getUserPanel(user);
    menuItems += `
      <li>
        <a href="/#/stats">
          <div>Statistics</div>
        </a>
      </li>
    `;
  }

  const header = `
  <div class="menu-switch">
    <ul class="main-menu">
      <li>
        <a href="/">
          <div>Home</div>
        </a>
      </li>
      <li>
        <a href="/#/tests-list">Tests List</a>
        <ul class=main-menu__sub>
          <li>Sub-element 1</li>
          <li>Sub-element 2</li>
          <li>Sub-element 3</li>
        </ul>
      </li>
      ${menuItems}
    </ul>
  </div>
  <div class="auth-info">
    ${authInfo}
  </div>
  `;

  document.querySelector('header').innerHTML = header;
  document.querySelector('.menu-switch').addEventListener('click', function() {
    document.querySelector('.main-menu').classList.toggle('visible');
    console.log('menu');
  });
}

function renderAuth() {
  const user = getUser();
  if(user != null && user != undefined) {
    window.location = '/';
    return;
  }

  const auth = `
    <section>
      <div>
        Please enter your username and password
      </div>
      <div>
        <div></div>
        <input type="text" value="" placeholder="Your Username" id="username">
      </div>
      <div>
        <div></div>
        <input type="password" value="" placeholder="Your Password" id="password">
      </div>
      <div>
        <button onclick="logUser();">Log In</button>
      </div>
      <div>
        <a href="/#/register">Don't have an account? Sign up!</a>
      </div>
      <div class="login-error">

      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = auth;
}

function renderRegister() {
  const register = `
    <section>
      <div>
        Please fill out the form
      </div>
      <div>
        <div>Fullname</div>
        <input type="text" value="" placeholder="Your Fullname" id="fullname">
      </div>
      <div>
        <div>Username</div>
        <input type="text" value="" placeholder="Your Username" id="username">
      </div>
      <div>
        <div>Password</div>
        <input type="password" value="" placeholder="Your Password" id="password">
      </div>
      <div>
        <div>Password</div>
        <input type="password" value="" placeholder="Confirm Password" id="password-confirm">
      </div>
      <div>
        <button onclick="regUser();">Sign Up</button>
      </div>
      <div class="reg-error">

      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = register;
}

function renderMain() {
  const data = JSON.parse(localStorage.getItem('data'));

  const homepage = data.categories
    .map((cat) => {
      const testsByCat = data.tests.filter((test) => {
        return test.category_id === cat.id;
      });

      const testsMarkup = testsByCat
        .map((test) => {
          return `
            <div>
              <a href="/#/test/${test.id}">
                <div>
                  <img src="${cat.img}">
                </div>
                <div>
                  ${test.name}
                </div>
              </a>
            </div>
          `;
        })
        .join('');

      return `
        <section>
          <div>
            <h1>${cat.name}</h1>
          </div>
          ${testsMarkup}
        </section>
      `;
    })
    .join('');

  document.querySelector('main').innerHTML = homepage;
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

function renderStats() {
  const user = getUser();
  if(user == null || user == undefined) {
    window.location = '/';
    return;
  }

  const data = JSON.parse(localStorage.getItem('data'));
  const passedTests = data.passedTests.filter((elem) => elem.userId === user);
  const testHistory = passedTests
    .map((elem) => {
      return '';
    })
    .join('');

  const stats = `
  <section>
    <div>
      <h1>History</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${testHistory}
        </tbody>
      </table>
    </div>
  </section>
  `;

  document.querySelector('main').innerHTML = stats;
}

function getUser() {
  return sessionStorage.getItem('userId');
}

function getUserPanel(userId) {
  const data = JSON.parse(localStorage.getItem('data'));
  const user = data.users.find((elem) => elem.id === userId);

  return `
    <div class="auth-info__pic">
      <img src="/res/img/account.png">
    </div>
    <div class="auth-info__name">
      ${user.name}
    </div>
    <div class="auth-info__logout">
      <img src="/res/img/logout.png" onclick="logoutUser();">
    </div>
  `;
}

function logUser() {
  const data = JSON.parse(localStorage.getItem('data'));
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  if(username === '' || password === '') {
    document.querySelector('.login-error').innerHTML = `
      Please fill username and password fields
    `;
    return;
  }

  user = data.users.find((elem) => elem.username === username);
  if(user === undefined) {
    document.querySelector('.login-error').innerHTML = `
      Wrong username or password. Please try again.
    `;
    return;
  }

  if(user.password === password) {
    sessionStorage.setItem('userId', user.id);
    window.location = '/';
  } else {
    document.querySelector('.login-error').innerHTML = `
      Wrong username or password. Please try again.
    `;
    return;
  }
}

function logoutUser() {
  sessionStorage.removeItem('userId');
  window.location = '/';
}

function regUser() {
  const data = JSON.parse(localStorage.getItem('data'));
  const fullname = document.querySelector('#fullname').value;
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const passwordConfirm = document.querySelector('#password-confirm').value;

  if(fullname === '' || username === '' || password === '' || passwordConfirm === '') {
    document.querySelector('.login-error').innerHTML = `
      Please fill all the fields.
    `;
    return;
  }

  const user = data.users.find((elem) => elem.username === username);
  if(user != undefined && user != null) {
    document.querySelector('.login-error').innerHTML = `
      User with this username already exists.
    `;
    return;
  }

  if(password != passwordConfirm) {
    document.querySelector('.login-error').innerHTML = `
      Passwords don't match
    `;
    return;
  }

  data.users.push({
    id: getNewId(data),
    name: fullname,
    username: username,
    password: password,
    avatar: ''
  });
  localStorage.setItem('data', JSON.stringify(data));
  window.location = '/#/auth';
}

function getNewId(data) {
  const users = data.users
    .slice()
    .sort((elem1, elem2) => elem2.id - elem1.id);
  return String(Number(users.shift().id) + 1);
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
    if(questionObject.correct_answer === userAnswer.innerText) {
      userAnswer.classList.add('question__answers-text--correct');
    } else {
      userAnswer.classList.add('question__answers-text--wrong');
      const allAnswers = document.querySelectorAll('input[name="radio-answers"] + label > .question__answers-text');
      allAnswers.forEach((item) => {
        if(questionObject.correct_answer === item.innerText) {
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

  tempTestObject.score = Math.floor((correctAnswers.length / testObject.question_ids.length) * 100);
  tempTestObject.time = document.querySelector('.test__timer-hidden').innerText;
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
  testResult = storeTestInDb();
  const data = JSON.parse(localStorage.getItem('data'));
  const testObject = data.tests.find((item) => item.id === testResult.testId);
  const correctAnswers = testResult.questions.filter((item) => {
    const question = data.questions.find((elem) => elem.id === item.question_id);
    return item.userAnswer == question.correct_answer;
  });
  const resultString = `
    <p>Total question count: ${testObject.question_ids.length}</p>
    <p>Questions passed: ${testResult.questions.length}</p>
    <p>Correct answers: ${correctAnswers.length}</p>
    <p>Test time: ${testResult.time}</p>
    <p>Score: ${testResult.score}%</p>
  `;
  document.querySelector('main').innerHTML = resultString;
  localStorage.removeItem('tempTest');
}
