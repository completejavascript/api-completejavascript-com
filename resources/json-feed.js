document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.querySelector("#txt-area");
  const jsonHTML = document.querySelector("#json-html");
  const inputURL = document.querySelector("#inp-url");
  const btnFetch = document.querySelector("#btn-fetch");
  
  const baseAPI = 'http://api-completejavascript.now.sh/api/v1/jsonfeed?url='; 
  const defaultURL = 'https://davidwalsh.name/feed';
  
  const setResultTextarea = (result) => {
    if (result !== null) textArea.value = JSON.stringify(result, undefined, 2); 
    else textArea.value = "";
  }
  
  const setInputURL = (url) => {
    inputURL.value = url;
  }
  
  const disableInput = (disable = true) => {
    inputURL.disabled = disable;
  }
  
  const appendJsonHtml = (json) => {
    if (json === null) {
       while(jsonHTML.firstChild) {
         delete jsonHTML.removeChild(jsonHTML.firstChild);
       }
    } else {
      jsonHTML.appendChild(renderjson(json)); 
    }
  }
  
  const render = url => {
    fetch(`${baseAPI}${url}`)
    .then(res => res.json())
    .then(myJson => {
       setResultTextarea(myJson);
       appendJsonHtml(myJson);
       disableInput(false);
    })
    .catch(error => console.log(error));
  }
  
  // Render with default RSS Feed URL
  setInputURL(defaultURL);
  disableInput();
  render(defaultURL);
  
  btnFetch.addEventListener("click", (e) => {
    e.preventDefault();
    
    setResultTextarea(null);
    appendJsonHtml(null);
    disableInput();
    render(inputURL.value);
  });
});