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
    width: 128,
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
    width: 128,
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
      </div>
    ),
  },
]

const BilibiliOverseas = () => (
  <Layout>
    <Seo title="嗶哩嗶哩（港澳臺）" />
    <h2>嗶哩嗶哩（港澳臺）</h2>
    <BangumiList columns={columns} data={JSONData.data} />
  </Layout>
)

export default BilibiliOverseas
