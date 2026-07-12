import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('validation.invalid_email').required('validation.required_email'),
  password: Yup.string().required('validation.required_password'),
});
