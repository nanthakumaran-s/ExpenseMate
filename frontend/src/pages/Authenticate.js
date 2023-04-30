import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../state/loading.atom";
import SignIn from "../components/SignIn.js";
import SignOut from "../components/SignUp";
import Resetpass from "../components/Resetpass";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgetPass, setIsForgetpass] = useState(false);
  const [resetPassForm, setResetpassForm] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

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
            <Button
              isLoading={loading}
              variant="ghost"
              onClick={() => handleResetRequest()}
            >
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
          ExpenseMate
        </Heading>
        {isForgetPass ? (
          <Resetpass
            setIsForgetpass={setIsForgetpass}
            setIsLogin={setIsLogin}
            resetPassForm={resetPassForm}
            setResetpassForm={setResetpassForm}
          />
        ) : isLogin ? (
          <SignIn onOpen={onOpen} setIsLogin={setIsLogin} />
        ) : (
          <SignOut setIsLogin={setIsLogin} />
        )}
      </Flex>
    </Flex>
  );
};

export default Login;
