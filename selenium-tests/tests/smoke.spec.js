import {Builder, By, until} from 'selenium-webdriver';
import 'chromedriver';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get(BASE_URL);
    await driver.wait(until.elementLocated(By.css('body')), 10000);
    await driver.sleep(1000);
    await driver.takeScreenshot().then((data) => {
      const fs = require('fs');
      fs.mkdirSync('./artifacts', {recursive: true});
      fs.writeFileSync('./artifacts/home.png', data, 'base64');
    });
  } finally {
    await driver.quit();
  }
})();
