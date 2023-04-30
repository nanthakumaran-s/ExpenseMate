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
} from "@chakra-ui/react";
import React, { useState } from "react";

const Add = () => {
  const [isExpense, setIsExpense] = useState(true);
  const [isNow, setIsNow] = useState(true);
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
        <Select placeholder="Select option">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Amount</FormLabel>
        <Input type="number" placeholder="amount that you spent" />
      </FormControl>
      <FormControl mt="3">
        <FormLabel>Note</FormLabel>
        <Input type="text" placeholder="note for this transation" />
      </FormControl>
      <FormControl mt="3">
        <Flex alignItems="center" justifyContent="space-between">
          <FormLabel>Date</FormLabel>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme={isNow ? "green" : "gray"}
              onClick={() => setIsNow(true)}
            >
              Just Now
            </Button>
            <Button
              colorScheme={!isNow ? "green" : "gray"}
              onClick={() => setIsNow(false)}
            >
              Not Now
            </Button>
          </ButtonGroup>
        </Flex>
      </FormControl>
      {!isNow && (
        <FormControl mt="3">
          <Input type="date" />
        </FormControl>
      )}
      <Divider mt="3" />
      <Button mt="3" colorScheme="blue" width="100%">
        Add {isExpense ? "Expense" : "Income"}
      </Button>
    </Flex>
  );
};
export default Add;
