"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import { useState } from "react";
import axios from "axios";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

const SignInForm = () => {
  const [userExists, setUserExists] = useState(false); // To show popup if user does not exist
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      // Send request to check if the user exists
      const response = await axios.post("http://localhost:3000/signin", {
        email: values.email,
        password: values.password,
      });

      // If user exists, redirect to /product
      if (response.status === 200) {
        response.send("/");
      }
    } catch (error: any) {
      // If user does not exist, show modal
      if (error.response && error.response.status === 404) {
        setUserExists(true); // Trigger the popup
      } else {
        console.error("An error occurred during sign-in.", error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Apply blur effect when the modal is visible */}
      <div
        className={`w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg ${
          userExists ? "blur-sm" : ""
        }`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
              type="submit"
            >
              Sign in
            </Button>
          </form>
          <div className="my-4 flex items-center justify-center space-x-4">
            <div className="flex-grow h-px bg-gray-400"></div>
            <span>or</span>
            <div className="flex-grow h-px bg-gray-400"></div>
          </div>
          <GoogleSignInButton className="w-full">
            Sign in with Google
          </GoogleSignInButton>
          <p className="text-center text-sm text-gray-600 mt-2">
            If you don&apos;t have an account, please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </Form>
      </div>

      {/* Modal for User Not Found */}
      {userExists && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>{" "}
          {/* Blurred background */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm z-50">
            <h2 className="text-xl font-semibold text-red-500">
              User not found!
            </h2>
            <p className="mt-2 text-gray-600">
              This email is not registered. Please{" "}
              <Link className="text-blue-500 hover:underline" href="/sign-up">
                sign up
              </Link>{" "}
              to create an account.
            </p>
            <Button
              onClick={() => setUserExists(false)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
