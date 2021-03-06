/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { register, REGISTER } from '../store/auth';
import { makeLoadingSelector } from '../store/loading';
import { makeErrorSelector } from '../store/error';
import Input from '../components/Input';
import Link from '../components/Link';
import Button from '../components/Button';
import Page from '../components/Page';
import Error from '../components/Error';
import LoadingOverlay from '../components/LoadingOverlay';

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(makeLoadingSelector([REGISTER]));
  const error = useSelector(makeErrorSelector([REGISTER]));

  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      await dispatch(register(values.email, values.password));
      history.replace('/');
    },
  });

  return (
    <Page sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <LoadingOverlay loading={loading}>
        <form
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            sx={{
              width: 320,
              py: 10,
              px: 6,
              boxShadow: 'medium',
              textAlign: 'center',
              backgroundColor: 'white',
            }}
          >
            <div sx={{ fontSize: 2, fontWeight: 'bold', mb: 10 }}>
              Create an Account
            </div>
            {error && (
              <Error sx={{ textAlign: 'center' }}>Account already exists</Error>
            )}
            <Input
              name="fullName"
              placeholder="Full Name"
              sx={{ mt: 4 }}
              {...getFieldProps('fullName')}
            ></Input>
            {touched.fullName && errors.fullName && (
              <Error>{errors.fullName}</Error>
            )}
            <Input
              name="email"
              placeholder="Email"
              sx={{ mt: 4 }}
              {...getFieldProps('email')}
            ></Input>
            {touched.email && errors.email && <Error>{errors.email}</Error>}
            <Input
              type="password"
              name="password"
              placeholder="Password"
              sx={{ mt: 4 }}
              {...getFieldProps('password')}
            ></Input>
            {touched.password && errors.password && (
              <Error>{errors.password}</Error>
            )}
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              sx={{ mt: 4 }}
              {...getFieldProps('confirmPassword')}
            ></Input>
            {touched.confirmPassword && errors.confirmPassword && (
              <Error>{errors.confirmPassword}</Error>
            )}
            <div sx={{ mt: 8, fontSize: 10, lineHeight: 2 }}>
              By creating an account you agree to our <br />
              Terms of Service and Privacy Policy
            </div>
          </div>
          <Link to="/signin" color="primary" sx={{ mt: 5 }}>
            I already have an account - sign in
          </Link>
          <Button type="submit" sx={{ mt: 5, width: 320 }}>
            CONTINUE
          </Button>
        </form>
      </LoadingOverlay>
    </Page>
  );
};
