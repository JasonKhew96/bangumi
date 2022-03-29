import * as React from "react"
import BangumiList from "../components/bangumiList"
import Layout from "../components/layout"
import Seo from "../components/seo"
import JSONData from "../../content/anigamer.json"
import { GridCellParams, GridColDef } from "@mui/x-data-grid"
import { Chip } from "@mui/material"
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial"
import { OutboundLink } from "gatsby-plugin-google-gtag"

const columns: GridColDef[] = [
  {
    field: "acg_sn",
    headerName: "詳情",
    align: "right",
    width: 128,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://acg.gamer.com.tw/acgDetail.php?s=" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </OutboundLink>
    ),
  },
  {
    field: "anime_sn",
    headerName: "播放",
    align: "right",
    width: 128,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://ani.gamer.com.tw/animeRef.php?sn=" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </OutboundLink>
    ),
  },
  {
    field: "",
    headerName: "專區",
    sortable: false,
    type: "string",
    align: "center",
    width: 32,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={
          "https://forum.gamer.com.tw/searchb.php?dc_c1=" +
          params.getValue(params.id, "dc_c1") +
          "&dc_c2=" +
          params.getValue(params.id, "dc_c2")
        }
        target="_blank"
        rel="noreferrer"
      >
        <FolderSpecialIcon />
      </OutboundLink>
    ),
  },
  {
    field: "title",
    headerName: "標題",
    type: "string",
    width: 1024,
    renderCell: (params: GridCellParams) => (
      <div>
        {params.value}
        {` `}
        {params.getValue(params.id, "is_new") ? (
          <Chip size="small" label="新上架" color="primary" />
        ) : (
          ""
        )}
        {params.getValue(params.id, "is_exclusive") ? (
          <Chip size="small" label="獨家" color="secondary" />
        ) : (
          ""
        )}
        {params.getValue(params.id, "is_vip") ? (
          <Chip size="small" label="會員" color="secondary" />
        ) : (
          ""
        )}
        {params.getValue(params.id, "edition") ? (
          <Chip
            size="small"
            label={params.getValue(params.id, "edition")}
            color="secondary"
          />
        ) : (
          ""
        )}
        {params.getValue(params.id, "is_bilingual") ? (
          <Chip size="small" label="雙語" color="primary" />
        ) : (
          ""
        )}
      </div>
    ),
  },
]

const AniGamer = () => (
  <Layout>
    <Seo title="巴哈姆特動畫瘋" />
    <h2>巴哈姆特動畫瘋</h2>
    <BangumiList columns={columns} data={JSONData.data} type="anigamer" />
  </Layout>
)

export default AniGamer
