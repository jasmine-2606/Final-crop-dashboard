import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDiversity } from "../../services/cropService";


function DiversityMatrix() {

  const [diversityData, setDiversityData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    fetchDiversity();

  }, []);



  const fetchDiversity = async () => {

    try {

      setLoading(true);

      const response = await getDiversity();

      setDiversityData(response);

      setError(null);


    } catch (err) {

      console.error(
        "Diversity API Error:",
        err
      );

      setError(
        "Unable to load diversity data"
      );

    }
    finally {

      setLoading(false);

    }

  };



  const chartData = useMemo(() => {

    return diversityData
      .filter(item => item.crop_count > 0)
      .slice(0,10)
      .map(item => ({

        district:
          item.district,

        crops:
          item.crop_count

      }));

  }, [diversityData]);
  console.log("Diversity Chart Data:", chartData);



  if (loading) {

    return (

      <div className="flex justify-center items-center h-64 text-cyan-400">

        Loading diversity...

      </div>

    );

  }



  if (error) {

    return (

      <div className="text-red-400 p-4">

        {error}

      </div>

    );

  }



  return (

   <div className="w-full h-[280px]">


      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart

          data={chartData}

          layout="vertical"

        margin={{
  top: 10,
  right: 15,
  left: 10,
  bottom: 10,
}}

        >

          <CartesianGrid
            strokeDasharray="3 3"
          />


          <XAxis

            type="number"

            domain={[0,14]}

          />


       <YAxis
  type="category"
  dataKey="district"
  width={90}
  tick={{ fontSize: 11 }}
/>


          <Tooltip />


          <Bar

            dataKey="crops"

            radius={[
              0,
              8,
              8,
              0
            ]}

            fill="#22d3ee"

          />


        </BarChart>


      </ResponsiveContainer>


    </div>

  );

}


export default DiversityMatrix;