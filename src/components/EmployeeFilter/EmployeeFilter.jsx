import React from 'react'
import { HierarchyContext } from '../../context/hierarchyContext';
import './EmployeeFilter.css'

function EmployeeFilter() {

  const [filterText, setFilterText] = React.useState('');
  const [displayedSearchResult, setDisplayedSearchResult] = React.useState([]);
  const {ceo} = React.useContext(HierarchyContext);

  function searchTextInHierarchy(searchText) {
    let text = searchText.trim();
    let queue = [ceo];
    let result = [];
    let level = 0;
    while (queue.length) {
        level += 1;
        let length = queue.length;
        for (let i = 0; i < length; i ++) {
            let currentNode = queue.shift();
            if (currentNode.childrens == null) continue;
            for (let node of currentNode.childrens) {
                if (level == 3) {
                  if (node.name.includes(text) || node.email.includes(text) || node.phNum.includes(text)) {
                    result.push({
                      teamMember: node,
                      team: node.parent.name,
                      department: node.parent.parent.name
                    });
                  }
                }
                queue.push(node);
            }
        }
    }
    setDisplayedSearchResult(result);
  }

  function filterTextChangeHandler(e) {
      let text = e.target.value;
      setFilterText(text);
  }

  return (
    <div className='employee-filter'>
        <input placeholder='Employee Filter' value={filterText} onChange={filterTextChangeHandler} type="text" />
        <button onClick={() => searchTextInHierarchy(filterText)}>Search</button>
        <div className='employee-filter-display-container'>
          {
            displayedSearchResult?.map((employee, idx) => (
              <div key={idx} className='employee-filter-display-ind'>
                <h1>{employee.teamMember.name}</h1>
                <h3>{employee.teamMember.email}</h3>
                <h3>{employee.teamMember.phNum}</h3>
                <h3>Department: {employee.department}</h3>
                <h3>Team: {employee.team}</h3>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default EmployeeFilter