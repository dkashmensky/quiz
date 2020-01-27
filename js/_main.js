
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*jshint esversion: 6 */
// (function () {
//   var getData = localStorage.getItem('data');
//
//   if (getData === undefined || getData === null) {
//     fetch('/json/data.json').then(function (response) {
//       return response.json();
//     }).then(function (json) {
//       localStorage.setItem('data', JSON.stringify(json));
//     });
//   }
// })();
(function () {
  var getData = localStorage.getItem('data');

  if (getData === undefined || getData === null) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        localStorage.setItem('data', JSON.stringify(JSON.parse(xhttp.responseText)));
        console.log(JSON.stringify(JSON.parse(xhttp.responseText)));
      }
    };

    xhttp.open("GET", "/json/data.json", true);
    xhttp.send();
  }
})();

window.addEventListener('load', render);
window.addEventListener('popstate', render);

function render() {
  renderHeader();
  var path = window.location.pathname;
  var pageName = path.split('/')[1];

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

    case 'about':
      renderAbout();
      break;

    case 'result':
      renderResult();
      break;

    default:
      renderMain();
      break;
  }
}

function navigate(path) {
  //event.preventDefault();
  window.history.pushState({}, path, window.location.origin + path);
}

function renderHeader() {
  var data = JSON.parse(localStorage.getItem('data'));
  var authInfo = '';
  var user = getUser();
  var menuItems = '';

  if (user === undefined || user === null) {
    authInfo = "\n      <a href=\"\" onclick=\"navigate('/')\" class=\"auth-info__home\">\n        <img src=\"/res/img/home.png\">\n      </a>\n      <a href=\"\" onclick=\"navigate('/auth', event)\">\n        <button class=\"grey-btn\">Log in</button>\n      </a>\n      <a href=\"\" onclick=\"navigate('/register', event)\">\n        <button class=\"purple-btn\">Sign up</button>\n      </a>\n    ";
  } else {
    authInfo = getUserPanel(user);
    menuItems += "\n      <li>\n        <a href=\"\" onclick=\"navigate('/stats')\">\n          <div>Statistics</div>\n        </a>\n      </li>\n    ";
  }

  console.log(typeof data)
  var subCats = data.categories.map(function (item) {
    var catTests = data.tests.filter(function (elem) {
      return elem.category_id == item.id;
    }).map(function (elem) {
      return "\n            <li>\n              <a href=\"\" onclick=\"navigate('/test?id=".concat(elem.id, "')\">").concat(elem.name, "</a>\n            </li>\n          ");
    }).join('');
    return "\n        <li>\n          <a href=\"\" onclick=\"navigate('/category?id=".concat(item.id, "')\">\n            ").concat(item.name, "\n          </a>\n          <ul class=\"main-menu__sub\">\n            ").concat(catTests, "\n          </ul>\n        </li>\n      ");
  }).join('');
  var header = "\n  <div class=\"menu-switch\">\n    <ul class=\"main-menu\">\n      <li>\n        <a href=\"\" onclick=\"navigate('/about')\">\n          <div>About Us</div>\n        </a>\n      </li>\n      <li>\n        <a href=\"\" onclick=\"navigate('/categories')\">Categories</a>\n        <ul class=main-menu__sub>\n          ".concat(subCats, "\n        </ul>\n      </li>\n      <li>\n        <a href=\"\" onclick=\"navigate('/alltests')\">All tests</a>\n      </li>\n      <li>\n        <a href=\"\" onclick=\"navigate('/search')\">Search</a>\n      </li>\n      ").concat(menuItems, "\n    </ul>\n  </div>\n  <div class=\"auth-info\">\n    ").concat(authInfo, "\n  </div>\n  ");
  document.querySelector('header').innerHTML = header;
  document.querySelector('.menu-switch').addEventListener('click', function () {
    document.querySelector('.main-menu').classList.toggle('visible');
  });
}

function renderAuth() {
  var user = getUser();

  if (user != null && user != undefined) {
    window.location = '/';
    return;
  }

  var auth = "\n    <section>\n      <div class=\"login-container\">\n        <div>\n          Please enter your username and password\n        </div>\n        <div>\n          <form class=\"login-form\">\n            <div>\n              <input type=\"text\" value=\"\" placeholder=\"Your Username\" id=\"username\">\n            </div>\n            <div>\n              <input type=\"password\" value=\"\" placeholder=\"Your Password\" id=\"password\">\n            </div>\n            <div>\n              <button class=\"purple-btn\">Log In</button>\n            </div>\n          </form>\n        </div>\n        <div>\n          <a href=\"\" onclick=\"navigate('/register')\">Don't have an account? Sign up!</a>\n        </div>\n        <div class=\"login-error\">\n\n        </div>\n      </div>\n    </section>\n  ";
  document.querySelector('main').innerHTML = auth;
  document.querySelector('.login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    logUser();
  });
}

