import React, { Fragment, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import Masonry from "react-masonry-css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";

import { getPhotoList } from "modules/photo/actions/photoActions";
import MasonryGridStyles from "./masonry-grid.styles";
import MasonryChildrenStyles from "./masonry-children.styles";

const config = {
  breakpoint: {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
  }
};

const MasonryChildren = withStyles(MasonryChildrenStyles)(props => {
  const { items, classes, getPhotoList } = props;

  useEffect(() => {
    getPhotoList();
  });

  return items.map(function(element) {
    return (
      (element.fileLink || element.location) && (
        <div className="image-container" key={element._id}>
          <Link href={`/photo/${element._id}`}>
            <a href={`/photo/${element._id}`}>
              <img
                className="image-element"
                src={element.s3_key ? element.location : element.fileLink}
              />
            </a>
          </Link>
          <div className="image-details">
            <a href={`/photo/${element._id}`}>
              <div title={element.description} className="photo-description">
                {element.description}
              </div>
            </a>
          </div>
        </div>
      )
    );
  });
});

const MasonryGrid = props => {
  const { classes } = props;
  return (
    <Fragment>
      {childElement.length && (
        <Masonry breakpointCols={config.breakpoint}>
          <MasonryChildren items={items} />
        </Masonry>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    photos: state.photo.photos
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPhotoList }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(MasonryGridStyles)(MasonryGrid));
