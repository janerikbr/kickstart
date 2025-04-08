import { hydrate } from "preact";

import { renderPage } from "./render-page.tsx";

hydrate(renderPage(), document.getElementById("app") as HTMLElement);
