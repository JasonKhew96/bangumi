/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  createRedirect({
    fromPath: "/bilibili",
    toPath: "/bilibili_overseas/",
    isPermanent: true,
  })
  createRedirect({
    fromPath: "/bilibili/",
    toPath: "/bilibili_overseas/",
    isPermanent: true,
  })
}
