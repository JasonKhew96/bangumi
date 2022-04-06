/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import { Container } from "@mui/material"

const Layout = ({ children }: any) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        buildTime(formatString: "YYYY-MM-DD hh:mm a z")
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{ height: `100vh`, display: `flex`, flexDirection: `column` }}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Container>
        <main>{children}</main>
      </Container>
      <footer
        style={{
          marginTop: `auto`,
          marginLeft: `32px`,
          marginRight: `32px`,
          marginBottom: `16px`,
        }}
      >
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` & `}
        <a href="https://material-ui.com">Material-UI</a>
        {` (Build time: ` + data.site.buildTime + `)`}
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
