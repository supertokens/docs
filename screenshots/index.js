const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const ProgressBar = require("progress");

let frameCount = 0;
let lastCursorPosition = { x: 0, y: 0 }; // Assuming 1280x720 screen size
let browser;
let page;

async function processRecordingFile(filePath) {
  browser = await puppeteer.launch({
    // headless: false,
  });
  page = await browser.newPage();

  const fileContent = fs.readFileSync(filePath, "utf8");
  const yaml = require("js-yaml");
  const steps = yaml.load(fileContent).steps;
  const totalLines = steps.length;
  const progressBar = new ProgressBar("Processing [:bar] :percent", {
    total: totalLines,
  });

  for (const step of steps) {
    await processPageSize(step.pageSize);
    await processNavigate(step.navigate);
    await processType(step.type);
    await processClick(step.click);
    await processWait(step.wait);
    await processFullScreenshot(step.fullScreenshot);
    await processRecording(step.recording);
    await processCursorTo(step.cursorTo);
    await processCapture(step.capture);
    await processTypeAnimate(step.typeAnimate);
    await processScrollTo(step.scrollTo);
    await processHighlightAndFullScreenshot(step.highlightAndFullScreenshot);
    progressBar.tick();
  }

  await browser.close();
}

async function processPageSize(pageSize) {
  if (!pageSize) return;
  await page.setViewport({
    width: pageSize[0],
    height: pageSize[1],
  });
  lastCursorPosition = {
    x: pageSize[0] / 2,
    y: pageSize[1] / 2,
  };
}

async function processNavigate(navigate) {
  if (!navigate) return;
  await page.goto(navigate, { waitUntil: "networkidle0" });
}

async function processType(type) {
  if (!type) return;
  await page.type(type.target, type.text);
}

async function processClick(click) {
  if (!click) return;
  if (click.startsWith("//")) {
    const query = click;
    await page.evaluate((query) => {
      document
        .evaluate(query, document, null, XPathResult.ANY_TYPE)
        .iterateNext()
        .click();
    }, query);
  } else {
    await page.click(click);
  }
}

async function processWait(wait) {
  if (!wait) return;
  if (wait === "navigate") {
    await page.waitForNetworkIdle();
  } else {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

async function processFullScreenshot(fullScreenshot) {
  if (!fullScreenshot) return;
  const screenshot = await page.screenshot();
  const dir = path.dirname(fullScreenshot);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullScreenshot, screenshot);
}

async function processRecording(recording) {
  if (!recording) return;
  if (recording === "start") {
    numFrames = 0;
    const dir = path.join(__dirname, "frames");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      fs.rmSync(dir, { recursive: true });
      fs.mkdirSync(dir);
    }
  } else {
    await processRecordingSave(recording);
  }
}

async function processRecordingSave(filename) {
  const framesDir = path.join(__dirname, "frames");
  const files = fs.readdirSync(framesDir);
  const sortedFiles = files.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const framesPaths = sortedFiles.map((file) => path.join(framesDir, file));
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const command = `gifski ${framesPaths.join(" ")} -o ${filename} -r 5 -W 900 -Q 65 --lossy-quality 40`;
  const proc = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
  await new Promise((resolve) => proc.on("exit", resolve));
  fs.rmSync(framesDir, { recursive: true });
}

async function processCursorTo(cursorTo) {
  if (!cursorTo) return;
  const target = cursorTo.target;
  const numFrames = cursorTo.numFrames;
  let rect = null;
  if (target.startsWith("//")) {
    rect = await page.evaluate((target) => {
      const result = document.evaluate(target, document, null, XPathResult.ANY_TYPE, null);
      const element = result.iterateNext();
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
          left: rect.left,
          top: rect.top + scrollTop,
          height: rect.height,
          width: rect.width,
        };
      }
      return null;
    }, target);
  } else {
    rect = await page.evaluate((target) => {
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          height: rect.height,
          width: rect.width,
        };
      }
      return null;
    }, target);
  }

  if (rect) {
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    const deltaX = (targetX - lastCursorPosition.x) / numFrames;
    const deltaY = (targetY - lastCursorPosition.y) / numFrames;

    for (let i = 0; i < numFrames; i++) {
      // move the cursor to target in numFrames
      await page.evaluate(
        (lastCursorPosition, deltaX, deltaY, i) => {
          const cursor = document.createElement("img");
          cursor.src =
            "https://sraak-001.sgp1.digitaloceanspaces.com/cursor.png";
          cursor.id = `screenshot-cursor`; // Assigning an id to the cursor
          cursor.style.position = "absolute";
          cursor.style.left = `${lastCursorPosition.x + deltaX * i}px`;
          cursor.style.top = `${lastCursorPosition.y + deltaY * i}px`;
          cursor.style.width = "24px";
          cursor.style.zIndex = "9999";
          document.body.appendChild(cursor);
        },
        lastCursorPosition,
        deltaX,
        deltaY,
        i + 1
      );

      await page.waitForNetworkIdle();

      const screenshot = await page.screenshot();
      fs.writeFileSync(
        path.join(__dirname, "frames", `${frameCount}.png`),
        screenshot
      );
      frameCount++;

      if (i == numFrames - 1) {
        // now in the last frame, so do the click effect
        for (let radius = 5; radius < 15; radius += 5) {
          await page.evaluate(
            (radius, targetX, targetY) => {
              const clickCircle = document.createElement("div");
              clickCircle.id = `click-circle`; // Assigning an id to the click circle
              clickCircle.style.position = "absolute";
              clickCircle.style.left = `${targetX - radius + 4}px`; // Offset left by 2px
              clickCircle.style.top = `${targetY - radius + 4}px`; // Offset top by 2px
              clickCircle.style.width = `${radius * 2}px`;
              clickCircle.style.height = `${radius * 2}px`;
              clickCircle.style.borderRadius = "50%";
              clickCircle.style.border = "8px solid rgba(0, 0, 0, 0.4)"; // Setting 2px border with transparency
              clickCircle.style.zIndex = "9999";
              clickCircle.style.filter = `blur(${radius / 3}px)`; // Adding blur radius equal to radius
              document.body.appendChild(clickCircle);
            },
            radius,
            targetX,
            targetY
          );
          const screenshot = await page.screenshot();
          fs.writeFileSync(
            path.join(__dirname, "frames", `${frameCount}.png`),
            screenshot
          );
          frameCount++;

          await page.evaluate(() => {
            const clickCircle = document.getElementById("click-circle");
            if (clickCircle) {
              clickCircle.remove();
            }
          });
        }
      }

      await page.evaluate(() => {
        const cursor = document.getElementById("screenshot-cursor");
        if (cursor) {
          cursor.remove();
        }
      });
    }
  }
}

