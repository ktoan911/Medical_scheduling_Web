import React, { Component } from 'react';  
import { connect } from 'react-redux';
import _ from 'lodash'; 
// lodash là thư viện tiện ích của js
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
// Component điều hướng
import { adminMenu, doctorMenu } from './menuApp';
// Menu điều dướng cho admin và doctor
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
// Hỗ trợ đa ngôn ngữ

// Chứa menuApp để lưu trữ menu điều hướng dựa trên vai trò người dùng
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        }
    }

    // Thay đổi ngôn ngữ ứng dụng
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    // Xác định menu điều hướng dựa trên vai trò người dùng khi component được mount
    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu,
        })
    }

    // Hiện thị giao diện người dùng 
    render() {
        const { processLogout, language, userInfo } = this.props;

        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                {/* Các tùy chọn ngôn ngữ */}
                <div className="languages">
                    <span className='welcome'><FormattedMessage id="home-header.welcome" />,<span>&nbsp;</span>
                        {userInfo.firstName ? userInfo.firstName : ' '}!</span>
                    <span className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>
                        VN
                    </span>
                    <span className={language === LANGUAGES.EN ? "language-en active" : "language-en"}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>
                        EN
                    </span>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}


// Lấy trạng thái từ Redux store
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

// Định nghĩa các hành động Redux để thay đổi ngôn ngữ và xử lý logout
const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: language => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
