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
  const { site, allFile } = useStaticQuery(graphql`
    query {
      site {
        buildTime(formatString: "YYYY-MM-DD hh:mm a z")
        siteMetadata {
          title
        }
      }
      allFile(filter: { sourceInstanceName: { eq: "background" } }) {
        edges {
          node {
            childImageSharp {
              fluid(quality: 90, maxHeight: 1920) {
                srcWebp
              }
              gatsbyImageData(
                placeholder: BLURRED
                quality: 100
              )
            }
          }
        }
        totalCount
      }
    }
  `)

  const r = Math.floor(Math.random() * allFile.totalCount)
  const pick = allFile.edges[r]

  return (
    <div
      style={{
        height: `100vh`,
        display: `flex`,
        flexDirection: `column`,
        background: `url(${pick.node.childImageSharp.fluid.srcWebp}) center no-repeat, url(${pick.node.childImageSharp.gatsbyImageData.placeholder.fallback}) center no-repeat`,
        backgroundSize: `contain, cover`,
        overflowY: `scroll`,
      }}
    >
      <Header siteTitle={site.siteMetadata?.title || `Title`} />
      <Container style={{ background: `#FFFFFFCC` }}>
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
        <a href="https://mui.com/">Material-UI</a>
        {` (Build time: ` + site.buildTime + `)`}
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
