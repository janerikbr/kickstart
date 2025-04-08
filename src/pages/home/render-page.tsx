import { App } from "../../app.tsx";
import { HomePage } from "./Home.tsx";

export function renderPage() {
  return (
    <App>
      <HomePage />
    </App>
  );
}
