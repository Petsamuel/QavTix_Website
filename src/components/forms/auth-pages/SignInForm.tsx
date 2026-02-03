"use client"

import ActionButton1 from "../../custom-utils/buttons/ActionButton1"
import PasswordInput1 from "../../custom-utils/inputs/PasswordInput1"
import TextInput1 from "../../custom-utils/inputs/TextInput1"

export default function SignInForm(){
    return (
        <form className="space-y-4">
            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">Email Address</label>
                <TextInput1 placeholder="Enter your email address" icon="mage:email" />
            </div>
            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">Password</label>
                <PasswordInput1 helperText="Must be at least 8 characters" />
            </div>
            <ActionButton1 buttonText="Sign in" className="mt-6 w-full" />
        </form>
    )
}