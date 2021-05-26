import { Button, Checkbox, CircularProgress, FormControlLabel, InputAdornment, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change, show, store, cep, brand, model, version, uploadPhoto, deletePhoto, reorderPhoto, update, indexResponse } from '../../store/actions/vehicle.action';
import Header from '../header';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import ArrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { apiUrl } from '../../config/App';
import { FaSave, FaTrash } from 'react-icons/fa';
import { Confirm } from '../components';
import { Link, Redirect } from 'react-router-dom';
import './vehicle.css';

const SortableItem = SortableElement(({ value }) =>
    <div className="bg-img" style={{ backgroundImage: `url(${apiUrl}/vehicles/photo/${value.uuid})` }}></div>    
);

const SortableList = SortableContainer(({ children }) => {
    return <div className="row">{children}</div>
});

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null)
            }}
            mask={mask}
            guide={false}
        />
    )
}

const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value
                    }
                })
            }}
            decimalSeparator=","
            thousandSeparator="."
            prefix={other.name}
        />
    );
}

export default function Vehicles(props) {
    const dispatch = useDispatch();
    const data = useSelector(state => state.vehicleReducer);
    const [state, setState] = useState({        
        isLoading: true,
        isLoadingCep: false,
        isDeleted: null,
        redirect: false,
        tips: 0,
        confirmEl: null,
    });
    console.warn(state.confirmEl)
    const vehicleId = (props.match.params.id) ?? null;
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
   
        const index = () => {
            if (vehicleId) {
                
                dispatch(show(vehicleId)).then(response => response && setLoading(false))
                
            } else {
                dispatch(store()).then(response => response && setLoading(false))
            }
        }

        index();

    }, [dispatch, vehicleId])

    useEffect(() => {
        return () => {
            dispatch(indexResponse({ success: false }))
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpload = (event) => {
        [...event.target.files].map(img => {
            const body = new FormData();
            body.append('file', img);
            body.append('uuid', data.vehicle.uuid)
            return dispatch(uploadPhoto(body));
        })

        if (data.error.photos && delete data.error.photos);
    }

    const _deletePhoto = (id) => {             
        setState({
            ...state,
            isDeleted: id
        })
        dispatch(deletePhoto(id)).then(response => response &&
            setState({
                ...state,
                isDeleted: null
            }))
    }

    const handleConfirm = event => {        
        setState({
            ...state,
            confirmEl: event.currentTarget
        })
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        let items = ArrayMove(data.vehicle.photos, oldIndex, newIndex);
        let order = items.map(({ id }) => id);
        dispatch(reorderPhoto({ order: order }, items));
    }

    return (
        <>
            {(data.success) && <Redirect to="/vehicles" />}
            <Header title="Gestão de veículo" button={
                            <Button color="inherit" onClick={() => dispatch(update(data.vehicle))} className="ml-auto">Salvar</Button>
                            }/>
            <div className="container my-4 pt-3">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"><CircularProgress /></div> :

                    <div className="row">
                        <div className="col-md-7">
                            <h3 className="font-weight-normal mt-4 mb-4">Localização do veiculo</h3>
                            <div className="card card-body" onClick={() => setState({ ...state, tips: 0 })}>
                                <div className="row">
                                    <div className="form-group ml-3">                                        
                                        <label className="label-custom">CEP</label>
                                        <TextField
                                            style={(state.isLoadingCep) ? { opacity: 0.5 } : {}}
                                            error={(data.error.zipcode) && true}
                                            type="tel"
                                            InputProps={{
                                                inputComponent: TextMaskCustom,
                                                value: data.vehicle.zipcode,
                                                onChange: text => {
                                                    dispatch(change({ zipcode: text.target.value }));
                                                    if (text.target.value.length > 8) {
                                                        setState({
                                                            ...state,
                                                            isLoadingCep: true
                                                        })
                                                        dispatch(cep(text.target.value)).then(res => {
                                                                setState({
                                                                    ...state,
                                                                    isLoadingCep: false
                                                                })
                                                            })
                                                        if (data.error.zipcode) {
                                                            delete data.error.zipcode;
                                                            delete data.error.uf;
                                                            delete data.error.city;
                                                        }
                                                    }
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        {(state.isLoadingCep) ? <CircularProgress size={32} /> : <></>}
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {(data.error.zipcode) &&
                                            <strong className="text-danger">{data.error.zipcode[0]}</strong>
                                        }
                                    </div>
                                </div>
                                <div className="row my-2">
                                    <div className="col-md-9 form-group">
                                        <label className="label-custom">Cidade</label>
                                        <TextField
                                            error={(data.error.city) && true}
                                            disabled
                                            value={data.vehicle.city || ''}
                                        />
                                        {(data.error.city) &&
                                            <strong className="text-danger">{data.error.city[0]}</strong>
                                        }
                                    </div>
                                    <div className="col-md-3 form-group">
                                        <label className="label-custom">UF</label>
                                        <TextField
                                            error={(data.error.uf) && true}
                                            disabled
                                            value={data.vehicle.uf || ''}
                                        />
                                        {(data.error.city) &&
                                            <strong className="text-danger">{data.error.uf[0]}</strong>
                                        }
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-weight-normal mt-4 mb-4">Dados do veiculo</h3>
                            <div className="card card-body" onClick={() => setState({ ...state, tips: 1 })}>
                                <div className="form-group">
                                    <label className="label-custom">Categoria</label>
                                    <Select
                                        error={data.error.type && true}
                                        value={data.vehicle.type || ''}
                                        onChange={event => {
                                            dispatch(change({
                                                type: event.target.value,
                                                brand_id: null,
                                                model_id: null,
                                                version_id: null,
                                                gerbox_id: null,
                                                fuel_id: null,
                                                steering_id: null,
                                                motor_power_id: null,
                                                doors_id: null
                                            }))
                                            dispatch(brand(event.target.value))
                                            if (data.error.type) {
                                                delete data.error.type
                                            }
                                        }}
                                    >
                                        {data.types.map(item => (
                                            <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {(data.error.type) &&
                                        <strong className="text-danger">{data.error.type[0]}</strong>
                                    }
                                </div>
                                <div className="form-group">
                                    <label className="label-custom">Marcas</label>
                                    <Select
                                        error={data.error.brand_id && true}
                                        value={data.vehicle.brand_id || ''}
                                        onChange={event => {
                                            dispatch(change({
                                                brand_id: event.target.value,
                                                model: null,
                                                version: null,
                                            }))

                                            dispatch(model(data.vehicle.type, event.target.value))
                                            if (data.error.brand_id) {
                                                delete data.error.brand_id
                                            }
                                        }}
                                    >
                                        {data.brand.map(item => (
                                            <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {(data.error.brand_id) &&
                                        <strong className="text-danger">{data.error.brand_id[0]}</strong>
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label className="label-custom">Modelo</label>
                                        <Select
                                            error={data.error.model_id && true}
                                            value={data.vehicle.model_id || ''}
                                            onChange={event => {
                                                dispatch(change({
                                                    model_id: event.target.value,
                                                    version_id: null,
                                                    gerbox_id: null,
                                                    fuel_id: null,
                                                    steering_id: null,
                                                    motor_power_id: null,
                                                    doors_id: null,
                                                }))
                                                dispatch(version(data.vehicle.brand_id, event.target.value))
                                                if (data.error.model_id) {
                                                    delete data.error.model_id
                                                }
                                            }}
                                        >
                                            {data.model.map(item => (
                                                <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {(data.error.model_id) &&
                                            <strong className="text-danger">{data.error.model_id[0]}</strong>
                                        }
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label className="label-custom">Ano</label>
                                        <Select
                                            error={data.error.regdate_id && true}
                                            value={data.vehicle.regdate_id || ''}
                                            onChange={event => {
                                                dispatch(change({ regdate_id: event.target.value }))
                                                if (data.error.regdate_id) {
                                                    delete data.error.regdate_id
                                                }
                                            }}
                                        >
                                            {data.regdate.map(item => (
                                                <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {(data.error.regdate_id) &&
                                            <strong className="text-danger">{data.error.regdate_id[0]}</strong>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label-custom">Versão</label>
                                    <Select
                                        error={data.error.version_id && true}
                                        value={data.vehicle.version_id || ''}
                                        onChange={event => {
                                            dispatch(change({ version_id: event.target.value }))
                                        }}
                                    >
                                        {data.version.map(item => (
                                            <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {(data.error.version_id) &&
                                        <strong className="text-danger">{data.error.version_id[0]}</strong>
                                    }
                                </div>
                            </div>
                            <div className="card card-body mt-4">
                                <div className="form-group">
                                    <div className="row">
                                        {(data.vehicle.type === 2020) && <>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Câmbio</label>
                                                <Select
                                                    value={data.vehicle.gearbox_id || ''}
                                                    onChange={event => dispatch(change({ gearbox_id: event.target.value }))}
                                                >
                                                    {data.gearbox.map(item => (
                                                        <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Combustível</label>
                                                <Select
                                                    error={data.error.fuel_id && true}
                                                    value={data.vehicle.fuel_id || ''}
                                                    onChange={event => dispatch(change({ fuel_id: event.target.value }))}
                                                >
                                                    {data.fuel.map(item => (
                                                        <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                                    ))}
                                                </Select>
                                                {(data.error.fuel_id) &&
                                                    <strong className="text-danger">{data.error.fuel_id[0]}</strong>
                                                }
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Força do motor</label>
                                                <Select
                                                    value={data.vehicle.motor_power_id || ''}
                                                    onChange={event => dispatch(change({ motor_power_id: event.target.value }))}
                                                >
                                                    {data.motorpower.map(item => (
                                                        <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="label-custom">Portas</label>
                                                <Select
                                                    value={data.vehicle.doors_id || ''}
                                                    onChange={event => dispatch(change({ doors_id: event.target.value }))}
                                                >
                                                    {data.doors.map(item => (
                                                        <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </>
                                        }

                                        <div className="col-md-6 form-group">
                                            <label className="label-custom">Cor</label>
                                            <Select
                                                value={data.vehicle.color_id || ''}
                                                onChange={event => dispatch(change({ color_id: event.target.value }))}
                                            >
                                                {data.colors.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="label-custom">Quilometragem</label>
                                            <TextField
                                                type="tel"
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                    value: data.vehicle.mileage || '',
                                                    onChange: text => dispatch(change({ mileage: text.target.value }))
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {(data.vehicle.type) &&
                                <>
                                    <h3 className="font-weight-normal mt-4">Itens e opcionais</h3>
                                    <div className="card card-body mt-4" onClick={() => setState({ ...state, tips: 1 })}>
                                        <div className="row">
                                            {data.features.map(item => (item.type_id === data.vehicle.type) && (
                                                <div key={item.id} className="col-md-6">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={data.vehicle.features[item.value] ? true : false}
                                                                onChange={() => {
                                                                    let checked = data.vehicle.features[item.value] ?
                                                                        delete data.vehicle.features[item.value] :
                                                                        { [item.value]: item }
                                                                    dispatch(change({
                                                                        features: {
                                                                            ...data.vehicle.features,
                                                                            ...checked
                                                                        }
                                                                    }))
                                                                }}
                                                            />
                                                        }
                                                        label={item.name}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            }
                            <h3 className="font-weight-normal my-4">Financeiro</h3>
                            <div className="card card-body" onClick={() => setState({ ...state, tips: 2 })}>
                                <div className="form-group">
                                    <label className="label-custom">Estado Financeiro</label>
                                    <div className="row">
                                        {data.financial.map(item => (
                                            <div key={item.id} className="col-md-6">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={data.vehicle.financials[item.value] ? true : false}
                                                            onChange={() => {
                                                                let checked = data.vehicle.financials[item.value] ?
                                                                    delete data.vehicle.financials[item.value] :
                                                                    { [item.value]: item }
                                                                dispatch(change({
                                                                    financials: {
                                                                        ...data.vehicle.financials,
                                                                        ...checked
                                                                    }
                                                                }))
                                                            }}
                                                        />
                                                    }
                                                    label={item.name}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label className="label-custom">Preço</label>
                                            <TextField
                                                type="tel"
                                                name="R$ "
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                    value: data.vehicle.price || '',
                                                    onChange: text => {
                                                        dispatch(change({ price: text.target.value }))
                                                        if (data.error.price) {
                                                            delete data.error.price
                                                        }
                                                    }
                                                }}
                                            />
                                            {(data.error.price) &&
                                                <strong className="text-danger">{data.error.price}</strong>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-weight-normal my-4">Título e descrição do anúncio</h3>
                            <div className="card card-body" onClick={() => setState({ ...state, tips: 3 })}>
                                <div className="form-group">
                                    <label className="label-custom">Titulo da descrição</label>
                                    <TextField
                                        value={data.vehicle.title || ''}
                                        onChange={text => dispatch(change({ title: text.target.value }))}
                                        onFocus={() => setState({ ...state, tips: 3 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label-custom">Descrição do anúncio</label>
                                    <TextField
                                        value={data.vehicle.description || ''}
                                        rows="5"
                                        rowmax="5"
                                        onChange={text => dispatch(change({ description: text.target.value }))}
                                    />
                                </div>
                            </div>                            
                            <h3 className="font-weight-normal my-4" onClick={() => setState({ ...state, tips: 4 })}>Fotos</h3>
                            <div className="card card-body">
                                {(data.error.photos) &&
                                    <strong className="text-danter">{data.error.photos[0]}</strong>
                                }
                                <SortableList axis="xy" onSortEnd={onSortEnd}>
                                    {data.vehicle.photos.map((item, index) => (
                                        <div key={item.id} className="col-6 col-md4">
                                            <div className="box-image justify-content-center alignt-items-center my-3">
                                                {(state.isDeleted === item.id) ?
                                                    <CircularProgress size="30" color="secundary" />
                                                    :
                                                    <>
                                                        <span id={item.id} onClick={handleConfirm}
                                                            className="img-action d-flex justify-content-center aligns-items-center">
                                                            <div className="app-icon d-flex">
                                                                <FaTrash
                                                                    color="#fff"
                                                                    size="1.2em"
                                                                />
                                                            </div>
                                                        </span>
                                                        <SortableItem
                                                            key={`item-${item.id}`}
                                                            index={index}
                                                            value={item}
                                                        />                                                          
                                                        {(Boolean(state.confirmEl)) && 
                                                            <Confirm
                                                                open={(item.id === parseInt(state.confirmEl.id))}
                                                                onConfirm={() => _deletePhoto(item.uuid)}
                                                                onClose={() => setState({
                                                                    ...state,
                                                                    confirmEl: null
                                                                })}
                                                            />
                                                        }                                                            
                                                    </>
                                                }
                                            </div>
                                        </div>                                        
                                    ))}
                                    

                                    <div className="col-6 col-md-4">
                                        <div className="box-image box-upload d-flex justify-content-center align-items-center-my-3">
                                            <input onChange={handleUpload} type="file" multiple name="img" className="file-input" />
                                            {(data.upload_photo) ?
                                                <CircularProgress />
                                                :
                                                <p className="box-text">
                                                    <span className="text-plus"> + </span>
                                                    <span> Adicionar fotos</span>
                                                </p>
                                            }
                                        </div>
                                    </div>
                                </SortableList>
                            </div>
                        </div>
                        <div className="col-md-5 d-none d-md-block mt-4">
                            <div className="tips">
                                <h3 className="font-weight-normal mb-4">Dicas</h3>
                                <div className="card card-body">
                                    {(state.tips === 0) &&
                                        <>
                                            <h5>Endereço</h5>
                                            <p>

                                            </p>
                                        </>
                                    }
                                    {(state.tips === 1) &&
                                        <>
                                            <h5>Dados do veículo</h5>
                                            <p>

                                            </p>
                                        </>
                                    }
                                    {(state.tips === 2) &&
                                        <>
                                            <h5>Financeiro</h5>
                                            <p>

                                            </p>
                                        </>
                                    }
                                    {(state.tips === 3) &&
                                        <>
                                            <h5>Título</h5>
                                            <p>

                                            </p>
                                        </>
                                    }
                                    {(state.tips === 4) &&
                                        <>
                                            <h5>Fotos</h5>
                                            <p>
                                            </p>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="d-flex btn-save">
                                <Link to="/vehicles"  className="mx-2">
                                    <Button variant="contained" size="large">
                                        Voltar
                                    </Button>
                                </Link>
                                <Button variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => dispatch(update(data.vehicle))}
                                    >
                                    <FaSave size="1.5rem" className="mx-3"/>
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )

}
