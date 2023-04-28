import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil';
import { loadingAtom } from '../state/loading.atom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Resetpass = ({ setIsForgetpass, setIsLogin, resetPassForm, setResetpassForm }) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const setLoading = useSetRecoilState(loadingAtom)
    const toast = useToast()

    const handleResetPass = async () => {
        let formData = new FormData();
        formData.append("email", resetPassForm.email);
        formData.append("password", resetPassForm.password);
        formData.append("token", resetPassForm.otp);
        try {
            setLoading(true);
            var response = await axios({
                method: "POST",
                data: formData,
                url: BASE_URL + "api/user/reset-pass",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            if (response.data.status === true) {
                toast({
                    title: "Success",
                    description: "Password was successfully changed",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setIsForgetpass(false);
                setIsLogin(true);
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
            console.log(error);
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
        <>
            <Text
                fontSize="xl"
                textAlign="center"
                width="100%"
                fontWeight="medium"
                my="5"
            >
                Reset password
            </Text>
            <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">
                    OTP
                </FormLabel>
                <Input
                    type="text"
                    placeholder="Enter your otp"
                    onChange={(e) =>
                        setResetpassForm((prev) => ({ ...prev, otp: e.target.value }))
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
                            setResetpassForm((prev) => ({
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
                onClick={handleResetPass}
            >
                Reset Pass
            </Button>
        </>
    )
}

export default Resetpass