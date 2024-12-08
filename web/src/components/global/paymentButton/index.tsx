"use client";
import { useSubscription } from "@/hooks/useSubscrition";
import { Button } from "@nextui-org/button";
import React from "react";

interface Props {}

const PaymentButton = (props: Props) => {
    const {isProcessing,onSubscribe}=useSubscription()
  return (
    <Button  className="w-full bg-muted-foreground/10 uppercase border-t hover:bg-background/30 backdrop-blur-lg active:scale-[.9] transition-all duration-[.3] ease-in" isLoading={isProcessing} onPress={onSubscribe}>
      Upgrade
    </Button>
  );
};

export default PaymentButton;
