import React, { useState, useEffect } from "react";
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../state/loading.atom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { userAtom } from "../state/user.atom";
import { useToast } from "@chakra-ui/react";

const PrivateRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const setLoading = useSetRecoilState(loadingAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      try {
        var response = await axios({
          method: "GET",
          url: BASE_URL + "api/user",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.data.status === true) {
          setUser({
            email: response.data.user.email,
            name: response.data.user.name,
            avatar: response.data.user.avatar,
            balance: response.data.user.balance,
          });
          setLoading(false);
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  const toast = useToast();

  const upgrade = async (token) => {
    const response = await axios({
      method: "PATCH",
      url: BASE_URL + "api/user/upgrade",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(response);
    if (response.data.status === true) {
      toast({
        title: "Success",
        description: "Upgraded to PRO user",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Err",
        description: "Some Error occurred while upgrading your account",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoggedIn(true);
    checkUser();
  };

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      const url = window.location.href;
      const hasCode = url.includes("?payment=");
      if (hasCode) {
        const newUrl = url.split("?payment=");
        console.log(newUrl);
        if (newUrl[1] === "true") {
          upgrade(userToken);
        } else {
          setIsLoggedIn(true);
          checkUser();
        }
      } else {
        setIsLoggedIn(true);
        checkUser();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn === undefined) {
    return <p>Loading....</p>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/authenticate" />;
};

export default PrivateRoute;
