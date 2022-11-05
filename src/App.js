const MissionUtils = require("@woowacourse/mission-utils");

class App {
  play() {}
  generateRandomNumber(digits) {
    const START_INCLUSIVE = 1,
      END_INCLUSIVE = 9;
    const randomNumberSet = new Set();

    while (randomNumberSet.size < digits) {
      const num = MissionUtils.Random.pickNumberInRange(
        START_INCLUSIVE,
        END_INCLUSIVE
      );
      randomNumberSet.add(num);
    }

    return [...randomNumberSet];
  }
  async playRound(answer) {
    const INPUT_MESSAGE = "숫자를 입력해주세요 : ";
    const GAME_END_MESSAGE = "3개의 숫자를 모두 맞히셨습니다! 게임 종료";
    const ERROR_MESSAGE = "Invalid Input!";
    const digits = answer.length;

    while (true) {
      const userNumber = await this.readLine(INPUT_MESSAGE);
      if (!this.isValidNumber(userNumber, digits))
        this.throwException(ERROR_MESSAGE);
      const [ballCount, strikeCount] = this.checkBaseballCount(
        answer,
        userNumber
      );
      this.printResult([ballCount, strikeCount]);
      if (this.isCorrectAnswer(strikeCount, digits)) {
        this.print(GAME_END_MESSAGE);
        break;
      }
    }
  }
  checkBaseballCount(answer, userNumber) {
    const userNumberList = userNumber.split("").map((num) => Number(num));
    const notStrikeList = [];
    let ballCount = 0;
    let strikeCount = 0;

    userNumberList.forEach((num, index) => {
      if (this.isEqual(num, answer[index])) strikeCount++;
      else notStrikeList.push(num);
    });
    notStrikeList.forEach((num) => {
      if (answer.includes(num)) ballCount++;
    });

    return [ballCount, strikeCount];
  }
  printResult(baseBallCounts) {
    const message = this.getResult(baseBallCounts);
    this.print(message);
  }
  getResult([ballCount, strikeCount]) {
    const totalCount = ballCount + strikeCount;
    let message = "";
    if (this.isEqual(totalCount, 0)) {
      message = "낫싱";
      return message;
    }
    if (!this.isEqual(ballCount, 0)) {
      message = message + `${ballCount}볼 `;
    }
    if (!this.isEqual(strikeCount, 0)) {
      message = message + `${strikeCount}스트라이크`;
    }
    return message;
  }
  print(message) {
    MissionUtils.Console.print(message);
  }
  readLine(message) {
    return new Promise((resolve) => {
      MissionUtils.Console.readLine(message, (answer) => {
        resolve(answer);
      });
    });
  }
  isEqual(a, b) {
    return a === b;
  }
  isCorrectAnswer(strikeCount, digits) {
    return this.isEqual(strikeCount, digits);
  }
  isValidNumber(num, digits) {
    if (isNaN(num)) return false;

    const numList = num.split("");
    if (!this.isEqual(numList.length, digits)) return false;

    const numSet = numList.reduce((numSet, num) => {
      return numSet.add(num);
    }, new Set());
    if (numSet.has("0")) return false;
    if (!this.isEqual(numSet.size, digits)) return false;

    return true;
  }
  isValidCommand(command) {
    const commandList = ["1", "2"];
    return commandList.includes(command);
  }
  throwException(message) {
    throw new Error(message);
  }
}
const app = new App();
app.play();

module.exports = App;
