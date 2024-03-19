const componentList = document.querySelectorAll("component");
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
    globalThis[componentName][globalThis[componentName].length] = new Object();
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

const linkcomponentList = document.querySelectorAll("linkcomponent");
linkcomponentList.forEach((element) => {
  const to = element.getAttribute("to");
  const area = document.getElementById(element.getAttribute("area"));
  element.addEventListener("click", () => {
    componentList.forEach((element) => {
      if (element.getAttribute("name") === to) {
        area.innerHTML = element.innerHTML;
      }
    });
  });
});