import { Button } from "@nextui-org/react";
import { IoIosClose } from "react-icons/io";
import React from "react";
import { Plus } from "lucide-react";
import { FaFilePdf } from "react-icons/fa6";
import PaymentMethod from "@/components/global/paymentMethod";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentHistory from "@/components/global/paymentMethod/PaymentHistory";
import { getPaymentInfo } from "../../../../../actions/subscription";

interface Props {}

const BillingPage = async(props: Props) => {
  const {data}=await getPaymentInfo()
 
  return (
    <div className="grid py-2   grid-cols-1 xl:grid-cols-2 lg:py-5    gap-3">
      <div className="flex flex-col gap-y-3">
        <div className="flex justify-between w-full bg-muted-foreground/5 rounded-lg p-4">
          <div className="flex flex-col w-full gap-y-8  ">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-xl font-semibold">Current Plan</h1>
              <p className="text-sm text-muted-foreground">
                Your Payment History
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <h1 className="text-xl font-semibold">${data?.subscription?.plan==="PRO" ? 99 : 0}/Month</h1>
              <p className="text-sm text-muted-foreground">
                You are currently on the{" "}
                <span className="text-primary font-semibold">{data?.subscription?.plan}</span> plan.
              </p>
            </div>
          </div>
          <Button
            color="primary"
            className="text-muted-foreground/40 bg-transparent hover:bg-transparent "
          >
            <p className="flex items-center gap-x-1">
              <IoIosClose size={20} /> Cancel Plan
            </p>
          </Button>
        </div>
        <div className="flex flex-col w-full bg-muted-foreground/5 rounded-lg p-4 gap-y-4">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-xl font-semibold">Payment Method</h1>
              <p className="text-sm text-muted-foreground">
                Your Payment History
              </p>
            </div>

            <Button
              color="primary"
              className="text-muted-foreground/40 bg-transparent hover:bg-transparent "
            >
              <Plus size={20} /> Add New
            </Button>
          </div>
          <ScrollArea className="max-h-[20rem] w-full flex flex-col gap-y-4">
            <PaymentMethod />
            <PaymentMethod />
          </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col w-full bg-muted-foreground/5 rounded-lg p-4 gap-y-4">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-xl font-semibold">Payment History</h1>
            <p className="text-sm text-muted-foreground">
              Your Payment History
            </p>
          </div>

          <Button color="secondary" className="text-muted-foreground/40 ">
            <FaFilePdf size={20} /> Download PDF
          </Button>
        </div>
        <ScrollArea className="lg:max-h-[32rem]  md:max-h-[20rem]  w-full flex flex-col gap-y-4">
          <PaymentHistory />
        </ScrollArea>
      </div>
    </div>
  );
};

export default BillingPage;
