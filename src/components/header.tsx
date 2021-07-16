import * as React from "react"
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

export default function Header({ siteTitle }: any): React.ReactElement {
  const [state, setState] = React.useState({
    drawer: false,
  })

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event && event.type === "keydown") {
        return
      }

      setState({ ...state, drawer: open })
    }

  return (
    <header>
      <div>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography>{siteTitle}</Typography>
          </Toolbar>
        </AppBar>
      </div>
      <SwipeableDrawer
        open={state.drawer}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
      >
        <List>
          <ListItem button key="嗶哩嗶哩（港澳臺）">
            <ListItemIcon>
              <DirectionsBoatIcon />
            </ListItemIcon>
            <ListItemText primary="嗶哩嗶哩（港澳臺）" />
          </ListItem>
          <ListItem button key="哔哩哔哩（东南亚）">
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="哔哩哔哩（东南亚）" />
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
