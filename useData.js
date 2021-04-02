import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/dataprofessor/data/master/penguins_cleaned.csv';
// "species","island","bill_length_mm","bill_depth_mm","flipper_length_mm","body_mass_g","sex"
export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = d => {
      //Converting string into number of following Column
      d.bill_length_mm = +d.bill_length_mm;
      d.bill_depth_mm = +d.bill_depth_mm;
      d.flipper_length_mm = +d.flipper_length_mm;
      d.body_mass_g = +d.body_mass_g;
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  
  return data;
};