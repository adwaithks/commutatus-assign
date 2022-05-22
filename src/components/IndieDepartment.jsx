import React from 'react'
import TeamAccordion from './TeamAccordion/TeamAccordion'

function IndieDepartment({department}) {

  return (
    <div className='department'>
        <h1 className='department-name'><span className='department-name-head'>Department</span><span className='department-manager-head'>Head: {department.head}</span>{department.name} </h1>
        {
          department.childrens.map((temp, idx) => (
            <TeamAccordion key={idx} teamName={temp.name} teamMembers={temp.childrens} departmentName={department.name} />
          ))
        }
    </div>
  )
}

export default IndieDepartment