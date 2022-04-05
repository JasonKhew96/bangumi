import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BangumiList from "../components/bangumiList"
import { GridCellParams, GridColDef } from "@mui/x-data-grid"
import { Chip } from "@mui/material"
import JSONData from "../../content/bilibili.json"
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
        {params.row.is_vip ? (
          <Chip size="small" label="会员" color="secondary" />
        ) : (
          ""
        )}
      </div>
    ),
  },
]

const Bilibili = () => (
  <Layout>
    <Seo title="哔哩哔哩" />
    <h2>哔哩哔哩</h2>
    <BangumiList
      columns={columns}
      data={JSONData.data.sort((a, b) => {
        if (a.season_id > b.season_id) {
          return -1
        }
        if (a.season_id < b.season_id) {
          return 1
        }
        return 0
      })}
    />
  </Layout>
)

export default Bilibili
