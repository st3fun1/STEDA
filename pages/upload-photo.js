import Link from "next/link";
import React from "react";
import { Container, Row, Col, Label, Input } from "reactstrap";
import Page from "../components/page";
import Layout from "../components/layout";
import { NextAuth } from "next-auth/client";
import uuid from "uuid/v4";
import ReactDropzone from "react-dropzone";
import axios from "axios";

import { Button, Form, FormGroup } from "reactstrap";

import "./photos-list.scss";

const breakpointColumnsObj = {
  default: 1
};

// extract images from Facebook - for the current user
// comments for the photo

export default class extends Page {
  constructor(props) {
    super(props);
    this.state = {
      photo: {},
      uploadedFile: React.createRef(),
      media: null,
      description: ""
    };
  }

  submitForm = e => {
    e.preventDefault();
  };

  handlePhotoUpload = e => {
    this.setState({
      src: URL.createObjectURL(this.state.uploadedFile.current.files[0])
    });
  };

  onDrop = e => {
    console.log("e: ", e);
    this.setState({
      photo: {
        src: URL.createObjectURL(e[0]),
        file: e[0],
        name: description || e[0].name
      }
    });
  };

  onSubmit = async e => {
    const { media, photo, description } = this.state;
    const { session } = this.props;
    e.preventDefault();
    if (media) {
      axios
        .post("/api/media/upload", {
          description,
          userId: session.user.id,
          fileLink: media,
          _csrf: await NextAuth.csrfToken()
        })
        .then(value => console.log("value", value))
        .catch(err => console.log(err));
    } else if (photo) {
      let formData = new FormData();
      formData.append("avatar", photo.file);
      formData.set(
        "photo",
        JSON.stringify({
          name: description
        })
      );
      formData.set("user", JSON.stringify(session.user));
      const config = {
        headers: {
          "Content-Type":
            'multipart/form-data; charset=utf-8; boundary="another cool boundary"'
        }
      };
      // TODO: action
      axios
        .post("/api/photo/upload", formData, config)
        .then(value => console.log("value", value))
        .catch(err => console.log(err));

      this.setState({
        photo: {}
      });
    }
  };

  onChange = e => {
    e.persist();
    console.log("e", e);
    this.setState({
      photo: {
        src: URL.createObjectURL(e.target.files[0]),
        file: e.target.files[0]
      }
    });
  };

  testImage = (url, timeoutT) => {
    return new Promise(function(resolve, reject) {
      var timeout = timeoutT || 5000;
      var timer,
        img = new Image();
      img.onerror = img.onabort = function() {
        clearTimeout(timer);
        reject("error");
      };
      img.onload = function() {
        clearTimeout(timer);
        resolve("success");
      };
      timer = setTimeout(function() {
        // reset .src to invalid URL so it stops previous
        // loading, but doesn't trigger new load
        img.src = "//!!!!/test.jpg";
        reject("timeout");
      }, timeout);
      img.src = url;
    });
  };

  handleDescriptionChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleMediaChange = async e => {
    if (e.target) {
      const value = e.target.value;
      const name = e.target.name;
      const imageTest = await this.testImage(value);
      console.log("test", imageTest);
      this.setState({
        [name]: value
      });
    }
  };

  render() {
    const { photo, media, description } = this.state;
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <h1 className="title">Share something</h1>
          <Row>
            <Col>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    value={description}
                    onChange={e => this.handleDescriptionChange(e)}
                  />
                </FormGroup>
                <FormGroup>
                  <ReactDropzone
                    style={{
                      width: "200px",
                      border: "2px solid black",
                      position: "relative"
                    }}
                    className="dropzone"
                    onDrop={this.onDrop}
                  >
                    {({ getRootProps, getInputProps }) => {
                      return (
                        <div
                          {...getRootProps()}
                          className="file-uploader-container"
                        >
                          <input {...getInputProps()} />
                          {this.state.photo ? (
                            <div className="image-container" skey={uuid()}>
                              <img
                                className="image-element"
                                src={photo.src}
                                style={{ width: "200px" }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                      );
                    }}
                  </ReactDropzone>
                </FormGroup>
                {!photo.src && (
                  <FormGroup>
                    <p>or</p>
                    <Label for="photo-name">Other media link</Label>
                    <Input
                      type="url"
                      name="media"
                      id="media"
                      value={media}
                      onChange={e => this.handleMediaChange(e)}
                    />
                  </FormGroup>
                )}
                <FormGroup>
                  <Button>Submit</Button>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}
