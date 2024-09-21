// "use client";
// import axios from "axios";
// import { DefaultValues, useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import GoogleSignInButton from "../GoogleSignInButton";
// import { FormEvent } from "react";
// import { send } from "process";
// const formSchema = z.object({
//   myInput: z.string().transform(Number),
// });

// const FormSchema = z
//   .object({
//     email: z.string().min(1, "Email is required").email("Invalid email"),
//     password: z
//       .string()
//       .min(1, "Password is required")
//       .min(8, "Password must have than 8 characters"),
//     cPassword: z.string().min(1, "Password confirmation is required"),
//   })
//   .refine((data) => data.password === data.cPassword, {
//     path: ["cPassword"],
//     message: "Password do not match",
//   });

// const SignUpForm = () => {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       cPassword: "",
//     },
//   });
//   const onSubmit = async (values: z.infer<typeof FormSchema>) => {
//     try {
//       const postData = {
//         email: values.email,
//         password: values.password,
//         cpassword: values.cPassword,
//       };

//       const resp = await axios.post("http://localhost:3000/signup", postData);
//       console.log("first", resp);
//     } catch (error) {
//       console.error("Error::::", error);
//     }
//   };
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
//         <div className="space-y-2">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="mail@sysbioz.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="Enter your password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="cPassword"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Re-Enter your password</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Re-Enter your password"
//                     type="password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         {/* <Link href="/sign-in">
//          <Button className="w-full mt-6" type="submit">
//            Sign up
//          </Button>
//        </Link> */}
//         <Button className="w-full mt-6" type="submit">
//           Sign up
//         </Button>
//       </form>
//       <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
//         or
//       </div>
//       <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
//       <p className="text-center text-sm text-gray-600 mt-2">
//         If you already have an account, please&nbsp;
//         <Link className="text-blue-500 hover:underline" href="/sign-in">
//           Sign in
//         </Link>
//       </p>
//     </Form>
//   );
// };

// export default SignUpForm;
"use client";
import axios from "axios";
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

const FormSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have at least 8 characters"),
    cPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.cPassword, {
    path: ["cPassword"],
    message: "Passwords do not match",
  });

const SignUpForm = () => {
  const [signUpSuccess, setSignUpSuccess] = useState(false); // Success state
  const [errorMessage, setErrorMessage] = useState(""); // Error message for other errors
  const [userExists, setUserExists] = useState(false); // User exists state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      cPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const postData = {
        email: values.email,
        password: values.password,
        cpassword: values.cPassword,
      };

      const resp = await axios.post(
        "http://localhost:3000/amazonPriceAlert/signup",
        postData
      );

      if (resp.status === 200 || resp.status === 201) {
        // Handle success
        setSignUpSuccess(true);
        setErrorMessage("");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setUserExists(true); // Show modal if user already exists
      } else {
        setErrorMessage("An error occurred during sign-up. Please try again.");
      }
    }
  };

  return (
    <div className="relative">
      {/* Apply blur effect conditionally */}
      <div
        className={`w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg ${
          userExists || signUpSuccess ? "blur-sm" : ""
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
                      <Input placeholder="Enter your mail" {...field} />
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
              <FormField
                control={form.control}
                name="cPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Re-Enter your password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-Enter your password"
                        type="password"
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
              Sign up
            </Button>
          </form>
          <div className="my-4 flex items-center justify-center space-x-4">
            <div className="flex-grow h-px bg-gray-400"></div>
            <span>or</span>
            <div className="flex-grow h-px bg-gray-400"></div>
          </div>
          <GoogleSignInButton className="w-full">
            Sign up with Google
          </GoogleSignInButton>
          <p className="text-center text-sm text-gray-600 mt-2">
            If you already have an account, please&nbsp;
            <Link className="text-blue-500 hover:underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </Form>
      </div>

      {/* Modal for Existing User */}
      {userExists && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>{" "}
          {/* Blurred background */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm z-50">
            <h2 className="text-xl font-semibold text-red-500">
              User Already Exists
            </h2>
            <p className="mt-2 text-gray-600">
              This email is already registered. Please{" "}
              <Link className="text-blue-500 hover:underline" href="/sign-in">
                sign in
              </Link>{" "}
              to continue.
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

      {/* Modal for Successful Sign Up */}
      {signUpSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>{" "}
          {/* Blurred background */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm z-50">
            <h2 className="text-xl font-semibold text-green-500">
              Sign Up Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Welcome to <span className="text-red-500">Smart Shopper</span> 🚀.
              Please{" "}
              <Link className="text-blue-500 hover:underline" href="/sign-in">
                sign in
              </Link>{" "}
              to continue.
            </p>
            <Button
              onClick={() => setSignUpSuccess(false)}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
