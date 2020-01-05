import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { Container, Row, Col } from "reactstrap";
import uuid from "uuid/v4";

import Layout from "../components/layout";
import Page from "../components/page";
import { getUserById } from "modules/user/actions/userActions";
import { getPhotosByUserId } from "modules/photo/actions/photoActions";

import "./photos-list.scss";
import { NextAuth } from "next-auth/client";

class User extends Page {
  constructor(props) {
    super(props);
    this.state = {
      userId: props.query.params.id
    };
  }

  componentDidMount() {
    const { userId } = this.state;
    this.props.getUserById(userId);
    this.props.getPhotosByUserId(userId);
  }

  render() {
    const { photos } = this.props;
    const childElements = photos.map(element => {
      return (
        element.location && (
          <div className="image-container" key={uuid()}>
            <Link href={`/photo/${element._id}`}>
              <a href={`/photo/${element._id}`}>
                <img className="image-element" src={element.location} />
              </a>
            </Link>
          </div>
        )
      );
    });
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <h1 className="title">
            User: {this.props.user ? this.props.user.email : ""}
          </h1>
          <Row>
            <Col>
              <Masonry
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {childElements}
              </Masonry>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

User.defaultProps = {
  photos: []
};

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    photos: state.photo.photosByUserId
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getUserById, getPhotosByUserId }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
