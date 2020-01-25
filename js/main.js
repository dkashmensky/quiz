/*jshint esversion: 6 */

(() => {
  const getData = localStorage.getItem('data');
  if(getData === undefined || getData === null) {
    fetch('/json/data.json')
      .then(response => response.json())
      .then((json) => {
         localStorage.setItem('data', JSON.stringify(json));
      });
  }
})();

window.addEventListener('load', render);
window.addEventListener('popstate', render);

function render() {
  renderHeader();
  const path = window.location.pathname;
  const pageName = path.split('/')[1];

  switch (pageName) {
    case 'category':
      renderTestsList();
      break;
    case 'categories':
      renderCategories();
      break;
    case 'test':
      renderTest();
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
    case 'alltests':
      renderAllTests();
      break;
    case 'search':
      renderSearch();
      break;
    default:
      renderMain();
      break;
  }
}

function navigate(path) {
  //event.preventDefault();
  window.history.pushState(
    {},
    path,
    window.location.origin + path
  );
}

function renderHeader() {
  const data = JSON.parse(localStorage.getItem('data'));

  let authInfo = '';
  const user = getUser();
  let menuItems = '';
  if(user === undefined || user === null) {
    authInfo = `
      <a href="" onclick="navigate('/auth', event)">
        <button class="grey-btn">Log in</button>
      </a>
      <a href="" onclick="navigate('/register', event)">
        <button class="purple-btn">Sign up</button>
      </a>
    `;
  } else {
    authInfo = getUserPanel(user);
    menuItems += `
      <li>
        <a href="" onclick="navigate('/stats')">
          <div>Statistics</div>
        </a>
      </li>
    `;
  }

  const subCats = data.categories
    .map((item) => {
      return `
        <li>
          <a href="" onclick="navigate('/category?id=${item.id}')">
            ${item.name}
          </a>
        </li>
      `;
    })
    .join('');

  const header = `
  <div class="menu-switch">
    <ul class="main-menu">
      <li>
        <a href="" onclick="navigate('/')">
          <div>Home</div>
        </a>
      </li>
      <li>
        <a href="" onclick="navigate('/categories')">Categories</a>
        <ul class=main-menu__sub>
          ${subCats}
        </ul>
      </li>
      <li>
        <a href="" onclick="navigate('/alltests')">All tests</a>
      </li>
      <li>
        <a href="" onclick="navigate('/search')">Search</a>
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
      <div class="login-container">
        <div>
          Please enter your username and password
        </div>
        <div>
          <form class="login-form">
            <div>
              <input type="text" value="" placeholder="Your Username" id="username">
            </div>
            <div>
              <input type="password" value="" placeholder="Your Password" id="password">
            </div>
            <div>
              <button class="purple-btn">Log In</button>
            </div>
          </form>
        </div>
        <div>
          <a href="" onclick="navigate('/register')">Don't have an account? Sign up!</a>
        </div>
        <div class="login-error">

        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = auth;

  document.querySelector('.login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    logUser();
  });
}

function renderRegister() {
  const register = `
    <section>
      <div class="reg-container">
        <div>
          Please fill out the form to create an account
        </div>
        <div>
          <form class="reg-form">
            <div>
              <input type="text" value="" placeholder="Your Fullname" id="fullname">
            </div>
            <div>
              <input type="text" value="" placeholder="Your Username" id="username">
            </div>
            <div>
              <input type="password" value="" placeholder="Your Password" id="password">
            </div>
            <div>
              <input type="password" value="" placeholder="Confirm Password" id="password-confirm">
            </div>
            <div>
              <button type="submit" class="purple-btn">Sign Up</button>
            </div>
          </form>
        <div>
        <div class="reg-error">

        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = register;

  document.querySelector('.reg-form').addEventListener('submit', (event) => {
    event.preventDefault();
    regUser();
  });
}

function renderMain() {
  const data = JSON.parse(localStorage.getItem('data'));

  const homepage = data.categories
    .map((cat) => {
      let testsByCat = data.tests
        .reverse()
        .filter((test) => {
          return test.category_id === cat.id;
        });

      testsByCat = testsByCat.slice(0, 3);

      const testsMarkup = testsByCat
        .map((test) => {
          return `
            <div class="category__test">
              <a href="" onclick="navigate('/test?id=${test.id}')">
                <div class="category__img-wrapper">
                  <img src="${cat.img}">
                </div>
                <div class="category__test-name">
                  ${test.name}
                </div>
              </a>
            </div>
          `;
        })
        .join('');

      return `
        <section>
          <div class="category">
            <div class="category__header">
              <h1>${cat.name}</h1>
              <a href="" onclick="navigate('/category?id=${cat.id}')">
                <button class="grey-btn">More</button>
              </a>
            </div>
            ${testsMarkup}
          </div>
        </section>
      `;
    })
    .join('');

  document.querySelector('main').innerHTML = homepage;
}

