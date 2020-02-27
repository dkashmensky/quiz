/*jshint esversion: 6 */
function renderStats() {
  const user = getUser();
  if(user == null || user == undefined) {
    window.location = '/';
    return;
  }

  const data = JSON.parse(localStorage.getItem('data'));
  const userTests = data.passedTests.filter((elem) => elem.userId === user);
  const passedTests = [...new Set(userTests.map((test) => test.testId))];
  const testHistory = passedTests
    .map((item) => {
      const testName = data.tests.find((elem) => {
        return elem.id == item;
      }).name;
      return `
        <li>
          <a href="" onclick="navigate('/result?id=${item}')">
            <div class="test-cat__item">
              ${testName}
            </div>
          </a>
        </li>
      `;
    })
    .join('');

  const stats = `
    <section>
      <div class="test-cat">
        <h1>Your passed tests</h1>
        <ul>
          ${testHistory}
        </ul>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = stats;
}

function renderResult() {
  const user = getUser();
  if(user == null || user == undefined) {
    window.location = '/';
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const testId = searchParams.get('id');
  const data = JSON.parse(localStorage.getItem('data'));

  const testObject = data.tests.find((item) => {
    return item.id == testId;
  });

  const personTests = data.passedTests
    .filter((item) => {
      return item.testId == testId && item.userId == user;
    })
    .sort((item1, item2) => {
      return Number(item2.score) - Number(item1.score);
    });

  const allTests = data.passedTests
    .filter((item) => {
      return item.testId == testId;
    });

  const flatScores = allTests
    .map((item) => Number(item.score));
  const personFlatScores = personTests
    .map((item) => Number(item.score));

  const personHighscore = Math.max(...personFlatScores);
  const highestScore = Math.max(...flatScores);
  const lowestScore = Math.min(...flatScores);
  const sumScore = flatScores
    .reduce((acc, item) => {
      return acc + item;
    });
  const averageScore = Math.floor(sumScore/allTests.length);

  const questionRows = testObject.question_ids
    .map((question) => {
      const questionObject = data.questions.find((elem) => elem.id == question);
      let resultObject = {
        text: questionObject.question,
        correct: questionObject.correct_answer,
        answers: [],
        other_answers: []
      };

      resultObject.answers = personTests.map((test) => {
        return test.questions
          .find((element) => {
            return element.question_id == question;
          })
          .userAnswer;
      });

      resultObject.other_answers = allTests.map((test) => {
        return test.questions
          .find((element) => {
            return element.question_id == question;
          })
          .userAnswer;
      });

    const sumOtherScores = resultObject.other_answers
      .map((other) => {
        if(other == resultObject.correct) {
          return 1;
        } else {
          return 0;
        }
      })
      .reduce((acc, point) => acc + point);

    const avScoreByQuestion = Math.floor(sumOtherScores/resultObject.other_answers.length*100);

    const answers = resultObject.answers
        .map((result) => {
          return `
            <tr>
              <td>
              </td>
              <td class="${result == resultObject.correct ? 'correct' : 'wrong'}">
                ${result}
              </td>
              <td class="${result == resultObject.correct ? 'correct' : 'wrong'}">
                ${resultObject.correct}
              </td>
              <td class="${result == resultObject.correct ? 'correct' : 'wrong'}">
                ${avScoreByQuestion}%
              </td>
            </tr>
          `;
        })
        .join('');

      return `
        <tr>
          <td colspan="4" class="question">
            ${resultObject.text}
          </td>
        </tr>
        ${answers}
      `;
    })
    .join('');

  const resultMarkup = `
    <section>
      <div class="result-container">
        <div class="result-header">
          <h1>Statistics - ${testObject.name}</h1>
        </div>
        <div class="results">
          <div class="results__elem">
            <div class="results__text">
              Your Highscore
            </div>
            <div class="results__round results__round--score">
              ${personHighscore}%
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Average Score
            </div>
            <div class="results__round">
              ${averageScore}%
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Highest Score
            </div>
            <div class="results__round">
              ${highestScore}%
            </div>
          </div>
          <div class="results__elem">
            <div class="results__text">
              Lowest Score
            </div>
            <div class="results__round">
              ${lowestScore}%
            </div>
          </div>
        </div>
        <div>
          <table class="results-table">
            <thead>
              <th>
                Question
              </th>
              <th>
                Your answer
              </th>
              <th>
                Correct answer
              </th>
              <th>
                Average score
              </th>
            </thead>
            <tbody>
              ${questionRows}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = resultMarkup;
}
