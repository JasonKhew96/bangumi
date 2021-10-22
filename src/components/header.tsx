import * as React from "react"
import { navigate } from "gatsby"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat"
import FlightIcon from "@material-ui/icons/Flight"
import VpnLockIcon from "@material-ui/icons/VpnLock"
import HomeIcon from "@material-ui/icons/Home"
import { GitHub } from "@material-ui/icons"

export default function Header({ siteTitle }: any): React.ReactElement {
  const [state, setState] = React.useState({
    drawer: false,
  })

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, drawer: open })
  }

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography style={{ flexGrow: 1 }}>{siteTitle}</Typography>
          <IconButton
            color="inherit"
            href="https://github.com/JasonKhew96/bangumi"
          >
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={state.drawer}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <List>
          <ListItem button key="首页" onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="首页" />
          </ListItem>
          <ListItem
            button
            key="哔哩哔哩"
            onClick={() => navigate("/bilibili/")}
          >
            <ListItemIcon>
              <DirectionsBoatIcon />
            </ListItemIcon>
            <ListItemText primary="哔哩哔哩" />
          </ListItem>
          <ListItem
            button
            key="哔哩哔哩（东南亚）"
            onClick={() => navigate("/bilibili_sea/")}
          >
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="哔哩哔哩（东南亚）" />
          </ListItem>
          <ListItem
            button
            key="巴哈姆特動畫瘋"
            onClick={() => navigate("/anigamer/")}
          >
            <ListItemIcon>
              <VpnLockIcon />
            </ListItemIcon>
            <ListItemText primary="巴哈姆特動畫瘋" />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </header>
  )
}

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// }

// Header.defaultProps = {
//   siteTitle: ``,
// }

// export default Header
