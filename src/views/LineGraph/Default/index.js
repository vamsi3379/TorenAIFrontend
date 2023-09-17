import React from 'react';
import Chart from "react-apexcharts";
import { Flex, Grid } from "@chakra-ui/react";


export default function Linegraph() {
  const options = {
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  };
  const series = [
    {
      name: "series-1",
      data: [30, 40, 25, 50, 49, 21, 70, 51]
    },
    {
      name: "series-2",
      data: [23, 12, 54, 61, 32, 56, 81, 19]
    },
    {
      name: "series-3",
      data: [24, 20, 5, 75, 42, 79, 72, 35]
    }
  ];

  return( 
    <div style={{justifyContent:"center"}}>
      <Chart options={options} series={series} type="area" />;  
    </div>
    
  
  )}



