import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import moment from "moment";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);

  const token = localStorage.getItem("token");
  const toast = useToast();

  const getInvoices = async () => {
    const response = await axios({
      method: "GET",
      url: BASE_URL + "api/invoice",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.data.status === true) {
      setInvoices(response.data.invoices);
      console.log(invoices);
    } else {
      toast({
        title: "Err",
        description: "Some Error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const headerProps = {
    style: {
      fontWeight: "bold",
      fontSize: "1rem",
    },
  };

  const columns = [
    {
      name: "incvoiceName",
      header: "Invoice Name",
      sortable: false,
      minWidth: 400,
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
      name: "user",
      header: "Email",
      sortable: false,
      minWidth: 300,
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
      name: "createdDate",
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
    {
      header: "Quick Action",
      sortable: false,
      minWidth: 200,
      render: ({ data }) => {
        return (
          <Flex>
            <IconButton
              variant="ghost"
              icon={<AiOutlineCloudDownload size="25" />}
              onClick={() => downlaodFile(data.id)}
            />
            <IconButton
              variant="ghost"
              icon={<CgTrash color="red" size="20" />}
              onClick={() => deleteInvoice(data.id)}
            />
          </Flex>
        );
      },
    },
  ];

  const downlaodFile = async (id) => {
    axios({
      method: "GET",
      url: BASE_URL + "api/invoice/download",
      params: {
        id: id,
      },
      headers: {
        Authorization: "Bearer " + token,
      },
      responseType: "blob",
    }).then((response) => {
      const href = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const deleteInvoice = async (id) => {
    const payload = new FormData();
    payload.append("id", id);
    try {
      const response = await axios({
        method: "DELETE",
        url: BASE_URL + "api/invoice",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        toast({
          title: "Removed Invoice",
          description: "Invoice deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        getInvoices();
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

  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Heading fontSize="3xl" mb="5">
        Invoice
      </Heading>
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
          Invoices
        </Text>
        <Box mt={3}>
          <ReactDataGrid
            idProperty="id"
            columns={columns}
            pagination
            dataSource={invoices}
            defaultLimit={10}
            rowHeight={60}
            style={{ minHeight: 600 }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default InvoicePage;
