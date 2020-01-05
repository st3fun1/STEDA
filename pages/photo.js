import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Page from "../components/page";
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
  FormText
} from "reactstrap";
import { getPhotoById } from "modules/photo/actions/photoActions";

class Photo extends Page {
  static async getInitialProps({ query, ...p }) {
    let props = await super.getInitialProps(p);
    props.photoId = query.params.id;
    return props;
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getPhotoById, photoId } = this.props;
    getPhotoById(photoId);
  }

  handleFormSubmit(e) {}

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
  return {
    photo: state.photo.photoById
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getPhotoById }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
