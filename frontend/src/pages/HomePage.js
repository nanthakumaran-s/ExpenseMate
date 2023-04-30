import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Add from "../components/Add";
import HomeTable from "../components/HomeTable";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    borderWidth: 3,
    cutout: 160,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <Flex flexDir="column" width="100%" justifyContent="center" py="10" pl="10">
      <Flex width="100%" gap="10" justifyContent="space-between">
        <Flex width="45%" flexDir="column">
          <Text fontSize="xl" fontWeight="bold">
            Expense Chart
          </Text>
          <Flex alignItems="center" justifyContent="center">
            <Box height="sm" width="sm" mt="5">
              <Doughnut options={options} data={data} />
              <Text textAlign="center" color="gray" mt="5">
                past 90 days data
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Add />
      </Flex>

      <HomeTable />
    </Flex>
  );
};

export default HomePage;
