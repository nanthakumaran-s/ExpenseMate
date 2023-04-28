import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../state/user.atom";
import { loadingAtom } from "../state/loading.atom";
import { useNavigate } from "react-router-dom";
import SignIn from "../components/SignIn.js";
import SignOut from "../components/SignUp";
import Resetpass from "../components/Resetpass";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const [isForgetPass, setIsForgetpass] = useState(false);
  const [resetPassForm, setResetpassForm] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLoading = useSetRecoilState(loadingAtom);

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
          toast({
            title: "Authenticated",
            description: "Logged in successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUser({
            email: response.data.user.email,
            name: response.data.user.name,
            role: response.data.user.role,
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
    checkUser();
  }, []);

  const handleResetRequest = async () => {
    let formData = new FormData();
    formData.append("email", resetPassForm.email);
    try {
      setLoading(true);
      var response = await axios({
        method: "POST",
        data: formData,
        url: BASE_URL + "api/user/reset-request",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (response.data.status === true) {
        toast({
          title: "Success",
          description: "OTP Sent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setIsForgetpass(true);
        setLoading(false);
      } else {
        toast({
          title: "Failed",
          description: "Some error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Some error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center"
      backgroundColor="bg"
    >
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter the email of the account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="medium">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email address"
                onChange={(e) =>
                  setResetpassForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={() => handleResetRequest()}>
              Request OTP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        flexDir="column"
        width="2xl"
        backgroundColor="white"
        borderRadius="10px"
        alignItems="center"
        justifyContent="center"
        shadow="sm"
        py="10"
        px="6"
      >
        <Heading fontSize="3xl" fontWeight="medium">
          Expense Tracker
        </Heading>
        {isForgetPass ? (
          <Resetpass setIsForgetpass={setIsForgetpass} setIsLogin={setIsLogin} resetPassForm={resetPassForm} setResetpassForm={setResetpassForm} />
        ) : isLogin ? (
          <SignIn onOpen={onOpen} setIsLogin={setIsLogin} />
        ) : (
          <SignOut checkUser={checkUser} setIsLogin={setIsLogin} />
        )}
      </Flex>
    </Flex>
  );
};

export default Login;
