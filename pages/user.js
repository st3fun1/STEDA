import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Masonry from "react-masonry-css";
import { Container, Row, Col } from "reactstrap";

import Layout from "../components/layout";
import Page from "../components/page";
import { getUserById } from "modules/user/actions/userActions";
import { getPhotosByUserId } from "modules/photo/actions/photoActions";

import "./photos-list.scss";

class User extends Page {
  static async getInitialProps({ query, ...p }) {
    let props = await super.getInitialProps(p);
    props.userId = query.params.id;
    return props;
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { userId } = this.props;
    this.props.getUserById(userId);
    this.props.getPhotosByUserId(userId);
  }

  render() {
    const { photos } = this.props;
    const childElements = photos.map(function(element) {
      return (
        element.location && (
          <div className="image-container" key={element._id}>
            <img className="image-element" src={element.location} />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
