import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/page";
import Masonry from "react-masonry-css";
import Layout from "../components/layout";
import { Container, Row, Col } from "reactstrap";
import Router from "next/router";

import "./liked-media.scss";
import { getLikedPhotos } from "modules/photo/actions/photoActions";

import Link from "next/link";

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1
};

class LikedMedia extends Page {
  componentDidMount() {
    const { getPhotoList, session } = this.props;
    // TODO - auth hoc
    if (!session.user) {
      console.log("withSession");
      Router.push("/");
    } else {
      getPhotoList(session.user.id);
    }
  }

  render() {
    const { photos, session } = this.props;
    console.log("photos", photos);
    const childElements = photos
      .map(item => item.photo)
      .map(function(element) {
        console.log("e", element);
        return (
          element.location && (
            <div className="image-container" key={element._id}>
              <Link href={`/photo/${element._id}`}>
                <a href={`/photo/${element._id}`}>
                  <img className="image-element" src={element.location} />
                </a>
              </Link>
              <div title={element.description} className="photo-description">
                {element.description}
              </div>
            </div>
          )
        );
      });
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <Row>
            <Col className="grid-container">
              {childElements.length ? (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {childElements}
                </Masonry>
              ) : (
                <p>No photos liked yet.</p>
              )}
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

LikedMedia.defaultProps = {
  photos: []
};

const mapStateToProps = state => {
  return {
    photos: state.photo.likedPhotos
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPhotoList: getLikedPhotos }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LikedMedia);
