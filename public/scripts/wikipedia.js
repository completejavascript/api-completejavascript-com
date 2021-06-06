document.addEventListener("DOMContentLoaded", () => {
  const $ = document.querySelector.bind(document);

  const root = $("#root");
  const textArea = $("#txt-area");
  const jsonHTML = $("#json-html");
  const inputText = $("#inp-text");
  const btnFetch = $("#btn-fetch");
  const fullRep = $("#full-req");

  const baseAPI = `${root.getAttribute("host")}/api/v1/wikipedia`;
  const defaultText = "Shiba";

  const setResultTextarea = (result) => {
    if (result !== null) textArea.value = JSON.stringify(result, undefined, 2);
    else textArea.value = "";
  };

  const setInputText = (text) => {
    inputText.value = text;
  };

  const disableInput = (disable = true) => {
    inputText.disabled = disable;
  };

  const appendJsonHtml = (json) => {
    if (json === null) {
      while (jsonHTML.firstChild) {
        delete jsonHTML.removeChild(jsonHTML.firstChild);
      }
    } else {
      jsonHTML.appendChild(renderjson(json));
    }
  };

  const render = (text) => {
    fetch(`${baseAPI}?search=${text}`)
      .then((res) => res.json())
      .then((myJson) => {
        setResultTextarea(myJson);
        appendJsonHtml(myJson);
        disableInput(false);
      })
      .catch((error) => console.log(error));
  };

  const setFullRequest = (text) => {
    fullRep.textContent = `${baseAPI}?search=${encodeURIComponent(text)}`;
  };

  const apply = (text) => {
    setInputText(text);
    disableInput();
    render(text);
    setFullRequest(text);
  };

  // Render with default RSS Feed URL
  apply(defaultText);

  btnFetch.addEventListener("click", (e) => {
    e.preventDefault();

    setResultTextarea(null);
    appendJsonHtml(null);

    apply(inputText.value);
  });
});
