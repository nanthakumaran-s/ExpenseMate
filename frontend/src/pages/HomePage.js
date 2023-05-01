import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Add from "../components/Add";
import HomeTable from "../components/HomeTable";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { colors } from "../utils/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState([]);

  const token = localStorage.getItem("token");
  const toast = useToast();

  const getTransactions = async () => {
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
  };

  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    let map = {};
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === "Expense") {
        if (!map[transactions[i].name]) {
          map[transactions[i].name] = 0;
        }
        map[transactions[i].name] += transactions[i].amount;
      }
    }
    const temp1 = [];
    const temp2 = [];
    const temp3 = [];
    for (const [key, value] of Object.entries(map)) {
      temp1.push(key);
      temp2.push(value);
      temp3.push(colors[key]);
    }
    setLabels(temp1);
    setData(temp2);
    setBackgroundColor(temp3);
  }, [transactions]);

  const options = {
    responsive: true,
    borderWidth: 3,
    cutout: 1,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Heading fontSize="3xl" mb="5">
        Home
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
          <Flex
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="xl" fontWeight="bold">
              Expense Chart
            </Text>
            <Text textAlign="center" color="gray">
              past 90 days data
            </Text>
          </Flex>

          <Flex alignItems="center" justifyContent="center">
            <Box height="sm" width="sm" mt="5">
              <Doughnut
                options={options}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "Expense Dataset",
                      data: data,
                      backgroundColor: backgroundColor,
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            </Box>
          </Flex>
        </Flex>

        <Add getTransactions={getTransactions} />
      </Flex>

      <HomeTable transactions={transactions} />
    </Flex>
  );
};

export default HomePage;
