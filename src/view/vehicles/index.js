import React, { forwardRef, useEffect, useState } from 'react'
import { index } from '../../store/actions/vehicle.action'
import { Link } from 'react-router-dom'
import { Button, CircularProgress, IconButton, Menu, MenuItem, Slide, Fade } from '@material-ui/core'
import { FaPlus, FaEllipsisV, FaClipboard, FaUser, FaLink, FaPencilAlt, FaTrash, FaShare } from 'react-icons/fa'
import { SCROLL, apiUrl } from '../../config/App'
import Header from '../header'
import { useDispatch, useSelector } from 'react-redux'
import { Fragment } from 'react'

export default function Vehicles() {
  const dispatch = useDispatch()
  const vehicles = useSelector(state => state.vehicleReducer.vehicles)
  const [isLoading, setLoading] = useState(true)
  const [isLoadMore, setLoadMore] = useState(false)
  const [query, setQuery] = useState({ page: 1 })
  const [state, setState] = useState({
    isDeleted: null,
    menuEl: null,
    confirmEl: null
  })

  useEffect(() => {
    document.addEventListener('scroll', _handleScroll);
    _index();
  }, [])

  const _handleScroll = (event) => {
    let scrollTop = event.srcElement.body.scrollHeight - (event.srcElement.body.offsetHeight + event.srcElement.body.scrollTop);
    if (scrollTop < SCROLL) {
      if (!isLoadMore && _handleLoadMore());
    }
  }

  const _handleLoadMore = () => {
    if (vehicles.current_page < vehicles.last_page) {
      setQuery({
        ...query,
        page: query.page + 1
      }, () => {
        _index(true);
      })
    }
  }

  const _handleMenu = (event) => {
    setState({ menuEl: event.currentTarget })
  }

  const _index = (loadMore) => {
    dispatch(index(query, loadMore)).then(res => {
      if (res) {
        setLoading(false)
        if (isLoadMore && setLoadMore(false));
      }
    })
  }

  const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />
  })

  return (
    <>
      <Header title="Veiculos" />
      <div className="container mt-4 pt-3">
        {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
          <>
            <div className="d-flex mb-4">
              <h3 className="font-weight-normal">Veiculos</h3>
              <Link to="/vehicles/create" className="ml-auto">
                <Button variant="contained" color="primary" size="large">
                  <FaPlus size="1.5em" className="mr-2" />
                        Cadastrar
                    </Button>
              </Link>
            </div>

            <div className="card">
              {(vehicles.data.length > 0) &&
                <div className="card-header">
                  <h6 className="m-0">Veiculos {vehicles.total}</h6>
                </div>
              }

              <div className="p-2 p-md-3">
                {vehicles.data.map((item, index) => (
                  <Fragment key={index}>
                    <div className="d-flex my-3">
                      <div className="vehicle-img d-flex justify-content-center align-items-center">
                        {(state.isDeleted === item.id) ?
                          <CircularProgress color="secondary" /> :
                          (item.cover && <img alt="" className="shadow rounded" src={`${apiUrl}/vehicles/photo/${item.cover.uuid}?width=180&height=135`} />)
                        }
                      </div>
                      <div className="vehicle-detail pl-3 pl-md-4">
                        <h6>{item.brand ? item.brand.name : ''} {item.model ? item.model.name : ''}</h6>
                        <strong className="d-block">{item.version ? item.version.name : ''}</strong>
                        {(item.price) &&
                          <strong className="text-danger h5 d-block">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</strong>
                        }
                      </div>

                      <div className="ml-auto">
                        <IconButton id={index} onClick={_handleMenu}>
                          <FaEllipsisV />
                        </IconButton>

                        {(Boolean(state.menuEl)) &&
                          <Menu
                                anchorEl={state.menuEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left'
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right'
                                }}
                                TransitionComponent={window.innerWidth < 577 ? Transition : Fade}
                                open={(index === parseInt(state.menuEl.id))}
                                onClose={() => setState({ menuEl: null })}
                                onClick={() => setState({ menuEl: null })}
                            >
                            <MenuItem>
                              <FaClipboard size="0.8em" className="mr-4" />Notas
                            </MenuItem>
                            <MenuItem>
                              <FaUser size="0.8em" className="mr-4" />Proprietário
                            </MenuItem>
                            <MenuItem>
                              <FaLink size="0.8em" className="mr-4" />Visualizar
                            </MenuItem>

                            <div className="dropdown-divider" />
                            <MenuItem>
                              <Link to={`/vehicles/${item.uuid}/edit`}>
                                <FaPencilAlt size="0.8em" className="mr-4" />Editar
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <FaTrash size="0.8em" className="mr-4" />Apagar
                            </MenuItem>
                            <MenuItem>
                              <FaShare size="0.8em" className="mr-4" />Compartilhar
                            </MenuItem>
                          </Menu>
                        }
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        }
      </div>
    </>
  )
}