async function processCapture(capture) {
  if (!capture) return;
  const numCaptures = parseInt(capture, 10);
  for (let i = 0; i < numCaptures; i++) {
    const screenshot = await page.screenshot();
    fs.writeFileSync(
      path.join(__dirname, "frames", `${frameCount}.png`),
      screenshot
    );
    frameCount++;
  }
}

async function processTypeAnimate(typeAnimate) {
  if (!typeAnimate) return;
  const targetInput = typeAnimate.target;
  const text = typeAnimate.text;
  const numFrames = typeAnimate.numFrames;

  let s = -1;
  for (let i = 0; i < text.length; i++) {
    await page.type(targetInput, text[i]);
    if (Math.floor((i + 1) / text.length) > s) {
      s = Math.floor((i + 1) / text.length);
      const screenshot = await page.screenshot();
      fs.writeFileSync(
        path.join(__dirname, "frames", `${frameCount}.png`),
        screenshot
      );
      frameCount++;
    }
  }
}

async function processScrollTo(scrollTo) {
  if (!scrollTo) return;
  const offset = await page.evaluate((scrollTo) => {
    const element = scrollTo.target.startsWith("//") ? document.evaluate(scrollTo.target, document, null, XPathResult.ANY_TYPE, null).iterateNext() : document.querySelector(scrollTo.target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      if (scrollTo.offset) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.pageYOffset + (scrollTo.offset || 0),
          behavior: "smooth"
        });
        return element.getBoundingClientRect().top + window.pageYOffset + (scrollTo.offset || 0);
      }
    }
    return 0;
  }, scrollTo);

  lastCursorPosition.y += offset;
}

async function processHighlightAndFullScreenshot(highlightAndFullScreenshot) {
  if (!highlightAndFullScreenshot) return;

  for (const sets of highlightAndFullScreenshot.targets) {
    let boundingBox = undefined;

    for (const selector of sets.set) {
      let rect = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
          };
        }
      }, selector);

      if (rect) {
        if (!boundingBox) {
          boundingBox = {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
          };
        } else {
          boundingBox.top = Math.min(boundingBox.top, rect.top);
          boundingBox.left = Math.min(boundingBox.left, rect.left);
          boundingBox.bottom = Math.max(boundingBox.bottom, rect.bottom);
          boundingBox.right = Math.max(boundingBox.right, rect.right);
        }
      }
    }

    await page.evaluate((boundingBox) => {
      const rect = document.createElement("div");
      rect.className = "highlighting";
      rect.style.position = "absolute";
      rect.style.left = `${boundingBox.left - 4}px`;
      rect.style.top = `${boundingBox.top - 4}px`;
      rect.style.width = `${boundingBox.right - boundingBox.left + 8}px`;
      rect.style.height = `${boundingBox.bottom - boundingBox.top + 8}px`;
      rect.style.border = "2px solid red";
      rect.style.zIndex = "9999";
      document.body.appendChild(rect);
    }, boundingBox);
  }

  const screenshot = await page.screenshot({ fullPage: true });
  const dir = path.dirname(highlightAndFullScreenshot.filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(highlightAndFullScreenshot.filename, screenshot);

  await page.evaluate(() => {
    document.querySelectorAll(".highlighting").forEach((rect) => rect.remove());
  });
}

processRecordingFile(process.argv[2]);
