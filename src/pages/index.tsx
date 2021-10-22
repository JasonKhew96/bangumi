import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => (
  <Layout>
    <Seo title="首页" />
    <p>
      <Link to="/bilibili/">哔哩哔哩</Link>
    </p>
    <p>
      <Link to="/bilibili_sea/">哔哩哔哩（东南亚）</Link>
    </p>
    <p>
      <Link to="/anigamer/">巴哈姆特動畫瘋</Link>
    </p>
  </Layout>
)

export default IndexPage
