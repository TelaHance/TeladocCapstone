import React from "react";
import PropTypes from 'prop-types';
import "./AppLayout.module.css";

function AppLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}

AppLayout.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element.isRequired
    ])
}

export default AppLayout;