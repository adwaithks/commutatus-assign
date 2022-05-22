import React from 'react';
import './App.css';
import EmployeeFilter from './components/EmployeeFilter/EmployeeFilter';
import IndieDepartment from './components/IndieDepartment';
import { HierarchyContext } from './context/hierarchyContext';


class Employee {
  constructor(name, empId, phNum, email, team = null, designation = 'SDE I') {
    this.teamLead = false;
    this.parent = team;
    this.name = name;
    this.empId = empId;
    this.phNum = phNum;
    this.email = email;
    this.designation = designation;
    this.childrens = null;
  }
}
  
class Department {
  constructor(name, head, ceo = null) {
    this.name = name;
    this.head = head;
    this.parent = ceo;
    this.childrens = [];
  }
}

class Team {
  constructor(name, department = null) {
    this.name = name;
    this.parent = department;
    this.childrens = [];
  }
}

class CEO {
  constructor(name, phNum, email) {
    this.parent = null;
    this.name = name;
    this.phNum = phNum;
    this.email = email;
    this.childrens = [];
  }
}



function App() {

  const {treeChanged, setTreeChanged, ceo, setCeo} = React.useContext(HierarchyContext);
  const [departmentName, setDepartmentName] = React.useState('');
  const [departmentHead, setDepartmentHead] = React.useState('');
  const [toTeamName, setToTeamName] = React.useState('')
  const [teamLead, setTeamLead] = React.useState(false);
  const [teamName, setTeamName] = React.useState('');
  const [employeeInfo, setEmployeeInfo] = React.useState({
    id: 0,
    name: '',
    email: '',
    phone: ''
  });


  React.useEffect(() => {
    setCeo(new CEO('Jiby Pappachan', '9495997660', 'adwaith@gmail.com'))
  }, []);

  function departmentHeadHandler(e) {
    setDepartmentHead(e.target.value);
  }

  const toTeamNameHandler = (e) => {
    setToTeamName(e.target.value);
  }

  const teamNameHandler = (e) => {
    setTeamName(e.target.value);
  }

  const departmentNameHandler = (e) => {
    setDepartmentName(e.target.value);
  }

  const teamLeadHandler = (e) => {
    setTeamLead(e.target.checked);
  }

  const empNameHandler = (e) => {
    setEmployeeInfo(() => ({
      ...employeeInfo,
      name: e.target.value
    }))
  }

  const empPhoneHandler = (e) => {
    setEmployeeInfo(() => ({
      ...employeeInfo,
      phone: e.target.value
    }))
  }

  const empEmailHandler = (e) => {
    setEmployeeInfo(() => ({
      ...employeeInfo,
      email: e.target.value
    }))
  }


  /* department logics */

  // given department name exists ? 
  function departmentExists(department) {
    for (let dept of ceo.childrens) {
      if (dept.name == department.name) {
        return true;
      }
    }
    return false;
  }

  // add new department
  function addNewDepartment(department) {
    if (departmentExists(department)) {
      window.alert("Department Already Exists!");
      return;
    }
    department.parent = ceo;
    ceo.childrens.push(department);
    setTreeChanged(!treeChanged);
    window.alert(department.name + " Department added!");
  }

  // find given department by name, and return the department node
  function findDepartment(departmentName) {
    for (let dept of ceo.childrens) {
      if (dept.name == departmentName) {
        return dept;
      }
    }
    return null;
  }


  /* team logics */


  // team name exists in given department ?
  function teamNameExists(departmentName, teamName) {
    for (let dept of ceo.childrens) {
      if (dept.name == departmentName) {
        for (let team of dept.childrens) {
            if (team.name == teamName) return true;
        }
      }
    }
    return false;
  }

  // add new team to department
  function addNewTeam(departmentName, team) {
    let department = findDepartment(departmentName);
    if (teamNameExists(departmentName, team.name)) {
      window.alert("Team name already exists!");
      return;
    }
    if (department == null) {
      window.alert("No department named " + departmentName);
      return;
    }
    team.parent = department;
    setTreeChanged(!treeChanged);
    department.childrens.push(team);
    window.alert("New team " + team.name + " added under " + departmentName)
  }

  // find team by name in given department and return team node
  function findTeam(teamName, departmentName) {
    let queue = [ceo];
    let level = 0;
    while (queue.length) {
      level += 1;
      let length = queue.length;
      for (let i = 0; i < length; i ++) {
        let currentNode = queue.shift();
        if (currentNode.childrens == null) continue;
        for (let node of currentNode.childrens) {
          if (level == 2 && node.name == teamName && node?.parent?.name == departmentName) {
            return node;
          }
          queue.push(node);
        }
      }
    }
    return null;
  }

  function teamLeadAlreadyExists(departmentName, teamName) {
    let queue = [ceo];
    let level = 0;
    while (queue.length) {
      level += 1;
      let length = queue.length;
      for (let i = 0; i < length; i ++) {
        let currentNode = queue.shift();
        if (currentNode.childrens == null) continue;
        for (let node of currentNode.childrens) {
          if (level == 2 && node.name == teamName && node?.parent?.name == departmentName) {
            for (let employee of node.childrens) {
              if (employee.teamLead) {
                return true;
              }
            }
          }
          queue.push(node);
        }
      }
    }
    return false;
  }

  function employeeExistsInTeam(employee, team) {
    let queue = [team];

    while(queue.length) {
      let length = queue.length;
      for (let i = 0; i < length; i ++) {
        let currentNode = queue.shift();
        for (let node of currentNode.childrens) {
          if (employee.name.toLowerCase() == node.name.toLowerCase() 
          || employee.email.toLowerCase() == node.email.toLowerCase()
          || employee.phNum.toLowerCase() == node.phNum.toLowerCase()) {
            return true;
          }
        }
      }
  }
  return false;
}

  // add new employee to team in a department
  function addNewTeamMember(employee, teamName, departmentName) {
    if (!findDepartment(departmentName)) {
      window.alert("Department does not exist");
      return;
    }
    let team = findTeam(teamName, departmentName);
    if (!team) {
      window.alert("No team named " + teamName);
      return;
    }
    if (employee.teamLead) {
      if (teamLeadAlreadyExists(departmentName, teamName)) {
        employee.teamLead = false;
      }
    }
    if (employeeExistsInTeam(employee, team)) {
      window.alert('Employee already Exists!');
      return;
    }
    employee.parent = team;
    setTreeChanged(!treeChanged);
    team.childrens.push(employee);
    window.alert("New employee " + employee.name + " added to " + team.name);
  }

  /* employee logic */

  // find employee by name and return employee node
  function findEmployee(employeeName) {
    let queue = [ceo];
    let level = 0;
    while (queue.length) {
      level += 1;
      let length = queue.length;
      for (let i = 0; i < length; i ++) {
        let currentNode = queue.shift();
        if (currentNode.childrens == null) continue;
        for (let node of currentNode.childrens) {
          if (level == 3 && node.name == employeeName) {
            return node;
          }
          queue.push(node);
        }
      }
    }
    return null;
  }

  // remove employee in a team in department
  function removeEmployee(departmentName, teamName, employeeName) {
    let queue = [ceo];
    let level = 0;
    while (queue.length) {
        level += 1;
        let length = queue.length;
        for (let i = 0; i < length; i ++) {
            let currentNode = queue.shift();
            if (currentNode.childrens == null) continue;
            for (let node of currentNode.childrens) {
                if (level == 3 && currentNode.name.trim() == teamName.trim() && currentNode.parent.name.trim() == departmentName.trim()) {
                    currentNode.childrens = currentNode.childrens.filter((child, idx) => {
                      if(child.name.trim() != employeeName.trim()) {
                        return true;
                    } else {
                        child.parent = null;
                        return false;
                    }
                    });
                }
                queue.push(node);
            }
        }
    }
    window.alert('Removed employee ', employeeName);   
  }

  // move team member from team1 to team2
  function moveTeamMember(fromTeamName, toTeamName, departmentName, employeeName) {
    let employee = findEmployee(employeeName);
    if (!employee) {
      window.alert('No such employee!');
      return;
    }
    removeEmployee(departmentName, fromTeamName, employeeName);
    let team = findTeam(toTeamName, departmentName);
    if (!team) {
      window.alert('No team named ', toTeamName);
      return;
    }
    employee.parent = team;
    team.childrens.push(employee);
    setTreeChanged(!treeChanged);
    window.alert(`Moved ${employeeName} from ${fromTeamName} to ${toTeamName}`)
  }


  return (
    <div className="App">
      <div>
        <EmployeeFilter />
      </div>
      <h1 className='ceo-name'>{ceo.name} | CEO</h1>
      {
        ceo?.childrens?.map((dept, idx) => (
          <IndieDepartment key={idx} department={dept} />
        ))
      }
      <div>
        <div className='add-department'>
          <h1>Add new department</h1>
          <input onChange={departmentNameHandler} type="text" placeholder='department name' />
          <input onChange={departmentHeadHandler} type="text" placeholder='department head' />
          <button onClick={() => {
            let dept = new Department(departmentName, departmentHead);
            addNewDepartment(dept);
          }}>Add new dept</button>
        </div>

        <div className='add-team'>
          <h1>Add new team</h1>
          <input onChange={departmentNameHandler} type="text" placeholder='department name' />
          <input onChange={teamNameHandler} type="text" placeholder='team name' />
          <button onClick={() => {
            let team = new Team(teamName);
            addNewTeam(departmentName, team);
          }}>Add new team</button>
        </div>

        <div className='add-member'>
          <h1>Add new member</h1>
          <input onChange={departmentNameHandler} type="text" placeholder='department name' />
          <input onChange={teamNameHandler} type="text" placeholder='team name' />
          <input onChange={empNameHandler} type="text" placeholder='name' />
          <input onChange={empEmailHandler} type="text" placeholder='email' />
          <input onChange={empPhoneHandler} type="text" placeholder='phone num' />
          <label htmlFor="">Team Leader?</label>
          <input type="checkbox" onChange={teamLeadHandler} />
          <button onClick={() => {
            let employee = new Employee(employeeInfo['name'], employeeInfo['id'], employeeInfo['phone'], employeeInfo['email']);
            employee.teamLead = teamLead;
            addNewTeamMember(employee, teamName, departmentName)
          }}>Add new member</button>
        </div>

        <div className='move-member'>
          <h1>Move Team Member</h1>
          <input onChange={departmentNameHandler} type="text" placeholder='department name' />
          <input onChange={teamNameHandler} type="text" placeholder='From team name' />
          <input onChange={toTeamNameHandler} type="text" placeholder='To team name' />
          <input onChange={empNameHandler} type="text" placeholder='employee name' />
          <button onClick={() => {
            moveTeamMember(teamName, toTeamName, departmentName, employeeInfo['name']);
          }}>Move Team member</button>
        </div>  
      </div>
    </div>
  );
}

export default App;
