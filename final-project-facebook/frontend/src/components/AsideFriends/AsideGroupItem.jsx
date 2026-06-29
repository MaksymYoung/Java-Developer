import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AsideGroupItem = ({name, id}) => {
  return (
    <li className='aside-friends-list__item'>
      <Link className='aside-friends-list__link' to={`/messages/${id}`}>
        {name}
      </Link>
    </li>
  )
}

AsideGroupItem.propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
}

export default AsideGroupItem
