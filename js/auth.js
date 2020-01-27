/*jshint esversion: 6 */
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

function getUser() {
  return sessionStorage.getItem('userId');
}

function getUserPanel(userId) {
  const data = JSON.parse(localStorage.getItem('data'));
  const user = data.users.find((elem) => elem.id === userId);

  return `
    <div class="auth-info__home">
      <a href="" onclick="navigate('/')">
        <img src="/res/img/home.png">
      </a>
    </div>
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
