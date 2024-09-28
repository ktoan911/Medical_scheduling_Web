import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import { postPatientBooking } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

const BookingModal = (props) => {
    const { isOpenModal, closeBooking, dataTime, language, getGenders } = props;

    const [bookingInfo, setBookingInfo] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        reason: '',
        doctorId: '',
        timeType: ''
    });

    useEffect(() => {
        getGenders(); // Trigger fetching gender data
    }, [getGenders]);
    useEffect(() => {
        if (props.dataTime !== dataTime) {
            if (props.dataTime && !_.isEmpty(props.dataTime)) {
                let doctorId = props.dataTime.IDBacSi;
                let timeType = props.dataTime.timeType;
                setBookingInfo({
                    ...bookingInfo,
                    doctorId: doctorId,
                    timeType: timeType
                });
            }
        }
    }, [props.dataTime, dataTime, bookingInfo]);
    

    const handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        setBookingInfo({
            ...bookingInfo,
            [id]: valueInput
        });
    }

    const buildTimeBooking = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime?.timeTypeData?.valueVi : dataTime?.timeTypeData?.valueEn;
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - DD/MM/YYYY');
            return `${time} | ${date}`;
        }
        return '';
    }

    const buildDoctorName = (dataTime) => {
        if (dataTime && !_.isEmpty(dataTime) && dataTime.doctorData) {
            return `${dataTime.doctorData.hoten}`;
        }
        return '';
    }

    const handleConfirmBooking = async () => {
        let timeString = buildTimeBooking(props.dataTime);
        let doctorName = buildDoctorName(props.dataTime);

        let bookingData = {
            ...bookingInfo,
            date: props.dataTime.date,
            language: language,
            timeString: timeString,
            doctorName: doctorName,
            serviceId: 1 // Ensure this matches your backend requirements
        };

        try {
            let res = await postPatientBooking(bookingData);

            if (res && res.errCode === 0) {
                toast.success('Booking successful!');
                closeBooking();
                handleReset();
            } else {
                toast.error('Booking failed! Error code: ' + (res.errCode || 'Unknown'));
            }
        } catch (error) {
            console.error('Booking Error:', error);
            toast.error('Booking failed due to a network or server error!');
        }
    }

    const handleReset = () => {
        setBookingInfo({
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            doctorId: '',
            timeType: ''
        });
    }

    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : '';

    return (
        <>
            <Modal
                isOpen={isOpenModal}
                size='lg'
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className='left'><FormattedMessage id={"detail-doctor.infor-booking"} /></span>
                        <span className='right' onClick={closeBooking}>
                            <i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                isShowAddressDoctor={true}
                                dataTime={dataTime}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label><FormattedMessage id={"detail-doctor.name"} /></label>
                                <input type="text" className='form-control'
                                    value={bookingInfo.fullName}
                                    onChange={(e) => handleOnChangeInput(e, 'fullName')} />
                            </div>
                            <div className="col-md-6 form-group">
                                <label><FormattedMessage id={"detail-doctor.sdt"} /></label>
                                <input type="text" className='form-control'
                                    value={bookingInfo.phoneNumber}
                                    onChange={(e) => handleOnChangeInput(e, 'phoneNumber')} />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>Email</label>
                                <input type="text" className='form-control'
                                    value={bookingInfo.email}
                                    onChange={(e) => handleOnChangeInput(e, 'email')} />
                            </div>
                            <div className="col-md-12 form-group">
                                <label><FormattedMessage id={"detail-doctor.address-user"} /></label>
                                <input type="text" className='form-control'
                                    value={bookingInfo.address}
                                    onChange={(e) => handleOnChangeInput(e, 'address')} />
                            </div>
                            <div className="col-md-12 form-group">
                                <label><FormattedMessage id={"detail-doctor.reason"} /></label>
                                <textarea type="text" className='form-control'
                                    value={bookingInfo.reason}
                                    onChange={(e) => handleOnChangeInput(e, 'reason')} />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className='btn-confirm' onClick={handleConfirmBooking}><FormattedMessage id={"detail-doctor.confirm"} /></button>
                        <button className='btn-cancel' onClick={() => { closeBooking(); handleReset(); }}><FormattedMessage id={"detail-doctor.cancel"} /></button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
