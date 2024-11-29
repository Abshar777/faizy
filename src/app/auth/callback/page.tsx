import { onAuthenticateUser } from "../../../../actions/user";
import { redirect } from "next/navigation";

type Props = {};

const AuthCallbackPage = async ({}: Props) => {
  const auth = await onAuthenticateUser();
  console.log(auth,"auth");
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.data?.workspace[0].id}`);
  }
  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect("/auth/sign-in");
  }
};

export default AuthCallbackPage;
