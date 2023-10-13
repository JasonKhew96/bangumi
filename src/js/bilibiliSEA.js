import { Wrapper } from "./wrapper.js";
import { AnchorWrapper } from "./anchorWrapper.js";
import { BangumiList } from "./bangumiList.js";
import { ModalDialog } from "./dialog.js";

export class BilibiliSEATable extends BangumiList {
  constructor() {
    super();
    this.setTitle("哔哩哔哩(东南亚)");
  }

  fetchData() {
    fetch("./data/bilibili_sea.json")
      .then((response) => response.json())
      .then((data) => {
        this._data.value = data.data.reverse();
      });
  }

  buildTable() {
    const table = Wrapper.generate("table");
    const dialog = ModalDialog.generate();
    table.appendChild(dialog);
    const header = Wrapper.generate("tr")
      .createChild("th", "Season ID")
      .createChild("th")
      .createChild("th", "标题");
    table.appendChild(header);

    this._currentPageData.forEach((element) => {
      const title = element.title.trim().trim();
      const tr = Wrapper.generate("tr")
        .appendChild(
          Wrapper.generate("td")
            .appendChild(
              AnchorWrapper.generate(
                "https://www.biliintl.com/en/play/" + element.season_id,
                element.season_id
              )
            )
            .addClass("text-right")
            .addClass("td-fit")
        )
        .appendChild(
          Wrapper.generate("td")
            .appendChild(
              AnchorWrapper.generate(
                "https://b23.tv/ss" + element.season_id,
                "🔒"
              )
            )
            .addClass("text-center")
            .addClass("td-fit")
        )
        .appendChild(Wrapper.generate("td", title)
            .setAttribute("title", element.regions)
            .setOnClickListener(() => {
              dialog.build(element.regions);
              dialog.element.showModal();
            })
        );
      table.appendChild(tr);
    });

    return table;
  }
}

export const registerBilibiliSEATable = () =>
  customElements.define("bilibili-sea-table", BilibiliSEATable);
