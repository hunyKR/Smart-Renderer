const componentList = document.querySelectorAll("component");
function resolve() {
  componentList.forEach((element) => {
    element.remove();
    const componentName = element.getAttribute("name");
    globalThis[componentName] = new Array();
    const componentUses = document.querySelectorAll(componentName);
    componentUses.forEach((useElement) => {
      NamedNodeMap.prototype.forEach = Array.prototype.forEach;
      const elementClone = element.cloneNode(true);
      elementClone.innerHTML = elementClone.innerHTML.replaceAll(
        "{children}",
        useElement.innerHTML
      );
      globalThis[componentName][globalThis[componentName].length] =
        new Object();
      useElement.attributes.forEach((prop) => {
        globalThis[componentName][globalThis[componentName].length - 1] = {
          ...globalThis[componentName][globalThis[componentName].length - 1],
          [prop.nodeName]: prop.nodeValue,
        };
        elementClone.innerHTML = elementClone.innerHTML.replaceAll(
          `{${prop.nodeName}}`,
          prop.nodeValue
        );
      });
      useElement.outerHTML = elementClone.innerHTML;
    });
  });
}
resolve();

function render(to, area, onloadFunction, props, children){
  const areaDOM = document.getElementById(area);
  componentList.forEach((element) => {
    const componentName = element.getAttribute("name");
    if (componentName === to) {
      areaDOM.innerHTML = `<${componentName} ${props ? props : ''}>${
        children ? children : ''
      }</${componentName}>`;
      resolve();
      onloadFunction && onloadFunction()
    }
  });
}

const linkcomponentList = document.querySelectorAll("linkcomponent");
linkcomponentList.forEach((element) => {
  const to = element.getAttribute("to");
  const area = element.getAttribute("area");
  const onloadFunction = element.getAttribute("onloadfunction");
  const props = element.getAttribute("props");
  const children = element.getAttribute("children");
  element.firstChild.id = "to-" + to;
  element.outerHTML = element.innerHTML;
  const button = document.getElementById("to-" + to);
  button.addEventListener("click", () => {
    render(to, area, globalThis[onloadFunction], props, children)
  });
});
