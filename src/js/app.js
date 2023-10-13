import { Navigator } from "./navigator.js";
import { registerAnimadTable } from "./animad.js";
import { registerAppHeader } from "./header.js";
import { registerHomeCard } from "./card.js";
import { registerHomeCards } from "./cards.js";
import { registerAppHome } from "./home.js";
import { registerAppFooter } from "./footer.js";
import { registerAppContainer } from "./container.js";
import { registerBilibiliSEATable } from "./bilibiliSEA.js";
import { registerBilibiliTable } from "./bilibili.js";
import { registerRadioButton } from "./radioButton.js";
import { registerModalDialog } from "./dialog.js";

const app = async () => {
  registerAppHeader();
  registerAnimadTable();
  registerHomeCard()
  registerHomeCards();
  registerAppHome();
  registerAppFooter();
  registerAppContainer();
  registerBilibiliTable();
  registerBilibiliSEATable();
  registerRadioButton();
  registerModalDialog();
  Navigator.build();
};

addEventListener("DOMContentLoaded", app);
