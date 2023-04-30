import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../state/loading.atom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { userAtom } from "../state/user.atom";

const PrivateRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const setLoading = useSetRecoilState(loadingAtom)
  const setUser = useSetRecoilState(userAtom)
  const navigate = useNavigate()

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
            balance: response.data.user.balance
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

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setIsLoggedIn(true);
      checkUser();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn === undefined) {
    return <p>Loading....</p>
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/authenticate" />
};

export default PrivateRoute;