function renderRegister() {
  var register = "\n    <section>\n      <div class=\"reg-container\">\n        <div>\n          Please fill out the form to create an account\n        </div>\n        <div>\n          <form class=\"reg-form\">\n            <div>\n              <input type=\"text\" value=\"\" placeholder=\"Your Fullname\" id=\"fullname\">\n            </div>\n            <div>\n              <input type=\"text\" value=\"\" placeholder=\"Your Username\" id=\"username\">\n            </div>\n            <div>\n              <input type=\"password\" value=\"\" placeholder=\"Your Password\" id=\"password\">\n            </div>\n            <div>\n              <input type=\"password\" value=\"\" placeholder=\"Confirm Password\" id=\"password-confirm\">\n            </div>\n            <div>\n              <button type=\"submit\" class=\"purple-btn\">Sign Up</button>\n            </div>\n          </form>\n        <div>\n        <div class=\"reg-error\">\n\n        </div>\n      </div>\n    </section>\n  ";
  document.querySelector('main').innerHTML = register;
  document.querySelector('.reg-form').addEventListener('submit', function (event) {
    event.preventDefault();
    regUser();
  });
}

function renderMain() {
  var data = JSON.parse(localStorage.getItem('data'));
  var homepage = data.categories.map(function (cat) {
    var testsByCat = data.tests.reverse().filter(function (test) {
      return test.category_id === cat.id;
    });
    testsByCat = testsByCat.slice(0, 3);
    var testsMarkup = testsByCat.map(function (test) {
      return "\n            <div class=\"category__test\">\n              <a href=\"\" onclick=\"navigate('/test?id=".concat(test.id, "')\">\n                <div class=\"category__img-wrapper\">\n                  <img src=\"").concat(cat.img, "\">\n                </div>\n                <div class=\"category__test-name\">\n                  ").concat(test.name, "\n                </div>\n              </a>\n            </div>\n          ");
    }).join('');
    return "\n        <section class=\"category\">\n          <div class=\"category__header\">\n            <h1>".concat(cat.name, "</h1>\n            <a href=\"\" onclick=\"navigate('/category?id=").concat(cat.id, "')\">\n              <button class=\"grey-btn\">More</button>\n            </a>\n          </div>\n          <div class=\"category-container\">\n            ").concat(testsMarkup, "\n          </div>\n        </section>\n      ");
  }).join('');
  document.querySelector('main').innerHTML = homepage;
}

