/*jshint esversion: 6 */
function renderAbout() {
  const data = JSON.parse(localStorage.getItem('data'));

  const photos = data.photos
    .map((item, index) => {
      return `
        <div class="gallery__photo${index == 0 ? ' active-photo' : ''}" id="photo-${index}">
          <img src="${item}">
        </div>
      `;
    })
    .join('');

  const switchers = data.photos
    .map((item, index) => {
      return `
        <div class="gallery__mini${index == 0 ? ' active-mini' : ''}">
          <img src="${item}" class="photo-${index}" onclick="switchPhoto(this)">
        </div>
      `;
    })
    .join('');

  const about = `
    <section>
      <div class="about-container">
        <div class="about-header">
          <h1>About Us</h1>
        </div>
        <div>
          We are educational company that provide courses and tests
        </div>
        <div class="gallery">
          <div class="gallery__content">
            ${photos}
          </div>
          <div class="gallery__switcher">
            ${switchers}
          </div>
        </div>
      </div>
      <div class="contacts-container">
        <div class="contacts-header">
          <h1>Contacts</h1>
        </div>
        <div>
          You can find our contact information and location map below
        </div>
        <div class="contacts__body">
          <div class="contacts__map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.755213998221!2d30.51154060099725!3d50.44566002397757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce5802407267%3A0x5b296e9450093a05!2sCoworking%20Platforma%20Leonardo!5e0!3m2!1sen!2sua!4v1580047652486!5m2!1sen!2sua" width="400" height="300" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
          </div>
          <div class="contacts__email">
            <div>
              General inquiries:
              <a href="mailto:info@example.com">info@example.com</a>
            </div>
            <div>
              Technical support:
              <a href="mailto:support@example.com">support@example.com</a>
            </div>
            <div>
              Sales:
              <a href="mailto:sales@example.com">sales@example.com</a>
            </div>
          </div>
          <div class="contacts__phone">
            <div>
              <div class="contacts__flag">
                <img src="/res/img/ukraine.png">
              </div>
              <div>
                <a href="tel:+380441234567">+380 44 123 4567</a>
              </div>
            </div>
            <div>
              <div class="contacts__flag">
                <img src="/res/img/usa.png">
              </div>
              <div>
                <a href="tel:+18881234567">+1 888 123 4567</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = about;
}

function switchPhoto(elem) {
  document.querySelectorAll('.gallery__photo').forEach((item) => {
    item.classList.remove('active-photo');
  });
  document.querySelector('#' + elem.classList[0]).classList.add('active-photo');

  document.querySelectorAll('.gallery__mini').forEach((item) => {
    item.classList.remove('active-mini');
  });
  elem.parentElement.classList.add('active-mini');
}
