"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  className?: string;
  showError?: boolean;
};

const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  lines,
  className,
  showError = true,
}: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [Type, setType] = useState<string>(type || "text");
  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <div className="flex items-center justify-end">
            {" "}
            <Input
              id={`input-${label}`}
              type={Type}
              placeholder={placeholder}
              className={cn(
                className,
                `focus:bg-background/20 placeholder:text-muted-foreground/30 bg-primary-foreground ${
                  errors[name] && "errInput"
                } border-themeGray text-themeTextGray`
              )}
              {...register(name)}
            />
            {type == "password" && (
              <i
                onClick={() => {
                  setShow(!show);
                  Type == "password" ? setType("text") : setType("password");
                }}
                className={`cursor-pointer ${
                  show ? "ri-eye-close-line" : "ri-eye-2-line"
                } absolute me-2`}
              ></i>
            )}
          </div>
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-700 mt-2">
                  {message === "Required" ? "" : message}
                </p>
              )}
            />
          )}
        </Label>
      );
    case "select":
      return (
        <Label htmlFor={`select-${label}`} className="flex flex-col gap-2">
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border-[1px] p-3 rounded-lg"
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="dark:bg-muted"
                >
                  {option.label}
                </option>
              ))}
          </select>
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-400 mt-2">
                  {message === "Required" ? "" : message}
                </p>
              )}
            />
          )}
        </Label>
      );

    case "textarea":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          {showError && (
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }: { message: string }) => (
                <p className="text-red-400 mt-2">
                  {message === "Required" ? "" : message}
                </p>
              )}
            />
          )}
        </Label>
      );

    default:
      break;
  }
};

export default FormGenerator;