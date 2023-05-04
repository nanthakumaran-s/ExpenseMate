import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

const InvoicePage = () => {
  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Heading fontSize="3xl" mb="5">
        Invoice
      </Heading>
    </Flex>
  );
};

export default InvoicePage;
