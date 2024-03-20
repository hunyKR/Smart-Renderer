const fs = require("fs");
const compileConfig = JSON.parse(
  fs.readFileSync("./compile-config.json", "utf-8")
);
const headCode = compileConfig.headFile && fs.readFileSync(compileConfig.headFile, "utf-8");
const containerCode = fs.readFileSync(compileConfig.container, "utf-8");
globalThis.componentCode = "";
globalThis.componentScript = "";

compileConfig.components.forEach((fileName) => {
  const componentCode = fs.readFileSync(fileName, "utf-8");
  globalThis.componentCode += `
    <component name="${fileName.split(".")[0]}">
        ${componentCode.split("<script>")[0]}
    </component>
  `;
  globalThis.componentScript += componentCode.split("<script>")[1].split("</script>")[0]
});
componentScript += containerCode.split("<script>")[1].split("</script>")[0]

fs.writeFileSync(
  compileConfig.compiledFileName,
  `
  <!DOCTYPE html>
  <html lang="${compileConfig.htmlLang ? compileConfig.htmlLang : "en"}">
  <head>
    ${headCode ? headCode : `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Renderer App</title>
    `}
  </head>
  <body>
    ${componentCode}
    ${containerCode}
  </body>
  <script src="https://cdn.jsdelivr.net/gh/hunyKR/Smart-Renderer/code.js"></script>
  <script>
    ${componentScript}
  </script>
  </html>
  `
);

console.log('컴파일 완료')