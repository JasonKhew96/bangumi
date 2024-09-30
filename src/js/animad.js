import { Wrapper } from "./wrapper.js";
import { AnchorWrapper } from "./anchorWrapper.js";
import { BangumiList } from "./bangumiList.js";

export class AnimadTable extends BangumiList {
  constructor() {
    super();
    this.setTitle("巴哈姆特動畫瘋");
  }

  fetchData() {
    fetch("./data/animad.json")
      .then((response) => response.json())
      .then((data) => {
        this._data.value = data.data.reverse();
      });
  }

  buildTable() {
    const table = Wrapper.generate("table");
    const header = Wrapper.generate("tr")
      .createChild("th", "詳情")
      .createChild("th", "播放")
      .createChild("th", "標題");
    table.appendChild(header);

    this._currentPageData.forEach((element) => {
      let suffix = "";
      if (element.is_bilingual) {
        suffix += '<span class="badge">雙語</span>';
      }
      if (element.is_vip) {
        suffix += '<span class="badge">會員</span>';
      }
      if (element.edition != "") {
        suffix += '<span class="badge">' + element.edition + '</span>';
      }
      const title = (element.title.trim() + " " + suffix).trim();
      const tr = Wrapper.generate("tr")
        .appendChild(
          Wrapper.generate("td")
            .appendChild(
              AnchorWrapper.generate(
                "https://acg.gamer.com.tw/acgDetail.php?s=" + element.acg_sn,
                element.acg_sn
              )
            )
            .addClass("text-right")
            .addClass("td-fit")
        )
        .appendChild(
          Wrapper.generate("td")
            .appendChild(
              AnchorWrapper.generate(
                "https://ani.gamer.com.tw/animeRef.php?sn=" + element.anime_sn,
                element.anime_sn
              )
            )
            .addClass("text-right")
            .addClass("td-fit")
        )
        .appendChild(Wrapper.generate("td", title));
      table.appendChild(tr);
    });

    return table;
  }
}

export const registerAnimadTable = () =>
  customElements.define("animad-table", AnimadTable);
