
import React from 'react';
import { Link } from 'react-router-dom'
import { FaCar, FaUsers, FaLaptop, FaCreditCard, FaWhatsapp, FaSignInAlt, FaAngleUp, FaAngleDown, FaSignOutAlt } from 'react-icons/fa'
import { MenuList, MenuItem, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@material-ui/core'
import { MdMenu } from 'react-icons/md'

export default function Header(props) {
    const [state, setState] = React.useState({
        open: false
    })

    const [collapse, setCollapse] = React.useState({
        site:false,
        financeiro: false,
    })

    return (
        <>
            <div></div>

            {(window.innerWidth < 577) ?
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu"
                                    onClick={()=> setState({open:true})}>
                            <MdMenu />
                        </IconButton>
                        <Typography variant="h6">
                            {props.title ?? 'Meu menu'}
                        </Typography>                        
                        {props.button}
                    </Toolbar>
                </AppBar>
                :
                <nav className="header navbar navbar-expand-lg navbar-light bg-white p-0">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand ml-3">
                            <img src="/img/icon-master.svg" width="50" height="50" alt=""></img>
                        </Link>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/vehicles">
                                    <FaCar className="icon-lg mr-2" />Veículos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link bg-white" to="/vehicles">
                                    <FaUsers className="icon-lg mr-2" />Proprietários
                                </button>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link  dropdown-toggle" to="#" data-toggle="dropdown">
                                    <FaLaptop className="icon-lg mr-2" />Site
                                </Link>
                                <MenuList className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <MenuItem className="dropdow-item">
                                        Otimização para o google
                                    </MenuItem>
                                    <MenuItem className="dropdow-item">
                                        Unidades e telefones
                                    </MenuItem>
                                    <MenuItem className="dropdow-item">
                                        Minha Logo
                                    </MenuItem>
                                    <MenuItem className="dropdow-item">
                                        Domínio
                                    </MenuItem>
                                    <MenuItem className="dropdow-item">
                                        Configurações
                                    </MenuItem>
                                </MenuList>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link  dropdown-toggle" to="#" data-toggle="dropdown">
                                    <FaCreditCard className="icon-lg mr-2" />Financeiro
                                </Link>
                                <MenuList className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <MenuItem className="dropdow-item">
                                        Meu plano
                                    </MenuItem>
                                    <MenuItem className="dropdow-item">
                                        Minhas transações
                                    </MenuItem>
                                </MenuList>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <FaWhatsapp className="icon-lg mr-2" />Whatsapp
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <FaSignInAlt className="icon-lg mr-2" />Sair
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            }

            <Drawer anchor="left" open={state.open} onClose={() => setState({open:false})}>
                <div style={{width: 320, maxWidth: window.innerWidth -70}}>
                    <List component="nav" className="menu-mobile">
                        <ListItem>
                            <img className="img-fluid logo-mobile"                            
                                 src="/img/icon-master.svg" height="30" alt="Vehicles CRM"/>
                        </ListItem>
                        <ListItem>
                            meuteste@dev.com.br
                        </ListItem>
                        <Divider className="mx-3"/>
                        <ListItem>                        
                            <ListItemIcon>
                            <Link className="nav-link" to="/vehicles">
                                <FaCar />                            
                            </Link>
                            </ListItemIcon>
                            <ListItemText primary="Veiculos"/>
                            
                        </ListItem>                        
                        <ListItem>
                            <ListItemIcon>
                                <FaUsers />
                            </ListItemIcon>
                            <ListItemText primary="Proprietários"/>
                        </ListItem>
                        <ListItem button onClick={() => setCollapse({site: (collapse.site) ? false : true})}>
                            <ListItemIcon>
                                <FaLaptop />
                            </ListItemIcon>
                            <ListItemText primary="Sites"/>
                            {(collapse.site) ? <FaAngleUp /> : <FaAngleDown />}
                        </ListItem>
                        <Collapse in={collapse.site} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Otimização pra o google">
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Unidades e telefones">
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Minha logo">
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Dominio">
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Configurações">
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Collapse>
                        <Divider className="mx-3"/>
                        <ListItem button onClick={() => setCollapse({financeiro: (collapse.financeiro) ? false : true})}>
                            <ListItemIcon>
                                <FaCreditCard />
                            </ListItemIcon>
                            <ListItemText primary="Financeiro"/>
                            {(collapse.financeiro) ? <FaAngleUp /> : <FaAngleDown />}
                        </ListItem>
                        <Collapse in={collapse.financeiro} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Meu plano">
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText className="pl-5" primary="Minhas transações">
                                    </ListItemText>
                                </ListItem>                                
                            </List>
                        </Collapse>
                        <ListItem>
                            <ListItemIcon>
                                <FaWhatsapp />
                            </ListItemIcon>
                            <ListItemText primary="Ajuda"/>
                        </ListItem>
                        <Divider className="mx-3"/>
                        <ListItem>
                            <ListItemIcon>
                                <FaSignOutAlt />
                            </ListItemIcon>
                            <ListItemText primary="Sair"/>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    )
}
