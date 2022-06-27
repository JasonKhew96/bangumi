import { Wrapper } from "./wrapper.js";
import { AnchorWrapper } from "./anchorWrapper.js";
import { BangumiList } from "./bangumiList.js";

export class BilibiliTable extends BangumiList {
  constructor() {
    super();
    this.setTitle("哔哩哔哩");
  }

  fetchData() {
    fetch("./data/bilibili.json")
      .then((response) => response.json())
      .then((data) => {
        this._data.value = data.data.reverse();
      });
  }

  buildSearchGroup() {
    const searchGroup = Wrapper.generate("div");

    const searchInput = Wrapper.generate("input");
    searchInput.element.value = this._searchText;
    searchInput.addClass("search-input");
    searchInput.element.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        this._searchText = searchInput.element.value;
        this.searchCallback(searchInput.element.value);
      }
    });
    searchGroup.appendChild(searchInput);

    const searchButton = Wrapper.generate("button", "search");
    searchButton.element.addEventListener("click", () => {
      this._searchText = searchInput.element.value;
      this.searchCallback(searchInput.element.value);
    });
    searchGroup.appendChild(searchButton);

    searchGroup.createChild("br");
    searchGroup.element.appendChild(this.typeFilter);

    return searchGroup;
  }

  buildTable() {
    const table = Wrapper.generate("table");
    const header = Wrapper.generate("tr")
      .createChild("th", "Season ID")
      .createChild("th", "Media ID")
      .createChild("th", "标题");
    table.appendChild(header);

    this._currentPageData.forEach((element) => {
      let suffix = "";
      if (element.is_vip) {
        suffix += '<span class="badge">会员</span>';
      }
      if (element.is_exclusive) {
        suffix += '<span class="badge">独家</span>';
      }
      const title = (element.title.trim() + " " + suffix).trim();
      const tr = Wrapper.generate("tr")
        .appendChild(
          Wrapper.generate("td")
            .appendChild(
              AnchorWrapper.generate(
                "https://b23.tv/ss" + element.season_id,
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
                "https://www.bilibili.com/bangumi/media/md" + element.media_id,
                element.media_id
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

export const registerBilibiliTable = () =>
  customElements.define("bilibili-table", BilibiliTable);
