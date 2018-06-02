const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

(async () => {
  const params = {
    headers: { "X-Figma-Token": "1497-c6c12c19-34b1-4a78-b70d-1152a0d27166" }
  };
  const { files } = await fetch(
    `https://api.figma.com/v1/projects/701703/files`,
    params
  ).then(res => res.json());

  const devices = [];
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const file of files) {
    if (devices.length > 0) {
      await new Promise(res => setTimeout(res, 1000));
    }

    const f0 = await fetch(
      `https://api.figma.com/v1/files/${file.key}`,
      params
    ).then(res => res.json());

    const ds = f0.document.children[0].children;
    ds.forEach(device => {
      try {
        const { name, absoluteBoundingBox } = device;
        const screenFrame = device.children.find(c => /screen/i.test(c.name))
          .absoluteBoundingBox;
        devices.push({
          name,
          imageWidth: absoluteBoundingBox.width,
          imageHeight: absoluteBoundingBox.height,
          screenX: screenFrame.x - absoluteBoundingBox.x,
          screenY: screenFrame.y - absoluteBoundingBox.y,
          screenWidth: screenFrame.width,
          screenHeight: screenFrame.height
        });
      } catch (e) {
        console.log(`Failed to parse ${file.name}`);
      }
    });
  }

  fs.writeFileSync(
    path.join(__dirname, "/devices.json"),
    JSON.stringify(devices, null, 2)
  );
})();
