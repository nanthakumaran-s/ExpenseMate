import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../state/loading.atom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setIsLogin, onOpen }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    let formData = new FormData();
    formData.append("email", formInput.email);
    formData.append("password", formInput.password);
    try {
      setLoading(true);
      var response = await axios({
        method: "POST",
        data: formData,
        url: BASE_URL + "api/user/login",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (response.data.status === true) {
        toast({
          title: "Authenticated",
          description: "Logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate("/");
      } else {
        toast({
          title: "Failed",
          description: "Failed to login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Text
        fontSize="2xl"
        textAlign="center"
        width="100%"
        fontWeight="medium"
        mt="5"
      >
        Welcome Back
      </Text>
      <Flex alignItems="center" gap="1" my="3">
        <Text color="gray.400" fontWeight="normal">
          Do not have an account?
        </Text>
        <Text
          onClick={() => setIsLogin(false)}
          color="blue.400"
          fontWeight="medium"
          cursor="pointer"
        >
          Create today!
        </Text>
      </Flex>
      <FormControl isRequired>
        <FormLabel fontSize="lg" fontWeight="medium">
          Email
        </FormLabel>
        <Input
          type="email"
          placeholder="Enter your email address"
          onChange={(e) =>
            setFormInput((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </FormControl>
      <FormControl isRequired mt={3}>
        <FormLabel fontSize="lg" fontWeight="medium">
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) =>
              setFormInput((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Flex width="100%" mt="5" alignItems="center" justifyContent="end">
        <Text
          onClick={() => {
            onOpen();
          }}
          color="blue.400"
          fontWeight="medium"
          cursor="pointer"
          textAlign="left"
        >
          Forgot Password?
        </Text>
      </Flex>
      <Button
        isLoading={loading}
        colorScheme="blue"
        width="100%"
        mt={6}
        fontSize="lg"
        onClick={handleLogin}
      >
        Login
      </Button>
    </>
  );
};

export default SignIn;
