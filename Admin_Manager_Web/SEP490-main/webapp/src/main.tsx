import "nprogress/nprogress.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { persistor, store } from "./app/redux/store.ts";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import "./app/i18n/i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