function renderCategories() {
  const data = JSON.parse(localStorage.getItem('data'));

  const categoriesList = data.categories
    .map((item) => {
      return `
        <div class="category__test">
          <a href="" onclick="navigate('/category?id=${item.id}')">
            <div class="category__img-wrapper">
              <img src="${item.img}">
            </div>
            <div class="category__test-name">
              ${item.name}
            </div>
          </a>
        </div>
      `;
    })
    .join('');

  const categoriesMarkup = `
    <section>
      <div class="category">
        <div class="category__header">
          <h1>Categories</h1>
        </div>
        ${categoriesList}
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = categoriesMarkup;
}

function renderAllTests() {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get('page') != null ? Number(searchParams.get('page')) : 1;
  const data = JSON.parse(localStorage.getItem('data'));

  const filteredTests = filterTests(data.tests, page);

  const testsList = filteredTests
    .map(item => {
      return `
      <li>
        <a href="" onclick="navigate('/test?id=${item.id}')">
          <div class="test-cat__item">
            ${item.name}
          </div>
        </a>
      </li>
      `;
    })
    .join('');

  const paging = getPaging(page, data.tests);

  const testsListContainer = `
    <section>
      <div class="test-cat">
        <h1>All tests</h1>
        <ul>
          ${testsList}
        </ul>
      </div>
      ${paging}
    </section>
  `;

  document.querySelector('main').innerHTML = testsListContainer;
}

function getPaging(page, items, itemsPerPage = 10) {
  // TODO: REFACTOR IF POSSIBLE
  const pagesCount = Math.ceil(items.length / itemsPerPage);

  const pageBack = page - 1 > 0 ? page - 1 : 1;
  const pageLast = pagesCount;
  const pageNext = page + 1 <= pagesCount ? page + 1 : pagesCount;

  const pagesBefore = `
    ${page - 2 > 0 ? `<div><a href="" onclick="navigate('/alltests?page=${page - 2}')">${page - 2}</a></div>` : ``}
    ${page - 1 > 0 ? `<div><a href="" onclick="navigate('/alltests?page=${page - 1}')">${page - 1}</a></div>` : ``}
  `;

  const pagesAfter = `
    ${page + 1 <= pagesCount ? `<div><a href="" onclick="navigate('/alltests?page=${page + 1}')">${page + 1}</a></div>` : ``}
    ${page + 2 <= pagesCount ? `<div><a href="" onclick="navigate('/alltests?page=${page + 2}')">${page + 2}</a></div>` : ``}
  `;

  return `
    <div class="paging-container">
      <div class="test-paging">
        <div class="test-paging__first">
          <a href="" onclick="navigate('/alltests?page=1')">
            <img src="/res/img/first.png">
          </a>
        </div>
        <div class="test-paging__back">
          <a href="" onclick="navigate('/alltests?page=${pageBack}')">
            <img src="/res/img/back.png">
          </a>
        </div>
        <div class="test-paging__pages">
          ${pagesBefore}
          <div class="active-page"><a href="" onclick="navigate('/alltests?page=${page}')">${page}</a></div>
          ${pagesAfter}
        </div>
        <div class="test-paging__next">
          <a href="" onclick="navigate('/alltests?page=${pageNext}')">
            <img src="/res/img/next.png">
          </a>
        </div>
        <div class="test-paging__last">
          <a href="" onclick="navigate('/alltests?page=${pageLast}')">
            <img src="/res/img/last.png">
          </a>
        </div>
      </div>
    </div>
  `;
}

function filterTests(items, pageId, itemsPerPage = 10) {
  if(pageId < 1) {
    pageId = 1;
  }

  const filtered = items.filter((item, index) => {
    const page = Math.floor(index / itemsPerPage);
    return page === pageId - 1;
  });

  if(filtered.length <= 0) {
    return filterTests(items, 1);
  }

  return filtered;
}

function renderTestsList() {
  const searchParams = new URLSearchParams(window.location.search);
  const catId = searchParams.get('id');
  const data = JSON.parse(localStorage.getItem('data'));
  const category = data.categories.find((item) => {
    return item.id === catId;
  });

  const testsList = data.tests
    .filter((item) => {
      return item.category_id === catId;
    })
    .map(item => {
      return `
      <li>
        <a href="" onclick="navigate('/test?id=${item.id}')">
          <div class="test-cat__item">
            ${item.name}
          </div>
        </a>
      </li>
      `;
    })
    .join('');

  const testsListContainer = `
    <div class="test-cat">
      <h1>${category.name}</h1>
      <ul>
        ${testsList}
      </ul>
    </div>
  `;

  document.querySelector('main').innerHTML = testsListContainer;
}

function renderSearch() {
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('query');
  const category = searchParams.get('cat');
  const data = JSON.parse(localStorage.getItem('data'));

  const catOptions = data.categories
    .map((item) => {
      return `
        <option value="${item.id}"${category && category == item.id ? ' selected' : ''}>
          ${item.name}
        </option>
      `;
    })
    .join('');

  const results = getSearchResults(data, searchQuery, category);

  const searchMarkup = `
    <section>
      <div class="search-container">
        <div>
          <h1>Search</h1>
        </div>
        <div>
          <form class="search-form" action="">
            <div>
              <label for="search-field">Search query: </label>
              <input type="text" id="search-field" value="${searchQuery ? searchQuery : ''}">
            </div>
            <div>
              <label for="search-cat">In category: </label>
              <select id="search-cat" value="">
                <option value=""${!category ? ' selected' : ''}></option>
                ${catOptions}
              </select>
            </div>
            <div>
              <button type="submit" class="purple-btn">Search</button>
            </div>
          </form>
        </div>
        <div class="search-result">
          <h2>Results:</h2>
          ${results}
        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = searchMarkup;

  document.querySelector('.search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    navigate('/search?' + getSearchString());
    renderSearch();
  });
}

