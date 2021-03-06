import React from "react";
import Router from "next/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col, Form, Input, Label, Button } from "reactstrap";
import Cookies from "universal-cookie";
import { NextAuth } from "next-auth/client";

import { signUp } from "modules/user/actions/userActions";

class SignInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      signupRepeatPassword: "",
      signupPassword: "",
      signupEmail: "",
      session: this.props.session,
      providers: this.props.providers,
      submitting: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim()
    });
  }

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value.trim()
    });
  };

  handleSignupRepeatPassword = event => {
    this.setState({
      signupRepeatPassword: event.target.value.trim()
    });
  };

  handleSignUpPasswordChange = event => {
    this.setState({
      signupPassword: event.target.value.trim()
    });
  };

  handleSignupEmailChange = event => {
    this.setState({
      signupEmail: event.target.value.trim()
    });
  };

  handleSignup = async event => {
    event.preventDefault();
    const { signupEmail, signupPassword, signupRepeatPassword } = this.state;
    const { signUpUser } = this.props;
    this.setState({
      submitting: true
    });
    if (
      signupEmail &&
      signupPassword &&
      signupRepeatPassword &&
      signupPassword === signupRepeatPassword
    ) {
      signUpUser({
        _csrf: await NextAuth.csrfToken(),
        signupEmail,
        signupPassword,
        signupRepeatPassword
      });
    }

    this.setState({
      submitting: false
    });
  };

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.email) return;

    this.setState({
      submitting: true
    });

    // Save current URL so user is redirected back here after signing in
    const cookies = new Cookies();
    cookies.set("redirect_url", window.location.pathname, { path: "/" });

    NextAuth.signin({
      email: this.state.email,
      password: this.state.password
    })
      .then(authenticated => {
        Router.push(`/auth/callback`);
      })
      .catch(() => {
        this.setState({
          submitting: false
        });
        alert("Authentication failed.");
      });
  }

  render() {
    if (this.props.session.user) {
      return <div />;
    } else {
      return (
        <React.Fragment>
          <p
            className="text-center"
            style={{ marginTop: 10, marginBottom: 30 }}
          >{`If you don't have an account, one will be created when you sign in.`}</p>
          <Row>
            <Col xs={12}>
              <SignInButtons providers={this.props.providers} />
            </Col>
            <p>or</p>
            <Col xs={12}>
              <Form
                id="signin"
                method="post"
                action="/auth/signin"
                onSubmit={this.handleSubmit}
              >
                <Input
                  name="_csrf"
                  type="hidden"
                  value={this.state.session.csrfToken}
                />
                <p>
                  <Label htmlFor="email">Email address</Label>
                  <br />
                  <Input
                    name="email"
                    disabled={this.state.submitting}
                    type="text"
                    placeholder="j.smith@example.com"
                    id="email"
                    className="form-control"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                  />
                </p>
                <p>
                  <Label htmlFor="password">Password</Label>
                  <br />
                  <Input
                    name="password"
                    disabled={this.state.submitting}
                    type="password"
                    id="password"
                    className="form-control"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                  />
                </p>
                <p className="text-right">
                  <Button
                    id="submitButton"
                    disabled={this.state.submitting}
                    outline
                    color="dark"
                    type="submit"
                  >
                    {this.state.submitting === true && (
                      <span className="icon icon-spin ion-md-refresh mr-2" />
                    )}
                    Sign in now
                  </Button>
                </p>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <p>or register</p>
            </Col>
            <Col>
              <Col xs={12} md={6}>
                <Form
                  id="signup"
                  method="post"
                  action="/auth/signup"
                  onSubmit={this.handleSignup}
                >
                  <Input
                    name="_csrf"
                    type="hidden"
                    value={this.state.session.csrfToken}
                  />
                  <p>
                    <Label htmlFor="signupEmail">Email address</Label>
                    <br />
                    <Input
                      name="signupEmail"
                      disabled={this.state.submitting}
                      type="text"
                      placeholder="j.smith@example.com"
                      id="signupEmail"
                      className="form-control"
                      value={this.state.signupEmail}
                      onChange={this.handleSignupEmailChange}
                    />
                  </p>
                  <p>
                    <Label htmlFor="signupPassword">Password</Label>
                    <br />
                    <Input
                      name="signupPassword"
                      disabled={this.state.submitting}
                      type="password"
                      id="signupPassword"
                      className="form-control"
                      value={this.state.signupPassword}
                      onChange={this.handleSignUpPasswordChange}
                    />
                  </p>
                  <p>
                    <Label htmlFor="repeatPassword">Repeat Password</Label>
                    <br />
                    <Input
                      name="repeatPassword"
                      disabled={this.state.submitting}
                      type="password"
                      id="repeatPassword"
                      className="form-control"
                      value={this.state.signupRepeatPassword}
                      onChange={this.handleSignupRepeatPassword}
                    />
                  </p>
                  <p className="text-right">
                    <Button
                      id="signUpSubmitBtn"
                      disabled={this.state.submitting}
                      outline
                      color="dark"
                      type="submit"
                    >
                      {this.state.submitting === true && (
                        <span className="icon icon-spin ion-md-refresh mr-2" />
                      )}
                      Register
                    </Button>
                  </p>
                </Form>
              </Col>
            </Col>
          </Row>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signUpUser: signUp }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInModal);

export class SignInButtons extends React.Component {
  render() {
    return (
      <React.Fragment>
        {Object.keys(this.props.providers).map((provider, i) => {
          if (!this.props.providers[provider].signin) return null;

          return (
            <p key={i}>
              <a
                className="btn btn-block btn-outline-secondary"
                href={this.props.providers[provider].signin}
              >
                Sign in with {provider}
              </a>
            </p>
          );
        })}
      </React.Fragment>
    );
  }
}
