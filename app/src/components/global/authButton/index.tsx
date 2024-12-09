import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "@nextui-org/button";
import { User } from "lucide-react";

interface Props {}

const AuthButton = (props: Props) => {
  return (
    <SignedOut>
      <div className="flex gap-x-3 justify-center items-center">
        <SignInButton>
          <Button radius="full" className="flex gap-x-2 px-1 font-medium bg-secondary/80" color="secondary" size="sm">
            <p className="text-sm">Login  </p>
          </Button>
        </SignInButton>
      </div>
    </SignedOut>
  );
};

export default AuthButton;
