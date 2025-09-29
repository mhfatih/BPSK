import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <GoogleReCaptchaProvider reCaptchaKey="6LdAfdUrAAAAAC_KH-xOeg71a-BDwFlnQ8QtSAai">
        <App />
    </GoogleReCaptchaProvider>    
    </BrowserRouter>
  </React.StrictMode>
);
