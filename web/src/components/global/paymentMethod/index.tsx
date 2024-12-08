import React from "react";
import { SiVisa } from "react-icons/si";

interface Props {}

const PaymentMethod = (props: Props) => {
  return (
    <div className="flex mt-2 flex-col gap-y-2 bg-primary-foreground rounded-md p-4  w-full">
      <h1 className="text-sm  flex items-center gap-x-4 ">
        <SiVisa size={35} className="text-muted-foreground/40" />
        <p className="text-muted-foreground/40 ">xxxx xxxx xxxx 1234</p>
      </h1>
      <h1 className="text-sm  flex items-center gap-x-4 ">
        <p className="text-muted-foreground/40 ">Expirey</p>
        <p className="text-muted-foreground/40 ">01/23</p>
      </h1>
    </div>
  );
};

export default PaymentMethod;
