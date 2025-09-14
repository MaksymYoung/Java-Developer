import React from "react";
import SearchIcon from "../../icons/search.svg?react";
import PropTypes from "prop-types";
import "./SearchInput.scss"
// import cn from "classnames";

const SearchInput = (props) => {
  const { name, placeholder, type, htmlFor, ...restProps } = props;
  return (
    <label htmlFor={htmlFor} className="search">
      <SearchIcon className="search__icon" />
      <input
        type={type}
        name={name}
        className="search__input"
        placeholder={placeholder}
        {...restProps}
      />
    </label>
  );
};

SearchInput.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    htmlFor: PropTypes.string,
    restProps: PropTypes.object,
  };

export default SearchInput;
