import React from 'react';
import { changeAlert } from '../../store/actions/alert.action';
import { Modal, Typography } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { MdError, MdCheckCircle } from 'react-icons/md'

export default function Notify() {    
    const dispatch = useDispatch();
    //useSelector pega todos os estados da aplicação, todosos reducers
    const alert = useSelector(state => state.alertReducer)    

    if (alert.open) {
        setTimeout(() => dispatch(changeAlert({ open: false })), alert.time)
    }

    return (
          <Modal
            open={alert.open}
            onClose={() => dispatch( changeAlert({ open: false }))}
            className="d-flex flex-column align-items-center justify-content-center h-100"
          >
              <div className="bg-white rounded-lg d-flex align-items-center p-4">
                  {
                    (alert.class === 'success') && 
                    <MdCheckCircle style={{ fontsize: '2.5rem' }} 
                                    className="mr-3 text-success" />
                  }
                  {
                    (alert.class === 'error') &&
                    <MdError style={{ fontsize: '2.5rem' }} 
                                    className="mr-3 text-danger" />
                  }
                <Typography className="font-weight-bold" variant="subtitle2">{alert.msg}</Typography>
              </div>

          </Modal>
    )
}