import "./HomePage.scss";
import Aside from "../../compositions/Aside/Aside";
import Feed from "../../compositions/Feed/Feed";
import FeedComponent from "../../components/FeedNews/FeedComponent.jsx";
import SideBar from "../../components/SideBar/SideBar.jsx";
import AsideFriends from "../../components/AsideFriends/AsideFriends.jsx";

const HomePage = () => {
  return (
    <>
      <div className="home-page-wrapper">
        <Aside className="aside-left">
          <SideBar />
        </Aside>
        <Feed>
          <FeedComponent />
        </Feed>
        <Aside className="aside-right">
          <AsideFriends />
        </Aside>
      </div>
    </>
  );
};

export default HomePage;
