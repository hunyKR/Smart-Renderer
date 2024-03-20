const fs = require("fs");
const compileConfig = JSON.parse(
  fs.readFileSync("./compile-config.json", "utf-8")
);
const code = fs.readFileSync('./code.js', 'utf-8')
const appRoot = compileConfig.appRoot ? compileConfig.appRoot : './'
const componentRoot = compileConfig.componentRoot ? compileConfig.componentRoot : './'
const headCode = compileConfig.headFile && fs.readFileSync(compileConfig.headFile + ".html", "utf-8");
const containerCodeAll = fs.readFileSync(appRoot + compileConfig.container + ".html", "utf-8");
const containerCode = containerCodeAll.split("<script>")[0]
const containerScript = containerCodeAll.split("<script>")[1].split("</script>")[0];
globalThis.componentCode = "";
globalThis.componentScript = "";

compileConfig.components.forEach((fileName) => {
  const componentCode = fs.readFileSync(componentRoot + fileName + ".html", "utf-8");
  globalThis.componentCode += `
    <component name="${fileName.split("/")[fileName.split("/").length - 1]}">
        ${componentCode.split("<script>")[0]}
    </component>
  `;
  globalThis.componentScript += componentCode.split("<script>")[1].split("</script>")[0]
});

fs.writeFileSync(
  appRoot + compileConfig.compiledFileName + ".html",
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
  <script>
    ${code}
    ${componentScript}
    ${containerScript}
  </script>
  </html>
  `
);

console.log('컴파일 완료')