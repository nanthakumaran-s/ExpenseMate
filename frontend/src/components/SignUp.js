import { Button, Flex, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil';
import { loadingAtom } from '../state/loading.atom';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const SignOut = ({ setIsLogin }) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [signUpInput, setSignUpInput] = useState({
        name: "",
        email: "",
        avatar: "default",
        password: "",
    });

    const setLoading = useSetRecoilState(loadingAtom);
    const toast = useToast();
    const navigate = useNavigate();

    const handleRegister = async () => {
        let formData = new FormData();
        formData.append("email", signUpInput.email);
        formData.append("password", signUpInput.password);
        formData.append("name", signUpInput.name);
        formData.append("avatar", signUpInput.avatar);
        try {
            setLoading(true);
            var response = await axios({
                method: "POST",
                data: formData,
                url: BASE_URL + "api/user/register",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            if (response.data.status === true) {
                toast({
                    title: "Authenticated",
                    description: "Sign up successfully completed",
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
                    description: "Failed to sign up",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                setLoading(false);
            }
        } catch (error) {
            toast({
                title: "Failed",
                description: "Failed to sign up",
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
                Get Started
            </Text>
            <Flex alignItems="center" gap="1" my="3">
                <Text color="gray.400" fontWeight="normal">
                    Already have an account?
                </Text>
                <Text
                    onClick={() => setIsLogin(true)}
                    color="blue.400"
                    fontWeight="medium"
                    cursor="pointer"
                >
                    Get in!
                </Text>
            </Flex>
            <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">
                    Name
                </FormLabel>
                <Input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) =>
                        setSignUpInput((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
            </FormControl>
            <FormControl isRequired mt={3}>
                <FormLabel fontSize="lg" fontWeight="medium">
                    Email
                </FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(e) =>
                        setSignUpInput((prev) => ({ ...prev, email: e.target.value }))
                    }
                />
            </FormControl>
            <FormControl mt={3}>
                <FormLabel fontSize="lg" fontWeight="medium">
                    Avatar URL
                </FormLabel>
                <Input
                    type="text"
                    placeholder="Copy paste you avatar URL"
                    onChange={(e) =>
                        setSignUpInput((prev) => ({ ...prev, role: e.target.value }))
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
                            setSignUpInput((prev) => ({
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
            <Button
                colorScheme="blue"
                width="100%"
                mt={6}
                fontSize="lg"
                onClick={handleRegister}
            >
                Sign Up
            </Button>
        </>
    )
}

export default SignOut