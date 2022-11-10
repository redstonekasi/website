/** @type DOMParser */
let parser;

async function getPageContent(url) {
  const response = await fetch(url);
  const text = await response.text();
  
  parser ??= new DOMParser();

  const dom = parser.parseFromString(text, "text/html");
  // return dom.getElementById("content").innerHTML;
  // return dom.body.innerHTML;
  return dom;
}

function isBackNavigation(navigateEvent) {
  if (navigateEvent.navigationType === 'push' || navigateEvent.navigationType === 'replace') {
    return false;
  }
  if (
    navigateEvent.destination.index !== -1 &&
    navigateEvent.destination.index < navigation.currentEntry.index
  ) {
    return true;
  }
  return false;
}

function onNavigation(callback) {
  if (!document.createDocumentTransition) return;

  navigation.addEventListener("navigate", (event) => {
    const destination = new URL(event.destination.url);
    if (location.origin !== destination.origin) return;
    if (location.href === destination.href) return event.preventDefault();
    
    event.intercept({
      handler: () => callback({
        destination: destination.pathname,
        origin: location.pathname,
      }),
    });
  });
}

export const registerTransitions = () =>
  onNavigation(async ({ destination }) => {
    const dom = await getPageContent(destination);
    const transition = document.createDocumentTransition();

    await transition.start(() => {
      document.title = dom.title;
      document.body.innerHTML = dom.body.innerHTML;
    });
  });
