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
  if (!document.startViewTransition) return;

  navigation.addEventListener("navigate", (event) => {
    const destination = new URL(event.destination.url);
    if (location.origin !== destination.origin) return;
    if (location.href === destination.href) return event.preventDefault();

    const back = isBackNavigation(event);

    event.intercept({
      handler: () => callback({
        destination: destination.pathname,
        origin: location.pathname,
        back,
      }),
    });
  });
}

export const registerTransitions = () =>

  onNavigation(async ({ destination, back }) => {
    const dom = await getPageContent(destination);

    if (back) document.documentElement.classList.add('back-transition');

    const trans = document.startViewTransition(() => {
      document.head.innerHTML = dom.head.innerHTML;
      document.body.querySelector("main").innerHTML = dom.body.querySelector("main").innerHTML;
    });

    try {
      await trans.finished;
    } finally {
      document.documentElement.classList.remove('back-transition');
    }
  });
