import React, { useEffect, useState } from 'react'

import { AppBar, CircularProgress, IconButton, Toolbar, Typography, useTheme, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose, MdKeyboardBackspace, MdSave, MdSend } from 'react-icons/md';
import { changeScreenC } from '../../store/ducks/navigation';
import { index, store, update, destroy, change } from '../../store/ducks/notes';
import { FcOpenedFolder } from 'react-icons/fc'

export default function Notes(props) {
    const dispatch = useDispatch();
    const notes = useSelector(state => state.NotesDuck.notes)
    const note = useSelector(state => state.NotesDuck.note)
    const theme = useTheme()
    const [isLoading, setLoading] = useState(true)
    const [isLoadMore, setLoadMore] = useState(false)
    const [query, setQuery] = useState({        
        uid: (props.uid) ? props.uid : null,
        type: (props.type) ? props.type : null,
        page: 1
    })

    const [state, setState] = useState({
        isLoading: false,
        isDeleted: null,
        isEdited: null,
        menuEl: null,
        confirmEl: null
      })

    useEffect(() => {
        //Se essa constant for true esta carregando mais itens
        _index(isLoadMore)
        //Msg para não ficar mostrando msg de alerta no navegador
        //eslint-disable-next-line react-hooks/exhaustive-deps

        //query = toda vez que essa variavel sofrer uma alteração ela vai sofrer uma alteração
    }, [query])

    const _index = (LoadMore) => {
        dispatch(index(query, LoadMore)).then(res => {
            //Assim que carregar os dados sumir o component de loading
            setLoading(false)
            //Assim que carregar os dados remove o setloadMore que esta carregando mais registros
            setLoadMore(false)
        })
    }

    const _store = () => {
        setState({ isLoading: true })
        let data =  {
            uid: query.uid,
            type: query.type
        }

        dispatch( store({...data, ...note})).then(res => {
            if(res) {
                dispatch(change('clear'))
                setState({ isLoading: false})
                document.getElementById('scroll').scroll({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        })
    }

    const _update = () => {
        setState({ isLoading:true })
        dispatch(update(update(note)).then(res => {
            if (res) {
                dispatch(change('clear'))
                setState({ isLoading: false, isEdited: null })
            }
        }))
    }

    return (
        //React fragment
        <>
            <AppBar postition="absolute">
                <Toolbar>
                    <IconButton onClick={() => dispatch( changeScreenC({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />                        
                    </IconButton>

                    <Typography variant="h6" color="inherit">Notas</Typography>
                </Toolbar>
            </AppBar>
            <div id="scroll" className="scroll-form notes">
            {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
                <>
                    {(notes.data.length > 0) &&
                        <div className="card-body">
                            <h6 className="m-0">{notes.total} {(notes.total> 1) ? 'Notas encontradas' : 'nota encontrada'}</h6>
                        </div>
                    }

                    {(notes.data.length < 1) &&
                        <div className="text-center my-5 py-5">
                            <FcOpenedFolder size="70"/>
                            <h6 className="mt-4 text-muted">Nenhuma nota encontrada</h6>
                        </div>
                    }
                    
                    <div className="form">
                        <TextField 
                            autoFocus
                            multiline
                            placeholder="Digite uma nota"
                            value={note.content || ''}
                            onChange={ text => dispatch (change({ content: text.target.value }))}
                        />
                        <div className="send">
                            {(state.isLoading) ? <CircularProgress /> :                            
                                <>
                                    {(state.isEdited) ?
                                    <>
                                    <IconButton onClick={() => {
                                        dispatch(change('clear'))
                                        setState({ isEdited: null })
                                    }}>
                                        <MdClose />
                                    </IconButton>
                                    <IconButton onClick={() => note.content && _update()}>
                                         <MdSave color={(note.content) && theme.palette.secondary.main}/>
                                    </IconButton>

                                     </>
                                     :                                     
                                    <IconButton onClick={() =>  _store()}>
                                        <MdSend color={(note.content) && theme.palette.secondary.main}/>
                                    </IconButton>
                                    }

                                </>
                            }
                        </div>
                    </div>
                </>

            }
            </div>
        </>
    )
}