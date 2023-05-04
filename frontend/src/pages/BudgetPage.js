import {
  Button,
  ButtonGroup,
  Divider,
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
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { AiFillCheckCircle } from "react-icons/ai";
import ListBudget from "../components/ListBudget";

const BudgetPage = () => {
  const [isSimple, setIsSimple] = useState(true);
  const [category, setCategory] = useState([]);
  const [categoryToShow, setCategoryToShow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: 0,
    limit: 0,
  });
  const { value, options, onChange } = useMultiSelect({
    value: [90],
    options: [],
  });

  const token = localStorage.getItem("token");
  const toast = useToast();

  const [budgets, setBudgets] = useState([]);
  const [thresholds, setThresholds] = useState([]);

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

  const getBudget = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: BASE_URL + "api/budget",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        setBudgets(response.data.budgets);
        setThresholds(response.data.thresholds);
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
    }
  };

  useEffect(() => {
    getBudget();
    getCategory();
  }, []);

  useEffect(() => {
    setCategoryToShow(category.filter((c) => c.type === "Expense"));
  }, [category]);

  const addThreshold = async (budget, percentage) => {
    const payload = new FormData();
    payload.append("budgetId", budget);
    payload.append("percentage", percentage);
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "api/budget/threshold",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status !== true) {
        toast({
          title: "Error",
          description: "Some error occured",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
    }
  };

  const handleClick = async () => {
    const payload = new FormData();
    payload.append("limit", form.limit);
    payload.append("category", form.category);
    try {
      setLoading(true);
      const response = await axios({
        method: "POST",
        url: BASE_URL + "api/budget",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        setForm({
          category: 0,
          limit: 0,
        });
        for (let i = 0; i < value.length; i++) {
          addThreshold(response.data.budget.id, value[i]);
        }
        toast({
          title: "Success",
          description: "Budget added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        getBudget();
      } else if (response.data.message === "Budget already exist") {
        toast({
          title: "Warning",
          description: "Subscribe to get more budgets",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        onOpen();
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
            <Button variant="ghost">Upgrade</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Heading fontSize="3xl" mb="5">
        Budgets
      </Heading>
      <Flex width="100%" gap="10" justifyContent="space-between">
        <Flex
          width="50%"
          flexDir="column"
          bg="white"
          px="5"
          py="6"
          borderRadius="md"
        >
          <Text fontSize="lg" fontWeight="bold" mb="3">
            Add Budget
          </Text>
          <FormControl>
            <Flex alignItems="center" justifyContent="space-between">
              <FormLabel>Type</FormLabel>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme={isSimple ? "green" : "gray"}
                  onClick={() => setIsSimple(true)}
                >
                  Simple
                </Button>
                <Button
                  colorScheme={!isSimple ? "green" : "gray"}
                  onClick={() => setIsSimple(false)}
                >
                  Categorical
                </Button>
              </ButtonGroup>
            </Flex>
          </FormControl>
          {!isSimple && (
            <FormControl mt="3">
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }));
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
          )}
          <FormControl my="3">
            <FormLabel>Limit</FormLabel>
            <Input
              type="number"
              placeholder="enter the limit for this budget"
              value={form.limit}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, limit: event.target.value }));
              }}
            />
          </FormControl>
          <MultiSelect
            options={options}
            value={value}
            label="Threshold Percentage"
            onChange={onChange}
            create
          />
          <Divider mt="3" />
          <Button
            isLoading={loading}
            mt="3"
            colorScheme="blue"
            width="100%"
            onClick={handleClick}
          >
            Add Budget
          </Button>
        </Flex>
      </Flex>
      <Divider my="5" />
      <ListBudget
        budgets={budgets}
        thresholds={thresholds}
        getBudget={getBudget}
      />
    </Flex>
  );
};

export default BudgetPage;
