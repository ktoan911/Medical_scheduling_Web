import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
// Hành động Redux thay đổi ngôn ngữ
import { withRouter } from 'react-router';
// Truy cập lịch sử điều hướng
import { getAllSpecialty } from '../../services/userService';
// Dịch vụ để lấy danh sách các chuyên khoa
// import Slider from './Slider';


// Khởi tạo component 'HomeHeader'
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialties: [],
            // Danh sách các chuyên khoa
            isSearchActive: false,
            // Trạng thái hiện thị thanh tìm kiếm
            placeholderIndex: 0,
        };
    }

// Các phương thức của component
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    // Lấy danh sách các chuyên khoa và thiết lập interval để cập nhật placeholder
    async componentDidMount() {
        this.fetchDataSpecialties();
        this.placeholderInterval = setInterval(this.updatePlaceholder, 3000);
    }

    // Xóa interval khi component bị unmount
    componentWillUnmount() {
        clearInterval(this.placeholderInterval);
    }

    // Lấy danh sách các chuyên khoa từ server
    fetchDataSpecialties = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({ listSpecialties: res.data });
        }
    }

    // Bật tắt danh sách tìm kiếm
    toggleSearchList = () => {
        this.setState(prevState => ({ isSearchActive: !prevState.isSearchActive }));
    }

    // Đánh dấu
    handleInputBlur = () => {
        setTimeout(() => {
            this.setState({ isSearchActive: false });
        }, 200); // Đợi 200ms trước khi đánh dấu isSearchActive là false
    }

    // Điều hướng đến thanh chi tiết chuyên khoa
    handleRedirectSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`);
    }

    // Cập nhật placeholdẻr cho input tìm kiếm
    updatePlaceholder = () => {
        const { listSpecialties, placeholderIndex } = this.state;
        if (listSpecialties.length > 0) {
            const newIndex = (placeholderIndex + 1) % listSpecialties.length;
            this.setState({ placeholderIndex: newIndex });
        }
    }


    // Phương thức hiện thử giao diện người dùng
    render() {
        let language = this.props.language;
        let { listSpecialties, isSearchActive, placeholderIndex } = this.state;
        let placeholderSpecialty =
            listSpecialties.length > 0 ? listSpecialties[placeholderIndex].name : '';

        return (
            <>
                <div className="home-header-container">
                    {/* Nội dung thanh Header */}
                    <div className="home-header-content">
                        <div className="one-content">
                            {/* <i className='fas fa-bars'></i> */}
                            <div onClick={() => this.props.history.push(`/home`)} className="header-logo"></div>
                        </div>
                        <div className="two-content">
                            <div className="child-content">
                                <div onClick={() => this.props.history.push(`/specialty`)}><b><FormattedMessage id="home-header.speciality" /></b></div>
                                {/* <div className="sub-title"><FormattedMessage id="home-header.searchdoctor" /></div> */}
                            </div>
                            <div className="child-content">
                                <div onClick={() => this.props.history.push(`/list-doctor`)}><b><FormattedMessage id="home-header.Doctor" /></b></div>
                                {/* <div className="sub-title"><FormattedMessage id="home-header.choose a good doctor" /></div> */}
                            </div>
                            {/*Begin: Fix later */}
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.Checkup package" /></b></div>
                                {/* <div className="sub-title"><FormattedMessage id="home-header.General health check Support" /></div> */}
                            </div>
                            <div className='child-content'>
                                <div><b>Chẩn đoán</b></div>
                                {/* <div className="sub-tiltle">AI dự đoán bệnh</div> */}
                            </div>
                            <div className='child-content'>
                                <div><b>Cá nhân</b></div>
                                {/* <div className="sub-tiltle">Cập nhật thông tin</div> */}
                            </div>
                            {/* End: Fix later */}
                        </div>

                        <div className='three-content'>
                            <div className="search">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={placeholderSpecialty || 'Tìm chuyên khoa'}
                                    onFocus={this.toggleSearchList}
                                    onBlur={this.handleInputBlur}
                                />
                                <div className="specialty-search-list">
                                    {isSearchActive && listSpecialties && listSpecialties.length > 0
                                        && listSpecialties.map((item, i) => {
                                            return (
                                                <div
                                                    className="list-specialty"
                                                    key={item.id}
                                                    onClick={() => this.handleRedirectSpecialty(item)}
                                                >
                                                    {item.name}
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="four-content">
                            {/* <div className="support">
                                <i onClick={() => this.props.history.push(`/support`)} className='fas fa-question-circle'><FormattedMessage id="home-header.Support" /></i>
                                <p>024-7301-2468</p>
                            </div> */}
                            <div className={language === LANGUAGES.VI ?
                                'language-vi active' : 'language-vi'} >
                                <span onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>
                                    VN
                                </span>
                            </div>
                            <div className={language === LANGUAGES.EN ?
                                'language-en active' : 'language-en'} >
                                <span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>
                                    EN
                                </span>
                            </div>
                            <div className="homepage_signin">Đăng nhập</div>
                        </div>
                        
                        
                    </div>

                    {/* {this.props.isShowBanner === true &&
                        <div className="home-header-banner">
                            <div className="home-header-banner-space"></div>
                            <Slider />
                        </div>
                    } */}
                </div>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: language => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
