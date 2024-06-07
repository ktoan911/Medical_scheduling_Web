import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions';
import './ListDoctor.scss';
import { getAllDoctorsService } from '../../../services/userService';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router';
import { LANGUAGES } from '../../../utils';
import removeDiacritics from 'remove-diacritics';
import { FormattedMessage } from 'react-intl';

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
            searchTerm: '',
            hideTitle: false,
        };
    }

    async componentDidMount() {
        this.fetchDoctors();
    }

    fetchDoctors = async () => {
        let res = await getAllDoctorsService();
        if (res.errCode === 0 && res.data) {
            this.setState({
                doctors: res.data,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.searchTerm !== this.state.searchTerm) {
            this.fetchDoctors();
            const { doctors, searchTerm } = this.state;
            const filteredDoctors = doctors.filter(item => {
                const fullName = this.props.language === LANGUAGES.VI
                    ? removeDiacritics(item.lastName + ' ' + item.firstName).toLowerCase()
                    : removeDiacritics(item.firstName + ' ' + item.lastName).toLowerCase();
                const searchValue = removeDiacritics(searchTerm).toLowerCase();
                return fullName.includes(searchValue);
            });

            this.setState({
                hideTitle: filteredDoctors.length === 0, // Cập nhật trạng thái ẩn tiêu đề
            });
        }
    }


    handleRedirectDetailDoctor = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${item.id}`);
        }
    }

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    render() {
        const { doctors, searchTerm, hideTitle } = this.state;
        let { language } = this.props;

        
        if (!doctors || doctors.length === 0) {
            return <div>Loading...</div>;
        }
        const filteredDoctors = doctors.filter(item => {
            const fullName = language === LANGUAGES.VI
                ? removeDiacritics(item.lastName + ' ' + item.firstName).toLowerCase()
                : removeDiacritics(item.firstName + ' ' + item.lastName).toLowerCase();
            const searchValue = removeDiacritics(searchTerm).toLowerCase();
            return fullName.includes(searchValue);
        });

        return (
            <div className='d-container'>
                <div className='d-body'>
                    <div className="d-header">
                        <i onClick={() => this.props.history.push(`/home`)} className="fas fa-arrow-left"></i>
                        <FormattedMessage id={"home-header.Doctor"} />
                    </div>
                    <div className="search-doctor">
                        <input
                            type="text"
                            placeholder={language === LANGUAGES.EN ? 'Search doctors' : 'Tìm kiếm bác sĩ'}
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <div className="title-name" style={{ display: hideTitle ? 'none' : 'block' }}>
                        <FormattedMessage id={"detail-doctor.outstanding-doctor"} />
                    </div>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(item => {
                            const doctorVi = language === LANGUAGES.VI
                                ? item.positionData.valueVi
                                : item.positionData.valueEn;
                            const nameVi = language === LANGUAGES.VI
                                ? item.lastName + ' ' + item.firstName : item.firstName + ' ' + item.lastName;

                            return (
                                <div className="content" key={item.id} onClick={() => this.handleRedirectDetailDoctor(item)}>
                                    <div className="i-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div className="content-right">
                                        <label className="">{doctorVi} || {nameVi}</label>
                                        <label className='clinic-name'>{item.Doctor_Infor.specialtyTypeData.name}</label>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-result-text">
                            {language === LANGUAGES.VI
                                ? `Không tìm thấy bác sĩ "${searchTerm}". Vui lòng nhập các từ khóa chung chung hơn.`
                                : `No doctors found for "${searchTerm}". Please enter more general keywords.`}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allRequireDoctorInfor: state.admin.allRequireDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDoctor));
