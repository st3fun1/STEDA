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
  Input,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Link from "next/link";
import { getPhotoById, likeById } from "modules/photo/actions/photoActions";
import {
  addComment,
  getComments
} from "modules/comment/actions/commentActions";

class Photo extends Page {
  static async getInitialProps({ query, ...p }) {
    let props = await super.getInitialProps(p);
    props.photoId = query.params.id;
    return props;
  }

  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
  }

  // TODO: one time password
  componentDidMount() {
    const { getPhotoById, photoId, getComments } = this.props;
    getPhotoById(photoId);
    getComments(photoId);
  }

  setComment = e => {
    this.setState({ comment: e.target.value });
  };

  //TODO:  repeat arrow function
  handleFormSubmit = async e => {
    e.preventDefault();
    const { photoId, addComment, currentUser } = this.props;
    const reqObj = {
      _csrf: await NextAuth.csrfToken(),
      photoId,
      userId: currentUser.id,
      comment: this.state.comment
    };
    this.setState({
      comment: ""
    });
    addComment(reqObj);
  };

  handleLike = async e => {
    const { likeById, photo, session } = this.props;
    const token = await NextAuth.csrfToken();
    likeById({
      _csrf: token,
      photoId: photo._id,
      userId: session.user.id,
      liked: photo.liked
    });
  };

  render() {
    const { photo, comments, session } = this.props;

    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <h1 className="title">Photo</h1>
          <Row>
            <Col md={3} sm={12}>
              {photo && (
                <Card style={{ height: "auto" }}>
                  <CardImg
                    top
                    width="100%"
                    src={photo.s3_key ? photo.location : photo.fileLink}
                    alt={photo.description}
                  />
                  <CardBody>
                    <CardTitle>
                      <div className="details">
                        Photo of{" "}
                        <Link href={`/user/${photo.userId}`}>
                          <a href={`/user/${photo.userId}`}>
                            {photo.user.name}
                          </a>
                        </Link>
                      </div>
                      {session.user && (
                        <div className="actions">
                          {photo.userId !== session.user.id && (
                            <Button
                              onClick={this.handleLike}
                              outline
                              color="primary"
                            >
                              {photo.liked ? "Dislike" : "Like"}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardTitle>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col md={9} sm={12}>
              <ListGroup>
                {comments &&
                  comments.map(item => (
                    <ListGroupItem key={item._id}>
                      <b>{item.user ? item.user.name : "Anonymous"}</b>:{" "}
                      {item.comment}
                    </ListGroupItem>
                  ))}
              </ListGroup>
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

const mapStateToProps = (state, props) => {
  return {
    photo: state.photo.photoById,
    comments: state.comment.comments[props.photoId],
    currentUser: props.session.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getPhotoById, addComment, getComments, likeById },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
