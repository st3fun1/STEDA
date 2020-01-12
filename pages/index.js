import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/page";
import Layout from "../components/layout";
import Masonry from "react-masonry-css";
import { getPhotoList } from "modules/photo/actions/photoActions";
import { Container, Row, Col, ListGroupItem, ListGroup } from "reactstrap";

// use withCSS
import "./photos-list.scss";
import Link from "next/link";

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1
};

class PhotoList extends Page {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getPhotoList } = this.props;
    getPhotoList();
  }

  render() {
    const { photos } = this.props;
    const childElements = photos.map(function(element) {
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
        <div className="upload-photo-container">
          <Link href="/upload-photo">
            <a href="/upload-photo">Upload</a>
          </Link>
        </div>
        <Container>
          <Row>
            <Col className="grid-container">
              {childElements.length && (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {childElements}
                </Masonry>
              )}
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

PhotoList.defaultProps = {
  photos: []
};

const mapStateToProps = state => {
  return {
    photos: state.photo.photos
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPhotoList }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoList);
