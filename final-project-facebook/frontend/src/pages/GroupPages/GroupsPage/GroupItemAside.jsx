import React from "react";
import "./GroupItemAside.scss";
import PropTypes from "prop-types";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";
import cn from "classnames";

const GroupItemAside = (props) => {
  const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
  const { coverImageUrl, name, onClick, className } = props;

  const [checkUrl, setCheckUrl] = useState(imageGroupIcon)
  const chechUrlImg = async (url) => {
      try {
          const response = await fetch(url);
          if (response.ok) {
              setCheckUrl(`${IMG_URL}/groups/${coverImageUrl}`)
          } else {
              setCheckUrl (imageGroupIcon)
          }
      } catch (e) {
      }
  }
  useEffect(() => {
      chechUrlImg(`${IMG_URL}/groups/${coverImageUrl}`)
  }, []);
  
  return (
      <li className={cn('aside-group-item', className)} onClick={onClick}>
            <img 
              className="aside-group-item__img"
              src={checkUrl}
              alt={name} 
            />
            <p className="aside-group-item__title">{name}</p>
      </li>
  );
};

GroupItemAside.propTypes = {
    name: PropTypes.string,
    coverImageUrl: PropTypes.string,
    id: PropTypes.number,
    onClick: PropTypes.func,
};

export default GroupItemAside;
