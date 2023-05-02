import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { mapIcons } from "../utils/icons";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { MdOutlinePause, MdPlayArrow } from "react-icons/md";
import { CgTrash } from "react-icons/cg";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const SubscriptionTable = ({ subscriptions, getSubscriptions }) => {
  const headerProps = {
    style: {
      fontWeight: "bold",
      fontSize: "1rem",
    },
  };

  const token = localStorage.getItem("token");
  const toast = useToast();

  const toggle = async (id, status) => {
    const payload = new FormData();
    payload.append("id", id);
    payload.append("status", status);
    try {
      const response = await axios({
        method: "PATCH",
        url: BASE_URL + "api/subscription",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        getSubscriptions();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Some error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteSub = async (id) => {
    const payload = new FormData();
    payload.append("id", id);
    try {
      const response = await axios({
        method: "DELETE",
        url: BASE_URL + "api/subscription",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        toast({
          title: "Removed subscription",
          description: "Subscription deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        getSubscriptions();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Some error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    {
      name: "note",
      header: "Note",
      sortable: false,
      minWidth: 250,
      render: ({ value }) => {
        return (
          <Text fontWeight="medium" fontSize="sm">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      header: "Amount",
      sortable: false,
      maxWidth: 200,
      render: ({ data }) => {
        return (
          <Text
            fontSize="md"
            color={data.type === "Income" ? "green.500" : "red.400"}
            fontWeight="medium"
          >{`${data.type === "Income" ? "+" : "-"}${data.amount}`}</Text>
        );
      },
      headerProps,
    },
    {
      header: "Category",
      sortable: false,
      minWidth: 250,
      render: ({ data }) => {
        return (
          <Flex alignItems="center" gap="3">
            {mapIcons[data.name]}
            <Text fontWeight="medium" fontSize="sm">
              {data.name}
            </Text>
          </Flex>
        );
      },
      headerProps,
    },
    {
      name: "interval",
      header: "Interval",
      sortable: false,
      minWidth: 250,
      render: ({ value }) => {
        return (
          <Text fontWeight="medium" fontSize="sm">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      header: "Quick Action",
      sortable: false,
      minWidth: 200,
      render: ({ data }) => {
        return (
          <Flex>
            <IconButton
              variant="ghost"
              icon={
                data.status === "Active" ? (
                  <MdOutlinePause color="gray" size="20" />
                ) : (
                  <MdPlayArrow color="gray" size="20" />
                )
              }
              onClick={() => {
                if (data.status === "Active") {
                  toggle(data.id, "Inactive");
                } else {
                  toggle(data.id, "Active");
                }
              }}
            />
            <IconButton
              variant="ghost"
              icon={<CgTrash color="red" size="20" />}
              onClick={() => deleteSub(data.id)}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex
      width="100%"
      flexDir="column"
      bg="white"
      px="5"
      py="6"
      borderRadius="md"
      mt="10"
    >
      <Text fontSize="lg" fontWeight="bold" mb="3">
        Subscription
      </Text>

      <Box mt={3}>
        <ReactDataGrid
          idProperty="id"
          columns={columns}
          pagination
          dataSource={subscriptions}
          defaultLimit={10}
          rowHeight={60}
          style={{ minHeight: 600 }}
        />
      </Box>
    </Flex>
  );
};

export default SubscriptionTable;
