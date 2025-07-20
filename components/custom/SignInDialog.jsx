"use client";

import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/userDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetails } = useContext(UserDetailContext);

  const createUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: "Bearer " + tokenResponse.access_token,
              Accept: "application/json",
            },
          }
        );

        const user = userInfo?.data;

        await createUser({
          name: user.name,
          email: user.email,
          picture: user.picture,
          uid: uuid4(),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        setUserDetails(user);
        window.location.reload();
        closeDialog(false);
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    onError: (errorResponse) => console.log("Google login error:", errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome Back!
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-center items-center gap-3">
              <h2 className="text-xl font-bold text-white text-center">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 mt-3"
                onClick={() => googleLogin()}
              >
                Sign In With Google
              </Button>
              <p className="text-center text-sm text-gray-500">
                {Lookup.SIGNIN_SUBHEADING}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
