import React from 'react';
import PropTypes from 'prop-types';

const Content = ({ children, className = '', onSubmit, onReset, autoComplete = 'off', ...rest }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(event);
    };
    return (
        <form
            onSubmit={handleSubmit}
            onReset={onReset}
            autoComplete={autoComplete}
            className={`pm-modalContent ${className}`}
            {...rest}
        >
            {children}
        </form>
    );
};

Content.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    autoComplete: PropTypes.string
};

export default Content;
