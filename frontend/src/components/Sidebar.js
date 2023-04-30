import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../state/user.atom";
import { FiHome } from "react-icons/fi";
import { SlNotebook } from "react-icons/sl";
import { TbFileInvoice } from "react-icons/tb";
import { BsGear } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";

const Sidebar = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/authenticate");
  };

  const LinkBtn = ({ link }) => {
    const isSame = location.pathname === link.path;
    return (
      <Flex
        width="100%"
        py="2"
        px="5"
        gap="5"
        rounded="md"
        alignItems="center"
        justifyContent="start"
        color={isSame ? "black" : "gray.400"}
        _hover={{
          color: !isSame && "blue.500",
          backgroundColor: !isSame && "gray.100",
        }}
        cursor="pointer"
        my="1"
        onClick={() => {
          navigate(link.path);
        }}
      >
        {link.icon}
        <Text fontSize="lg">{link.name}</Text>
      </Flex>
    );
  };

  const links = [
    {
      name: "Home",
      icon: <FiHome size={25} />,
      path: "/",
    },
    {
      name: "Subscriptions",
      icon: <FaDollarSign size={25} />,
      path: "/subscriptions",
    },
    {
      name: "Budget",
      icon: <SlNotebook size={25} />,
      path: "/budget",
    },
    {
      name: "Invoice",
      icon: <TbFileInvoice size={25} />,
      path: "/invoice",
    },
    {
      name: "Settings",
      icon: <BsGear size={25} />,
      path: "/settings",
    },
  ];

  return (
    <Flex width="100%" height="100vh" backgroundColor="bg">
      <Flex
        width="18%"
        height="100%"
        backgroundColor="white"
        flexDir="column"
        alignItems="center"
        justifyContent="space-between"
        py="10"
      >
        <Flex flexDir="column" alignItems="center" width="80%">
          <Avatar size="lg" rounded="2xl" src={user.avatar} name={user.name} />
          <Text mt="5" fontWeight="medium" fontSize="xl" textAlign="center">
            Hi, {user.name}
          </Text>
          <Divider my="8" />
          {links.map((link, i) => (
            <LinkBtn link={link} key={i} />
          ))}
        </Flex>
        <Flex flexDir="column" alignItems="center" width="80%">
          <Divider mb="8" />
          <Flex
            width="100%"
            onClick={handleSignOut}
            alignItems="center"
            justifyContent="center"
            py="3"
            fontSize="lg"
            backgroundColor="gray.50"
            rounded="3xl"
            fontWeight="medium"
            cursor="pointer"
            _hover={{
              backgroundColor: "gray.100",
            }}
          >
            Sign Out
          </Flex>
        </Flex>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default Sidebar;
