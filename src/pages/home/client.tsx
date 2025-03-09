import { hydrate } from "preact";
import { App } from "../../app";
import { HomePage } from "./Home";

hydrate(
  <App>
    <HomePage />
  </App>,
  document.getElementById("app") as HTMLElement,
);
