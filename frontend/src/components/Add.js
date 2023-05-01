import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import moment from "moment/moment";

const Add = ({ getTransactions }) => {
  const [isExpense, setIsExpense] = useState(true);
  const [isNow, setIsNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryToShow, setCategoryToShow] = useState([]);
  const [form, setForm] = useState({
    note: "",
    amount: 0,
    category: 0,
    date: Date.now(),
  });

  const token = localStorage.getItem("token");

  const toast = useToast();

  useEffect(() => {
    const getCategory = async () => {
      const response = await axios({
        method: "GET",
        url: BASE_URL + "api/category",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status == true) {
        setCategory(response.data.categories);
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

    getCategory();
  }, []);

  useEffect(() => {
    setCategoryToShow(
      category.filter((c) =>
        isExpense ? c.type == "Expense" : c.type == "Income"
      )
    );
  }, [category, isExpense]);

  const handleClick = async () => {
    if (form.category === 0 || form.amount === 0 || form.note === "") {
      toast({
        title: "Fields Missing",
        description: "All fields are required",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const payload = new FormData();
    payload.append("category", parseInt(form.category));
    payload.append("amount", parseInt(form.amount));
    payload.append("note", form.note);
    if (isNow) {
      payload.append("date", moment().format("YYYY-MM-DDTHH:mm:ss"));
    } else {
      payload.append("date", moment(form.date).format("YYYY-MM-DDTHH:mm:ss"));
    }
    console.log(payload.get("category"));
    try {
      setLoading(true);
      var response = await axios({
        method: "POST",
        url: BASE_URL + "api/transaction",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        setForm({
          note: "",
          amount: 0,
          category: 0,
          date: Date.now(),
        });
        toast({
          title: "Success",
          description: "Transaction added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        getTransactions();
      } else {
        toast({
          title: "Error",
          description: "Some erro occured",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Some erro occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      width="50%"
      flexDir="column"
      bg="white"
      px="5"
      py="6"
      borderRadius="md"
    >
      <Text fontSize="lg" fontWeight="bold" mb="3">
        Add Transaction
      </Text>
      <FormControl mt="3">
        <Flex alignItems="center" justifyContent="space-between">
          <FormLabel>Type</FormLabel>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme={isExpense ? "green" : "gray"}
              onClick={() => setIsExpense(true)}
            >
              Expense
            </Button>
            <Button
              colorScheme={!isExpense ? "green" : "gray"}
              onClick={() => setIsExpense(false)}
            >
              Income
            </Button>
          </ButtonGroup>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Select option"
          onChange={(event) => {
            setForm((prev) => ({ ...prev, category: event.target.value }));
          }}
          value={form.category}
        >
          {categoryToShow.map((e, i) => (
            <option key={i} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Amount</FormLabel>
        <Input
          type="number"
          placeholder="amount that you spent"
          value={form.amount}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, amount: event.target.value }));
          }}
        />
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Note</FormLabel>
        <Input
          type="text"
          placeholder="note for this transation"
          value={form.note}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, note: event.target.value }));
          }}
        />
      </FormControl>
      <FormControl mt="3">
        <Flex alignItems="center" justifyContent="space-between">
          <FormLabel>Date</FormLabel>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme={isNow ? "green" : "gray"}
              onClick={() => setIsNow(true)}
            >
              Today
            </Button>
            <Button
              colorScheme={!isNow ? "green" : "gray"}
              onClick={() => setIsNow(false)}
            >
              Not Today
            </Button>
          </ButtonGroup>
        </Flex>
      </FormControl>
      {!isNow && (
        <FormControl mt="3">
          <Input
            type="date"
            value={form.date}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, date: event.target.value }));
            }}
          />
        </FormControl>
      )}
      <Divider mt="3" />
      <Button
        isLoading={loading}
        mt="3"
        colorScheme="blue"
        width="100%"
        onClick={handleClick}
      >
        Add {isExpense ? "Expense" : "Income"}
      </Button>
    </Flex>
  );
};
export default Add;
