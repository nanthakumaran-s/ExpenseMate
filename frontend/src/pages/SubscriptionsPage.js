import { Box, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AddSubscription from "../components/AddSubscription";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import SubscriptionTable from "../components/SubscriptionTable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { colors } from "../utils/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState([]);

  const token = localStorage.getItem("token");
  const toast = useToast();

  const getSubscriptions = async () => {
    const response = await axios({
      method: "GET",
      url: BASE_URL + "api/subscription",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.data.status == true) {
      setSubscriptions(response.data.subscriptions);
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

  const options = {
    responsive: true,
    borderWidth: 3,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  useEffect(() => {
    getSubscriptions();
  }, []);

  useEffect(() => {
    let map = {};
    for (let i = 0; i < subscriptions.length; i++) {
      if (!map[subscriptions[i].name]) {
        map[subscriptions[i].name] = 0;
      }
      if (subscriptions[i].status === "Inactive") {
        continue;
      }
      if (subscriptions[i].interval === "Monthly") {
        map[subscriptions[i].name] += subscriptions[i].amount * 12;
      } else {
        map[subscriptions[i].name] += subscriptions[i].amount;
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
  }, [subscriptions]);

  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Heading fontSize="3xl" mb="5">
        Subscriptions
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
              Subscription Split Up
            </Text>
            <Text textAlign="center" color="gray">
              Annual subscriptions
            </Text>
          </Flex>

          <Flex flexDir="column" alignItems="center" justifyContent="center">
            <Box width="100%" mt="10">
              <Bar
                options={options}
                data={{
                  labels: labels,
                  datasets: [
                    {
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
        <AddSubscription getSubscriptions={getSubscriptions} />
      </Flex>
      <SubscriptionTable
        subscriptions={subscriptions}
        getSubscriptions={getSubscriptions}
      />
    </Flex>
  );
};

export default SubscriptionsPage;
