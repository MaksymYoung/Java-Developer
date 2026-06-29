import "./Feed.scss";
import cn from "classnames"
import PropTypes from "prop-types";

function Feed({children, className}) {
  return (
    <main className={cn("feed-wrapper", className)} >
      {children}
    </main>
  );
}

Feed.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
}

export default Feed;
