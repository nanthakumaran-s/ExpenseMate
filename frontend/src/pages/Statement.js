import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import { mapIcons } from "../utils/icons";
import moment from "moment/moment";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { TbArrowNarrowRight, TbFileInvoice } from "react-icons/tb";
import { FiFilter } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { AiFillCheckCircle } from "react-icons/ai";

const Statement = () => {
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");
  const toast = useToast();

  const [filterLoading, setFilterLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const getTransactions = async () => {
    setResetLoading(true);
    const response = await axios({
      method: "GET",
      url: BASE_URL + "api/transaction/recent",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.data.status == true) {
      setTransactions(response.data.transactions);
    } else {
      toast({
        title: "Err",
        description: "Some Error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setResetLoading(false);
  };

  useEffect(() => {
    getTransactions();
  }, []);

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

  const [form, setForm] = useState({
    from: "",
    to: "",
  });

  const filter = async () => {
    if (form.from === "" || form.to === "") {
      toast({
        title: "Fields missing",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setFilterLoading(true);
    const response = await axios({
      method: "GET",
      url: BASE_URL + "api/transaction/custom",
      params: {
        from: moment(form.from).format("YYYY-MM-DDTHH:mm:ss"),
        to: moment(form.to).format("YYYY-MM-DDTHH:mm:ss"),
      },
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.data.status === true) {
      console.log(response.data);
      setTransactions(response.data.transactions);
    } else {
      toast({
        title: "Err",
        description: "Some Error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setFilterLoading(false);
  };

  const generateInvoice = async () => {
    const payload = new FormData();
    if (form.from === "" && form.to === "") {
      var today = new Date();
      var priorDate = new Date(new Date().setDate(today.getDate() - 90));
      payload.append("from", moment(priorDate).format("YYYY-MM-DDTHH:mm:ss"));
      payload.append("to", moment().format("YYYY-MM-DDTHH:mm:ss"));
    } else {
      payload.append("from", moment(form.from).format("YYYY-MM-DDTHH:mm:ss"));
      payload.append("to", moment(form.to).format("YYYY-MM-DDTHH:mm:ss"));
    }
    setInvoiceLoading(true);
    const response = await axios({
      method: "POST",
      url: BASE_URL + "api/invoice",
      data: payload,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(response.data);
    if (response.data.status === true) {
      toast({
        title: "Invoice Created",
        description: "Invoice created successfully. Go to Invoice Details Page",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (response.data.message === "Invoices credits ended") {
      toast({
        title: "Warning",
        description: "Subscribe to get more Invoice",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      onOpen();
    } else {
      toast({
        title: "Err",
        description: "Some Error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setInvoiceLoading(false);
  };

  const makePayment = async () => {
    const response = await axios({
      method: "GET",
      url: BASE_URL + "api/user/checkout",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    window.location.href = response.data.link;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              flexDir="column"
              width="100%"
              alignItems="center"
              justifyContent="center"
              mt="20"
              mb="10"
            >
              <Heading fontSize="3xl" mb="5">
                Upgrade to Pro
              </Heading>
              <Flex
                flexDir="column"
                width="100%"
                align="start"
                justifyContent="center"
                pl="160px"
                mt="5"
              >
                <Flex gap="5" alignItems="center">
                  <AiFillCheckCircle size={30} color="gray" />
                  <Text fontSize="md" color="gray">
                    Unlimited Budgets
                  </Text>
                </Flex>
                <Flex gap="5" alignItems="center" mt="3">
                  <AiFillCheckCircle size={30} color="gray" />
                  <Text fontSize="md" color="gray">
                    Unlimited Invoice
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={makePayment}>
              Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading fontSize="3xl" mb="5">
        Statement
      </Heading>
      <Flex
        width="100%"
        bg="white"
        px="10"
        py="6"
        borderRadius="md"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <FormControl width="200px" mr="5">
            <FormLabel>From</FormLabel>
            <Input
              type="date"
              value={form.from}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, from: event.target.value }));
              }}
            />
          </FormControl>
          <TbArrowNarrowRight size="30" />
          <FormControl width="200px" ml="5">
            <FormLabel>To</FormLabel>
            <Input
              type="date"
              value={form.to}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, to: event.target.value }));
              }}
            />
          </FormControl>
          <Button
            ml="10"
            variant="ghost"
            size="lg"
            leftIcon={<FiFilter size="25" />}
            onClick={filter}
            isLoading={filterLoading}
          >
            Filter
          </Button>
          <IconButton
            variant="ghost"
            size="lg"
            icon={<GrPowerReset size="25" />}
            onClick={getTransactions}
            isLoading={resetLoading}
          />
        </Flex>
        <Flex>
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<TbFileInvoice size="25" />}
            onClick={generateInvoice}
            isLoading={invoiceLoading}
          >
            Generate Invoice
          </Button>
        </Flex>
      </Flex>
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
          Transactions
        </Text>
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
    </Flex>
  );
};

export default Statement;
