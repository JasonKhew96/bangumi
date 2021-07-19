import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BangumiList from "../components/bangumiList"
import { GridCellParams, GridColDef } from "@material-ui/data-grid"
import { Chip } from "@material-ui/core"
import JSONData from "../../content/bilibili_overseas.json"
import { OutboundLink } from "gatsby-plugin-google-gtag"

const columns: GridColDef[] = [
  {
    field: "season_id",
    headerName: "Season ID",
    type: "string",
    align: "right",
    width: 64,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://www.bilibili.com/bangumi/play/ss" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </OutboundLink>
    ),
  },
  {
    field: "media_id",
    headerName: "Media ID",
    type: "string",
    align: "right",
    width: 92,
    renderCell: (params: GridCellParams) => (
      <OutboundLink
        href={"https://www.bilibili.com/bangumi/media/md" + params.value}
        target="_blank"
        rel="noreferrer"
      >
        {params.value}
      </OutboundLink>
    ),
  },
  {
    field: "title",
    headerName: "Title",
    type: "string",
    width: 600,
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
          <Chip size="small" label="獨" color="secondary" />
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
  //   headerName: "獨播",
  //   type: "boolean",
  // },
]

const BilibiliOverseas = () => (
  <Layout>
    <Seo title="嗶哩嗶哩（港澳臺）" />
    <h2>嗶哩嗶哩（港澳臺）</h2>
    <BangumiList columns={columns} data={JSONData.data} />
  </Layout>
)

export default BilibiliOverseas
