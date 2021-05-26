import { Drawer } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeScreenA, changeScreenB, changeScreenC } from '../../store/ducks/navigation';
import Notes from '../notes';

const style = {
    width: '580px',
    maxWidth: window.innerWidth
}

export default function Navigation() {
    const dispatch = useDispatch();
    const nav = useSelector(state => state.NavigationDuck)

    return (
        <>
            <Drawer
                anchor="right"
                open={nav.screenA.open}
                onClose={() => dispatch(changeScreenA({open: false}))}
            >
                <div style={style}></div>
            </Drawer>

            <Drawer
                anchor="right"
                open={nav.screenB.open}
                onClose={() => dispatch(changeScreenB({open: false}))}
            >
                <div style={style}></div>
            </Drawer>

            <Drawer
                anchor="right"
                open={nav.screenC.open}
                onClose={() => dispatch(changeScreenC({open: false}))}
            >
                <div style={style}>
                    {(nav.screenC.type === 'notes') && 
                        <Notes 
                            uid={nav.screenC.uid}
                            type={nav.screenC.type}
                            props={nav.screenC.props}
                        />
                    }
                </div>
            </Drawer>
        </>
    )
}