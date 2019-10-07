import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import Masonry from "react-masonry-css";
import { NextAuth } from "next-auth/client";
import uuid from "uuid/v4";
import ReactDropzone from "react-dropzone";
import axios from "axios";

import { Button, Form, FormGroup } from "reactstrap";

import "./photos-list.scss";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

// extract images from Facebook - for the current user
// comments for the photo

export default class extends Page {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        {
          src:
            "https://images.unsplash.com/photo-1569844514393-4e409050d5d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
        },
        {
          src:
            "https://images.unsplash.com/photo-1569817480337-01a8b22cd8d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"
        },
        {
          src:
            "https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        },
        {
          src:
            "https://images.unsplash.com/photo-1569757257198-736f6fa93fae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        },
        {
          src:
            "https://images.unsplash.com/photo-1569819417568-cb6a2d3a05dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        },
        {
          src:
            "https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
        }
      ],
      uploadedFile: React.createRef()
    };
  }

  submitForm = e => {
    e.preventDefault();
  };

  handlePhotoUpload = e => {
    console.log("e", e, this.state.uploadedFile.current.files[0]);
    this.setState({
      photos: [
        ...this.state.photos,
        {
          src: URL.createObjectURL(this.state.uploadedFile.current.files[0])
        }
      ]
    });

    console.log(this.state);
  };

  onDrop = e => {
    console.log("props", this.props.session);
    this.setState({
      photos: [
        ...this.state.photos,
        {
          src: URL.createObjectURL(e[0]),
          file: e[0]
        }
      ]
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const csrf = this.props.session.csrfToken;

    let formData = new FormData();
    formData.append(
      "avatar",
      this.state.photos[this.state.photos.length - 1].file
    );
    formData.set("user", JSON.stringify(this.props.session.user));
    const config = {
      headers: {
        "Content-Type":
          'multipart/form-data; charset=utf-8; boundary="another cool boundary"'
      }
    };
    axios
      .post("/upload", formData, config)
      .then(value => console.log("value", value))
      .catch(err => console.log(err));
  };

  onChange = e => {
    e.persist();
    this.setState({
      photos: [
        ...this.state.photos,
        {
          src: URL.createObjectURL(e.target.files[0]),
          file: e.target.files[0]
        }
      ]
    });
  };

  render() {
    const { photos, uploadedFile } = this.state;
    const childElements = photos.map(function(element) {
      return (
        <div className="image-container" key={uuid()}>
          <img className="image-element" src={element.src} />
        </div>
      );
    });
    return (
      <>
        <Layout {...this.props} navmenu={false} container={false}>
          <Container>
            <h1 className="title">Photo Gallery</h1>
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
            <Row>
              <Col>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <input
                      type="file"
                      name="myImage"
                      onChange={this.onChange}
                    />
                    <ReactDropzone onDrop={this.onDrop}>
                      {({ getRootProps, getInputProps }) => {
                        return (
                          <div
                            {...getRootProps()}
                            className="file-uploader-container"
                          >
                            <div className="thumbnail">
                              <img
                                src={
                                  this.state.photos[
                                    this.state.photos.length - 1
                                  ].src
                                }
                                alt="image"
                              />
                            </div>
                            <input {...getInputProps()} />
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          </div>
                        );
                      }}
                    </ReactDropzone>
                  </FormGroup>
                  <FormGroup>
                    <Button>Submit</Button>
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Container>
        </Layout>
      </>
    );
  }
}
