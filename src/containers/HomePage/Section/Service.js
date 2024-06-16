import React from 'react';
import './Service.scss';
import Icon_test_sk from '../../../assets/service/test.png';
import Icon_goi_phau_thuat from '../../../assets/service/Icon_goi_phau_thuat.png';
import Icon_kham_chuyen_khoa from '../../../assets/service/Icon_kham_chuyen_khoa.png';
import Icon_kham_tong_quat from '../../../assets/service/Icon_kham_tong_quat.png';
import Icon_kham_tu_xa from '../../../assets/service/Icon_kham_tu_xa.png';
import Icon_xet_nghiem from '../../../assets/service/Icon_xet_nghiem_y_hoc.png';

const Service = () => {
    return (
        <div className="service">
            <h1>Dịch vụ toàn diện</h1>
            <div className="service-grid">
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_kham_chuyen_khoa} alt="Khám chuyên khoa" />
                    </div>
                    <p>Khám chuyên khoa</p>
                </div>
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_kham_tu_xa} alt="Khám từ xa" />
                    </div>
                    <p>Khám từ xa</p>
                </div>
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_kham_tong_quat} alt="Khám tổng quát" />
                    </div>
                    <p>Khám tổng quát</p>
                </div>
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_goi_phau_thuat} alt="Gói phẫu thuật" />
                    </div>
                    <p>Gói phẫu thuật</p>
                </div>
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_test_sk} alt="Bài test sức khỏe" />
                    </div>
                    <p>Bài test sức khỏe</p>
                </div>
                <div className="service-item">
                    <div className="icon-wrapper">
                        <img src={Icon_xet_nghiem} alt="Xét nghiệm y học" />
                    </div>
                    <p>Xét nghiệm y học</p>
                </div>
            </div>
        </div>
    );
};

export default Service;