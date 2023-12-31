import { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { ChakraProvider, HStack } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  useDisclosure,
  Stack,
  Flex
} from "@chakra-ui/react";
import {
  DownloadIcon,
  RepeatClockIcon,
  ChevronDownIcon
} from "@chakra-ui/icons";
// material-ui
// import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Heatmap from "./Heatmap";
import { useClassificationsContext } from '../../../layout/ClassificationsProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { min } from 'd3';
import Table from './Table'
import Linegraph from "../../LineGraph/Default"
import Pagination from '@mui/material/Pagination';
// ==============================|| DEFAULT DASHBOARD ||============================== //


const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const { selectedClassifications } = useClassificationsContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fromTime, setFromTime] = React.useState(dayjs());
  const [toTime, setToTime] = React.useState(dayjs());
  const [minDateTime, setMinDateTime] = React.useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [maxDateTime, setMaxDateTime] = React.useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [data, setData] = React.useState([])
  const [showData, setShowData] = React.useState(true)
  const [preData, setPreData] = React.useState([])
  const [timeData, setTimeData] = React.useState([])
  const [imgData, setImgData] = React.useState([])
  const [pageNum, setPageNum] = React.useState(1) 

  const handlePageNum = (event, value) => {
    setPageNum(value);
  };

  const fromTimeChange = (newValue) => {
    setFromTime(dayjs(newValue))
};
const toTimeChange = (newValue) => {
    setToTime(dayjs(newValue))
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/timelines");

        //output:{ending_time: '2023-09-11T21:25', starting_time: '2023-09-11T18:51'}
        const { starting_time, ending_time } = response.data;
        console.log(starting_time)
        setFromTime(dayjs(starting_time));
        setToTime(dayjs(ending_time));
        setMinDateTime(dayjs(starting_time))
        setMaxDateTime(dayjs(ending_time))
        
      } catch (error) {
          console.error(error);
      }
        setLoading(false);
      };
  
    fetchData();
  }, []);
  const isClassificationSelected = (classification) => {
    return selectedClassifications.includes(classification);
  };
  const viewDataClick = () => {
    const a=fromTime
    const b=toTime
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/timepersecond?",{
          params: {
            start_timestamp: a.format("YYYY-MM-DD HH:mm"),
          end_timestamp: b.format("YYYY-MM-DD HH:mm"), 
          },
        });
        
        setPreData(response.data.slice(data.slice((pageNum-1)*50,pageNum*50)));
        console.log(response.data.length);
        const transformedData = [];

        const totalData = response.data
        
        
        let tempTimeData = []
        let tempImgData = []


        for (let i = 0; i < totalData.length; i++) {
          const timestamp = totalData[i].timestamps;
          const img_url = totalData[i].img_url;
          
          tempTimeData.push(timestamp)
          tempImgData.push(img_url)
          delete totalData[i].timestamps;
          delete totalData[i].img_url;
        
          for (let key in totalData[i]) {
            transformedData.push({
              x: timestamp,
              y: key,
              value: totalData[i][key],
              img_url: img_url
            });
          }
        }

        setTimeData(tempTimeData)
        setImgData(tempImgData)
  

    console.log(transformedData);
    console.log("sjwkmd",transformedData.length)
    console.log("ghi",transformedData)
    setData(transformedData)
    setShowData(false)
      } catch (error) {
          console.error(error);
      }
        setLoading(false);
      };
  
    fetchData();
  }


  return (
    <>
    <Grid sx={{justifyContent:"center",alignItems:"center"}}>
    <Typography component="legend">Selected Classifications:</Typography>
        {selectedClassifications.map((classification, index) => (
          <Typography key={index}>{classification}</Typography>
        ))}
      <Grid container sx={{ marginTop: "30px", justifyContent:"center",alignItems:"center" }}>
        <Grid item sx={{ marginRight: "16px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DateTimePicker
                    label="Start Date"
                    value={fromTime}
                    onChange={fromTimeChange}
            
                    minDateTime={minDateTime}
                    maxDateTime={maxDateTime}
            />
          </LocalizationProvider>
          </Grid>
          <Grid item sx={{ marginRight: "16px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                      label="End Date"
                      value={toTime}
                      onChange={toTimeChange}
                      
                      minDateTime={fromTime}
                      maxDateTime={maxDateTime}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={viewDataClick}>View Data</Button>
          </Grid>
      </Grid>
          {!showData&&(
            <>
            <Flex sx={{marginTop:"10px", justifyContent:"center",alignItems:"center", width:"100%"}}>
              <Pagination count={Math.ceil(data.length/100)} page={pageNum} onChange={handlePageNum} showFirstButton showLastButton /> 
            </Flex>
            </>
          )}
          
          {!showData&&(
            <>
        <Grid sx={{justifyContent:"center",alignItems:"center"}}>
          <Flex sx={{justifyContent:"center",alignItems:"center", width:"100%"}}>
            <Heatmap data={data.slice((pageNum-1)*100,pageNum*100)} onOpen={onOpen}/>     
          </Flex>
        </Grid>
        </>
        )}
   
    
    <ChakraProvider>
    {/* <Button onClick={onOpen}>Open Modal</Button> */}
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              You can scroll the content behind the modal
            </Text>
            <Flex justifyContent="center" alignItems="center">
            <Image
              boxSize="550px"
              // src="https://thistlesourcing.com/wp-content/uploads/2022/08/automotive-annotation.jpg"
              src={imgData[Math.floor(Math.random() * imgData.length)]}
              alt="CC TV frame"
            />
            </Flex>
            <Stack  direction={"col"} spacing={2}>
              <Text mb="1rem">
              <Text fontWeight="bold">Description:</Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              <Text mb="1rem">
              <Text fontWeight="bold">Description:</Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              <Text mb="1rem">
              <Text fontWeight="bold">Description:</Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack spacing={2} direction="row" align="center">
              <Button colorScheme="teal" variant="outline">
                <DownloadIcon />
                Download clip
              </Button>
              <Button colorScheme="teal" variant="outline">
                <RepeatClockIcon />
                Object details
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Add to card
                <ChevronDownIcon />
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
    </Grid>
    {!showData && (<Linegraph data={preData} timeData={timeData}/>)}
    
    </>
  );
};

export default Dashboard;
