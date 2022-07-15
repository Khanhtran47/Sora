import { SignUp } from '@clerk/remix';

const SignUpPage = () => <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />;

export default SignUpPage;
