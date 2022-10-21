import "./css/index.css";
import IMask from "imask";

import mastercardLogo from "./assets/images/cc-mastercard.svg";
import visaLogo from "./assets/images/cc-visa.svg";
import defaultLogo from "./assets/images/cc-default.svg";

const ccBgColor01 = document.querySelector(
  ".cc-bg > svg > g > g:nth-child(1) > path"
);

const ccBgColor02 = document.querySelector(
  ".cc-bg > svg > g > g:nth-child(2) > path"
);

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "grey"],
  };

  const logos = {
    visa: visaLogo,
    mastercard: mastercardLogo,
    default: defaultLogo,
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", logos[type]);
}

const cvcInput = document.querySelector("#security-code");
const cvcPattern = { mask: "0000" };
const cvcMasked = IMask(cvcInput, cvcPattern);

const expirationDate = document.querySelector("#expiration-date");

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");

    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.getElementById("add-card");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value.trim() || "FULANO DA SILVA";
});

cvcMasked.on("accept", () => updateSecurityCode(cvcMasked.value));

function updateSecurityCode(code) {
  const ccSecurityValue = document.querySelector(".cc-security .value");
  ccSecurityValue.innerText = code.trim() || "123";
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(cardNumber) {
  const ccNumberValue = document.querySelector(".cc-info .cc-number");
  ccNumberValue.innerText = cardNumber.trim() || "1234 5678 9012 3456";
}

expirationDateMasked.on("accept", () => {
  updateCardExpiration(expirationDateMasked.value);
});

function updateCardExpiration(cardExpiration) {
  const ccExpirationDateValue = document.querySelector(".cc-expiration .value");
  ccExpirationDateValue.innerText = cardExpiration.trim() || "02/32";
}
