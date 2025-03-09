import "./app.css";

import { ComponentChildren } from "preact";

interface AppProps {
  children: ComponentChildren;
}

export function App({ children }: AppProps) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
