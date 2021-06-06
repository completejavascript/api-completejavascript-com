document.addEventListener("DOMContentLoaded", () => {
  const $ = document.querySelector.bind(document);

  const root = $("#root");
  const textArea = $("#txt-area");
  const jsonHTML = $("#json-html");
  const inputLat = $("#inp-lat");
  const inputLng = $("#inp-lng");
  const btnFetch = $("#btn-fetch");
  const fullRep = $("#full-req");

  const baseAPI = `${root.getAttribute("host")}/api/v1/weather`;
  const defaultLat = "21.0245";
  const defaultLng = "105.8412";

  const setResultTextarea = (result) => {
    if (result !== null) textArea.value = JSON.stringify(result, undefined, 2);
    else textArea.value = "";
  };

  const setInputLatLng = (lat, lng) => {
    inputLat.value = lat;
    inputLng.value = lng;
  };

  const disableInput = (disable = true) => {
    inputLat.disabled = disable;
    inputLng.disable = disable;
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

  const render = (lat, lng) => {
    fetch(`${baseAPI}?lat=${lat}&lng=${lng}`)
      .then((res) => res.json())
      .then((myJson) => {
        setResultTextarea(myJson);
        appendJsonHtml(myJson);
        disableInput(false);
      })
      .catch((error) => console.log(error));
  };

  const setFullRequest = (lat, lng) => {
    fullRep.textContent = `${baseAPI}?lat=${lat}&lng=${lng}`;
  };

  const apply = (lat, lng) => {
    setInputLatLng(lat, lng);
    disableInput();
    render(lat, lng);
    setFullRequest(lat, lng);
  };

  // Render with default RSS Feed URL
  apply(defaultLat, defaultLng);

  btnFetch.addEventListener("click", (e) => {
    e.preventDefault();

    setResultTextarea(null);
    appendJsonHtml(null);

    apply(inputLat.value, inputLng.value);
  });
});
