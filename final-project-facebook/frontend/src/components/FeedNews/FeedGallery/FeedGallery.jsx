import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useState } from 'react';
import './FeedGallery.scss'

const FeedGallery = ({ imagesList, imageLink }) => {
    const [openLightbox, setOpenLightbox] = useState(false);

    const handleLightboxOpen = () => {
        setOpenLightbox(true);
    };

    return (
        <div className="feed-content__wrapper">
            {imagesList.length === 1 && (
                <img
                    className="feed-content__imagebox-img"
                    src={`${imageLink}${imagesList[0]}`}
                    alt="post_photo"
                />
            )}

            {imagesList.length === 2 && (
                <>
                    <img
                        className="feed-content__imagebox-img"
                        src={`${imageLink}${imagesList[0]}`}
                        alt="post_photo"
                    />
                    <img
                        className="feed-content__imagebox-img"
                        src={`${imageLink}${imagesList[1]}`}
                        alt="post_photo"
                    />
                </>
            )}

            {imagesList.length >= 3 && (
                <>
                    <img
                        className="feed-content__imagebox-img"
                        src={`${imageLink}${imagesList[0]}`}
                        alt="post_photo"
                    />
                    <img
                        className="feed-content__imagebox-img"
                        src={`${imageLink}${imagesList[1]}`}
                        alt="post_photo"
                    />
                    <div
                        className="feed-content__imagebox-more"
                        data-images-left={`+${imagesList.length - 3}`}
                        onClick={handleLightboxOpen}
                    >
                        <img
                            className="feed-content__imagebox-img"
                            src={`${imageLink}${imagesList[2]}`}
                            alt="post_photo"
                        />
                    </div>
                </>
            )}

            {openLightbox && (
                <Lightbox
                    open={openLightbox}
                    close={() => setOpenLightbox(false)}
                    slides={imagesList.map((image) => ({ src: `${imageLink}${image}` }))}
                />
            )}
        </div>
    );
};

export default FeedGallery;