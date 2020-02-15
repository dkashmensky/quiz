/*jshint esversion: 6 */
window.addEventListener('load', render);
window.addEventListener('popstate', render);

function renderHeader() {
  const data = JSON.parse(localStorage.getItem('data'));

  let authInfo = '';
  const user = getUser();
  let menuItems = '';
  if(user === undefined || user === null) {
    authInfo = `
      <a href="" onclick="navigate('/')" class="auth-info__home">
        <img src="/res/img/home.png">
      </a>
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
      const catTests = data.tests
        .filter((elem) => {
          return elem.category_id == item.id;
        })
        .map((elem) => {
          return `
            <li>
              <a href="" onclick="navigate('/test?id=${elem.id}')">${elem.name}</a>
            </li>
          `;
        })
        .join('');

      return `
        <li>
          <a href="" onclick="navigate('/category?id=${item.id}')">
            ${item.name}
          </a>
          <ul class="main-menu__sub">
            ${catTests}
          </ul>
        </li>
      `;
    })
    .join('');

  const header = `
  <nav class="menu-switch">
    <ul class="main-menu">
      <li>
        <a href="" onclick="navigate('/about')">
          <div>About Us</div>
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
  </nav>
  <div class="auth-info">
    ${authInfo}
  </div>
  `;

  document.querySelector('header').innerHTML = header;
  document.querySelector('.menu-switch').addEventListener('click', function() {
    document.querySelector('.main-menu').classList.toggle('visible');
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
        <section class="category">
          <div class="category__header">
            <h1>${cat.name}</h1>
            <a href="" onclick="navigate('/category?id=${cat.id}')">
              <button class="grey-btn">More</button>
            </a>
          </div>
          <div class="category-container">
            ${testsMarkup}
          </div>
        </section>
      `;
    })
    .join('');

  document.querySelector('main').innerHTML = homepage;
}
