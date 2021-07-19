import * as React from "react"
import BangumiList from "../components/bangumiList"
import Layout from "../components/layout"
import Seo from "../components/seo"
import JSONData from "../../content/bilibili_sea.json"
import {
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from "@material-ui/data-grid"
import { Chip } from "@material-ui/core"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import { OutboundLink } from "gatsby-plugin-google-gtag"

const columns: GridColDef[] = [
  {
    field: "season_id",
    headerName: "Season ID",
    type: "string",
    align: "right",
    flex: 1,
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
    valueGetter: (params: GridValueGetterParams) =>
      `${params.getValue(params.id, "season_id")}`,
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
    flex: 6,
    renderCell: (params: GridCellParams) => (
      <div>
        {params.value}
        {` `}
        {params.getValue(params.id, "is_new") ? (
          <Chip size="small" label="新" color="primary" />
        ) : (
          ""
        )}
        {params.getValue(params.id, "is_exclusive") ? (
          <Chip size="small" label="独" color="secondary" />
        ) : (
          ""
        )}
      </div>
    ),
  },
  // {
  //   field: "is_new",
  //   headerName: "新上架",
  //   type: "boolean",
  // },
  // {
  //   field: "is_exclusive",
  //   headerName: "独播",
  //   type: "boolean",
  // },
]

const BilibiliSEA = () => (
  <Layout>
    <Seo title="哔哩哔哩（东南亚）" />
    <h2>哔哩哔哩（东南亚）</h2>
    <BangumiList columns={columns} data={JSONData.data} />
  </Layout>
)

export default BilibiliSEA
