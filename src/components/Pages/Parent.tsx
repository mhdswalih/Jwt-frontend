import React, { Children, useState } from 'react'
import Child from './Child'

const Parent = () => {
const [data,setData] = useState<string>('')
    const fetchData= (data:string)=> {
        setData(data)
    }
  return (
   <>

   <div>
    <Child  fetchData={fetchData}/>
    {data}
   </div>
      
   </>
  )
}

export default Parent