import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Button from "@material-ui/core/Button";

const Home = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={values => {
        // Your client-side validation logic
        return false;
      }}
      onSubmit={(values, { setSubmitting }) => {
        // Call your API
        console.log("submit: ", values);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            type="email"
            name="email"
            component="TextField"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <br />
          <Field
            type="password"
            name="password"
            component="TextField"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <br />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Home;