function getSearchString() {
  let searchString = '';

  searchString += `query=${document.querySelector('#search-field').value}`;
  searchString += `&cat=${document.querySelector('#search-cat').value}`;

  return searchString;
}

function getSearchResults(data, text, cat, notpassed) {
  let result = '';
  text = text ? text : '';
  cat = cat ? cat : '';
  notpassed = notpassed ? notpassed : false;

  if(text == '' && cat == '') {
    return '';
  }

  if(text != '') {
    const queryCats = data.categories.filter((item) => {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });

    if(queryCats.length > 0) {
      const catsResult = queryCats
        .map((item) => {
          return `
            <li>
              <a href="" onclick="navigate('/category?id=${item.id}')">
                <div class="test-cat__item">
                  ${item.name}
                </div>
              </a>
            </li>
          `;
        })
        .join('');

      result += `
        <div class="search-result-header">
          <h2>Categories</h2>
        </div>
        <div class="test-cat">
          <ul>
            ${catsResult}
          </ul>
        </div>
      `;
    }
  }

  let queryTests = data.tests.filter((item) => {
    return item.name.toLowerCase().includes(text.toLowerCase());
  });

  if(cat != '') {
    queryTests = queryTests.filter((item) => {
      return item.category_id == cat;
    });
  }

  if(queryTests.length > 0) {
    const testsResult = queryTests
      .map((item) => {
        return `
          <li>
            <a href="" onclick="navigate('/test?id=${item.id}')">
              <div class="test-cat__item">
                ${item.name}
              </div>
            </a>
          </li>
        `;
      })
      .join('');

    result += `
      <div class="search-result-header">
        <h2>Tests</h2>
      </div>
      <div class="test-cat">
        <ul>
          ${testsResult}
        </ul>
      </div>
    `;
  }

  if(result === '') {
    result = 'Nothing found. Please change search parameters';
  }

  return result;
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

  user = data.users.find((elem) => elem.username.toLowerCase() === username.toLowerCase());
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
    document.querySelector('.reg-error').innerHTML = `
      Please fill all the fields.
    `;
    return;
  }

  const user = data.users.find((elem) => elem.username === username);
  if(user != undefined && user != null) {
    document.querySelector('.reg-error').innerHTML = `
      User with this username already exists.
    `;
    return;
  }

  if(password != passwordConfirm) {
    document.querySelector('.reg-error').innerHTML = `
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
  window.location = '/auth';
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
