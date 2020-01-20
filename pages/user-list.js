import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Router from "next/router";
import Link from "next/link";
import Page from "../components/page";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button
} from "reactstrap";

import Layout from "../components/layout";
import { getUserList } from "modules/user/actions/userActions";
class UserList extends Page {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getUserList();
  }

  render() {
    const { users } = this.props;
    return (
      <Layout {...this.props} container={false} navmenu={false}>
        <Container>
          <h1 className="title">User List</h1>
          <Row>
            {users.length
              ? users.map(user => (
                  <Col key={user._id} xs="12" md="3">
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={
                          user.avatar ||
                          "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg"
                        }
                        alt="Card image cap"
                      />
                      <CardBody>
                        <CardTitle>{user.email}</CardTitle>
                        <Link href={`/user/${user._id}`}>
                          <Button>
                            <a
                              style={{
                                color: "#FFF",
                                textDecoration: "none"
                              }}
                              href={`/user/${user._id}`}
                            >
                              Go to profile
                            </a>
                          </Button>
                        </Link>
                      </CardBody>
                    </Card>
                  </Col>
                ))
              : "Loading users"}
          </Row>
        </Container>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.user.users
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getUserList }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
