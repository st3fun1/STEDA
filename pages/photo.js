import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/page";
import { NextAuth } from "next-auth/client";
import Layout from "../components/layout";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { getPhotoById } from "modules/photo/actions/photoActions";
import { addComment } from "modules/comment/actions/commentActions";

class Photo extends Page {
  static async getInitialProps({ query, ...p }) {
    let props = await super.getInitialProps(p);
    props.photoId = query.params.id;
    return props;
  }

  constructor(props) {
    super(props);
    this.state = {
      comment: null
    };
  }

  componentDidMount() {
    const { getPhotoById, photoId } = this.props;
    getPhotoById(photoId);
  }

  setComment = e => {
    this.setState({ comment: e.target.value });
  };

  //TODO:  repeat arrow function
  handleFormSubmit = async e => {
    e.preventDefault();
    const { photoId, photo, addComment } = this.props;
    const reqObj = {
      _csrf: await NextAuth.csrfToken(),
      photoId,
      userId: photo.userId,
      comment: this.state.comment
    };

    console.log("req", reqObj);
    addComment(reqObj);
  };

  render() {
    const { photo } = this.props;
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <h1 className="title">Photo</h1>
          <Row>
            <Col md={3}>
              {photo && (
                <Card style={{ width: "200px", height: "auto" }}>
                  <CardImg
                    top
                    width="100%"
                    src={photo.location}
                    alt={photo.s3_key}
                  />
                  <CardBody>
                    <CardTitle>Photo of user {photo.userId}</CardTitle>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col md={9}>
              <Form onSubmit={this.handleFormSubmit}>
                <FormGroup>
                  <Label for="comment">Comment</Label>
                  <Input
                    style={{ minHeight: "200px", overflowY: "hidden" }}
                    type="textarea"
                    name="comment"
                    value={this.state.comment}
                    onChange={this.setComment}
                    id="comment"
                    placeholder="What's on your mind?"
                  />
                </FormGroup>
                <Button>Submit</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

Photo.defaultProp = {
  photo: ""
};

const mapStateToProps = state => {
  console.log("state", state.photo);
  return {
    photo: state.photo.photoById
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPhotoById, addComment }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
