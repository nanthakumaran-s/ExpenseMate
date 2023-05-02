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

const AddSubscription = ({ getSubscriptions }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [categoryToShow, setCategoryToShow] = useState([]);
  const [form, setForm] = useState({
    note: "",
    amount: 0,
    category: 0,
    interval: "",
  });

  const token = localStorage.getItem("token");

  const toast = useToast();

  const handleClick = async () => {
    if (
      form.category === 0 ||
      form.note === "" ||
      form.amount === 0 ||
      form.interval === ""
    ) {
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
    payload.append("category", form.category);
    payload.append("note", form.note);
    payload.append("amount", form.amount);
    payload.append("interval", form.interval);
    try {
      setLoading(true);
      var response = await axios({
        method: "POST",
        url: BASE_URL + "api/subscription",
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
          interval: "",
        });
        toast({
          title: "Success",
          description: "Subscription added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        getSubscriptions();
        setLoading(false);
      } else {
        toast({
          title: "Error",
          description: "Some error occured",
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
    setCategoryToShow(category.filter((c) => c.type === "Expense"));
  }, [category]);

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
        Add Subscription
      </Text>
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
        <FormLabel>Note</FormLabel>
        <Input
          placeholder="note for this subscription"
          onChange={(event) => {
            setForm((prev) => ({ ...prev, note: event.target.value }));
          }}
          value={form.note}
        />
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Amount</FormLabel>
        <Input
          type="number"
          placeholder="amount for this subscription"
          onChange={(event) => {
            setForm((prev) => ({ ...prev, amount: event.target.value }));
          }}
          value={form.amount}
        />
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Interval</FormLabel>
        <Select
          placeholder="Select option"
          onChange={(event) => {
            setForm((prev) => ({ ...prev, interval: event.target.value }));
          }}
          value={form.interval}
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </Select>
      </FormControl>
      <Divider mt="3" />
      <Button
        isLoading={loading}
        onClick={handleClick}
        mt="3"
        colorScheme="blue"
        width="100%"
      >
        Add Subscription
      </Button>
    </Flex>
  );
};
export default AddSubscription;
