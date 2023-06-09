import {
  Avatar,
  Box,
  Container,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { BsArrowsAngleExpand } from "react-icons/bs";
import React from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { mapIcons } from "../utils/icons";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

const HomeTable = ({ transactions }) => {
  const headerProps = {
    style: {
      fontWeight: "bold",
      fontSize: "1rem",
    },
  };

  const columns = [
    {
      header: "Type",
      sortable: false,
      maxWidth: 60,
      render: ({ data }) => {
        return (
          <Flex
            rounded="full"
            width="10"
            height="10"
            bg={data.type === "Income" ? "green.400" : "red.400"}
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
          >
            {data.type[0]}
          </Flex>
        );
      },
      headerProps,
    },
    {
      header: "Amount",
      sortable: false,
      maxWidth: 150,
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
      name: "note",
      header: "Note",
      sortable: false,
      minWidth: 200,
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
      header: "Category",
      sortable: false,
      minWidth: 200,
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
      name: "opening",
      header: "Opening Balance",
      sortable: false,
      minWidth: 200,
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
      name: "closing",
      header: "Closing Balance",
      sortable: false,
      minWidth: 200,
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
      name: "date",
      header: "Date",
      sortable: false,
      minWidth: 200,
      render: ({ value }) => {
        return (
          <Text fontWeight="medium" fontSize="sm">
            {moment(value).format("Do MMM YYYY")}
          </Text>
        );
      },
      headerProps,
    },
  ];

  const navigate = useNavigate();

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
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="bold" mb="3">
          Transactions
        </Text>
        <IconButton
          variant="ghost"
          icon={<BsArrowsAngleExpand />}
          onClick={() => navigate("/statement")}
        />
      </Flex>
      <Box mt={3}>
        <ReactDataGrid
          idProperty="id"
          columns={columns}
          pagination
          dataSource={transactions}
          defaultLimit={10}
          rowHeight={60}
          style={{ minHeight: 600 }}
        />
      </Box>
    </Flex>
  );
};

export default HomeTable;
