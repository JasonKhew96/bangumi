import * as React from "react"
import { DataGrid } from "@material-ui/data-grid"

const BangumiList = ({ columns, data }: any) => {
  return (
    <div>
      <DataGrid
        rows={data}
        getRowId={row => row.season_id}
        columns={columns}
        pageSize={50}
        autoHeight
        sortModel={[{ field: "season_id", sort: "desc" }]}
      />
    </div>
  )
}

export default BangumiList
