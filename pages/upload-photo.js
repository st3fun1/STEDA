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
      uploadedFile: React.createRef()
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
        name: this.state.name || e[0].name
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const csrf = this.props.session.csrfToken;

    let formData = new FormData();
    formData.append("avatar", this.state.photo.file);
    formData.set(
      "photo",
      JSON.stringify({
        name: this.state.photo.name
      })
    );
    formData.set("user", JSON.stringify(this.props.session.user));
    const config = {
      headers: {
        "Content-Type":
          'multipart/form-data; charset=utf-8; boundary="another cool boundary"'
      }
    };
    axios
      .post("/api/photo/upload", formData, config)
      .then(value => console.log("value", value))
      .catch(err => console.log(err));

    this.setState({
      photo: {}
    });
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

  handlePhotoNameChange = e => {
    this.setState({
      photo: {
        ...this.state.photo,
        name: e.target.value
      }
    });
  };

  render() {
    const { photo } = this.state;
    console.log(":", photo);
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Container>
          <h1 className="title">Upload Photo</h1>
          <Row>
            <Col>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="photo-name">Photo name</Label>
                  <Input
                    type="text"
                    name="photoName"
                    id="photo-name"
                    value={photo.name || undefined}
                    onChange={e => this.handlePhotoNameChange(e)}
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
                <FormGroup></FormGroup>
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
