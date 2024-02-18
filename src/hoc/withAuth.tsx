"use client";

import { isAuthenticated } from "@/lib/utils/auth";
import Router from "next/router";
import { ComponentType, FC, useEffect } from "react";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
): FC<P> => {
  const WithAuthComponent: FC<P> = (props) => {
    useEffect(() => {
      if (!isAuthenticated()) {
        Router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
