document.addEventListener("DOMContentLoaded", () => {
  const $ = document.querySelector.bind(document);

  const root = $("#root");
  const textArea = $("#txt-area");
  const jsonHTML = $("#json-html");
  const inputURL = $("#inp-url");
  const btnFetch = $("#btn-fetch");
  const fullRep = $("#full-req");
  
  const baseAPI = `${root.getAttribute("host")}/api/v1/jsonfeed?url=`; 
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

  const setFullRequest = (feedUrl) => {
    fullRep.textContent = `${baseAPI}${feedUrl}`;
  }
  
  const apply = (feedUrl) => {
    setInputURL(feedUrl);
    disableInput();
    render(feedUrl);
    setFullRequest(feedUrl);
  }

  // Render with default RSS Feed URL
  apply(defaultURL);
  
  btnFetch.addEventListener("click", (e) => {
    e.preventDefault();
    
    setResultTextarea(null);
    appendJsonHtml(null);

    apply(inputURL.value);
  });
});