import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { mapIcons } from "../utils/icons";
import { CgTrash } from "react-icons/cg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const SingleBudget = ({ budget, threshold, getBudget }) => {
  const [labels, setlabels] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const options = {
    responsive: true,
    borderWidth: 3,
    scales: {
      y: {
        max: budget.limit + 1000,
        min: 0,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      annotation: {
        annotations: annotation,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "This Month",
        data: dataset,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const [report, setReport] = useState([]);
  const toast = useToast();

  const token = localStorage.getItem("token");

  const getReport = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: BASE_URL + "api/transaction/monthly",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.data.status === true) {
        setReport(response.data.reports);
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

  const setlabel = () => {
    var dt = new Date();
    var mnth = dt.getMonth() + 1;

    if ([1, 3, 5, 7, 8, 10, 12].includes(mnth)) {
      setlabels([...Array.from({ length: 31 }, (_, i) => i + 1)]);
    } else if (mnth === 2) {
      setlabels([...Array.from({ length: 28 }, (_, i) => i + 1)]);
    } else {
      setlabels([...Array.from({ length: 30 }, (_, i) => i + 1)]);
    }
  };

  useEffect(() => {
    setlabel();
    getReport();
    setAnnotations();
  }, []);

  useEffect(() => {
    const temp = new Array(labels.length).fill(0);
    for (let i = 0; i < report.length; i++) {
      const cur = report[i];
      var ind = new Date(cur.date);
      if (cur.type === "Income") {
        continue;
      }
      if (budget.name === "Others") {
        temp[ind.getDate() - 1] += cur.amount;
        continue;
      }
      if (cur.name === budget.name) {
        temp[ind.getDate() - 1] += cur.amount;
        continue;
      }
    }
    const temp2 = [];
    temp2.push(temp[0]);
    for (let i = 1; i < temp.length; i++) {
      if (i > new Date().getDate() - 1) {
        break;
      }
      temp2.push(temp[i] + temp2[i - 1]);
    }
    setDataset(temp2);
  }, [report]);

  const setAnnotations = () => {
    const temp = {};
    for (let i = 0; i < threshold.length; i++) {
      var thres = {
        adjustScaleRange: true,
        drawTime: "afterDatasetsDraw",
        type: "line",
        scaleID: "y",
        value: budget.limit * (threshold[i].percentage / 100),
        borderColor: threshold[i].status === "Active" ? "green" : "brown",
      };
      temp["line" + i] = thres;
    }
    setAnnotation((prev) => ({ ...prev, ...temp }));
  };

  const handleDelete = async () => {
    try {
      const payload = new FormData();
      payload.append("id", budget.id);
      await axios({
        method: "DELETE",
        url: BASE_URL + "api/budget",
        data: payload,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      getBudget();
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

  return (
    <Flex
      width="100%"
      flexDir="row"
      bg="white"
      px="5"
      py="6"
      borderRadius="md"
      mb="5"
    >
      <Flex width="40%" flexDir="column" justifyContent="space-between">
        <Flex flexDir="column">
          <Flex gap="3" align="start" mb="3">
            <Heading fontSize="xl">
              {budget.name === "Others"
                ? "Simple Budget"
                : "Categorical Budget"}
            </Heading>
            <Badge>{budget.type}</Badge>
          </Flex>
          {budget.name !== "Others" && (
            <Flex alignItems="center" gap="3" mb="3">
              {mapIcons[budget.name]}
              <Text fontWeight="medium" fontSize="sm">
                {budget.name}
              </Text>
            </Flex>
          )}
          <Flex>
            <Text fontSize="lg" fontWeight="medium">
              Limit:
            </Text>
            <Text fontSize="lg">{" " + budget.limit}</Text>
          </Flex>
        </Flex>
        <Flex>
          <IconButton
            variant="ghost"
            icon={<CgTrash color="red" size="25" />}
            onClick={handleDelete}
          />
        </Flex>
      </Flex>
      <Flex width="60%">
        <Box width="100%">
          <Line options={options} data={data} />
        </Box>
      </Flex>
    </Flex>
  );
};

const ListBudget = ({ budgets, thresholds, getBudget }) => {
  return (
    <Flex flexDir="column" width="100%">
      {budgets.map((budget, i) => (
        <SingleBudget
          key={i}
          budget={budget}
          getBudget={getBudget}
          threshold={thresholds[i]}
        />
      ))}
    </Flex>
  );
};

export default ListBudget;