function renderAbout() {
  var data = JSON.parse(localStorage.getItem('data'));
  var photos = data.photos.map(function (item, index) {
    return "\n        <div class=\"gallery__photo".concat(index == 0 ? ' active-photo' : '', "\" id=\"photo-").concat(index, "\">\n          <img src=\"").concat(item, "\">\n        </div>\n      ");
  }).join('');
  var switchers = data.photos.map(function (item, index) {
    return "\n        <div class=\"gallery__mini".concat(index == 0 ? ' active-mini' : '', "\">\n          <img src=\"").concat(item, "\" class=\"photo-").concat(index, "\" onclick=\"switchPhoto(this)\">\n        </div>\n      ");
  }).join('');
  var about = "\n    <section>\n      <div class=\"about-container\">\n        <div class=\"about-header\">\n          <h1>About Us</h1>\n        </div>\n        <div>\n          We are educational company that provide courses and tests\n        </div>\n        <div class=\"gallery\">\n          <div class=\"gallery__content\">\n            ".concat(photos, "\n          </div>\n          <div class=\"gallery__switcher\">\n            ").concat(switchers, "\n          </div>\n        </div>\n      </div>\n      <div class=\"contacts-container\">\n        <div class=\"contacts-header\">\n          <h1>Contacts</h1>\n        </div>\n        <div>\n          You can find our contact information and location map below\n        </div>\n        <div class=\"contacts__body\">\n          <div class=\"contacts__map\">\n            <iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.755213998221!2d30.51154060099725!3d50.44566002397757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce5802407267%3A0x5b296e9450093a05!2sCoworking%20Platforma%20Leonardo!5e0!3m2!1sen!2sua!4v1580047652486!5m2!1sen!2sua\" width=\"400\" height=\"300\" frameborder=\"0\" style=\"border:0;\" allowfullscreen=\"\"></iframe>\n          </div>\n          <div class=\"contacts__email\">\n            <div>\n              General inquiries:<br>\n              <a href=\"mailto:info@example.com\">info@example.com</a>\n            </div>\n            <div>\n              Technical support:<br>\n              <a href=\"mailto:support@example.com\">support@example.com</a>\n            </div>\n            <div>\n              Sales:<br>\n              <a href=\"mailto:sales@example.com\">sales@example.com</a>\n            </div>\n          </div>\n          <div class=\"contacts__phone\">\n            <div>\n              <div class=\"contacts__flag\">\n                <img src=\"/res/img/ukraine.png\">\n              </div>\n              <div>\n                <a href=\"tel:+380441234567\">+380 44 123 4567</a>\n              </div>\n            </div>\n            <div>\n              <div class=\"contacts__flag\">\n                <img src=\"/res/img/usa.png\">\n              </div>\n              <div>\n                <a href=\"tel:+18881234567\">+1 888 123 4567</a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = about;
}

function switchPhoto(elem) {
  document.querySelectorAll('.gallery__photo').forEach(function (item) {
    item.classList.remove('active-photo');
  });
  document.querySelector('#' + elem.classList[0]).classList.add('active-photo');
  document.querySelectorAll('.gallery__mini').forEach(function (item) {
    item.classList.remove('active-mini');
  });
  elem.parentElement.classList.add('active-mini');
}

function renderCategories() {
  var data = JSON.parse(localStorage.getItem('data'));
  var categoriesList = data.categories.map(function (item) {
    return "\n        <div class=\"category__test\">\n          <a href=\"\" onclick=\"navigate('/category?id=".concat(item.id, "')\">\n            <div class=\"category__img-wrapper\">\n              <img src=\"").concat(item.img, "\">\n            </div>\n            <div class=\"category__test-name\">\n              ").concat(item.name, "\n            </div>\n          </a>\n        </div>\n      ");
  }).join('');
  var categoriesMarkup = "\n    <section class=\"category\">\n      <div class=\"category__header\">\n        <h1>Categories</h1>\n      </div>\n      <div class=\"category-container\">\n        ".concat(categoriesList, "\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = categoriesMarkup;
}

function renderAllTests() {
  var searchParams = new URLSearchParams(window.location.search);
  var page = searchParams.get('page') != null ? Number(searchParams.get('page')) : 1;
  var data = JSON.parse(localStorage.getItem('data'));
  var filteredTests = filterTests(data.tests, page);
  var testsList = filteredTests.map(function (item) {
    return "\n      <li>\n        <a href=\"\" onclick=\"navigate('/test?id=".concat(item.id, "')\">\n          <div class=\"test-cat__item\">\n            ").concat(item.name, "\n          </div>\n        </a>\n      </li>\n      ");
  }).join('');
  var paging = getPaging(page, data.tests);
  var testsListContainer = "\n    <section>\n      <div class=\"test-cat\">\n        <h1>All tests</h1>\n        <ul>\n          ".concat(testsList, "\n        </ul>\n      </div>\n      ").concat(paging, "\n    </section>\n  ");
  document.querySelector('main').innerHTML = testsListContainer;
}

function getPaging(page, items) {
  var itemsPerPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  // TODO: REFACTOR IF POSSIBLE
  var pagesCount = Math.ceil(items.length / itemsPerPage);
  var pageBack = page - 1 > 0 ? page - 1 : 1;
  var pageLast = pagesCount;
  var pageNext = page + 1 <= pagesCount ? page + 1 : pagesCount;
  var pagesBefore = "\n    ".concat(page - 2 > 0 ? "<div><a href=\"\" onclick=\"navigate('/alltests?page=".concat(page - 2, "')\">").concat(page - 2, "</a></div>") : "", "\n    ").concat(page - 1 > 0 ? "<div><a href=\"\" onclick=\"navigate('/alltests?page=".concat(page - 1, "')\">").concat(page - 1, "</a></div>") : "", "\n  ");
  var pagesAfter = "\n    ".concat(page + 1 <= pagesCount ? "<div><a href=\"\" onclick=\"navigate('/alltests?page=".concat(page + 1, "')\">").concat(page + 1, "</a></div>") : "", "\n    ").concat(page + 2 <= pagesCount ? "<div><a href=\"\" onclick=\"navigate('/alltests?page=".concat(page + 2, "')\">").concat(page + 2, "</a></div>") : "", "\n  ");
  return "\n    <div class=\"paging-container\">\n      <div class=\"test-paging\">\n        <div class=\"test-paging__first\">\n          <a href=\"\" onclick=\"navigate('/alltests?page=1')\">\n            <img src=\"/res/img/first.png\">\n          </a>\n        </div>\n        <div class=\"test-paging__back\">\n          <a href=\"\" onclick=\"navigate('/alltests?page=".concat(pageBack, "')\">\n            <img src=\"/res/img/back.png\">\n          </a>\n        </div>\n        <div class=\"test-paging__pages\">\n          ").concat(pagesBefore, "\n          <div class=\"active-page\"><a href=\"\" onclick=\"navigate('/alltests?page=").concat(page, "')\">").concat(page, "</a></div>\n          ").concat(pagesAfter, "\n        </div>\n        <div class=\"test-paging__next\">\n          <a href=\"\" onclick=\"navigate('/alltests?page=").concat(pageNext, "')\">\n            <img src=\"/res/img/next.png\">\n          </a>\n        </div>\n        <div class=\"test-paging__last\">\n          <a href=\"\" onclick=\"navigate('/alltests?page=").concat(pageLast, "')\">\n            <img src=\"/res/img/last.png\">\n          </a>\n        </div>\n      </div>\n    </div>\n  ");
}

function filterTests(items, pageId) {
  var itemsPerPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

  if (pageId < 1) {
    pageId = 1;
  }

  var filtered = items.filter(function (item, index) {
    var page = Math.floor(index / itemsPerPage);
    return page === pageId - 1;
  });

  if (filtered.length <= 0) {
    return filterTests(items, 1);
  }

  return filtered;
}

function renderTestsList() {
  var searchParams = new URLSearchParams(window.location.search);
  var catId = searchParams.get('id');
  var data = JSON.parse(localStorage.getItem('data'));
  var category = data.categories.find(function (item) {
    return item.id === catId;
  });
  var testsList = data.tests.filter(function (item) {
    return item.category_id === catId;
  }).map(function (item) {
    return "\n      <li>\n        <a href=\"\" onclick=\"navigate('/test?id=".concat(item.id, "')\">\n          <div class=\"test-cat__item\">\n            ").concat(item.name, "\n          </div>\n        </a>\n      </li>\n      ");
  }).join('');
  var testsListContainer = "\n    <div class=\"test-cat\">\n      <h1>".concat(category.name, "</h1>\n      <ul>\n        ").concat(testsList, "\n      </ul>\n    </div>\n  ");
  document.querySelector('main').innerHTML = testsListContainer;
}

function renderSearch() {
  var searchParams = new URLSearchParams(window.location.search);
  var searchQuery = searchParams.get('query');
  var category = searchParams.get('cat');
  var data = JSON.parse(localStorage.getItem('data'));
  var catOptions = data.categories.map(function (item) {
    return "\n        <option value=\"".concat(item.id, "\"").concat(category && category == item.id ? ' selected' : '', ">\n          ").concat(item.name, "\n        </option>\n      ");
  }).join('');
  var results = getSearchResults(data, searchQuery, category);
  var searchMarkup = "\n    <section>\n      <div class=\"search-container\">\n        <div>\n          <h1>Search</h1>\n        </div>\n        <div class=\"search-inputs\">\n          <form class=\"search-form\" action=\"\">\n            <div>\n              <label for=\"search-field\">Search query: </label>\n              <input type=\"text\" id=\"search-field\" value=\"".concat(searchQuery ? searchQuery : '', "\">\n            </div>\n            <div>\n              <label for=\"search-cat\">In category: </label>\n              <select id=\"search-cat\" value=\"\">\n                <option value=\"\"").concat(!category ? ' selected' : '', "></option>\n                ").concat(catOptions, "\n              </select>\n            </div>\n            <div>\n              <button type=\"submit\" class=\"purple-btn\">Search</button>\n            </div>\n          </form>\n        </div>\n        <div class=\"search-result\">\n          <h2>Results:</h2>\n          ").concat(results, "\n        </div>\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = searchMarkup;
  document.querySelector('.search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    navigate('/search?' + getSearchString());
    renderSearch();
  });
}

function getSearchString() {
  var searchString = '';
  searchString += "query=".concat(document.querySelector('#search-field').value);
  searchString += "&cat=".concat(document.querySelector('#search-cat').value);
  return searchString;
}

function getSearchResults(data, text, cat, notpassed) {
  var result = '';
  text = text ? text : '';
  cat = cat ? cat : '';
  notpassed = notpassed ? notpassed : false;

  if (text == '' && cat == '') {
    return '';
  }

  if (text != '') {
    var queryCats = data.categories.filter(function (item) {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });

    if (queryCats.length > 0) {
      var catsResult = queryCats.map(function (item) {
        return "\n            <li>\n              <a href=\"\" onclick=\"navigate('/category?id=".concat(item.id, "')\">\n                <div class=\"test-cat__item\">\n                  ").concat(item.name, "\n                </div>\n              </a>\n            </li>\n          ");
      }).join('');
      result += "\n        <div class=\"search-result-header\">\n          <h2>Categories</h2>\n        </div>\n        <div class=\"test-cat\">\n          <ul>\n            ".concat(catsResult, "\n          </ul>\n        </div>\n      ");
    }
  }

  var queryTests = data.tests.filter(function (item) {
    return item.name.toLowerCase().includes(text.toLowerCase());
  });

  if (cat != '') {
    queryTests = queryTests.filter(function (item) {
      return item.category_id == cat;
    });
  }

  if (queryTests.length > 0) {
    var testsResult = queryTests.map(function (item) {
      return "\n          <li>\n            <a href=\"\" onclick=\"navigate('/test?id=".concat(item.id, "')\">\n              <div class=\"test-cat__item\">\n                ").concat(item.name, "\n              </div>\n            </a>\n          </li>\n        ");
    }).join('');
    result += "\n      <div class=\"search-result-header\">\n        <h2>Tests</h2>\n      </div>\n      <div class=\"test-cat\">\n        <ul>\n          ".concat(testsResult, "\n        </ul>\n      </div>\n    ");
  }

  if (result === '') {
    result = 'Nothing found. Please change search parameters';
  }

  return result;
}

function renderTest() {
  var searchParams = new URLSearchParams(window.location.search);
  var itemId = searchParams.get('id');
  var data = JSON.parse(localStorage.getItem('data'));
  var testObject = data.tests.find(function (item) {
    return item.id === itemId;
  });
  var user = getUser();
  var startInfo = "<button class=\"purple-btn\" onclick=\"startTest('".concat(testObject.id, "')\">Start</button>");

  if (user == null || user == undefined) {
    startInfo = "Please log in to start test";
  }

  var renderedTest = "\n  <section>\n    <div class=\"test-container\">\n      <div>\n        <h1>".concat(testObject.name, "</h1>\n      </div>\n      <div>\n        <h2>Description</h2>\n        <p>").concat(testObject.desc, "</p>\n      </div>\n      <div class=\"test-start\">\n        ").concat(startInfo, "\n      </div>\n    </div>\n  </section>\n  ");
  document.querySelector('main').innerHTML = renderedTest;
}

function renderStats() {
  var user = getUser();

  if (user == null || user == undefined) {
    window.location = '/';
    return;
  }

  var data = JSON.parse(localStorage.getItem('data'));
  var userTests = data.passedTests.filter(function (elem) {
    return elem.userId === user;
  });

  var passedTests = _toConsumableArray(new Set(userTests.map(function (test) {
    return test.testId;
  })));

  var testHistory = passedTests.map(function (item) {
    var testName = data.tests.find(function (elem) {
      return elem.id == item;
    }).name;
    return "\n        <li>\n          <a href=\"\" onclick=\"navigate('/result?id=".concat(item, "')\">\n            <div class=\"test-cat__item\">\n              ").concat(testName, "\n            </div>\n          </a>\n        </li>\n      ");
  }).join('');
  var stats = "\n    <section>\n      <div class=\"test-cat\">\n        <h1>Your passed tests</h1>\n        <ul>\n          ".concat(testHistory, "\n        </ul>\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = stats;
}

function renderResult() {
  var user = getUser();

  if (user == null || user == undefined) {
    window.location = '/';
    return;
  }

  var searchParams = new URLSearchParams(window.location.search);
  var testId = searchParams.get('id');
  var data = JSON.parse(localStorage.getItem('data'));
  var testObject = data.tests.find(function (item) {
    return item.id == testId;
  });
  var personTests = data.passedTests.filter(function (item) {
    return item.testId == testId && item.userId == user;
  }).sort(function (item1, item2) {
    return Number(item2.score) - Number(item1.score);
  });
  var allTests = data.passedTests.filter(function (item) {
    return item.testId == testId;
  });
  var flatScores = allTests.map(function (item) {
    return Number(item.score);
  });
  var personFlatScores = personTests.map(function (item) {
    return Number(item.score);
  });
  var personHighscore = Math.max.apply(Math, _toConsumableArray(personFlatScores));
  var highestScore = Math.max.apply(Math, _toConsumableArray(flatScores));
  var lowestScore = Math.min.apply(Math, _toConsumableArray(flatScores));
  var sumScore = flatScores.reduce(function (acc, item) {
    return acc + item;
  });
  var averageScore = Math.floor(sumScore / allTests.length);
  var questionRows = testObject.question_ids.map(function (question) {
    var questionObject = data.questions.find(function (elem) {
      return elem.id == question;
    });
    var resultObject = {
      text: questionObject.question,
      correct: questionObject.correct_answer,
      answers: [],
      other_answers: []
    };
    resultObject.answers = personTests.map(function (test) {
      return test.questions.find(function (element) {
        return element.question_id == question;
      }).userAnswer;
    });
    resultObject.other_answers = allTests.map(function (test) {
      return test.questions.find(function (element) {
        return element.question_id == question;
      }).userAnswer;
    });
    var sumOtherScores = resultObject.other_answers.map(function (other) {
      if (other == resultObject.correct) {
        return 1;
      } else {
        return 0;
      }
    }).reduce(function (acc, point) {
      return acc + point;
    });
    var avScoreByQuestion = Math.floor(sumOtherScores / resultObject.other_answers.length * 100);
    var answers = resultObject.answers.map(function (result) {
      return "\n            <tr>\n              <td>\n              </td>\n              <td class=\"".concat(result == resultObject.correct ? 'correct' : 'wrong', "\">\n                ").concat(result, "\n              </td>\n              <td class=\"").concat(result == resultObject.correct ? 'correct' : 'wrong', "\">\n                ").concat(resultObject.correct, "\n              </td>\n              <td class=\"").concat(result == resultObject.correct ? 'correct' : 'wrong', "\">\n                ").concat(avScoreByQuestion, "%\n              </td>\n            </tr>\n          ");
    }).join('');
    return "\n        <tr>\n          <td colspan=\"4\" class=\"question\">\n            ".concat(resultObject.text, "\n          </td>\n        </tr>\n        ").concat(answers, "\n      ");
  }).join('');
  var resultMarkup = "\n    <section>\n      <div class=\"result-container\">\n        <div class=\"result-header\">\n          <h1>Statistics - ".concat(testObject.name, "</h1>\n        </div>\n        <div class=\"results\">\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Your Highscore\n            </div>\n            <div class=\"results__round results__round--score\">\n              ").concat(personHighscore, "%\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Average Score\n            </div>\n            <div class=\"results__round\">\n              ").concat(averageScore, "%\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Highest Score\n            </div>\n            <div class=\"results__round\">\n              ").concat(highestScore, "%\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Lowest Score\n            </div>\n            <div class=\"results__round\">\n              ").concat(lowestScore, "%\n            </div>\n          </div>\n        </div>\n        <div>\n          <table class=\"results-table\">\n            <thead>\n              <th>\n                Question\n              </th>\n              <th>\n                Your answer\n              </th>\n              <th>\n                Correct answer\n              </th>\n              <th>\n                Average score\n              </th>\n            </thead>\n            <tbody>\n              ").concat(questionRows, "\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = resultMarkup;
}

function getUser() {
  return sessionStorage.getItem('userId');
}

function getUserPanel(userId) {
  var data = JSON .parse(localStorage.getItem('data'));
  console.log(data.users);
  var user = data.users.find(function (elem) {
    return elem.id == userId;
  });
  return "\n    <div class=\"auth-info__home\">\n      <a href=\"\" onclick=\"navigate('/')\">\n        <img src=\"/res/img/home.png\">\n      </a>\n    </div>\n    <div class=\"auth-info__pic\">\n      <img src=\"/res/img/account.png\">\n    </div>\n    <div class=\"auth-info__name\">\n      ".concat(user.name, "\n    </div>\n    <div class=\"auth-info__logout\">\n      <img src=\"/res/img/logout.png\" onclick=\"logoutUser();\">\n    </div>\n  ");
}

function logUser() {
  var data = JSON.parse(localStorage.getItem('data'));
  var username = document.querySelector('#username').value;
  var password = document.querySelector('#password').value;

  if (username === '' || password === '') {
    document.querySelector('.login-error').innerHTML = "\n      Please fill username and password fields\n    ";
    return;
  }

  user = data.users.find(function (elem) {
    return elem.username.toLowerCase() === username.toLowerCase();
  });

  if (user === undefined) {
    document.querySelector('.login-error').innerHTML = "\n      Wrong username or password. Please try again.\n    ";
    return;
  }

  if (user.password === password) {
    sessionStorage.setItem('userId', user.id);
    window.location = '/';
  } else {
    document.querySelector('.login-error').innerHTML = "\n      Wrong username or password. Please try again.\n    ";
    return;
  }
}

function logoutUser() {
  sessionStorage.removeItem('userId');
  window.location = '/';
}

function regUser() {
  var data = JSON.parse(localStorage.getItem('data'));
  var fullname = document.querySelector('#fullname').value;
  var username = document.querySelector('#username').value;
  var password = document.querySelector('#password').value;
  var passwordConfirm = document.querySelector('#password-confirm').value;

  if (fullname === '' || username === '' || password === '' || passwordConfirm === '') {
    document.querySelector('.reg-error').innerHTML = "\n      Please fill all the fields.\n    ";
    return;
  }

  var user = data.users.find(function (elem) {
    return elem.username === username;
  });

  if (user != undefined && user != null) {
    document.querySelector('.reg-error').innerHTML = "\n      User with this username already exists.\n    ";
    return;
  }

  if (password != passwordConfirm) {
    document.querySelector('.reg-error').innerHTML = "\n      Passwords don't match\n    ";
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
  var users = data.users.slice().sort(function (elem1, elem2) {
    return elem2.id - elem1.id;
  });
  return String(Number(users.shift().id) + 1);
}

function randomizeArray(itemsArray) {
  var tempArray = itemsArray.slice();
  var randomIndex = Math.floor(Math.random() * tempArray.length);
  var currentIndex = tempArray.length - 1;

  while (currentIndex >= 0) {
    var tempObject = tempArray[randomIndex];
    tempArray[randomIndex] = tempArray[currentIndex];
    tempArray[currentIndex] = tempObject;
    randomIndex = Math.floor(Math.random() * tempArray.length);
    currentIndex--;
  }

  return tempArray;
}

function startTest(itemId) {
  var data = JSON.parse(localStorage.getItem('data'));
  var testObject = data.tests.find(function (item) {
    return item.id === itemId;
  });
  var testQuestions = randomizeArray(testObject.question_ids.map(function (item) {
    return data.questions.find(function (elem) {
      return elem.id === item;
    });
  }));
  questionsGenerator = createGenerator(testQuestions);
  var testTemplate = "\n  <section class=\"test\">\n    <div class=\"test__close\">\n      <img src=\"/res/img/close.png\">\n    </div>\n    <div class=\"test__progress\">\n      <!-- Progress bar -->\n    </div>\n    <div class=\"test__counter\">\n      <span class=\"test__counter-quest\"></span>\n      /\n      <span class=\"test__counter-total\">".concat(testQuestions.length, "</span>\n    </div>\n    <div class=\"test__timer\">\n      ").concat(stringifyTime(testObject.time), ":00\n    </div>\n    <div class=\"test__timer-hidden\">\n      00:00\n    </div>\n    <div class=\"question\">\n\n    </div>\n  </section>\n  ");
  document.querySelector('main').innerHTML = testTemplate;
  document.querySelector('.test__close').addEventListener('click', function () {
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
  var timer = setInterval(function () {
    // get current timer time
    try {
      var newTime, newHiddenTime, seconds, minutes;
      var curTime = String(document.querySelector('.test__timer').innerHTML).split(':');
      var hiddenTime = String(document.querySelector('.test__timer-hidden').innerHTML).split(':');
      minutes = Number(curTime[0]);
      seconds = Number(curTime[1]);
      hiddenMinutes = Number(hiddenTime[0]);
      hiddenSeconds = Number(hiddenTime[1]); // stop timer if time runs out

      if (minutes <= 0 && seconds <= 0) {
        clearInterval(timer);
        showResults();
        return;
      } // subtract one second


      if (seconds == 0) {
        seconds = 59;
        minutes--;
      } else {
        seconds--;
      }

      newTime = stringifyTime(minutes) + ':' + stringifyTime(seconds); //add for hidden

      if (hiddenSeconds == 59) {
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
  return (
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < itemsArray.length)) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return itemsArray[i];

            case 4:
              i++;
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })()
  );
}

function renderQuestion(qGen) {
  var questionObject = qGen.next();

  if (questionObject.done) {
    showResults();
    return;
  }

  var questionAnswers = questionObject.value.incorrect_answers.slice();
  questionAnswers.push(questionObject.value.correct_answer);
  questionAnswers = randomizeArray(questionAnswers);
  var question = "\n    <div class=\"question__text\">\n      ".concat(questionObject.value.question, "\n    </div>\n    <div class=\"question__answers\">\n      ").concat(questionAnswers.map(function (item, index) {
    return "\n        <div>\n          <div>\n            <input type=\"radio\" id=\"answer-".concat(index + 1, "\" name=\"radio-answers\" value=\"\">\n            <label for=\"answer-").concat(index + 1, "\">\n              <div><div></div></div>\n              <div class=\"question__answers-text\">").concat(item, "</div>\n            </label>\n          </div>\n        </div>\n        ");
  }).join(''), "\n    <div class=\"question__buttons\">\n      <button type=\"button\" onclick=\"disableAnswers(); storeAnswer('").concat(questionObject.value.id, "');\">SUBMIT</button>\n    </div>\n  ");
  document.querySelector('.question').innerHTML = question;
  updateCounter();
}

function updateCounter() {
  var currentCount = document.querySelector('.test__counter-quest');
  var totalCount = document.querySelector('.test__counter-total');

  if (currentCount.innerHTML === '') {
    currentCount.innerHTML = '1';
  } else {
    currentCount.innerHTML = Number(currentCount.innerHTML) + 1;
  }

  newProgress = Math.floor(Number(currentCount.innerHTML) / Number(totalCount.innerHTML) * 100);
  document.querySelector('.test__progress').style.width = newProgress + '%';
}

function disableAnswers() {
  if (!isChecked()) {
    return;
  }

  var radios = document.querySelectorAll('input[name="radio-answers"]');
  radios.forEach(function (elem) {
    elem.disabled = true;
  });
}

function storeAnswer(questionId) {
  if (!isChecked()) {
    return;
  }

  var userAnswer = document.querySelector('input[name="radio-answers"]:checked + label > .question__answers-text');
  var tempTestObject = JSON.parse(localStorage.getItem('tempTest'));
  tempTestObject.questions.push({
    question_id: questionId,
    userAnswer: userAnswer.innerText
  });
  localStorage.setItem('tempTest', JSON.stringify(tempTestObject));
  var data = JSON.parse(localStorage.getItem('data'));
  var questionObject = data.questions.find(function (item) {
    return item.id === questionId;
  });

  if (questionObject != undefined) {
    if (questionObject.correct_answer === userAnswer.innerText) {
      userAnswer.classList.add('question__answers-text--correct');
    } else {
      userAnswer.classList.add('question__answers-text--wrong');
      var allAnswers = document.querySelectorAll('input[name="radio-answers"] + label > .question__answers-text');
      allAnswers.forEach(function (item) {
        if (questionObject.correct_answer === item.innerText) {
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
  var data = JSON.parse(localStorage.getItem('data'));
  var tempTestObject = JSON.parse(localStorage.getItem('tempTest'));
  var correctAnswers = tempTestObject.questions.filter(function (item) {
    var question = data.questions.find(function (elem) {
      return elem.id === item.question_id;
    });
    return item.userAnswer == question.correct_answer;
  });
  var testObject = data.tests.find(function (item) {
    return item.id === tempTestObject.testId;
  });
  var testDate = new Date();
  tempTestObject.score = Math.floor(correctAnswers.length / testObject.question_ids.length * 100);
  tempTestObject.time = document.querySelector('.test__timer-hidden').innerText;
  tempTestObject.date = testDate.toString();
  data.passedTests.push(tempTestObject);
  localStorage.setItem('data', JSON.stringify(data));
  return tempTestObject;
}

function showNextBtn() {
  var nextBtn = "\n    <button type=\"button\" onclick=\"renderQuestion(questionsGenerator);\">\n      NEXT\n    </button>\n  ";
  document.querySelector('.question__buttons').innerHTML = nextBtn;
}

function showResults() {
  testResult = storeTestInDb();
  var data = JSON.parse(localStorage.getItem('data'));
  var testObject = data.tests.find(function (item) {
    return item.id === testResult.testId;
  });
  var correctAnswers = testResult.questions.filter(function (item) {
    var question = data.questions.find(function (elem) {
      return elem.id === item.question_id;
    });
    return item.userAnswer == question.correct_answer;
  });
  var resultString = "\n    <section>\n      <div class=\"result-container\">\n        <div class=\"result-header\">\n          <h1>Result</h1>\n        </div>\n        <div class=\"results\">\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Your score\n            </div>\n            <div class=\"results__round results__round--score\">\n              ".concat(testResult.score, "%\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Total question count\n            </div>\n            <div class=\"results__round\">\n              ").concat(testObject.question_ids.length, "\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Questions passed\n            </div>\n            <div class=\"results__round\">\n              ").concat(testResult.questions.length, "\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Correct answers\n            </div>\n            <div class=\"results__round\">\n              ").concat(correctAnswers.length, "\n            </div>\n          </div>\n          <div class=\"results__elem\">\n            <div class=\"results__text\">\n              Test time\n            </div>\n            <div class=\"results__round\">\n              ").concat(testResult.time, "\n            </div>\n          </div>\n        </div>\n        <div>\n          <a href=\"\" onclick=\"navigate('/alltests')\">\n            <button class=\"purple-btn results-btn\">Take another test</button>\n          </a>\n        </div>\n      </div>\n    </section>\n  ");
  document.querySelector('main').innerHTML = resultString;
  localStorage.removeItem('tempTest');
}
