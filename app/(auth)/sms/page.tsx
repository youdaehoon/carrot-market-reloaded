"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";
const initialState = {
  token: false,
  error: undefined,
  phone: undefined,
};
export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state?.token ? (
          <Input
            name="token"
            required
            type="number"
            placeholder="Verification code"
            minLength={100000}
            maxLength={999999}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            required
            type="text"
            placeholder="Phone number"
            errors={state?.error?.formErrors}
          />
        )}

        <Button text={state?.token ? "Verify Token" : "Send verification SMS"} />
      </form>
    </div>
  );
}
