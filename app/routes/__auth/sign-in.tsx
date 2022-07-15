import { RedirectToSignIn } from '@clerk/remix';

const SignInPage = () => <RedirectToSignIn redirectUrl={new URL(document.referrer).pathname} />;

export default SignInPage;
