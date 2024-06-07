import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {


    render() {

        return (
            <div className="home-footer">
                <p>&copy; 2023 design by <a target='_blank' href="https://www.facebook.com/ThucSkin202" rel="noopener noreferrer">Thức Skin</a></p>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
