import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import Masonry from "react-masonry-css";
import uuid from "uuid/v4";
import ReactDropzone from "react-dropzone";

import { Button, Form, FormGroup } from "reactstrap";

import "./photos-list.css";

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
    this.setState({
      photos: [
        ...this.state.photos,
        {
          src: URL.createObjectURL(e[0])
        }
      ]
    });
    console.log("onDrop", e);
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
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                  }}
                >
                  <FormGroup>
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
                  <Button>Submit</Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </Layout>
      </>
    );
  }
}
