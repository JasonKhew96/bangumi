import * as React from "react"
import BangumiList from "../components/bangumiList"
import Layout from "../components/layout"
import Seo from "../components/seo"
import JSONData from "../../content/bilibili_sea.json"
import {
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid"
import { Chip } from "@mui/material"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import { OutboundLink } from "gatsby-plugin-google-gtag"

const columns: GridColDef[] = [
  {
    field: "season_id",
    headerName: "Season ID",
    type: "string",
    align: "right",
    width: 128,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://www.biliintl.com/en/play/" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </OutboundLink>
    ),
  },
  {
    field: "",
    headerName: "",
    sortable: false,
    type: "string",
    align: "center",
    width: 32,
    valueGetter: (params: GridValueGetterParams) => `${params.row.season_id}`,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://www.bilibili.com/bangumi/play/ss" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        <LockOpenIcon />
      </OutboundLink>
    ),
  },
  {
    field: "title",
    headerName: "Title",
    type: "string",
    width: 1024,
    renderCell: (params: GridCellParams) => (
      <div>
        {params.value}
        {` `}
        {params.row.is_new ? (
          <Chip size="small" label="新上架" color="primary" />
        ) : (
          ""
        )}
        {params.row.is_exclusive ? (
          <Chip size="small" label="独家" color="secondary" />
        ) : (
          ""
        )}
      </div>
    ),
  },
]

const BilibiliSEA = () => (
  <Layout>
    <Seo title="哔哩哔哩（东南亚）" />
    <h2>哔哩哔哩（东南亚）</h2>
    <BangumiList columns={columns} data={JSONData.data} type="bilibili_sea" />
  </Layout>
)

export default BilibiliSEA
